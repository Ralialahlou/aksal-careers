import { useState, useMemo } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import JobCard from '../components/JobCard';
import { JOBS, MALLS, STORES, CONTRACT_TYPES } from '../data/jobs';

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMall, setSelectedMall] = useState('all');
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedContract, setSelectedContract] = useState('all');

  const filtered = useMemo(() => {
    return JOBS.filter((job) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.storeName.toLowerCase().includes(q) ||
        job.city.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q);
      const matchMall = selectedMall === 'all' || job.mall === selectedMall;
      const matchStore = selectedStore === 'all' || job.store === selectedStore;
      const matchContract = selectedContract === 'all' || job.contract === selectedContract;
      return matchSearch && matchMall && matchStore && matchContract;
    });
  }, [searchQuery, selectedMall, selectedStore, selectedContract]);

  const hasFilters = selectedMall !== 'all' || selectedStore !== 'all' || selectedContract !== 'all' || searchQuery;

  function clearFilters() {
    setSelectedMall('all');
    setSelectedStore('all');
    setSelectedContract('all');
    setSearchQuery('');
  }

  return (
    <main className="flex-1">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#E5DDD0] py-16 md:py-24 px-5">
        <div className="max-w-6xl mx-auto">
          {/* Eyebrow */}
          <p className="text-[0.65rem] uppercase tracking-[0.2em] font-medium text-[#C9A96E] mb-6">
            Carrières · Groupe AKSAL
          </p>

          {/* Headline — Morocco Mall italic serif style */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-light italic leading-[1.05] text-[#1C1C1C] mb-6 max-w-3xl"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Rejoignez<br />l'excellence.
          </h1>

          {/* Gold divider */}
          <div className="w-16 h-px bg-[#C9A96E] mb-6" />

          <p className="text-base md:text-lg text-[#6B6560] font-light leading-relaxed max-w-xl mb-10">
            Découvrez nos opportunités au sein de Morocco Mall Casablanca, Morocco Mall Marrakech,
            et les plus grandes maisons de mode et de luxe du groupe.
          </p>

          {/* Search */}
          <div className="relative max-w-lg">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A96E] pointer-events-none" />
            <input
              type="search"
              placeholder="Rechercher un poste, une enseigne, une ville…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E5DDD0] pl-10 pr-4 py-3.5 text-sm text-[#1C1C1C] placeholder:text-[#6B6560]/60 font-light focus:outline-none focus:border-[#C9A96E] transition-colors"
            />
          </div>
        </div>
      </section>

      {/* ── Filters + Grid ───────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-12">

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8 pb-8 border-b border-[#E5DDD0]">
          <FilterSelect
            label="Mall"
            value={selectedMall}
            onChange={setSelectedMall}
            options={MALLS}
          />
          <FilterSelect
            label="Enseigne"
            value={selectedStore}
            onChange={setSelectedStore}
            options={STORES}
          />
          <FilterSelect
            label="Contrat"
            value={selectedContract}
            onChange={setSelectedContract}
            options={CONTRACT_TYPES}
          />

          <div className="sm:ml-auto flex items-center gap-4">
            <span className="text-xs text-[#6B6560] font-light whitespace-nowrap">
              <span className="font-medium text-[#1C1C1C]">{filtered.length}</span>{' '}
              offre{filtered.length !== 1 ? 's' : ''}
            </span>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-[#C9A96E] hover:text-[#A8813F] transition-colors uppercase tracking-wider font-medium"
              >
                <X size={12} />
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-8">
            {searchQuery && (
              <Chip label={`"${searchQuery}"`} onRemove={() => setSearchQuery('')} />
            )}
            {selectedMall !== 'all' && (
              <Chip label={MALLS.find((m) => m.id === selectedMall)?.label} onRemove={() => setSelectedMall('all')} />
            )}
            {selectedStore !== 'all' && (
              <Chip label={STORES.find((s) => s.id === selectedStore)?.label} onRemove={() => setSelectedStore('all')} />
            )}
            {selectedContract !== 'all' && (
              <Chip label={CONTRACT_TYPES.find((c) => c.id === selectedContract)?.label} onRemove={() => setSelectedContract('all')} />
            )}
          </div>
        )}

        {/* Job grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5DDD0]">
            {filtered.map((job) => (
              <div key={job.id} className="bg-white">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-[#E5DDD0]">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#C9A96E] mb-4">Aucun résultat</p>
            <p
              className="text-2xl font-light italic text-[#1C1C1C] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Aucune offre trouvée
            </p>
            <p className="text-sm text-[#6B6560] font-light mb-6">Modifiez vos critères ou revenez bientôt.</p>
            <button
              onClick={clearFilters}
              className="text-xs uppercase tracking-[0.12em] font-medium text-[#C9A96E] hover:text-[#A8813F] transition-colors border-b border-[#C9A96E] pb-px"
            >
              Réinitialiser
            </button>
          </div>
        )}
      </section>

      {/* ── Spontaneous application banner ───────────────────── */}
      <section className="bg-[#FAF8F5] border-t border-[#E5DDD0] py-16 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.2em] font-medium text-[#C9A96E] mb-4">
              Candidature spontanée
            </p>
            <h2
              className="text-3xl md:text-4xl font-light italic text-[#1C1C1C] leading-snug"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Votre poste idéal<br />n'est pas listé ?
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
            <p className="text-sm text-[#6B6560] font-light leading-relaxed max-w-sm md:text-right">
              Déposez votre profil et nous vous contacterons dès qu'une opportunité se présente.
            </p>
            <a
              href="/candidature"
              className="px-8 py-3.5 bg-[#C9A96E] text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#A8813F] transition-colors"
            >
              Déposer ma candidature
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.6rem] uppercase tracking-[0.15em] font-medium text-[#6B6560]">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border border-[#E5DDD0] px-4 py-2.5 pr-8 text-sm text-[#1C1C1C] font-light focus:outline-none focus:border-[#C9A96E] transition-colors min-w-[180px] cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#C9A96E]" />
      </div>
    </div>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white border border-[#C9A96E]/40 text-[#A8813F] text-xs font-medium px-3 py-1.5">
      {label}
      <button onClick={onRemove} className="hover:text-[#1C1C1C] transition-colors">
        <X size={11} />
      </button>
    </span>
  );
}
