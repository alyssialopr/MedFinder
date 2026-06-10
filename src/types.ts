export interface Medication {
  id: string;
  nom: string;
  substanceActive: string;
  dosage: string;
  forme: string; // e.g., Comprimé, Gélule, Sirop, Sachet
  groupeGenerique: string; // e.g., PARACETAMOL_1000, AMOXICILLINE_500
  description: string;
  estGenerique: boolean;
  laboratoire: string;
  prixIndication?: string;
  ordonnanceObligatoire: boolean;
}

export interface Pharmacy {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  horaires: string;
  latitude: number;
  longitude: number;
  // Stock information is determined dynamically or statically per pharmacy
  stocks: { [medicationId: string]: number }; // Quantity available
}

export interface SearchedMedication {
  medication: Medication;
  quantite: number;
}

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom?: string;
}

export interface PrescriptionScanResult {
  detectedNames: string[];
  matchedMedications: SearchedMedication[];
  unmatchedNames: string[];
  scanDate: string;
}
