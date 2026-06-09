/*
  Scoring system — max 100 points

  Langues          max 35   Français=25 / Anglais=5 / Arabe=3 / Espagnol=2
  Expérience       max 35   retail=oui → +10 bonus / années: <1=5, 1-2=10, 3-5=18, >5=25
  Formation        max 15   Bac=3 / Bac+2=7 / Bac+3=10 / Bac+5=15 / Autre=2
  Disponibilité    max  5   Immédiate=5 / <15j=4 / <1m=2 / >1m=1
  CV joint         max  5
  Complétude       max  5   +1 per optional field filled (poste, employeur, secteur, diplôme, adresse)
*/

const EXP_SCORES = {
  "Moins d'1 an":   5,
  '1 à 2 ans':     10,
  '3 à 5 ans':     18,
  'Plus de 5 ans': 25,
};

const ETUDES_SCORES = {
  'Baccalauréat':   3,
  'Bac+2':          7,
  'Bac+3':         10,
  'Bac+5 et plus': 15,
  'Autre':          2,
};

const DISPO_SCORES = {
  'Immédiate':      5,
  'Sous 15 jours':  4,
  'Sous 1 mois':    2,
  "Plus d'1 mois":  1,
};

const MAX_RAW = 100;

export function scoreCandidature({
  langues          = [],
  experienceRetail = '',
  annéesExperience = '',
  disponibilite    = '',
  niveauEtudes     = '',
  cv               = null,
  dernierPoste     = '',
  dernierEmployeur = '',
  secteurActivite  = '',
  diplomePrincipal = '',
  adresse          = '',
}) {
  const breakdown = [];
  let raw = 0;

  /* Langues (max 35) — Français fortement valorisé */
  const addLang = (id, pts, label) => {
    const earned = langues.includes(id) ? pts : 0;
    raw += earned;
    breakdown.push({ criterion: label, points: earned, max: pts });
  };
  addLang('francais', 25, 'Français');
  addLang('anglais',   5, 'Anglais');
  addLang('arabe',     3, 'Arabe');
  addLang('espagnol',  2, 'Espagnol');

  /* Expérience retail (max 35) — oui fortement valorisé */
  const retailPts = experienceRetail === 'oui' ? 10 : 0;
  raw += retailPts;
  breakdown.push({ criterion: 'Expérience retail', points: retailPts, max: 10 });

  const expPts = experienceRetail === 'oui' ? (EXP_SCORES[annéesExperience] ?? 0) : 0;
  raw += expPts;
  breakdown.push({ criterion: "Années d'expérience", points: expPts, max: 25 });

  /* Formation (max 15) — niveau d'études fortement valorisé */
  const etudesPts = ETUDES_SCORES[niveauEtudes] ?? 0;
  raw += etudesPts;
  breakdown.push({ criterion: "Niveau d'études", points: etudesPts, max: 15 });

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

  const score = Math.min(Math.round((raw / MAX_RAW) * 100), 100);
  return { score, scoreBreakdown: breakdown };
}

export function scoreLabel(score) {
  if (score >= 80) return { label: 'Excellent', color: 'emerald' };
  if (score >= 60) return { label: 'Bon',       color: 'blue'    };
  if (score >= 40) return { label: 'Moyen',     color: 'amber'   };
  return             { label: 'Faible',    color: 'red'     };
}
