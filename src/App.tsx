import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Map,
  Phone,
  Clock,
  ChevronRight,
  Plus,
  Trash2,
  Camera,
  Upload,
  Check,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  X,
  Smartphone,
  ShieldCheck,
  Package,
  Stethoscope,
} from "lucide-react";
import { REFERENTIEL_MEDICAMENTS, getMedicationAlternatives } from "./data/medicaments";
import { Medication, Pharmacy, SearchedMedication, User, PrescriptionScanResult } from "./types";
import { generatePharmacies, calculateDistance, DEFAULT_CITIES } from "./utils/geo";

export default function App() {
  // Authentication State
  const [user, setUser] = useState<User | null>({
    id: "user-1",
    email: "lucas.martin@gmail.com",
    nom: "Martin",
    prenom: "Lucas",
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPrenom, setAuthPrenom] = useState("");
  const [authNom, setAuthNom] = useState("");

  // Location State
  const [userLat, setUserLat] = useState(48.8566); // Default: Paris
  const [userLng, setUserLng] = useState(2.3522);
  const [currentCityName, setCurrentCityName] = useState("Paris (Centre)");
  const [isLocating, setIsLocating] = useState(false);
  const [locationAlert, setLocationAlert] = useState<string | null>(null);

  // Search & Cart/Searched items State
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Medication[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<SearchedMedication[]>([
    {
      medication: REFERENTIEL_MEDICAMENTS.find(m => m.id === "doliprane-1000") || REFERENTIEL_MEDICAMENTS[0],
      quantite: 1
    },
    {
      medication: REFERENTIEL_MEDICAMENTS.find(m => m.id === "spasfon-80") || REFERENTIEL_MEDICAMENTS[6],
      quantite: 1
    }
  ]);

  // Selected Pharmacy State
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(null);

  // Scan Modal State
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<PrescriptionScanResult | null>(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "info" | "error" } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  // Generate pharmacies dynamic list whenever coordinates change
  useEffect(() => {
    const list = generatePharmacies(userLat, userLng);
    setPharmacies(list);
    // select the closest by default
    if (list.length > 0) {
      // sort list by distance to find the closest
      const sorted = [...list].sort((a, b) => {
        const distA = calculateDistance(userLat, userLng, a.latitude, a.longitude);
        const distB = calculateDistance(userLat, userLng, b.latitude, b.longitude);
        return distA - distB;
      });
      setSelectedPharmacyId(sorted[0].id);
    }
  }, [userLat, userLng]);

  // Toast auto-helper
  const triggerToast = (text: string, type: "success" | "info" | "error" = "success") => {
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToastMessage({ text, type });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 4500);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current !== null) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Autocomplete suggestions handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const cleanQuery = searchQuery.toLowerCase().trim();
    const filtered = REFERENTIEL_MEDICAMENTS.filter(m => 
      m.nom.toLowerCase().includes(cleanQuery) || 
      m.substanceActive.toLowerCase().includes(cleanQuery) ||
      m.groupeGenerique.toLowerCase().includes(cleanQuery)
    ).slice(0, 5);
    setSuggestions(filtered);
  }, [searchQuery]);

  // Request browser GPS position
  const handleGeolocationRequest = () => {
    if (!navigator.geolocation) {
      triggerToast("La géolocalisation n'est pas supportée par votre navigateur.", "error");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLat(lat);
        setUserLng(lng);
        setCurrentCityName("Position GPS Actuelle");
        setIsLocating(false);
        triggerToast("Position mise à jour par GPS !", "success");
      },
      (error) => {
        console.warn("GPS error", error);
        setIsLocating(false);
        let errorMsg = "Impossible d'accéder à votre position.";
        if (error.code === 1) {
          errorMsg = "Accès à la position refusé (Iframe/Navigateur). Utilisez la simulation de ville ci-dessous.";
        }
        setLocationAlert(errorMsg);
        setTimeout(() => setLocationAlert(null), 8500);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Add medicine to active list
  const handleAddMedication = (med: Medication, qty: number = 1) => {
    setSelectedMedications((prev) => {
      const existing = prev.find(item => item.medication.id === med.id);
      if (existing) {
        return prev.map(item =>
          item.medication.id === med.id ? { ...item, quantite: item.quantite + qty } : item
        );
      }
      return [...prev, { medication: med, quantite: qty }];
    });
    setSearchQuery("");
    setSuggestions([]);
    triggerToast(`${med.nom} ajouté à votre recherche`, "success");
  };

  // Remove medicine from active list
  const handleRemoveMedication = (id: string) => {
    const item = selectedMedications.find(m => m.medication.id === id);
    setSelectedMedications((prev) => prev.filter(m => m.medication.id !== id));
    if (item) {
      triggerToast(`${item.medication.nom} retiré de la liste`, "info");
    }
  };

  // Update quantity in active list
  const handleUpdateQuantity = (id: string, delta: number) => {
    setSelectedMedications((prev) =>
      prev.map(item => {
        if (item.medication.id === id) {
          const nextQty = Math.max(1, item.quantite + delta);
          return { ...item, quantite: nextQty };
        }
        return item;
      })
    );
  };

  // Quick helper to fetch alternatives
  const getAlternativesFor = (med: Medication) => {
    return getMedicationAlternatives(med.id);
  };

  // Calculate how many products are fully satisfied (out of selectedMedications.length) for a pharmacy
  const calculateStockProgressDetails = (pharmacy: Pharmacy) => {
    if (selectedMedications.length === 0) {
      return { score: 0, totalItems: 0, satisfiedDirectly: 0, satisfiedWithGeneric: 0, totalSearched: 0 };
    }

    let satisfiedDirectly = 0;
    let satisfiedWithGeneric = 0;
    let satisfiedCount = 0;

    selectedMedications.forEach(item => {
      const targetId = item.medication.id;
      const neededQty = item.quantite;
      const primaryStock = pharmacy.stocks[targetId] || 0;

      if (primaryStock >= neededQty) {
        satisfiedDirectly += 1;
        satisfiedCount += 1;
      } else {
        // Evaluate generic equivalents
        const alternatives = getAlternativesFor(item.medication);
        const bestAltWithStock = alternatives.find(alt => (pharmacy.stocks[alt.id] || 0) >= neededQty);
        
        if (bestAltWithStock) {
          satisfiedWithGeneric += 1;
          satisfiedCount += 1;
        }
      }
    });

    return {
      score: satisfiedCount,
      totalItems: selectedMedications.length,
      satisfiedDirectly,
      satisfiedWithGeneric,
      totalSearched: selectedMedications.length
    };
  };

  // File Upload to Base64 OCR Scanner
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setScanImage(reader.result as string);
      setScanError(null);
    };
    reader.readAsDataURL(file);
  };

  // Simulate scanning of presets
  const handleSelectPresetPrescription = (presetName: string) => {
    setScanError(null);
    setScanResult(null);
    setIsScanning(true);
    
    // Create a beautiful simulation showing the image being read by Gemini
    let detectedNames: string[] = [];
    let matchedMeds: SearchedMedication[] = [];
    let unmatched: string[] = [];

    if (presetName === "grippe") {
      setScanImage("/assets/presets/grippe.png"); // visual mock path
      detectedNames = ["Doliprane 1000mg", "Spasfon 80mg"];
      const dol = REFERENTIEL_MEDICAMENTS.find(m => m.id === "doliprane-1000")!;
      const spa = REFERENTIEL_MEDICAMENTS.find(m => m.id === "spasfon-80")!;
      matchedMeds = [
        { medication: dol, quantite: 2 },
        { medication: spa, quantite: 1 }
      ];
    } else if (presetName === "angine") {
      setScanImage("/assets/presets/angine.png");
      detectedNames = ["Clamoxyl 1g", "Ibuprofène 400mg"];
      const clam = REFERENTIEL_MEDICAMENTS.find(m => m.id === "clamoxyl-1g")!;
      const ibu = REFERENTIEL_MEDICAMENTS.find(m => m.id === "ibuprofene-biogaran-400")!;
      matchedMeds = [
        { medication: clam, quantite: 1 },
        { medication: ibu, quantite: 1 }
      ];
    } else if (presetName === "asthme") {
      detectedNames = ["Ventoline 100 µg", "Inexium 40mg"];
      const ven = REFERENTIEL_MEDICAMENTS.find(m => m.id === "ventoline-100")!;
      const ine = REFERENTIEL_MEDICAMENTS.find(m => m.id === "inexium-40")!;
      matchedMeds = [
        { medication: ven, quantite: 1 },
        { medication: ine, quantite: 2 }
      ];
    }

    // Give it a natural timeout feedback
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        detectedNames,
        matchedMedications: matchedMeds,
        unmatchedNames: unmatched,
        scanDate: new Date().toLocaleDateString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit"
        })
      });
      triggerToast("Analyse Gemini terminée !", "success");
    }, 1800);
  };

  // Perform Gemini API OCR on the user-uploaded image
  const triggerGeminiScan = async () => {
    if (!scanImage) {
      setScanError("Veuillez sélectionner ou prendre une photo d'ordonnance.");
      return;
    }

    setIsScanning(true);
    setScanError(null);

    try {
      // split base64 header
      const base64Content = scanImage.split(",")[1] || scanImage;
      const mimeType = scanImage.substring(scanImage.indexOf(":") + 1, scanImage.indexOf(";"));

      const response = await fetch("/api/scan-prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Content,
          mimeType: mimeType || "image/jpeg"
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur lors du traitement : Code ${response.status}`);
      }

      const data: PrescriptionScanResult = await response.json();
      setScanResult(data);
      triggerToast("Ordonnance scannée avec succès par l'IA !", "success");
    } catch (err: any) {
      console.error(err);
      setScanError(err.message || "Une erreur est survenue lors de l'analyse avec l'IA. Vérifiez que la clé API Gemini est bien configurée.");
    } finally {
      setIsScanning(false);
    }
  };

  // Import detected medicines list back to prescription checklist
  const handleImportScanResult = () => {
    if (!scanResult || scanResult.matchedMedications.length === 0) return;

    setSelectedMedications((prev) => {
      const tempCart = [...prev];
      scanResult.matchedMedications.forEach(imported => {
        const idx = tempCart.findIndex(item => item.medication.id === imported.medication.id);
        if (idx > -1) {
          tempCart[idx] = {
            ...tempCart[idx],
            quantite: Math.max(tempCart[idx].quantite, imported.quantite),
          };
        } else {
          tempCart.push(imported);
        }
      });
      return tempCart;
    });

    setIsScanModalOpen(false);
    setScanImage(null);
    setScanResult(null);
    setScanError(null);
    triggerToast("Médicaments de l'ordonnance importés avec succès !", "success");
  };

  // Quick preset adding directly
  const handleAddPopular = (medId: string) => {
    const med = REFERENTIEL_MEDICAMENTS.find(m => m.id === medId);
    if (med) {
      handleAddMedication(med, 1);
    }
  };

  // Authentication Mock Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    setUser({
      id: "user-new",
      email: authEmail,
      nom: authNom || "Utilisateur",
      prenom: authPrenom || "easyPharma"
    });
    setAuthModalOpen(false);
    triggerToast(`Ravi de vous revoir, ${authPrenom || 'easyPharma'} !`, "success");
  };

  const handleSignout = () => {
    setUser(null);
    triggerToast("Vous avez été déconnecté.", "info");
  };

  // Build sorted list of pharmacies with precomputed distance
  const sortedPharmacies = pharmacies.map(pharma => {
    const distanceVal = calculateDistance(userLat, userLng, pharma.latitude, pharma.longitude);
    const stockDetails = calculateStockProgressDetails(pharma);
    return {
      ...pharma,
      distance: distanceVal,
      stockDetails
    };
  }).sort((a, b) => a.distance - b.distance);

  // Active highlighted pharmacy details
  const activePharmacy = sortedPharmacies.find(p => p.id === selectedPharmacyId) || sortedPharmacies[0];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900" id="easyPharma-app">
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 animate-bounce shadow-2xl rounded-2xl p-4 flex items-center gap-3 border bg-white max-w-sm" id="toast-notif">
          <div className={`p-2 rounded-xl text-white ${
            toastMessage.type === "success" ? "bg-emerald-600" : toastMessage.type === "error" ? "bg-rose-500" : "bg-blue-500"
          }`}>
            {toastMessage.type === "success" ? <Check size={18} /> : toastMessage.type === "error" ? <AlertTriangle size={18} /> : <Info size={18} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{toastMessage.text}</p>
          </div>
        </div>
      )}

      {/* App Topbar Header */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center px-6 lg:px-8 shrink-0 justify-between sticky top-0 z-40" id="main-header">
        
        {/* Logo and App Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-100 cursor-pointer hover:bg-emerald-500 transition-colors" title="easyPharma">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
              <path d="M12 2v20M2 12h20"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-800 leading-none">
              easy<span className="text-emerald-600">Pharma</span>
            </h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Recherche & Disponibilité</span>
          </div>
        </div>

        {/* Global Medications Autocomplete Input bar */}
        <div className="relative w-full max-w-md mx-6 hidden md:block" id="desktop-search-container">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Saisir un médicament... (ex: Doliprane, Spasfon, Ventoline)" 
            className="w-full h-11 bg-slate-100 border-none rounded-full pl-11 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm transition-all placeholder:text-slate-400"
            id="medication-search-input"
          />

          {/* Suggestions Dropdown overlay */}
          {suggestions.length > 0 && (
            <div className="absolute top-13 left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 overflow-hidden animate-fadeIn" id="search-suggestions">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Résultats du référentiel public
              </div>
              {suggestions.map((med) => (
                <div 
                  key={med.id}
                  onClick={() => handleAddMedication(med, 1)}
                  className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer flex justify-between items-center transition-colors group"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 group-hover:text-emerald-700 text-sm transition-colors">{med.nom}</span>
                    <span className="text-xs text-slate-500">{med.substanceActive} &bull; {med.dosage} &bull; {med.forme}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {med.estGenerique && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Générique</span>
                    )}
                    <span className="w-7 h-7 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <Plus size={14} strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Account controls and Location indicator */}
        <div className="flex items-center gap-4" id="header-user-controls">
          <div className="flex items-center gap-2 text-slate-600 border border-slate-200 rounded-full py-1.5 px-3 bg-slate-50 text-xs font-semibold cursor-pointer hover:bg-slate-100 transition-colors" onClick={handleGeolocationRequest} title="Actualiser la position">
            <MapPin size={14} className={isLocating ? "animate-spin text-emerald-600" : "text-emerald-600"} />
            <span className="max-w-30 truncate">{currentCityName}</span>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end text-xs">
                <span className="font-bold text-slate-800">{user.prenom} {user.nom}</span>
                <button onClick={handleSignout} className="text-[10px] text-slate-400 hover:text-rose-500 font-bold tracking-tight transition-colors">Déconnexion</button>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                {user.prenom?.[0] || 'U'}
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-full text-xs font-bold transition-all shadow-sm"
            >
              Créer compte / Connexion
            </button>
          )}
        </div>
      </header>

      {/* Main Body Grid Container */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden" id="main-content-layout">
        
        {/* Left Drawer Block: Selected Medications List (Checklist d'Ordonnance) */}
        <div className="w-full lg:w-97.5 border-r border-slate-200 bg-white flex flex-col shrink-0" id="sidebar-prescription-cart">
          
          {/* Quick Info & Scan Banner
          <div className="p-4 bg-emerald-50/50 border-b border-slate-100 flex items-center justify-between" id="scan-trigger-banner">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-700">
                <Camera size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Ordonnance papier ?</h4>
                <p className="text-[11px] text-slate-500">Scannez-la en 2 secondes grâce à l'IA</p>
              </div>
            </div>
            <button
              onClick={() => setIsScanModalOpen(true)}
              className="p-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold shadow-sm flex items-center gap-1 transition-all"
              id="sidebar-scan-btn"
            >
              <Sparkles size={12} />
              Scanner
            </button>
          </div> */}

          {/* Search bar on mobile only */}
          <div className="p-4 border-b border-slate-100 md:hidden block" id="mobile-search-bar">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un médicament..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-100 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-10 left-0 w-full bg-white rounded-lg shadow-lg border border-slate-200 z-50 p-1">
                  {suggestions.map((med) => (
                    <div 
                      key={med.id}
                      onClick={() => handleAddMedication(med, 1)}
                      className="p-2 hover:bg-slate-50 text-xs cursor-pointer flex justify-between"
                    >
                      <span>{med.nom}</span>
                      <span className="text-[10px] text-slate-400">{med.dosage}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Medications count & clear action */}
          <div className="p-4 px-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50" id="cart-header">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Ma Recherche de Traitement</span>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-bold rounded-full text-[10px]">
                {selectedMedications.length}
              </span>
            </div>
            {selectedMedications.length > 0 && (
              <button 
                onClick={() => {
                  setSelectedMedications([]);
                  triggerToast("Recherche réinitialisée", "info");
                }}
                className="text-slate-400 hover:text-rose-500 text-xs font-medium transition-colors"
                title="Vider la liste"
              >
                Tout effacer
              </button>
            )}
          </div>

          {/* User's Cart checklist checklist content */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-40 max-h-75 lg:max-h-none border-b border-slate-100 lg:border-none" id="prescription-checklist-container">
            {selectedMedications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center my-auto" id="cart-empty-placeholder">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                  <Package size={20} />
                </div>
                <h5 className="font-bold text-slate-700 text-sm">Votre liste est vide</h5>
                <p className="text-xs text-slate-400 max-w-60 mt-1">
                  Ajoutez des médicaments à rechercher en tapant dans le champ du haut ou en important une ordonnance.
                </p>
                
                {/* Popular rapid recommendation tags */}
                <div className="mt-6 w-full align-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Ajouts rapides populaires :</span>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    <button onClick={() => handleAddPopular("doliprane-1000")} className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-slate-600 font-medium transition-all">&bull; Doliprane 1000g</button>
                    <button onClick={() => handleAddPopular("spasfon-80")} className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-slate-600 font-medium transition-all">&bull; Spasfon</button>
                    <button onClick={() => handleAddPopular("ventoline-100")} className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-slate-600 font-medium transition-all">&bull; Ventoline</button>
                    <button onClick={() => handleAddPopular("clamoxyl-1g")} className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-slate-600 font-medium transition-all">&bull; Clamoxyl 1g</button>
                  </div>
                </div>
              </div>
            ) : (
              selectedMedications.map(({ medication, quantite }) => (
                <div 
                  key={medication.id}
                  className="p-3 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl flex justify-between items-center transition-all"
                  id={`checked-med-${medication.id}`}
                >
                  <div className="flex flex-col pr-2 truncate">
                    <div className="flex items-center gap-1.5">
                      {medication.ordonnanceObligatoire && (
                        <span className="w-2 h-2 rounded-full bg-rose-500" title="Ordonnance obligatoire (Liste I/II)" />
                      )}
                      <span className="font-bold text-slate-800 text-xs truncate leading-tight">{medication.nom}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-0.5 truncate">{medication.substanceActive} &bull; {medication.dosage}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-sm">
                      <button 
                        onClick={() => handleUpdateQuantity(medication.id, -1)}
                        className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-rose-600 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-800 w-5 text-center">{quantite}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(medication.id, 1)}
                        className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-emerald-600 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => handleRemoveMedication(medication.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Retirer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
            
            {selectedMedications.length > 0 && (
              <div className="mt-2 border-t border-slate-100 pt-3">
                <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-2 text-[11px] text-slate-500">
                  <Info size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    La jauge de stock des pharmacies ci-dessous va se réajuster en temps réel selon les quantités définies dans cet espace.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center / Right Content Split: Nearest Officines List & Detail Focus */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden" id="easyPharma-office-explorer">
          
          {/* List of Near Pharmacies */}
          <div className="w-full md:w-87.5 border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden" id="pharmacy-listings-container">
            
            {/* Simulation coordinates drawer */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50" id="coords-simulator-widget">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Zone de test (Simulation)</span>
              <div className="grid grid-cols-2 gap-1.5">
                {DEFAULT_CITIES.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => {
                      setUserLat(city.lat);
                      setUserLng(city.lng);
                      setCurrentCityName(city.name);
                      triggerToast(`Simulation déplacée à ${city.name}`, "info");
                    }}
                    className={`px-2 py-1.5 text-center rounded-lg text-[11px] font-bold truncate transition-all ${
                      currentCityName === city.name 
                        ? "bg-emerald-600 text-white shadow-sm" 
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {city.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* List Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                {sortedPharmacies.length} Pharmacies à proximité
              </span>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-wide">
                TRI : PROXIMITÉ
              </span>
            </div>

            {/* Pharmacy card item list */}
            <div className="flex-1 overflow-y-auto" id="pharmacy-cards-list">
              {locationAlert && (
                <div className="m-3 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-fadeIn">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>{locationAlert}</span>
                </div>
              )}

              {sortedPharmacies.map((pharmacy) => {
                const isActive = pharmacy.id === selectedPharmacyId;
                const distanceInMeters = Math.round(pharmacy.distance * 1000);
                const distanceText = distanceInMeters < 1000 ? `${distanceInMeters}m` : `${pharmacy.distance.toFixed(1)}km`;
                const { score } = pharmacy.stockDetails;

                return (
                  <div 
                    key={pharmacy.id}
                    onClick={() => setSelectedPharmacyId(pharmacy.id)}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-all flex flex-col gap-2 relative ${
                      isActive 
                        ? "bg-emerald-50/40 border-l-4 border-l-emerald-600" 
                        : "hover:bg-slate-50"
                    }`}
                    id={`pharmacy-card-${pharmacy.id}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="pr-4">
                        <h3 className="font-bold text-slate-800 text-sm leading-tight">{pharmacy.nom}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 max-w-55 truncate">{pharmacy.adresse}</p>
                      </div>
                      <span className="text-[11px] font-extrabold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                        {distanceText}
                      </span>
                    </div>

                    {/* Stock level volumetric gauges segment display */}
                    <div className="flex items-center justify-between gap-2 mt-1">
                      {selectedMedications.length === 0 ? (
                        <div className="flex gap-1" title="Aucun traitement recherché">
                          {[1, 2, 3, 4, 5].map((index) => (
                            <div 
                              key={index}
                              className="h-1.5 w-6 rounded-full bg-slate-200"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-1" title={`Médicaments disponibles : ${score}/${selectedMedications.length}`}>
                          {selectedMedications.map(({ medication, quantite }) => {
                            const primaryStock = pharmacy.stocks[medication.id] || 0;
                            const isFullyAvailable = primaryStock >= quantite;
                            const alternatives = getAlternativesFor(medication);
                            const bestAltWithStock = alternatives.find(alt => (pharmacy.stocks[alt.id] || 0) >= quantite);
                            const genericAvailable = !isFullyAvailable && !!bestAltWithStock;
                            
                            let barColor = "bg-rose-200"; // Default rupture
                            if (isFullyAvailable) {
                              barColor = "bg-emerald-500";
                            } else if (genericAvailable) {
                              barColor = "bg-indigo-500"; // Generic substituted in stock
                            } else if (primaryStock > 0 || alternatives.some(alt => (pharmacy.stocks[alt.id] || 0) > 0)) {
                              barColor = "bg-amber-400"; // Partial stock
                            }

                            return (
                              <div 
                                key={medication.id}
                                className={`h-1.5 w-6 rounded-full transition-colors ${barColor}`}
                                title={`${medication.nom} : ${isFullyAvailable ? "En stock" : genericAvailable ? "Générique disponible" : "Hors stock"}`}
                              />
                            );
                          })}
                        </div>
                      )}

                      <span className={`text-[11px] font-bold ${
                        selectedMedications.length === 0
                          ? "text-slate-400"
                          : score === selectedMedications.length
                            ? "text-emerald-700"
                            : score > 0
                              ? "text-indigo-700"
                              : "text-rose-600"
                      }`}>
                        {selectedMedications.length === 0
                          ? "Recherche vide"
                          : score === selectedMedications.length
                            ? "Dispo immédiate"
                            : score > 0
                              ? `${score}/${selectedMedications.length} dispos`
                              : "En rupture"}
                      </span>
                    </div>

                    {/* Dynamic state check bullet */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                      <Clock size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{pharmacy.horaires}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Main Panel: Detail Sheet focus of active pharmacy */}
          <section className="flex-1 bg-slate-100 p-4 lg:p-6 flex flex-col gap-6 overflow-y-auto" id="pharmacy-details-viewport">
            {!activePharmacy ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center my-auto min-h-75" id="no-pharmacy-selected">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 animate-pulse">
                  <MapPin size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-700">Recherche de pharmacies...</h3>
                <p className="text-sm text-slate-400 max-w-sm mt-1">
                  Détection de votre position en cours, ou veuillez sélectionner une position dans la zone de simulation.
                </p>
              </div>
            ) : (
              <>
                {/* Header info banner */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col gap-6" id="pharma-detail-container">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="flex flex-col gap-1.5">
                      <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full w-fit tracking-wide">
                        SÉLECTIONNÉ
                      </span>
                      <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                        {activePharmacy.nom}
                      </h2>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin size={13} className="text-emerald-600" />
                        {activePharmacy.adresse}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={13} className="text-slate-400" />
                        Horaires de garde : {activePharmacy.horaires}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-emerald-50 rounded-2xl p-3 border border-emerald-100 shrink-0 self-start md:self-auto uppercase">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 font-extrabold tracking-wider leading-none">SCORE DE STOCK</span>
                        <span className="text-xs text-slate-500 font-medium lowercase">calculé sur ordonnance</span>
                      </div>
                      <div className="text-3xl font-black text-emerald-600 leading-none">
                        {selectedMedications.length === 0 ? "—" : activePharmacy.stockDetails.score}
                        {selectedMedications.length > 0 && (
                          <span className="text-lg text-slate-300 font-bold">
                            /{selectedMedications.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Searched Medications Stocks list details for this Pharmacy */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">
                      Disponibilité des médicaments requis ({selectedMedications.length}) :
                    </h3>

                    {selectedMedications.length === 0 ? (
                      <div className="p-6 bg-slate-50 rounded-xl text-center border border-dashed border-slate-200 text-slate-500 text-xs">
                        Configurez d'abord la liste de traitements recherchés à gauche, et les stocks s'ajusteront immédiatement ici.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4" id="detailed-checked-stocks-grid">
                        {selectedMedications.map(({ medication, quantite }) => {
                          const id = medication.id;
                          const stockAvailable = activePharmacy.stocks[id] || 0;
                          const isFullyAvailable = stockAvailable >= quantite;
                          const hasAlternatives = getAlternativesFor(medication).length > 0;
                          
                          // Identify generic alternatives in store
                          const alternativesList = getAlternativesFor(medication).map(alt => {
                            return {
                              ...alt,
                              stock: activePharmacy.stocks[alt.id] || 0
                            };
                          });
                          
                          const validAlternativeWithStock = alternativesList.find(alt => alt.stock >= quantite);

                          return (
                            <div 
                              key={id}
                              className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-3 transition-colors"
                              id={`detail-stock-item-${id}`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                {/* Product summary */}
                                <div className="flex items-start gap-2.5">
                                  <span className="w-6 h-6 rounded bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center italic shrink-0 mt-0.5">
                                    Rx
                                  </span>
                                  <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{medication.nom}</h4>
                                    <p className="text-xs text-slate-400">{medication.substanceActive} &bull; {medication.laboratoire} ({medication.dosage})</p>
                                  </div>
                                </div>

                                {/* Volumetric count badge */}
                                <div className="flex items-center gap-2 shrink-0 sm:self-center">
                                  {isFullyAvailable ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                                      <Check size={12} className="stroke-3" />
                                      EN STOCK
                                    </span>
                                  ) : stockAvailable > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
                                      STOCK FAIBLE
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-lg bg-rose-100 text-rose-800 border border-rose-200">
                                      PAS EN STOCK
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Generics Substitution Area - GESTION DES ÉQUIVALENCES */}
                              {( !isFullyAvailable && hasAlternatives ) && (
                                <div className="p-3.5 bg-white rounded-xl border border-slate-100 flex flex-col gap-2.5 shadow-sm">
                                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700">
                                    <Sparkles size={14} className="text-indigo-600 shrink-0" />
                                    <span>Alternatives de substitution génériques :</span>
                                  </div>
                                  
                                  <div className="text-[11px] text-slate-500 leading-tight">
                                    Médicaments équivalents rattachés au groupe thérapeutique <strong className="text-slate-700">{medication.groupeGenerique}</strong> de substitution.
                                  </div>

                                  <div className="flex flex-col gap-2 mt-1">
                                    {alternativesList.map(alt => (
                                      <div 
                                        key={alt.id}
                                        className="p-2.5 bg-slate-50/70 hover:bg-slate-50 rounded-lg flex items-center justify-between text-xs border border-slate-100 transition-colors"
                                      >
                                        <div className="flex flex-col">
                                          <span className="font-bold text-slate-800">{alt.nom}</span>
                                          <span className="text-[10px] text-slate-500">{alt.laboratoire} &bull; {alt.forme}</span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                          {alt.stock >= quantite ? (
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                                              Disponible
                                            </span>
                                          ) : alt.stock > 0 ? (
                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                                              Stock limité
                                            </span>
                                          ) : (
                                            <span className="px-2 py-0.5 bg-slate-200 text-slate-500 rounded font-bold text-[10px]">
                                              Rupture
                                            </span>
                                          )}
                                          
                                          <button
                                            onClick={() => handleAddMedication(alt, quantite)}
                                            className="p-1 px-2 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold tracking-tight rounded hover:bg-indigo-600 hover:text-white transition-all text-[10px]"
                                          >
                                            Ajouter à la recherche
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Call-to actions to contact and map directions */}
                  <div className="mt-8 pt-6  border-t border-slate-100 flex flex-col sm:flex-row gap-3 ">
                    <a 
                      href={`tel:${activePharmacy.telephone}`}
                      onClick={(e) => {
                        e.preventDefault(); 
                        triggerToast(`Appel simulé vers ${activePharmacy.nom} : ${activePharmacy.telephone}`, "info");
                      }} 
                      className="flex-1 h-14 px-3 sm:px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-4 shadow-lg shadow-emerald-100 transition-colors text-sm sm:p-8"
                      id="action-call-pharmacy"
                    >
                      <Phone size={16} />
                      Appeler la pharmacie ({activePharmacy.telephone})
                    </a>
                    
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(activePharmacy.nom + ", " + activePharmacy.adresse)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 h-14 px-3 sm:px-8 py-3 bg-white border  border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-4 shadow-lg shadow-slate-100 transition-colors text-sm"
                      id="action-map-directions"
                    >
                      <Map size={16} className="text-slate-400" />
                      Itinéraire (Google Maps / Waze)
                    </a>
                  </div>
                </div>

                {/* Bottom explanatory block explaining database reference */}
                <div className="p-4 bg-slate-200/50 rounded-2xl flex items-start gap-3 border border-slate-300/30 text-xs text-slate-600">
                  <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-700 block mb-0.5">Base Publique et Sécurité de Substitution</strong>
                    Ce référentiel suit la nomenclature officielle française. Les substitutions de spécialités en rupture sont alignées sur le répertoire officiel des groupes génériques de l'ANSM. En cas de doute, sollicitez toujours la validation finale de votre pharmacien officiel.
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-800 text-slate-400 text-center py-4 border-t border-slate-700 text-[11px] shrink-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; 2026 easyPharma &bull; Recherche intelligente et substitution de soins</span>
          <div className="flex gap-4">
            <a href="#provis" className="hover:underline">Conditions d'utilisation</a>
            <a href="#provis" className="hover:underline">Données personnelles et RGPD</a>
            <span className="text-emerald-500 font-bold flex items-center gap-1">🟢 Connexion Stocks Active</span>
          </div>
        </div>
      </footer>

      {/* AUTHENTICATION / CREER COMPTE / CONNEXION MODAL */}
      {authModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" id="auth-modal">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 w-full max-w-md relative">
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">Compte easyPharma</h3>
                <p className="text-xs text-slate-500">Sauvegardez vos ordonnances et pharmacies favorites</p>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Prénom</label>
                  <input 
                    type="text" 
                    value={authPrenom}
                    onChange={(e) => setAuthPrenom(e.target.value)}
                    placeholder="Lucas"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium" 
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Nom</label>
                  <input 
                    type="text" 
                    value={authNom}
                    onChange={(e) => setAuthNom(e.target.value)}
                    placeholder="Martin"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium" 
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Adresse E-mail</label>
                <input 
                  type="email" 
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="votre.nom@compte.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium" 
                  required
                />
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start gap-2.5 text-[11px] text-slate-600">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Vos données de santé restent locales et ne sont jamais revendues. easyPharma est hébergé en environnement hautement sécurisé.
                </span>
              </div>

              <button 
                type="submit"
                className="w-full py-3 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-100"
              >
                S'enregistrer et Se connecter
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SCAN PRESCRIPTION MODAL / CAMERA DRAWERS */}
      {isScanModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" id="scan-prescription-modal">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative flex flex-col gap-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                  <Camera size={22} className="animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Numérisation d'Ordonnance par Intelligence Artificielle</h3>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                    <Sparkles size={11} className="text-emerald-600" />
                    Propulsé par Google Gemini
                  </span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsScanModalOpen(false);
                  setScanImage(null);
                  setScanResult(null);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                id="close-scan-modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Split layout: Upload & Configuration vs. OCR Live Result */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Image Selector and Demonstration Presets */}
              <div className="md:col-span-7 flex flex-col gap-4">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Étape 1 : Choisir ou Capturer l'ordonnance
                </span>

                {/* Simulated file selector / Camera area */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl relative bg-slate-50 min-h-45 flex flex-col items-center justify-center p-4 text-center transition-all group cursor-default">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled
                    className="absolute inset-0 opacity-0 cursor-not-allowed z-10" 
                    title="Prendre une photo ou importer un fichier d'ordonnance"
                  />
                  
                  {scanImage ? (
                    <div className="w-full h-40 relative rounded-xl overflow-hidden bg-slate-900 border border-slate-300">
                      <img 
                        src={scanImage} 
                        alt="Aperçu Ordonnance" 
                        className="w-full h-full object-contain"
                      />
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setScanImage(null);
                          setScanResult(null);
                        }}
                        className="absolute bottom-2 right-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded font-bold transition-all shadow-md"
                      >
                        Retirer l'image
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm group-hover:scale-110 transition-all">
                        <Upload size={18} className="text-emerald-600" />
                      </div>
                      <div className="text-xs font-bold text-slate-700 block mt-1">Glissez une ordonnance ou Cliquez pour parcourir</div>
                      <div className="text-[10px] text-slate-400">Formats supportés : JPEG, PNG, HEIC (Fichiers d'ordonnance médicaux)</div>
                    </div>
                  )}
                </div>

                {/* Simulation assistance cards */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <Stethoscope size={14} className="text-emerald-700" />
                    <span className="text-xs font-extrabold text-slate-700">Pas d'ordonnance sous la main ? Testez la démo :</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-2 leading-snug">
                    Sélectionnez une prescription d'exemple authentique:
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <button 
                      onClick={() => handleSelectPresetPrescription("grippe")}
                      className="p-2 py-2.5 bg-white hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl text-left flex justify-between items-center transition-all group"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-all block">📝 Prescription Grippe, Fièvre & Douleur</span>
                        <span className="text-[10px] text-slate-400 italic">Doliprane 1000mg x2, Spasfon 80mg x1</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-600" />
                    </button>

                    <button 
                      onClick={() => handleSelectPresetPrescription("angine")}
                      className="p-2 py-2.5 bg-white hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl text-left flex justify-between items-center transition-all group"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-all block">📝 Prescription Angine Clinique</span>
                        <span className="text-[10px] text-slate-400 italic">Clamoxyl 1g x1, Ibuprofène 400mg x1</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-600" />
                    </button>

                    <button 
                      onClick={() => handleSelectPresetPrescription("asthme")}
                      className="p-2 py-2.5 bg-white hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl text-left flex justify-between items-center transition-all group"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-all block">📝 Prescription Asthme & Reflux gastrique (RGO)</span>
                        <span className="text-[10px] text-slate-400 italic">Ventoline 100 µg x1, Inexium 40mg x2</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-600" />
                    </button>
                  </div>
                </div>

                {/* Primary trigger OCR button */}
                <button
                  disabled={isScanning || !scanImage}
                  onClick={triggerGeminiScan}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    isScanning 
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                      : !scanImage 
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100"
                  }`}
                >
                  {isScanning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      Analyse OCR & Recherche en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Lancer l'extraction par l'IA
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: API response parser match rendering */}
              <div className="md:col-span-5 flex flex-col gap-4 border-t pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-6 border-slate-200">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Étape 2 : Résultats identifiés
                </span>

                {/* Live scanner analysis workspace placeholder */}
                {scanError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl flex items-start gap-2">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <span>{scanError}</span>
                  </div>
                )}

                {!scanResult && !isScanning && (
                  <div className="flex-1 min-h-40 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center p-4">
                    <Smartphone size={24} className="text-slate-300 mb-2" />
                    <span className="text-xs font-bold text-slate-600 block">En attente de scan</span>
                    <span className="text-[11px] text-slate-400 mt-1">Uploadez une ordonnance ou cliquez sur un exemple public à gauche pour extraire les données.</span>
                  </div>
                )}

                {isScanning && (
                  <div className="flex-1 min-h-40 flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-2xl bg-slate-50 text-center p-6 animate-pulse">
                    <div className="w-8 h-8 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mb-3" />
                    <span className="text-xs font-extrabold text-emerald-700">Gemini déchiffre l'ordonnance...</span>
                    <span className="text-[10px] text-slate-400 mt-1 text-center">Extraction de l'écriture manuscrite, des dosages réglementaires et croisement avec le référentiel d'État.</span>
                  </div>
                )}

                {scanResult && (
                  <div className="flex flex-col gap-3 h-full animate-fadeIn" id="scan-results-pane">
                    
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between shrink-0">
                      <span className="text-xs font-bold font-mono text-emerald-800">Scan du {scanResult.scanDate}</span>
                      <span className="text-[10px] font-extrabold bg-emerald-600 text-white p-0.5 px-2 rounded-full">Analyse OK</span>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-75 flex flex-col gap-2 p-1" id="scan-matched-items">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Médicaments détectés dans la base</span>
                      
                      {scanResult.matchedMedications.length === 0 ? (
                        <div className="p-4 bg-slate-50 text-center rounded-xl text-xs text-slate-500">
                          Aucun médicament similaire n'a pu être recensé dans notre référentiel public disponible.
                        </div>
                      ) : (
                        scanResult.matchedMedications.map(({ medication, quantite }) => (
                          <div 
                            key={medication.id}
                            className="p-3.5 bg-white border border-slate-150 rounded-xl flex justify-between items-center transition-all bg-emerald-50/20 border-l-4 border-l-emerald-600"
                          >
                            <div className="flex flex-col truncate pr-2">
                              <span className="font-bold text-indigo-950 text-xs truncate leading-tight">{medication.nom}</span>
                              <span className="text-[9px] text-slate-500 mt-0.5 italic">{medication.forme} &bull; {medication.dosage}</span>
                            </div>
                            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded shrink-0">
                              qté: {quantite}
                            </span>
                          </div>
                        ))
                      )}

                      {/* Unmatched medications list */}
                      {scanResult.unmatchedNames.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-100 overflow-hidden" id="scan-unmatched-items">
                          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1 flex items-center gap-1">
                            <AlertTriangle size={11} />
                            Non répertoriés ({scanResult.unmatchedNames.length})
                          </span>
                          <div className="flex flex-col gap-1">
                            {scanResult.unmatchedNames.map((name, i) => (
                              <div key={i} className="p-2 bg-slate-100/70 text-slate-600 rounded text-[10px] truncate">
                                &bull; {name} (hors catalogue démo)
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Import result command */}
                    <button
                      onClick={handleImportScanResult}
                      className="w-full py-3 mt-auto bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
                      id="import-scan-btn"
                    >
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      Importer ces médicaments ({scanResult.matchedMedications.length})
                    </button>
                    
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
