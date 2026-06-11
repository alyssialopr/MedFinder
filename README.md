# easyPharma

Application web de recherche de pharmacies et de disponibilité de médicaments. easyPharma permet de composer une liste de traitements, de scanner une ordonnance grâce à l'IA Google Gemini, puis de trouver les pharmacies les plus proches disposant des produits recherchés — y compris leurs équivalents génériques.

> **Note :** Ce projet est une démonstration. Les stocks de pharmacies et l'authentification sont simulés. Les données médicales proviennent d'un référentiel public de démonstration.

---

## Fonctionnalités

- **Recherche de médicaments** — Autocomplétion sur un référentiel français (nom, substance active, groupe générique)
- **Scan d'ordonnance par IA** — Extraction automatique des médicaments depuis une photo (Google Gemini)
- **Localisation** — Géolocalisation GPS ou simulation par ville (Paris, Lyon, Marseille, etc.)
- **Pharmacies à proximité** — Classement par distance avec jauge de disponibilité en temps réel
- **Substitutions génériques** — Proposition d'alternatives selon les groupes thérapeutiques (ANSM)
- **Démo intégrée** — Prescriptions d'exemple (grippe, angine, asthme) pour tester sans ordonnance réelle

---

## Stack technique

| Couche | Technologies |
|--------|--------------|
| Frontend | React 19, TypeScript, Tailwind CSS 4, Lucide Icons |
| Backend | Express, Vite (middleware en dev) |
| IA | Google Gemini (`gemini-3.5-flash`) via `@google/genai` |
| Build | Vite + esbuild |

---

## Prérequis

- [Node.js](https://nodejs.org/) 18 ou supérieur
- Une clé API [Google Gemini](https://aistudio.google.com/apikey) (requise pour le scan d'ordonnance)

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/alyssialopr/EasyPharma.git
cd EasyPharma


# Installer les dépendances
npm install
```

---

## Configuration

Créez un fichier `.env.local` à la racine du projet :

```bash
cp .env.example .env.local
```

Éditez `.env.local` et renseignez votre clé API :

```env
GEMINI_API_KEY="votre_cle_api_gemini"
```

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `GEMINI_API_KEY` | Clé API Google Gemini pour l'analyse d'ordonnances | Oui (pour le scan IA) |
| `APP_URL` | URL de l'application (déploiement) | Non |

> L'application démarre sans clé API, mais le scan d'ordonnance renverra une erreur tant que `GEMINI_API_KEY` n'est pas configurée.

---

## Lancement

### Mode développement

```bash
npm run dev
```

L'application est accessible sur **http://localhost:3000**.

### Mode production

```bash
npm run build
npm start
```

### Autres commandes

```bash
npm run lint    # Vérification TypeScript
npm run clean   # Suppression du dossier dist
```

---

## API

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/health` | État du serveur |
| `GET` | `/api/medicaments` | Référentiel complet des médicaments |
| `POST` | `/api/scan-prescription` | Analyse d'une ordonnance (image en base64) |

**Exemple — scan d'ordonnance :**

```json
POST /api/scan-prescription
Content-Type: application/json

{
  "image": "<contenu_base64>",
  "mimeType": "image/jpeg"
}
```

---

## Structure du projet

```
EasyPharma/
├── server.ts              # Serveur Express + routes API + Vite
├── src/
│   ├── App.tsx            # Interface principale
│   ├── main.tsx           # Point d'entrée React
│   ├── types.ts           # Types TypeScript
│   ├── data/
│   │   └── medicaments.ts # Référentiel des médicaments
│   └── utils/
│       └── geo.ts         # Géolocalisation et pharmacies simulées
├── .env.example
├── package.json
└── vite.config.ts
```

---

## Utilisation

1. **Ajouter des médicaments** — Recherchez par nom dans la barre du haut ou utilisez les ajouts rapides
2. **Scanner une ordonnance** — Cliquez sur « Scanner », importez une photo ou choisissez un exemple de démo
3. **Consulter les pharmacies** — Les pharmacies proches s'affichent avec un score de disponibilité
4. **Voir le détail** — Sélectionnez une pharmacie pour consulter le stock produit par produit et les génériques disponibles

---

## Avertissement

Cette application est un **prototype de démonstration**. Elle ne remplace pas l'avis d'un professionnel de santé. En cas de doute sur un médicament ou une substitution, consultez toujours votre pharmacien.

---

## Licence

Projet à usage éducatif et de démonstration.
