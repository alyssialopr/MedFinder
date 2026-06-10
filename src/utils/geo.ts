import { Pharmacy } from "../types";
import { REFERENTIEL_MEDICAMENTS } from "../data/medicaments";

// Paris defaults
export const DEFAULT_LAT = 48.8566;
export const DEFAULT_LNG = 2.3522;

export const DEFAULT_CITIES = [
  { name: "Paris Centre", lat: 48.8566, lng: 2.3522 },
  { name: "Rive Gauche", lat: 48.8512, lng: 2.3333 },
  { name: "Bastille", lat: 48.8531, lng: 2.3691 },
  { name: "Vaugirard", lat: 48.8412, lng: 2.2998 },
  { name: "Montmartre", lat: 48.8867, lng: 2.3431 }
];

// Calculate distance in km between two GPS coordinates using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d; // Distance in km
}

// Generate realistic pharmacies with stock configurations depending on location coordinates
export function generatePharmacies(userLat: number, userLng: number): Pharmacy[] {
  // We'll place 5 pharmacies around the user coordinate with different pseudo-random offsets
  const offices = [
    {
      id: "pharmacie-centrale",
      nom: "Pharmacie Centrale de Garde",
      adresse: "84 Rue de Rivoli, 75004 Paris (Simulé à proximité)",
      telephone: "01 42 72 18 19",
      horaires: "24h/24 et 7j/7",
      latOffset: 0.0031, // ~ 300m North
      lngOffset: -0.0015, // West
      // Stock profile: Full availability
      stockMultiplier: 1.0, 
      customStock: {
        "doliprane-1000": 15,
        "dafalgan-1000": 8,
        "efferalgan-1000": 12,
        "paracetamol-biogaran-1000": 20,
        "doliprane-500": 18,
        "paracetamol-mylan-500": 14,
        "spasfon-80": 9,
        "spasfon-lyoc-80": 6,
        "phloroglucinol-biogaran-80": 22,
        "clamoxyl-1g": 4,
        "amoxicilline-biogaran-1g": 11,
        "amoxicilline-sandoz-1g": 8,
        "inexium-40": 5,
        "esomeprazole-biogaran-40": 10,
        "mopral-20": 4,
        "omeprazole-biogaran-20": 15,
        "smecta-3": 17,
        "diosmectite-mylan-3": 25,
        "nurofen-400": 12,
        "advil-400": 6,
        "ibuprofene-biogaran-400": 30,
        "ventoline-100": 8,
        "salbutamol-arrow-100": 12,
        "zyrtec-10": 14,
        "cetirizine-biogaran-10": 18,
        "gaviscon-suspension": 20,
        "alginate-sodium-biogaran": 25,
      }
    },
    {
      id: "pharmacie-saint-germain",
      nom: "Pharmacie Saint-Germain & Lafayette",
      adresse: "124 Boulevard Saint-Germain, 75006 Paris (Simulé à proximité)",
      telephone: "01 43 25 10 30",
      horaires: "08h00 - 20h30 (Sauf Dimanche)",
      latOffset: -0.0042, // ~ 450m South
      lngOffset: 0.0051, // East
      // Stock profile: Shortage on Brand items (Doliprane, Spasfon, Clamoxyl) but strong Generic stock!
      stockMultiplier: 0.7,
      customStock: {
        "doliprane-1000": 0, // Rupture!
        "dafalgan-1000": 0,  // Rupture!
        "efferalgan-1000": 2, // Stock très faible
        "paracetamol-biogaran-1000": 34, // Excellent générique alternatif !
        "doliprane-500": 0,  // Rupture!
        "paracetamol-mylan-500": 18, // Générique alternatif !
        "spasfon-80": 0,      // Rupture!
        "spasfon-lyoc-80": 0,  // Rupture!
        "phloroglucinol-biogaran-80": 19, // Générique alternatif !
        "clamoxyl-1g": 0,     // Rupture!
        "amoxicilline-biogaran-1g": 9, // Générique alternatif !
        "amoxicilline-sandoz-1g": 12,
        "inexium-40": 0,
        "esomeprazole-biogaran-40": 8,
        "mopral-20": 3,
        "omeprazole-biogaran-20": 12,
        "smecta-3": 12,
        "diosmectite-mylan-3": 18,
        "nurofen-400": 14,
        "advil-400": 0,
        "ibuprofene-biogaran-400": 25,
        "ventoline-100": 0,
        "salbutamol-arrow-100": 10,
        "zyrtec-10": 8,
        "cetirizine-biogaran-10": 15,
        "gaviscon-suspension": 14,
        "alginate-sodium-biogaran": 22,
      }
    },
    {
      id: "pharmacie-du-centre",
      nom: "Grande Pharmacie du Centre-Ville",
      adresse: "14 Rue du Temple, 75004 Paris (Simulé à proximité)",
      telephone: "01 42 78 54 22",
      horaires: "08h30 - 20h00",
      latOffset: 0.0084, // ~ 900m North-East
      lngOffset: 0.0075,
      // Stock profile: Random mid-levels
      stockMultiplier: 0.6,
      customStock: {
        "doliprane-1000": 8,
        "dafalgan-1000": 3,
        "efferalgan-1000": 0,
        "paracetamol-biogaran-1000": 4,
        "doliprane-500": 5,
        "paracetamol-mylan-500": 0,
        "spasfon-80": 8,
        "spasfon-lyoc-80": 4,
        "phloroglucinol-biogaran-80": 0,
        "clamoxyl-1g": 5,
        "amoxicilline-biogaran-1g": 0,
        "amoxicilline-sandoz-1g": 3,
        "inexium-40": 12,
        "esomeprazole-biogaran-40": 2,
        "mopral-20": 0,
        "omeprazole-biogaran-20": 8,
        "smecta-3": 0,
        "diosmectite-mylan-3": 9,
        "nurofen-400": 5,
        "advil-400": 4,
        "ibuprofene-biogaran-400": 10,
        "ventoline-100": 1,
        "salbutamol-arrow-100": 2,
        "zyrtec-10": 5,
        "cetirizine-biogaran-10": 6,
        "gaviscon-suspension": 8,
        "alginate-sodium-biogaran": 2,
      }
    },
    {
      id: "pharmacie-du-marche",
      nom: "Pharmacie du Marché et des Écoles",
      adresse: "45 Rue Saint-Antoine, 75004 Paris (Simulé à proximité)",
      telephone: "01 48 87 56 12",
      horaires: "09h00 - 19h30 (Sauf Dimanche)",
      latOffset: -0.0019, // ~ 400m South-East
      lngOffset: -0.0092,
      // Stock profile: Severe shortages everywhere (tests visual score < 3/5)
      stockMultiplier: 0.2,
      customStock: {
        "doliprane-1000": 0,
        "dafalgan-1000": 0,
        "efferalgan-1000": 0,
        "paracetamol-biogaran-1000": 1, // seulement 1 en stock !
        "doliprane-500": 0,
        "paracetamol-mylan-500": 2,
        "spasfon-80": 3,
        "spasfon-lyoc-80": 0,
        "phloroglucinol-biogaran-80": 1,
        "clamoxyl-1g": 0,
        "amoxicilline-biogaran-1g": 0,
        "amoxicilline-sandoz-1g": 0,
        "inexium-40": 0,
        "esomeprazole-biogaran-40": 0,
        "mopral-20": 0,
        "omeprazole-biogaran-20": 1,
        "smecta-3": 2,
        "diosmectite-mylan-3": 0,
        "nurofen-400": 3,
        "advil-400": 0,
        "ibuprofene-biogaran-400": 1,
        "ventoline-100": 0,
        "salbutamol-arrow-100": 0,
        "zyrtec-10": 0,
        "cetirizine-biogaran-10": 2,
        "gaviscon-suspension": 0,
        "alginate-sodium-biogaran": 3,
      }
    },
    {
      id: "pharmacie-parc-marais",
      nom: "Pharmacie Verte du Parc - Le Marais",
      adresse: "61 Rue des Francs Bourgeois, 75004 Paris (Simulé à proximité)",
      telephone: "01 42 72 20 20",
      horaires: "08h30 - 21h00",
      latOffset: 0.0048, // ~ 600m North-East
      lngOffset: -0.0055,
      // Unique stock layout: strong on high-end / prescription items but low on OTC
      stockMultiplier: 0.75,
      customStock: {
        "doliprane-1000": 12,
        "dafalgan-1000": 0,
        "efferalgan-1000": 0,
        "paracetamol-biogaran-1000": 0,
        "doliprane-500": 14,
        "paracetamol-mylan-500": 0,
        "spasfon-80": 0,
        "spasfon-lyoc-80": 12, // Lyoc is in stock!
        "phloroglucinol-biogaran-80": 0,
        "clamoxyl-1g": 8, // Antibiotics in stock!
        "amoxicilline-biogaran-1g": 14,
        "amoxicilline-sandoz-1g": 0,
        "inexium-40": 12, // IPP in stock!
        "esomeprazole-biogaran-40": 18,
        "mopral-20": 9,
        "omeprazole-biogaran-20": 0,
        "smecta-3": 8,
        "diosmectite-mylan-3": 11,
        "nurofen-400": 0,
        "advil-400": 0,
        "ibuprofene-biogaran-400": 4,
        "ventoline-100": 12, // Ventoline is in stock!
        "salbutamol-arrow-100": 0,
        "zyrtec-10": 0,
        "cetirizine-biogaran-10": 8,
        "gaviscon-suspension": 14,
        "alginate-sodium-biogaran": 0,
      }
    }
  ];

  return offices.map((entry) => {
    // calculate actual geo position
    const pharmacyLat = userLat + entry.latOffset;
    const pharmacyLng = userLng + entry.lngOffset;

    // finalize stock listing
    const finalStock: { [key: string]: number } = {};
    
    // Seed stock for all medications in the reference catalog
    REFERENTIEL_MEDICAMENTS.forEach((med) => {
      if (entry.customStock && med.id in entry.customStock) {
        finalStock[med.id] = (entry.customStock as any)[med.id];
      } else {
        // Pseudo-random repeatable stock generator based on pharmacy & medication names
        const hash = med.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + 
                     entry.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const randomBase = hash % 13; // 13 is coprime with many patterns, 0 to 12 range
        const computed = Math.round(randomBase * entry.stockMultiplier);
        finalStock[med.id] = computed;
      }
    });

    return {
      id: entry.id,
      nom: entry.nom,
      adresse: entry.adresse,
      telephone: entry.telephone,
      horaires: entry.horaires,
      latitude: pharmacyLat,
      longitude: pharmacyLng,
      stocks: finalStock,
    };
  });
}
