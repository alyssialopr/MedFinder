import { Medication } from "../types";

export const REFERENTIEL_MEDICAMENTS: Medication[] = [
  // Groupe PARACETAMOL 1000mg
  {
    id: "doliprane-1000",
    nom: "Doliprane 1000mg",
    substanceActive: "Paracétamol",
    dosage: "1000mg",
    forme: "Comprimé",
    groupeGenerique: "PARACETAMOL_1000",
    description: "Antalgique (calme la douleur) et antipyretique (fait baisser la fièvre). Indiqué en cas de douleur et/ou fièvre.",
    estGenerique: false,
    laboratoire: "Sanofi Aventis France",
    prixIndication: "2.10 €",
    ordonnanceObligatoire: false
  },
  {
    id: "dafalgan-1000",
    nom: "Dafalgan 1000mg",
    substanceActive: "Paracétamol",
    dosage: "1000mg",
    forme: "Gélule",
    groupeGenerique: "PARACETAMOL_1000",
    description: "Médicament indiqué dans le traitement symptomatique des douleurs d'intensité légère à modérée et/ou des états fébriles.",
    estGenerique: false,
    laboratoire: "UPSA SAS",
    prixIndication: "2.10 €",
    ordonnanceObligatoire: false
  },
  {
    id: "efferalgan-1000",
    nom: "Efferalgan 1000mg",
    substanceActive: "Paracétamol",
    dosage: "1000mg",
    forme: "Comprimé Effervescent",
    groupeGenerique: "PARACETAMOL_1000",
    description: "Traitement symptomatique des affections douloureuses et/ou fébriles.",
    estGenerique: false,
    laboratoire: "UPSA SAS",
    prixIndication: "2.10 €",
    ordonnanceObligatoire: false
  },
  {
    id: "paracetamol-biogaran-1000",
    nom: "Paracétamol Biogaran 1000mg",
    substanceActive: "Paracétamol",
    dosage: "1000mg",
    forme: "Comprimé",
    groupeGenerique: "PARACETAMOL_1000",
    description: "Générique de Doliprane 1000mg. Utilisé contre la douleur ou la fièvre.",
    estGenerique: true,
    laboratoire: "Biogaran",
    prixIndication: "1.95 €",
    ordonnanceObligatoire: false
  },

  // Groupe PARACETAMOL 500mg
  {
    id: "doliprane-500",
    nom: "Doliprane 500mg",
    substanceActive: "Paracétamol",
    dosage: "500mg",
    forme: "Gélule",
    groupeGenerique: "PARACETAMOL_500",
    description: "Traitement symptomatique de la douleur légère à modérée et des états fébriles chez l'adulte et l'enfant.",
    estGenerique: false,
    laboratoire: "Sanofi Aventis France",
    prixIndication: "1.64 €",
    ordonnanceObligatoire: false
  },
  {
    id: "paracetamol-mylan-500",
    nom: "Paracétamol Mylan 500mg",
    substanceActive: "Paracétamol",
    dosage: "500mg",
    forme: "Comprimé",
    groupeGenerique: "PARACETAMOL_500",
    description: "Générique de Doliprane 500mg. Traitement symptomatique de la fièvre et des douleurs.",
    estGenerique: true,
    laboratoire: "Mylan SAS",
    prixIndication: "1.50 €",
    ordonnanceObligatoire: false
  },

  // Groupe PHLOROGLUCINOL 80mg (Spasfon)
  {
    id: "spasfon-80",
    nom: "Spasfon",
    substanceActive: "Phloroglucinol",
    dosage: "80mg",
    forme: "Comprimé enrobé",
    groupeGenerique: "PHLOROGLUCINOL_80",
    description: "Antispasmodique. Soigne les spasmes abdominaux, hépatiques, urinaires ou gynécologiques (douleurs menstruelles).",
    estGenerique: false,
    laboratoire: "Teva Santé",
    prixIndication: "3.24 €",
    ordonnanceObligatoire: false
  },
  {
    id: "spasfon-lyoc-80",
    nom: "Spasfon Lyoc 80mg",
    substanceActive: "Phloroglucinol",
    dosage: "80mg",
    forme: "Lyophilisat oral",
    groupeGenerique: "PHLOROGLUCINOL_80",
    description: "Antispasmodique d'action rapide à dissoudre sous la langue pour soulager les crises de spasme.",
    estGenerique: false,
    laboratoire: "Teva Santé",
    prixIndication: "3.50 €",
    ordonnanceObligatoire: false
  },
  {
    id: "phloroglucinol-biogaran-80",
    nom: "Phloroglucinol Biogaran 80mg",
    substanceActive: "Phloroglucinol",
    dosage: "80mg",
    forme: "Comprimé",
    groupeGenerique: "PHLOROGLUCINOL_80",
    description: "Générique de Spasfon 80mg. Indiqué pour soulager les spasmes douloureux digestifs, rénaux ou gynécologiques.",
    estGenerique: true,
    laboratoire: "Biogaran",
    prixIndication: "2.80 €",
    ordonnanceObligatoire: false
  },

  // Groupe AMOXICILLINE 1g (Clamoxyl)
  {
    id: "clamoxyl-1g",
    nom: "Clamoxyl 1g",
    substanceActive: "Amoxicilline",
    dosage: "1g",
    forme: "Poudre pour suspension buvable",
    groupeGenerique: "AMOXICILLINE_1000",
    description: "Antibiotique de la famille des pénicillines. Indiqué pour traiter diverses infections bactériennes.",
    estGenerique: false,
    laboratoire: "GlaxoSmithKline",
    prixIndication: "5.10 €",
    ordonnanceObligatoire: true
  },
  {
    id: "amoxicilline-biogaran-1g",
    nom: "Amoxicilline Biogaran 1g",
    substanceActive: "Amoxicilline",
    dosage: "1g",
    forme: "Comprimé dispersible",
    groupeGenerique: "AMOXICILLINE_1000",
    description: "Générique de Clamoxyl 1g. Antibiotique de premier choix pour de nombreuses infections.",
    estGenerique: true,
    laboratoire: "Biogaran",
    prixIndication: "4.20 €",
    ordonnanceObligatoire: true
  },
  {
    id: "amoxicilline-sandoz-1g",
    nom: "Amoxicilline Sandoz 1g",
    substanceActive: "Amoxicilline",
    dosage: "1g",
    forme: "Comprimé dispersible",
    groupeGenerique: "AMOXICILLINE_1000",
    description: "Générique de Clamoxyl 1g. Traitement d'infections respiratoires, urinaires ou ORL.",
    estGenerique: true,
    laboratoire: "Sandoz",
    prixIndication: "4.20 €",
    ordonnanceObligatoire: true
  },

  // Groupe ESOMEPRAZOLE 40mg (Inexium)
  {
    id: "inexium-40",
    nom: "Inexium 40mg",
    substanceActive: "Ésoméprazole",
    dosage: "40mg",
    forme: "Comprimé",
    groupeGenerique: "ESOMEPRAZOLE_40",
    description: "Inhibiteur de la pompe à protons (IPP). Réduit l'acide de l'estomac. Indiqué contre les reflux gastriques (RGO) ou ulcères.",
    estGenerique: false,
    laboratoire: "AstraZeneca",
    prixIndication: "6.80 €",
    ordonnanceObligatoire: true
  },
  {
    id: "esomeprazole-biogaran-40",
    nom: "Ésoméprazole Biogaran 40mg",
    substanceActive: "Ésoméprazole",
    dosage: "40mg",
    forme: "Comprimé",
    groupeGenerique: "ESOMEPRAZOLE_40",
    description: "Générique d'Inexium 40mg. Réduit l'acidité gastrique pour soigner l'œsophagite ou les ulcères.",
    estGenerique: true,
    laboratoire: "Biogaran",
    prixIndication: "5.45 €",
    ordonnanceObligatoire: true
  },

  // Groupe OMEPRAZOLE 20mg (Mopral)
  {
    id: "mopral-20",
    nom: "Mopral 20mg",
    substanceActive: "Oméprazole",
    dosage: "20mg",
    forme: "Gélule gastro-résistante",
    groupeGenerique: "OMEPRAZOLE_20",
    description: "Inhibiteur de la pompe à protons. Protège l'estomac d'excès d'acide, traite les brûlures gastriques et reflux.",
    estGenerique: false,
    laboratoire: "AstraZeneca",
    prixIndication: "4.12 €",
    ordonnanceObligatoire: true
  },
  {
    id: "omeprazole-biogaran-20",
    nom: "Oméprazole Biogaran 20mg",
    substanceActive: "Oméprazole",
    dosage: "20mg",
    forme: "Gélule gastro-résistante",
    groupeGenerique: "OMEPRAZOLE_20",
    description: "Générique de Mopral 20mg. Aide à guérir les brûlures d'estomac et prévient les récidives d'ulcères.",
    estGenerique: true,
    laboratoire: "Biogaran",
    prixIndication: "3.20 €",
    ordonnanceObligatoire: true
  },

  // Groupe DIOSMECTITE 3g (Smecta)
  {
    id: "smecta-3",
    nom: "Smecta 3g",
    substanceActive: "Diosmectite",
    dosage: "3g",
    forme: "Poudre pour suspension buvable",
    groupeGenerique: "DIOSMECTITE_3",
    description: "Absorbant intestinal. Pansement digestif indiqué dans le traitement des diarrhées aiguës.",
    estGenerique: false,
    laboratoire: "Ipsen Consumer Healthcare",
    prixIndication: "3.90 €",
    ordonnanceObligatoire: false
  },
  {
    id: "diosmectite-mylan-3",
    nom: "Diosmectite Mylan 3g",
    substanceActive: "Diosmectite",
    dosage: "3g",
    forme: "Sachet",
    groupeGenerique: "DIOSMECTITE_3",
    description: "Générique de Smecta 3g. Utilisé comme traitement symptomatique des diarrhées aiguës chez l'adulte.",
    estGenerique: true,
    laboratoire: "Mylan SAS",
    prixIndication: "3.10 €",
    ordonnanceObligatoire: false
  },

  // Groupe IBUPROFENE 400mg (Advil / Nurofen)
  {
    id: "nurofen-400",
    nom: "Nurofen 400mg",
    substanceActive: "Ibuprofène",
    dosage: "400mg",
    forme: "Comprimé",
    groupeGenerique: "IBUPROFENE_400",
    description: "Anti-inflammatoire non stéroïdien (AINS). Traite les douleurs légères à modérées (maux de tête, rage de dents, courbatures).",
    estGenerique: false,
    laboratoire: "Reckitt Benckiser Healthcare",
    prixIndication: "3.80 €",
    ordonnanceObligatoire: false
  },
  {
    id: "advil-400",
    nom: "Advil 400mg",
    substanceActive: "Ibuprofène",
    dosage: "400mg",
    forme: "Comprimé",
    groupeGenerique: "IBUPROFENE_400",
    description: "Anti-inflammatoire non stéroïdien. Lutte contre les douleurs modérées et les maux de tête passagers.",
    estGenerique: false,
    laboratoire: "Pfizer",
    prixIndication: "3.95 €",
    ordonnanceObligatoire: false
  },
  {
    id: "ibuprofene-biogaran-400",
    nom: "Ibuprofène Biogaran 400mg",
    substanceActive: "Ibuprofène",
    dosage: "400mg",
    forme: "Comprimé",
    groupeGenerique: "IBUPROFENE_400",
    description: "Générique d'Advil/Nurofen 400mg. Utilisé à court terme pour soulager la fièvre et les rhumatismes passagers.",
    estGenerique: true,
    laboratoire: "Biogaran",
    prixIndication: "2.90 €",
    ordonnanceObligatoire: false
  },

  // Groupe SALBUTAMOL 100 µg (Ventoline)
  {
    id: "ventoline-100",
    nom: "Ventoline 100 µg/dose",
    substanceActive: "Salbutamol",
    dosage: "100 µg",
    forme: "Suspension pour inhalation",
    groupeGenerique: "SALBUTAMOL_100",
    description: "Bronchodilatateur à action rapide. Indiqué en cas d'asthme aigu, sifflements et bronchites obstructives.",
    estGenerique: false,
    laboratoire: "GlaxoSmithKline",
    prixIndication: "6.20 €",
    ordonnanceObligatoire: true
  },
  {
    id: "salbutamol-arrow-100",
    nom: "Salbutamol Arrow 100 µg/dose",
    substanceActive: "Salbutamol",
    dosage: "100 µg",
    forme: "Inhalateur",
    groupeGenerique: "SALBUTAMOL_100",
    description: "Générique de Ventoline. Soulage rapidement la crise d'asthme en dilatant les bronches respiratoires.",
    estGenerique: true,
    laboratoire: "Arrow Génériques",
    prixIndication: "5.50 €",
    ordonnanceObligatoire: true
  },

  // Groupe CETIRIZINE 10mg (Allergie)
  {
    id: "zyrtec-10",
    nom: "Zyrtec 10mg",
    substanceActive: "Cétirizine dichlorhydrate",
    dosage: "10mg",
    forme: "Comprimé sécable",
    groupeGenerique: "CETIRIZINE_10",
    description: "Anti-allergique / antihistaminique. Traite les symptômes de la rhinite allergique de saison et de l'urticaire.",
    estGenerique: false,
    laboratoire: "UCB Pharma",
    prixIndication: "4.50 €",
    ordonnanceObligatoire: false
  },
  {
    id: "cetirizine-biogaran-10",
    nom: "Cétirizine Biogaran 10mg",
    substanceActive: "Cétirizine dichlorhydrate",
    dosage: "10mg",
    forme: "Comprimé sécable",
    groupeGenerique: "CETIRIZINE_10",
    description: "Générique de Zyrtec 10mg. Soulage efficacement la conjonctivite allergique, le nez qui coule et le rhume des foins.",
    estGenerique: true,
    laboratoire: "Biogaran",
    prixIndication: "3.20 €",
    ordonnanceObligatoire: false
  },

  // GAVISCON (Anti-acide)
  {
    id: "gaviscon-suspension",
    nom: "Gaviscon Suspension Buvable",
    substanceActive: "Alginate de sodium / Bicarbonate de sodium",
    dosage: "Sachet 10ml",
    forme: "Suspension buvable en sachet",
    groupeGenerique: "ALGINATE_BICARBONATE",
    description: "Forme un gel protecteur dans l'estomac pour empêcher les remontées acides acides le long de l'œsophage.",
    estGenerique: false,
    laboratoire: "Reckitt Benckiser Healthcare",
    prixIndication: "3.20 €",
    ordonnanceObligatoire: false
  },
  {
    id: "alginate-sodium-biogaran",
    nom: "Alginate de sodium / Bicarbonate Biogaran",
    substanceActive: "Alginate de sodium / Bicarbonate de sodium",
    dosage: "Sachet 10ml",
    forme: "Suspension buvable en sachet",
    groupeGenerique: "ALGINATE_BICARBONATE",
    description: "Générique de Gaviscon. Soulage instantanément les brûlures d'estomac et reflux acides.",
    estGenerique: true,
    laboratoire: "Biogaran",
    prixIndication: "2.50 €",
    ordonnanceObligatoire: false
  },

  // Groupe LORATADINE 10mg (Clarityne)
  {
    id: "clarityne-10",
    nom: "Clarityne 10mg",
    substanceActive: "Loratadine",
    dosage: "10mg",
    forme: "Comprimé",
    groupeGenerique: "LORATADINE_10",
    description: "Antihistaminique de deuxième génération. Indiqué dans le traitement symptomatique de la rhinite allergique et de l'urticaire.",
    estGenerique: false,
    laboratoire: "Bayer Healthcare",
    prixIndication: "4.15 €",
    ordonnanceObligatoire: false
  },
  {
    id: "loratadine-biogaran-10",
    nom: "Loratadine Biogaran 10mg",
    substanceActive: "Loratadine",
    dosage: "10mg",
    forme: "Comprimé",
    groupeGenerique: "LORATADINE_10",
    description: "Générique de Clarityne 10mg. Soulage les éternuements, l'écoulement nasal et les démangeaisons allergiques.",
    estGenerique: true,
    laboratoire: "Biogaran",
    prixIndication: "3.10 €",
    ordonnanceObligatoire: false
  },

  // Groupe DESLORATADINE 5mg (Aerius)
  {
    id: "aerius-5",
    nom: "Aerius 5mg",
    substanceActive: "Desloratadine",
    dosage: "5mg",
    forme: "Comprimé pelliculé",
    groupeGenerique: "DESLORATADINE_5",
    description: "Antihistaminique non sédatif à action prolongée pour calmer les symptômes d'allergie ou de rhume des foins.",
    estGenerique: false,
    laboratoire: "Organon France",
    prixIndication: "3.90 €",
    ordonnanceObligatoire: true
  },
  {
    id: "desloratadine-biogaran-5",
    nom: "Desloratadine Biogaran 5mg",
    substanceActive: "Desloratadine",
    dosage: "5mg",
    forme: "Comprimé pelliculé",
    groupeGenerique: "DESLORATADINE_5",
    description: "Générique de Aerius 5mg. Bloque les récepteurs à l'histamine pour stopper la réaction allergique cutanée ou respiratoire.",
    estGenerique: true,
    laboratoire: "Biogaran",
    prixIndication: "2.80 €",
    ordonnanceObligatoire: true
  },

  // Groupe METFORMINE 1000mg (Glucophage)
  {
    id: "glucophage-1000",
    nom: "Glucophage 1000mg",
    substanceActive: "Metformine chlorhydrate",
    dosage: "1000mg",
    forme: "Comprimé pelliculé",
    groupeGenerique: "METFORMINE_1000",
    description: "Antidiabétique oral (famille des biguanides). Indiqué dans le traitement du diabète de type 2.",
    estGenerique: false,
    laboratoire: "Merck Santé",
    prixIndication: "5.80 €",
    ordonnanceObligatoire: true
  },
  {
    id: "metformine-biogaran-1000",
    nom: "Metformine Biogaran 1000mg",
    substanceActive: "Metformine chlorhydrate",
    dosage: "1000mg",
    forme: "Comprimé pelliculé",
    groupeGenerique: "METFORMINE_1000",
    description: "Générique de Glucophage 1000mg. Diminue la production de glucose par le foie pour réguler la glycémie.",
    estGenerique: true,
    laboratoire: "Biogaran",
    prixIndication: "4.50 €",
    ordonnanceObligatoire: true
  },

  // Groupe ATORVASTATINE 20mg (Tahor)
  {
    id: "tahor-20",
    nom: "Tahor 20mg",
    substanceActive: "Atorvastatine",
    dosage: "20mg",
    forme: "Comprimé pelliculé",
    groupeGenerique: "ATORVASTATINE_20",
    description: "Hypolipidémiant (statine). Réduit les taux de cholestérol et de triglycérides dans le sang.",
    estGenerique: false,
    laboratoire: "Pfizer Holding France",
    prixIndication: "11.20 €",
    ordonnanceObligatoire: true
  },
  {
    id: "atorvastatine-biogaran-20",
    nom: "Atorvastatine Biogaran 20mg",
    substanceActive: "Atorvastatine",
    dosage: "20mg",
    forme: "Comprimé pelliculé",
    groupeGenerique: "ATORVASTATINE_20",
    description: "Générique d'Atorvastatine. Utilisé en prévention cardiovasculaire et traitement de l'hypercholestérolémie.",
    estGenerique: true,
    laboratoire: "Biogaran",
    prixIndication: "9.10 €",
    ordonnanceObligatoire: true
  }
];

export function getMedicationAlternatives(medId: string): Medication[] {
  const med = REFERENTIEL_MEDICAMENTS.find((m) => m.id === medId);
  if (!med) return [];
  return REFERENTIEL_MEDICAMENTS.filter((m) => m.groupeGenerique === med.groupeGenerique && m.id !== medId);
}
