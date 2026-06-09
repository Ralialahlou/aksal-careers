/*
  Scoring system — max 100 points (MAX_RAW = 100, score = raw directly)

  Langues          max 40   Arabe+5 / Français+20 / Anglais+10 / Espagnol+5
  Expérience       max 30   retail=oui+5 / années: <1=5, 1-2=10, 3-5=18, >5=25
  Formation        max 10   Bac=2 / Bac+2=5 / Bac+3=7 / Bac+5=10 / Autre=2
  Disponibilité    max  5   Immédiate=5 / <15j=4 / <1m=2 / >1m=1
  CV joint         max 10
  Complétude       max  5   +1 per optional field filled (poste, employeur, secteur, diplôme, adresse)
*/

const EXP_SCORES = {
  "Moins d'1 an":  5,
  '1 à 2 ans':    10,
  '3 à 5 ans':    18,
  'Plus de 5 ans': 25,
};

const ETUDES_SCORES = {
  'Baccalauréat':  2,
  'Bac+2':         5,
  'Bac+3':         7,
  'Bac+5 et plus': 10,
  'Autre':         2,
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

  /* Langues (max 40) */
  const addLang = (id, pts, label) => {
    const earned = langues.includes(id) ? pts : 0;
    raw += earned;
    breakdown.push({ criterion: label, points: earned, max: pts });
  };
  addLang('francais', 20, 'Français');
  addLang('anglais',  10, 'Anglais');
  addLang('arabe',     5, 'Arabe');
  addLang('espagnol',  5, 'Espagnol');

  /* Expérience retail (max 30) */
  const retailPts = experienceRetail === 'oui' ? 5 : 0;
  raw += retailPts;
  breakdown.push({ criterion: 'Expérience retail', points: retailPts, max: 5 });

  const expPts = experienceRetail === 'oui' ? (EXP_SCORES[annéesExperience] ?? 0) : 0;
  raw += expPts;
  breakdown.push({ criterion: "Années d'expérience", points: expPts, max: 25 });

  /* Formation (max 10) */
  const etudesPts = ETUDES_SCORES[niveauEtudes] ?? 0;
  raw += etudesPts;
  breakdown.push({ criterion: "Niveau d'études", points: etudesPts, max: 10 });

  /* Disponibilité (max 5) */
  const dispoPts = DISPO_SCORES[disponibilite] ?? 0;
  raw += dispoPts;
  breakdown.push({ criterion: 'Disponibilité', points: dispoPts, max: 5 });

  /* CV (max 10) */
  const cvPts = cv ? 10 : 0;
  raw += cvPts;
  breakdown.push({ criterion: 'CV joint', points: cvPts, max: 10 });

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
