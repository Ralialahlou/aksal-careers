import { useMemo } from 'react';
import { useCandidatures } from '../hooks/useCandidatures.js';
import { scoreLabel } from '../utils/scoring.js';
import { Users, MapPin, Building2, TrendingUp } from 'lucide-react';

function calcAge(dateNaissance) {
  return Math.floor((Date.now() - new Date(dateNaissance).getTime()) / (365.25 * 24 * 3600 * 1000));
}

export default function DashboardPage() {
  const { candidatures } = useCandidatures();
  const total = candidatures.length;

  const stats = useMemo(() => {
    const byMall = {}, byCity = {}, byAge = { '18–24':0,'25–34':0,'35–44':0,'45+':0 };
    const byExp  = {}, byStatus = {}, byScore = { 'Excellent':0,'Bon':0,'Moyen':0,'Faible':0 };

    candidatures.forEach((c) => {
      // mall
      const m = c.mall || 'Non précisé';
      byMall[m] = (byMall[m] || 0) + 1;
      // city
      const ci = c.ville || 'Autre';
      byCity[ci] = (byCity[ci] || 0) + 1;
      // age
      if (c.dateNaissance) {
        const age = calcAge(c.dateNaissance);
        if (age < 25) byAge['18–24']++;
        else if (age < 35) byAge['25–34']++;
        else if (age < 45) byAge['35–44']++;
        else byAge['45+']++;
      }
      // experience
      const exp = c.experience || 'Non précisé';
      byExp[exp] = (byExp[exp] || 0) + 1;
      // status
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      // score range
      const { label } = scoreLabel(c.score ?? 0);
      byScore[label]++;
    });

    return { byMall, byCity, byAge, byExp, byStatus, byScore };
  }, [candidatures]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[#C9A96E] font-medium mb-1">Tableau de bord</p>
        <h1 className="text-2xl font-light text-[#1C1C1C]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Vue d'ensemble des candidatures
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={18} />} label="Total candidatures" value={total} />
        <StatCard icon={<Building2 size={18} />} label="Morocco Mall Casa" value={stats.byMall['Morocco Mall Casablanca'] || 0} />
        <StatCard icon={<Building2 size={18} />} label="Morocco Mall Marrakech" value={stats.byMall['Morocco Mall Marrakech'] || 0} />
        <StatCard icon={<TrendingUp size={18} />} label="Score ≥ 80 (Excellent)" value={stats.byScore['Excellent'] || 0} accent />
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

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Par mall" data={stats.byMall} total={total} />
        <ChartCard title="Par ville" data={stats.byCity} total={total} topN={6} />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Tranche d'âge" data={stats.byAge} total={total} ordered={['18–24','25–34','35–44','45+']} />
        <ChartCard title="Années d'expérience" data={stats.byExp} total={total}
          ordered={["Aucune expérience","Moins d'1 an","1 à 2 ans","3 à 5 ans","Plus de 5 ans"]} />
      </div>

      {/* Score distribution */}
      <ChartCard title="Distribution des scores" data={stats.byScore} total={total}
        ordered={['Excellent','Bon','Moyen','Faible']}
        colors={{ Excellent:'#10b981', Bon:'#3b82f6', Moyen:'#f59e0b', Faible:'#ef4444' }}
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
  const entries = useMemo(() => {
    let items = ordered
      ? ordered.map((k) => [k, data[k] || 0])
      : Object.entries(data).sort((a, b) => b[1] - a[1]);
    if (topN) items = items.slice(0, topN);
    return items;
  }, [data, ordered, topN]);

  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="bg-white border border-[#E5DDD0] p-5 rounded">
      <p className="text-[0.6rem] uppercase tracking-[0.15em] text-[#6B6560] font-medium mb-4">{title}</p>
      <div className="space-y-3">
        {entries.map(([label, count]) => {
          const pct = Math.round((count / max) * 100);
          const barColor = colors?.[label] || '#C9A96E';
          return (
            <div key={label} className="flex items-center gap-3">
              <span className="w-32 text-xs text-[#1C1C1C] font-light truncate shrink-0">{label}</span>
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
