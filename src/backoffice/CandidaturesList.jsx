import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronUp, ChevronDown, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { useCandidatures } from '../hooks/useCandidatures.js';
import { scoreLabel } from '../utils/scoring.js';

const STATUSES      = ['Tous', 'À contacter', 'En cours', 'Retenu', 'Archivé'];
const EXPERIENCES   = ['Toutes', "Moins d'1 an", '1 à 2 ans', '3 à 5 ans', 'Plus de 5 ans'];
const DISPONIBILITES = ['Toutes', 'Immédiate', 'Sous 15 jours', 'Sous 1 mois', "Plus d'1 mois"];
const NIVEAUX_ETUDES = ['Tous', 'Baccalauréat', 'Bac+2', 'Bac+3', 'Bac+5 et plus', 'Autre'];
const EXP_RETAIL    = ['Tous', 'Oui', 'Non'];

export default function CandidaturesList() {
  const { candidatures } = useCandidatures();
  const navigate = useNavigate();

  const [search, setSearch]         = useState('');
  const [sortKey, setSortKey]       = useState('submittedAt');
  const [sortDir, setSortDir]       = useState('desc');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filterStatus,   setFilterStatus]   = useState('Tous');
  const [filterMagasin,  setFilterMagasin]  = useState('Tous');
  const [filterCity,     setFilterCity]     = useState('Toutes');
  const [filterLang,     setFilterLang]     = useState('Toutes');
  const [filterExp,      setFilterExp]      = useState('Toutes');
  const [filterDispo,    setFilterDispo]    = useState('Toutes');
  const [filterEtudes,   setFilterEtudes]   = useState('Tous');
  const [filterExpRetail,setFilterExpRetail]= useState('Tous');

  const magasins = useMemo(() => ['Tous', ...new Set(candidatures.map((c) => c.magasinSouhaite || c.magasinPrefere).filter(Boolean))], [candidatures]);
  const cities   = useMemo(() => ['Toutes', ...new Set(candidatures.map((c) => c.ville).filter(Boolean))], [candidatures]);
  const langs    = useMemo(() => ['Toutes', ...new Set(candidatures.flatMap((c) => c.langues || []))], [candidatures]);

  const filtered = useMemo(() => {
    let list = candidatures;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        (c.nom + ' ' + c.prenom).toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        (c.magasinSouhaite || c.magasinPrefere || '').toLowerCase().includes(q) ||
        (c.posteRecherche || '').toLowerCase().includes(q),
      );
    }
    if (filterStatus   !== 'Tous')   list = list.filter((c) => c.status === filterStatus);
    if (filterMagasin  !== 'Tous')   list = list.filter((c) => (c.magasinSouhaite || c.magasinPrefere) === filterMagasin);
    if (filterCity     !== 'Toutes') list = list.filter((c) => c.ville === filterCity);
    if (filterLang     !== 'Toutes') list = list.filter((c) => c.langues?.includes(filterLang));
    if (filterExp      !== 'Toutes') list = list.filter((c) => (c.annéesExperience || c.experience) === filterExp);
    if (filterDispo    !== 'Toutes') list = list.filter((c) => c.disponibilite === filterDispo);
    if (filterEtudes   !== 'Tous')   list = list.filter((c) => c.niveauEtudes === filterEtudes);
    if (filterExpRetail !== 'Tous')  list = list.filter((c) => {
      const val = c.experienceRetail;
      return filterExpRetail === 'Oui' ? val === 'oui' : val === 'non' || !val;
    });

    const dir = sortDir === 'asc' ? 1 : -1;
    list = [...list].sort((a, b) => {
      if (sortKey === 'score')       return dir * ((a.score ?? 0) - (b.score ?? 0));
      if (sortKey === 'nom')         return dir * (a.nom || '').localeCompare(b.nom || '');
      if (sortKey === 'submittedAt') return dir * (new Date(a.submittedAt) - new Date(b.submittedAt));
      return 0;
    });

    return list;
  }, [candidatures, search, sortKey, sortDir, filterStatus, filterMagasin, filterCity, filterLang, filterExp, filterDispo, filterEtudes, filterExpRetail]);

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  }

  function resetFilters() {
    setFilterStatus('Tous'); setFilterMagasin('Tous'); setFilterCity('Toutes');
    setFilterLang('Toutes'); setFilterExp('Toutes'); setFilterDispo('Toutes');
    setFilterEtudes('Tous'); setFilterExpRetail('Tous');
  }

  const activeFilterCount = [
    filterStatus   !== 'Tous',
    filterMagasin  !== 'Tous',
    filterCity     !== 'Toutes',
    filterLang     !== 'Toutes',
    filterExp      !== 'Toutes',
    filterDispo    !== 'Toutes',
    filterEtudes   !== 'Tous',
    filterExpRetail !== 'Tous',
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[#C9A96E] font-medium mb-1">Candidatures</p>
        <h1 className="text-2xl font-light text-[#1C1C1C]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          {filtered.length} candidature{filtered.length !== 1 ? 's' : ''}
        </h1>
      </div>

      {/* Search + filter toggle */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9A96E]" />
          <input
            type="search"
            placeholder="Rechercher par nom, e-mail, magasin, poste…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#E5DDD0] pl-9 pr-4 py-2.5 text-sm text-[#1C1C1C] font-light focus:outline-none focus:border-[#C9A96E] transition-colors"
          />
        </div>
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className={`flex items-center gap-2 border px-4 py-2.5 text-xs uppercase tracking-wider font-medium transition-colors ${
            filtersOpen || activeFilterCount > 0
              ? 'bg-[#C9A96E] text-white border-[#C9A96E]'
              : 'bg-white text-[#6B6560] border-[#E5DDD0] hover:border-[#C9A96E]'
          }`}
        >
          <SlidersHorizontal size={13} />
          Filtres
          {activeFilterCount > 0 && (
            <span className="bg-white text-[#C9A96E] rounded-full w-4 h-4 text-[0.6rem] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="bg-white border border-[#E5DDD0] p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <FilterSelect label="Statut"          value={filterStatus}    onChange={setFilterStatus}    options={STATUSES} />
          <FilterSelect label="Magasin"         value={filterMagasin}   onChange={setFilterMagasin}   options={magasins} />
          <FilterSelect label="Ville"           value={filterCity}      onChange={setFilterCity}       options={cities} />
          <FilterSelect label="Langue"          value={filterLang}      onChange={setFilterLang}       options={langs} />
          <FilterSelect label="Expérience retail" value={filterExpRetail} onChange={setFilterExpRetail} options={EXP_RETAIL} />
          <FilterSelect label="Années d'exp."  value={filterExp}       onChange={setFilterExp}        options={EXPERIENCES} />
          <FilterSelect label="Disponibilité"  value={filterDispo}     onChange={setFilterDispo}      options={DISPONIBILITES} />
          <FilterSelect label="Niveau d'études" value={filterEtudes}   onChange={setFilterEtudes}     options={NIVEAUX_ETUDES} />
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="col-span-2 sm:col-span-4 flex items-center gap-1.5 text-xs text-[#6B6560] hover:text-[#C9A96E] font-medium transition-colors"
            >
              <X size={12} /> Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#E5DDD0] overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-[#E5DDD0] bg-[#FAF8F5] text-[0.6rem] uppercase tracking-[0.1em] text-[#6B6560] font-medium">
          <SortHeader label="Candidat"   k="nom"         current={sortKey} dir={sortDir} onSort={toggleSort} />
          <span>Magasin · Poste</span>
          <span>Langues · Dispo</span>
          <SortHeader label="Score"      k="score"       current={sortKey} dir={sortDir} onSort={toggleSort} />
          <span>Statut</span>
          <SortHeader label="Date"       k="submittedAt" current={sortKey} dir={sortDir} onSort={toggleSort} />
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#6B6560] font-light">Aucun résultat pour ces filtres.</div>
        ) : (
          filtered.map((c) => (
            <CandidatureRow key={c.id} c={c} onClick={() => navigate(`/backoffice/candidatures/${c.id}`)} />
          ))
        )}
      </div>
    </div>
  );
}

/* ── Row ───────────────────────── */
function CandidatureRow({ c, onClick }) {
  const { label, color } = scoreLabel(c.score ?? 0);
  const scoreColors = {
    emerald: 'bg-emerald-50 text-emerald-700',
    blue:    'bg-blue-50 text-blue-700',
    amber:   'bg-amber-50 text-amber-700',
    red:     'bg-red-50 text-red-700',
  };
  const statusColors = {
    'À contacter': 'bg-blue-50 text-blue-700',
    'En cours':    'bg-amber-50 text-amber-700',
    'Retenu':      'bg-emerald-50 text-emerald-700',
    'Archivé':     'bg-gray-50 text-gray-500',
  };
  const date = c.submittedAt
    ? new Date(c.submittedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
    : '—';
  const magasin = c.magasinSouhaite || c.magasinPrefere || '—';
  const exp     = c.annéesExperience || c.experience || '—';

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-5 py-4 border-b border-[#E5DDD0] last:border-0 hover:bg-[#FBF7F1] transition-colors group"
    >
      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#1C1C1C] truncate">{c.prenom} {c.nom}</p>
          <p className="text-xs text-[#6B6560] font-light truncate">{magasin} · {c.posteRecherche || '—'}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2 py-0.5 rounded text-[0.6rem] font-semibold ${scoreColors[color]}`}>
            {c.score ?? '—'}
          </span>
          <ChevronRight size={14} className="text-[#C9A96E] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_auto_auto_auto] gap-4 items-center">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#1C1C1C] truncate">{c.prenom} {c.nom}</p>
          <p className="text-xs text-[#6B6560]/70 font-light truncate">{c.email}</p>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-[#1C1C1C] truncate">{magasin}</p>
          <p className="text-xs text-[#6B6560] font-light truncate">{c.posteRecherche || '—'}</p>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-[#1C1C1C] truncate">{(c.langues || []).join(', ') || '—'}</p>
          <p className="text-xs text-[#6B6560] font-light">{c.disponibilite || exp}</p>
        </div>
        <div className="w-20 text-center">
          <span className={`inline-block px-2 py-0.5 rounded text-[0.6rem] font-semibold ${scoreColors[color]}`}>
            {c.score ?? '—'} · {label}
          </span>
        </div>
        <div className="w-24 text-center">
          <span className={`inline-block px-2 py-0.5 rounded text-[0.6rem] font-medium ${statusColors[c.status] || 'bg-gray-50 text-gray-500'}`}>
            {c.status || '—'}
          </span>
        </div>
        <div className="w-16 text-right">
          <p className="text-xs text-[#6B6560] font-light">{date}</p>
          <ChevronRight size={13} className="ml-auto text-[#C9A96E] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </button>
  );
}

/* ── Helpers ───────────────────── */
function SortHeader({ label, k, current, dir, onSort }) {
  const active = current === k;
  const Icon = active && dir === 'asc' ? ChevronUp : ChevronDown;
  return (
    <button onClick={() => onSort(k)} className="flex items-center gap-1 hover:text-[#C9A96E] transition-colors">
      {label}
      <Icon size={10} className={active ? 'text-[#C9A96E]' : 'opacity-40'} />
    </button>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-[0.6rem] uppercase tracking-[0.1em] text-[#6B6560] font-medium mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#FAF8F5] border border-[#E5DDD0] px-3 py-2 text-xs text-[#1C1C1C] font-light focus:outline-none focus:border-[#C9A96E] cursor-pointer"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
