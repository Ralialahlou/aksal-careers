import { useMemo } from 'react';
import { useCandidatures } from '../hooks/useCandidatures.js';
import { scoreLabel } from '../utils/scoring.js';
import { Users, Building2, TrendingUp, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { candidatures } = useCandidatures();
  const total = candidatures.length;

  const stats = useMemo(() => {
    const byMagasin   = {};
    const byCity      = {};
    const byPoste     = {};
    const byDispo     = {};
    const byEtudes    = {};
    const byExp       = {};
    const byStatus    = {};
    const byScore     = { 'Excellent': 0, 'Bon': 0, 'Moyen': 0, 'Faible': 0 };
    let withRetailExp = 0;
    let disponibleNow = 0;

    candidatures.forEach((c) => {
      const magasin = c.magasinSouhaite || c.magasinPrefere || 'Non précisé';
      byMagasin[magasin] = (byMagasin[magasin] || 0) + 1;

      const city = c.ville || 'Autre';
      byCity[city] = (byCity[city] || 0) + 1;

      const poste = c.posteRecherche || 'Non précisé';
      byPoste[poste] = (byPoste[poste] || 0) + 1;

      const dispo = c.disponibilite || 'Non précisé';
      byDispo[dispo] = (byDispo[dispo] || 0) + 1;
      if (c.disponibilite === 'Immédiate') disponibleNow++;

      const etudes = c.niveauEtudes || 'Non précisé';
      byEtudes[etudes] = (byEtudes[etudes] || 0) + 1;

      const exp = c.annéesExperience || c.experience || 'Non précisé';
      byExp[exp] = (byExp[exp] || 0) + 1;

      byStatus[c.status] = (byStatus[c.status] || 0) + 1;

      const { label } = scoreLabel(c.score ?? 0);
      byScore[label]++;

      if (c.experienceRetail === 'oui') withRetailExp++;
    });

    return { byMagasin, byCity, byPoste, byDispo, byEtudes, byExp, byStatus, byScore, withRetailExp, disponibleNow };
  }, [candidatures]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[#C9A96E] font-medium mb-1">Tableau de bord</p>
        <h1 className="text-2xl font-light text-[#1C1C1C]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Vue d'ensemble des candidatures
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={18} />}     label="Total candidatures"   value={total} />
        <StatCard icon={<TrendingUp size={18} />} label="Score Excellent (≥80)" value={stats.byScore['Excellent'] || 0} accent />
        <StatCard icon={<Clock size={18} />}     label="Disponibles immédiatement" value={stats.disponibleNow} />
        <StatCard icon={<Building2 size={18} />} label="Avec expérience retail" value={stats.withRetailExp} />
      </div>

      {/* Status row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'À contacter', color: 'bg-blue-50 text-blue-700 border-blue-100' },
          { label: 'En cours',    color: 'bg-amber-50 text-amber-700 border-amber-100' },
          { label: 'Retenu',      color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
          { label: 'Archivé',     color: 'bg-gray-50 text-gray-500 border-gray-100' },
        ].map(({ label, color }) => (
          <div key={label} className={`border rounded px-4 py-3 flex items-center justify-between ${color}`}>
            <span className="text-xs font-medium">{label}</span>
            <span className="text-lg font-semibold tabular-nums">{stats.byStatus[label] || 0}</span>
          </div>
        ))}
      </div>

      {/* Charts row 1 — magasin + ville */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Par magasin souhaité" data={stats.byMagasin} total={total} topN={8} />
        <ChartCard title="Par ville"            data={stats.byCity}    total={total} topN={6} />
      </div>

      {/* Charts row 2 — poste + disponibilité */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Par poste recherché"
          data={stats.byPoste}
          total={total}
          ordered={['Conseiller(ère) de Vente','Caissier(ère)','Réserviste Stock','Visual Merchandiser / Vitriniste','Manager','Directeur(trice) de Magasin']}
        />
        <ChartCard
          title="Disponibilité"
          data={stats.byDispo}
          total={total}
          ordered={['Immédiate','Sous 15 jours','Sous 1 mois',"Plus d'1 mois"]}
          colors={{ 'Immédiate': '#10b981', 'Sous 15 jours': '#3b82f6', 'Sous 1 mois': '#f59e0b', "Plus d'1 mois": '#ef4444' }}
        />
      </div>

      {/* Charts row 3 — expérience + formation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Années d'expérience"
          data={stats.byExp}
          total={total}
          ordered={["Moins d'1 an", '1 à 2 ans', '3 à 5 ans', 'Plus de 5 ans', 'Non précisé']}
        />
        <ChartCard
          title="Niveau d'études"
          data={stats.byEtudes}
          total={total}
          ordered={['Baccalauréat', 'Bac+2', 'Bac+3', 'Bac+5 et plus', 'Autre']}
        />
      </div>

      {/* Score distribution */}
      <ChartCard
        title="Distribution des scores"
        data={stats.byScore}
        total={total}
        ordered={['Excellent', 'Bon', 'Moyen', 'Faible']}
        colors={{ Excellent: '#10b981', Bon: '#3b82f6', Moyen: '#f59e0b', Faible: '#ef4444' }}
      />
    </div>
  );
}

/* ── Components ─────────────────────────────── */

function StatCard({ icon, label, value, accent }) {
  return (
    <div className={`bg-white border rounded p-5 flex flex-col gap-3 ${accent ? 'border-[#C9A96E]/40' : 'border-[#E5DDD0]'}`}>
      <div className={`w-8 h-8 flex items-center justify-center ${accent ? 'text-[#C9A96E]' : 'text-[#6B6560]'}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold text-[#1C1C1C] tabular-nums">{value}</p>
        <p className="text-[0.65rem] text-[#6B6560] font-light mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, data, total, topN, ordered, colors }) {
  const entries = (() => {
    let items = ordered
      ? ordered.map((k) => [k, data[k] || 0]).filter(([, v]) => v > 0)
      : Object.entries(data).sort((a, b) => b[1] - a[1]);
    if (topN) items = items.slice(0, topN);
    return items;
  })();

  const max = Math.max(...entries.map(([, v]) => v), 1);

  if (entries.length === 0) {
    return (
      <div className="bg-white border border-[#E5DDD0] p-5 rounded">
        <p className="text-[0.6rem] uppercase tracking-[0.15em] text-[#6B6560] font-medium mb-4">{title}</p>
        <p className="text-xs text-[#6B6560]/40 font-light">Aucune donnée.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5DDD0] p-5 rounded">
      <p className="text-[0.6rem] uppercase tracking-[0.15em] text-[#6B6560] font-medium mb-4">{title}</p>
      <div className="space-y-3">
        {entries.map(([label, count]) => {
          const pct = Math.round((count / max) * 100);
          const barColor = colors?.[label] || '#C9A96E';
          return (
            <div key={label} className="flex items-center gap-3">
              <span className="w-36 text-xs text-[#1C1C1C] font-light truncate shrink-0">{label}</span>
              <div className="flex-1 bg-[#F0EAE0] h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>
              <span className="w-6 text-xs text-[#1C1C1C] font-medium tabular-nums text-right shrink-0">{count}</span>
              <span className="w-8 text-[0.6rem] text-[#6B6560] tabular-nums text-right shrink-0">
                {total ? Math.round((count / total) * 100) : 0}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
