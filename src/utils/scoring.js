/*
  Scoring system — max 100 points

  Langues          max 40   Context-based: Luxe → Fr=25,En=10,Ar=1,Es=4
                            Autres périmètres  → Fr=30,En=5, Ar=4,Es=1
  Expérience       max 40   non (1ère exp)=5 / oui=+10 + années: <1=8,1-2=15,3-5=25,>5=30
  Formation        max  5   Bac=2 / Bac+2=3 / Bac+3=4 / Bac+5=5 / Autre=1
  Disponibilité    max  5   Immédiate=5 / <15j=4 / <1m=2 / >1m=1
  CV joint         max  5
  Complétude       max  5   +1 per optional field filled
*/

const LANG_SCORES = {
  luxe:  { francais: 25, anglais: 10, arabe: 1, espagnol: 4 },
  other: { francais: 30, anglais:  5, arabe: 4, espagnol: 1 },
};

const EXP_SCORES = {
  "Moins d'1 an":   8,
  '1 à 2 ans':     15,
  '3 à 5 ans':     25,
  'Plus de 5 ans': 30,
};

const ETUDES_SCORES = {
  'Baccalauréat':   2,
  'Bac+2':          3,
  'Bac+3':          4,
  'Bac+5 et plus':  5,
  'Autre':          1,
};

const DISPO_SCORES = {
  'Immédiate':      5,
  'Sous 15 jours':  4,
  'Sous 1 mois':    2,
  "Plus d'1 mois":  1,
};

export function scoreCandidature({
  langues           = [],
  magasinsSouhaites = [],
  magasinSouhaite   = '',
  experienceRetail  = '',
  annéesExperience  = '',
  disponibilite     = '',
  niveauEtudes      = '',
  cv                = null,
  dernierPoste      = '',
  dernierEmployeur  = '',
  secteurActivite   = '',
  diplomePrincipal  = '',
  adresse           = '',
}) {
  const breakdown = [];
  let raw = 0;

  /* Detect Luxe context */
  const allMagasins = magasinsSouhaites.length
    ? magasinsSouhaites
    : [magasinSouhaite].filter(Boolean);
  const isLuxe = allMagasins.some((m) => /luxe/i.test(m));
  const lw = isLuxe ? LANG_SCORES.luxe : LANG_SCORES.other;

  /* Langues (max 40) */
  const addLang = (id, label) => {
    const pts = lw[id] ?? 0;
    const earned = langues.includes(id) ? pts : 0;
    raw += earned;
    breakdown.push({ criterion: label, points: earned, max: pts });
  };
  addLang('francais', 'Français');
  addLang('anglais',  'Anglais');
  addLang('arabe',    'Arabe');
  addLang('espagnol', 'Espagnol');

  /* Expérience retail (max 40) */
  let retailPts = 0;
  let expPts    = 0;
  if (experienceRetail === 'oui') {
    retailPts = 10;
    expPts    = EXP_SCORES[annéesExperience] ?? 0;
  } else if (experienceRetail === 'non') {
    retailPts = 5;
  }
  raw += retailPts;
  breakdown.push({ criterion: 'Expérience retail', points: retailPts, max: 10 });
  raw += expPts;
  breakdown.push({ criterion: "Années d'expérience", points: expPts, max: 30 });

  /* Formation (max 5) */
  const etudesPts = ETUDES_SCORES[niveauEtudes] ?? 0;
  raw += etudesPts;
  breakdown.push({ criterion: "Niveau d'études", points: etudesPts, max: 5 });

  /* Disponibilité (max 5) */
  const dispoPts = DISPO_SCORES[disponibilite] ?? 0;
  raw += dispoPts;
  breakdown.push({ criterion: 'Disponibilité', points: dispoPts, max: 5 });

  /* CV (max 5) */
  const cvPts = cv ? 5 : 0;
  raw += cvPts;
  breakdown.push({ criterion: 'CV joint', points: cvPts, max: 5 });

  /* Complétude profil (max 5) */
  const completude = [dernierPoste, dernierEmployeur, secteurActivite, diplomePrincipal, adresse]
    .filter((v) => v && v.trim()).length;
  raw += completude;
  breakdown.push({ criterion: 'Complétude profil', points: completude, max: 5 });

  const score = Math.min(raw, 100);
  return { score, scoreBreakdown: breakdown };
}

export function scoreLabel(score) {
  if (score >= 80) return { label: 'Excellent', color: 'emerald' };
  if (score >= 60) return { label: 'Bon',       color: 'blue'    };
  if (score >= 40) return { label: 'Moyen',     color: 'amber'   };
  return             { label: 'Faible',    color: 'red'     };
}
