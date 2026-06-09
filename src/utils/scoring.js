const EXP_SCORES = {
  'Aucune expérience': 0,
  "Moins d'1 an":      5,
  '1 à 2 ans':        15,
  '3 à 5 ans':        25,
  'Plus de 5 ans':    35,
};

const MAX_RAW = 95; // 20+15+5+35+15+5

export function scoreCandidature({ langues = [], experience = '', cv = null, message = '' }) {
  const breakdown = [];
  let raw = 0;

  const addLang = (id, pts, max, label) => {
    const earned = langues.includes(id) ? pts : 0;
    raw += earned;
    breakdown.push({ criterion: label, points: earned, max });
  };

  addLang('francais', 20, 20, 'Français');
  addLang('anglais',  15, 15, 'Anglais');
  addLang('espagnol',  5,  5, 'Espagnol');

  const expPts = EXP_SCORES[experience] ?? 0;
  raw += expPts;
  breakdown.push({ criterion: 'Expérience', points: expPts, max: 35 });

  const cvPts = cv ? 15 : 0;
  raw += cvPts;
  breakdown.push({ criterion: 'CV joint', points: cvPts, max: 15 });

  const msgPts = message?.trim() ? 5 : 0;
  raw += msgPts;
  breakdown.push({ criterion: 'Message', points: msgPts, max: 5 });

  const score = Math.round((raw / MAX_RAW) * 100);
  return { score, scoreBreakdown: breakdown };
}

export function scoreLabel(score) {
  if (score >= 80) return { label: 'Excellent', color: 'emerald' };
  if (score >= 60) return { label: 'Bon',       color: 'blue'    };
  if (score >= 40) return { label: 'Moyen',     color: 'amber'   };
  return             { label: 'Faible',    color: 'red'     };
}
