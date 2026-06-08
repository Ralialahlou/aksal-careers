# AKSAL Careers — Site de recrutement

Site web de recrutement pour le **Groupe AKSAL** (Morocco Mall Casablanca & Marrakech).  
Construit avec **React 18 + Vite + Tailwind CSS v4**.

---

## Démarrage rapide

```bash
# 1. Cloner le projet
git clone https://github.com/Ralialahlou/aksal-careers.git
cd aksal-careers

# 2. Installer les dépendances
npm install

# 3. Lancer en local
npm run dev
# → http://localhost:5173
```

> **Prérequis :** Node.js >= 18. Utiliser [nvm](https://github.com/nvm-sh/nvm) :
> ```bash
> nvm install 24 && nvm use 24
> ```

---

## Structure du projet

```
aksal-careers/
├── public/
│   ├── aksal-logo.png          # Logo AKSAL
│   └── data/                   # Fichiers editables SANS toucher au code
│       ├── jobs.json           # Offres d'emploi
│       ├── config.json         # Malls, enseignes, villes, contrats, langues
│       └── content.json        # Tous les textes de l'interface
│
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── JobCard.jsx
│   ├── hooks/
│   │   └── useData.js          # Chargement des JSON depuis /public/data/
│   ├── pages/
│   │   ├── CareersPage.jsx     # Page offres d'emploi avec filtres
│   │   └── ApplyPage.jsx       # Formulaire de candidature (QR code)
│   ├── App.jsx
│   └── index.css
│
├── .github/workflows/ci.yml   # CI : lint + build sur chaque PR
└── .prettierrc                 # Formatage du code
```

---

## Modifier le contenu (sans coder)

Tous les textes et données sont dans **`public/data/`**.  
Editables directement sur GitHub (bouton crayon sur chaque fichier) — aucune connaissance technique requise.

### Ajouter une offre d'emploi → `public/data/jobs.json`

Copier un bloc existant et modifier les champs :

```json
{
  "id": 11,
  "title": "Responsable Clientele",
  "store": "zara",
  "storeName": "Zara",
  "mall": "morocco-mall-casa",
  "mallName": "Morocco Mall Casablanca",
  "contract": "cdi",
  "contractLabel": "CDI",
  "city": "Casablanca",
  "description": "Description du poste...",
  "requirements": ["Critere 1", "Critere 2"],
  "posted": "2026-06-08",
  "isNew": true
}
```

Valeurs valides pour `mall` :

| id | Label |
|---|---|
| `morocco-mall-casa` | Morocco Mall Casablanca |
| `morocco-mall-marrakech` | Morocco Mall Marrakech |
| `siege-social` | Siege Social |

Valeurs valides pour `contract` : `"cdi"` · `"cdd"` · `"stage"`

---

### Ajouter une ville ou une enseigne → `public/data/config.json`

Ajouter une nouvelle ville dans les filtres :
```json
"cities": [
  { "id": "all", "label": "Toutes les villes" },
  { "id": "Casablanca", "label": "Casablanca" },
  { "id": "Rabat", "label": "Rabat" }
]
```

Ajouter une nouvelle enseigne :
```json
"stores": [
  ...
  { "id": "nouvelle-marque", "label": "Nouvelle Marque" }
]
```

---

### Modifier les textes → `public/data/content.json`

Exemple — changer le titre de la page carrières :
```json
"careers": {
  "headline": "Rejoignez\nl'excellence."
}
```

---

## Commandes disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de developpement (hot reload) |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Previsualiser le build de production |
| `npm run lint` | Verifier le code avec ESLint |
| `npm run format` | Formater avec Prettier |

---

## Deploiement

### Vercel (recommande)
1. Connecter le repo GitHub a [vercel.com](https://vercel.com)
2. Build command : `npm run build`
3. Output directory : `dist`
4. Chaque push sur `main` declenche un deploiement automatique

### Netlify
1. Connecter le repo GitHub a [netlify.com](https://netlify.com)
2. Build command : `npm run build`
3. Publish directory : `dist`

---

## Charte graphique

| Couleur | Hex | Usage |
|---|---|---|
| Or | `#C9A96E` | Accent principal, CTAs |
| Or fonce | `#A8813F` | Hover des boutons |
| Charcoal | `#1C1C1C` | Texte principal |
| Pierre | `#6B6560` | Texte secondaire |
| Bordure | `#E5DDD0` | Separateurs |
| Fond clair | `#FAF8F5` | Fond de sections |

Polices : **Cormorant Garamond** (titres italic) · **Jost** (corps light)

---

## Contact

Equipe RH : [careers@groupeaksal.com](mailto:careers@groupeaksal.com)
