import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { REFERENTIEL_MEDICAMENTS } from "./src/data/medicaments";

dotenv.config();

// Reconstruct __dirname in ESM if needed, but we are running tsx which supports ESM directly
const PORT = 3000;

// Lazy initialization of Gemini to prevent startup crash if API key is not yet set
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("Clé API Google Gemini manquante. Veuillez configurer GEMINI_API_KEY dans vos paramètres (Secrets).");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();

  // Increase payload limit for base64 image uploads
  app.use(express.json({ limit: "15mb" }));

  // API Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Get full medications database
  app.get("/api/medicaments", (req, res) => {
    res.json(REFERENTIEL_MEDICAMENTS);
  });

  // scan-prescription endpoint
  app.post("/api/scan-prescription", async (req, res) => {
    try {
      const { image, mimeType } = req.body;

      if (!image) {
        return res.status(400).json({ error: "Aucune image d'ordonnance fournie." });
      }

      const ai = getGeminiClient();

      const imagePart = {
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: image,
        },
      };

      const systemInstruction = 
        "Tu es un pharmacien expert français. Ton but est d'analyser l'image d'ordonnance " +
        "fournie (prescription médicale), d'en extraire TOUS les médicaments prescrits, " +
        "et de renvoyer le résultat au format JSON strict selon le schéma demandé. " +
        "Extrais le nom du médicament, son dosage (ex: 1000mg, 500mg, 1g, 80mg) " +
        "et la quantité spécifiée ou estimée de boîtes/unités prescrites. " +
        "Si l'image ne contient pas de texte médical lisible ou n'est pas une ordonnance, " +
        "renvoie simplement une liste de médicaments vide.";

      const promptPart = {
        text: "Analyse cette ordonnance médicale française et liste tous les médicaments identifiés.",
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [imagePart, promptPart],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detectedMedicines: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    medicationName: {
                      type: Type.STRING,
                      description: "Nom brut du médicament extrait (ex: Doliprane, Clamoxyl, Spasfon Lyoc)",
                    },
                    dosage: {
                      type: Type.STRING,
                      description: "Dosage associé si présent (ex: 1000mg, 1g, 80mg)",
                    },
                    quantity: {
                      type: Type.INTEGER,
                      description: "Nombre de boîtes ou quantité prescrite. Défaut à 1 s'il n'est pas trouvable.",
                    },
                  },
                  required: ["medicationName"],
                },
              },
            },
            required: ["detectedMedicines"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("L'API Gemini n'a renvoyé aucune réponse.");
      }

      const parsedData = JSON.parse(responseText);
      const rawMedicines = parsedData.detectedMedicines || [];

      // Perform matching between extracted medications and our public referential
      const matchedMedications: any[] = [];
      const unmatchedNames: string[] = [];
      const detectedNames: string[] = [];

      for (const raw of rawMedicines) {
        const rawName = raw.medicationName;
        const rawDosage = raw.dosage || "";
        const rawQty = raw.quantity || 1;

        detectedNames.push(`${rawName} ${rawDosage}`.trim());

        const cleanedRawName = rawName.toLowerCase().replace(/[^a-z0-9]/g, "");
        const cleanedRawDosage = rawDosage.toLowerCase().replace(/[^a-z0-9]/g, "");

        // Search in our database
        // Rank matches:
        // 1. Exact or include name match with matched dosage
        // 2. Exact or include name match ignoring dosage
        // 3. Substance active match
        let bestMatch = REFERENTIEL_MEDICAMENTS.find((m) => {
          const mNomClean = m.nom.toLowerCase().replace(/[^a-z0-9]/g, "");
          const mDosageClean = m.dosage.toLowerCase().replace(/[^a-z0-9]/g, "");
          return mNomClean.includes(cleanedRawName) && mDosageClean.includes(cleanedRawDosage);
        });

        if (!bestMatch) {
          bestMatch = REFERENTIEL_MEDICAMENTS.find((m) => {
            const mNomClean = m.nom.toLowerCase().replace(/[^a-z0-9]/g, "");
            return mNomClean.includes(cleanedRawName) || cleanedRawName.includes(mNomClean);
          });
        }

        if (!bestMatch) {
          bestMatch = REFERENTIEL_MEDICAMENTS.find((m) => {
            const mSubClean = m.substanceActive.toLowerCase().replace(/[^a-z0-9]/g, "");
            return mSubClean.includes(cleanedRawName);
          });
        }

        if (bestMatch) {
          // Avoid duplicate matches of the same drug in the same list
          const alreadyAdded = matchedMedications.find((entry) => entry.medication.id === bestMatch!.id);
          if (alreadyAdded) {
            alreadyAdded.quantite += rawQty;
          } else {
            matchedMedications.push({
              medication: bestMatch,
              quantite: rawQty,
            });
          }
        } else {
          unmatchedNames.push(`${rawName} ${rawDosage}`.trim());
        }
      }

      res.json({
        detectedNames,
        matchedMedications,
        unmatchedNames,
        scanDate: new Date().toLocaleDateString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } catch (err: any) {
      console.error("Erreur serveur lors de l'analyse :", err);
      res.status(500).json({
        error: "Erreur lors du scan de l'ordonnance.",
        message: err.message || "Une erreur inconnue s'est produite.",
      });
    }
  });

  // Serve static assets / Vite files
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Medfinder Server] Serveur démarré sur http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Échec du démarrage du serveur Medfinder :", error);
});
