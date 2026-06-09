import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Phone, Mail, MapPin, Briefcase, Building2, Languages, GraduationCap, Clock, CheckCircle2 } from 'lucide-react';
import { useCandidatures } from '../hooks/useCandidatures.js';
import { scoreLabel } from '../utils/scoring.js';
import { updateCandidatureStatus } from '../utils/storage.js';

const STATUSES = ['À contacter', 'En cours', 'Retenu', 'Archivé'];

const STATUS_COLORS = {
  'À contacter': 'bg-blue-50 text-blue-700 border-blue-200',
  'En cours':    'bg-amber-50 text-amber-700 border-amber-200',
  'Retenu':      'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Archivé':     'bg-gray-50 text-gray-500 border-gray-200',
};

const SCORE_COLORS = {
  emerald: { bar: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  blue:    { bar: '#3b82f6', bg: 'bg-blue-50',    text: 'text-blue-700'    },
  amber:   { bar: '#f59e0b', bg: 'bg-amber-50',   text: 'text-amber-700'   },
  red:     { bar: '#ef4444', bg: 'bg-red-50',     text: 'text-red-700'     },
};

export default function CandidatureProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { candidatures, reload } = useCandidatures();

  const candidature = candidatures.find((c) => c.id === id);

  if (!candidature) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-[#6B6560] font-light">Candidature introuvable.</p>
        <button onClick={() => navigate('/backoffice/candidatures')} className="mt-4 text-xs text-[#C9A96E] underline underline-offset-2">
          Retour à la liste
        </button>
      </div>
    );
  }

  const c = candidature;
  const { label: scoreTag, color } = scoreLabel(c.score ?? 0);
  const sc = SCORE_COLORS[color];

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Back button */}
      <button
        onClick={() => navigate('/backoffice/candidatures')}
        className="flex items-center gap-2 text-xs text-[#6B6560] hover:text-[#C9A96E] transition-colors font-medium uppercase tracking-wider"
      >
        <ArrowLeft size={13} /> Retour à la liste
      </button>

      {/* Profile header */}
      <div className="bg-white border border-[#E5DDD0] p-6 flex flex-col sm:flex-row sm:items-start gap-5">
        {/* Avatar initials */}
        <div className="w-14 h-14 rounded-full bg-[#F0EAE0] flex items-center justify-center shrink-0">
          <span className="text-[#C9A96E] font-semibold text-lg">
            {(c.prenom?.[0] || '') + (c.nom?.[0] || '')}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-3 mb-1">
            <h1 className="text-xl font-light text-[#1C1C1C]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {c.prenom} {c.nom}
            </h1>
            <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${sc.bg} ${sc.text}`}>
              {c.score ?? '—'} · {scoreTag}
            </span>
          </div>
          <p className="text-xs text-[#6B6560] font-light">{c.magasinSouhaite || c.magasinPrefere || '—'}{c.posteRecherche ? ` · ${c.posteRecherche}` : ''}</p>
          {c.submittedAt && (
            <p className="text-[0.6rem] text-[#6B6560]/50 mt-1 uppercase tracking-wider">
              Soumis le {new Date(c.submittedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>

        {/* Status selector */}
        <StatusSelector candidatureId={c.id} current={c.status} reload={reload} />
      </div>

      {/* Score breakdown */}
      <ScoreCard score={c.score ?? 0} breakdown={c.scoreBreakdown || []} color={color} />

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard title="Coordonnées">
          <InfoRow icon={<Mail size={13} />}   label="E-mail"    value={c.email} />
          <InfoRow icon={<Phone size={13} />}  label="Téléphone" value={c.telephone} />
          <InfoRow icon={<MapPin size={13} />} label="Ville"     value={c.ville} />
          {c.adresse && <InfoRow icon={<MapPin size={13} />} label="Adresse" value={c.adresse} />}
        </InfoCard>

        <InfoCard title="Candidature">
          <InfoRow icon={<Building2 size={13} />} label="Magasin"  value={c.magasinSouhaite || c.magasinPrefere || '—'} />
          <InfoRow icon={<Briefcase size={13} />} label="Poste"    value={c.posteRecherche || '—'} />
          <InfoRow icon={<Clock size={13} />}     label="Disponibilité" value={c.disponibilite || '—'} />
        </InfoCard>

        <InfoCard title="Expérience professionnelle">
          <InfoRow icon={<CheckCircle2 size={13} />} label="Exp. retail"     value={c.experienceRetail === 'oui' ? 'Oui' : c.experienceRetail === 'non' ? 'Non — 1ère exp.' : '—'} />
          <InfoRow icon={<Briefcase size={13} />}    label="Années d'exp."   value={c.annéesExperience || c.experience || '—'} />
          {c.dernierPoste     && <InfoRow icon={<Briefcase size={13} />} label="Dernier poste"    value={c.dernierPoste} />}
          {c.dernierEmployeur && <InfoRow icon={<Building2 size={13} />} label="Dernier employeur" value={c.dernierEmployeur} />}
          {c.secteurActivite  && <InfoRow icon={<Building2 size={13} />} label="Secteur"          value={c.secteurActivite} />}
        </InfoCard>

        <InfoCard title="Formation & Langues">
          <InfoRow icon={<GraduationCap size={13} />} label="Niveau d'études" value={c.niveauEtudes || '—'} />
          {c.diplomePrincipal && <InfoRow icon={<GraduationCap size={13} />} label="Diplôme" value={c.diplomePrincipal} />}
          <InfoRow icon={<Languages size={13} />} label="Langues" value={(c.langues || []).join(', ') || '—'} />
        </InfoCard>
      </div>

      {/* CV badge */}
      {c.cv && (
        <div className="bg-white border border-[#E5DDD0] p-5">
          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-[#6B6560] font-medium mb-3">CV joint</p>
          <div className="flex items-center gap-3 bg-[#FBF7F1] border border-[#C9A96E]/20 px-4 py-3">
            <FileText size={16} className="text-[#C9A96E] shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-[#1C1C1C] font-medium truncate">{c.cv.name}</p>
              <p className="text-xs text-[#6B6560] font-light">{c.cv.size ? `${(c.cv.size / 1024).toFixed(0)} Ko` : 'Taille inconnue'}</p>
            </div>
            <CvDownloadButton cv={c.cv} />
          </div>
          {!c.cv.data && (
            <p className="text-[0.6rem] text-[#6B6560]/40 mt-2 font-light">
              Fichier non disponible — les CVs des candidatures importées n'ont pas de contenu téléchargeable.
            </p>
          )}
        </div>
      )}

      {/* Message */}
      {c.message && (
        <div className="bg-white border border-[#E5DDD0] p-5">
          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-[#6B6560] font-medium mb-3">Message du candidat</p>
          <p className="text-sm text-[#1C1C1C] font-light leading-relaxed whitespace-pre-wrap">{c.message}</p>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ─────────────── */

function StatusSelector({ candidatureId, current, reload }) {
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setSaving(true);
    updateCandidatureStatus(candidatureId, e.target.value);
    reload();
    setSaving(false);
  }

  return (
    <div className="shrink-0">
      <label className="block text-[0.6rem] uppercase tracking-[0.1em] text-[#6B6560] font-medium mb-1.5">Statut</label>
      <select
        value={current}
        onChange={handleChange}
        disabled={saving}
        className={`border px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#C9A96E] cursor-pointer transition-colors ${STATUS_COLORS[current] || 'bg-white text-[#1C1C1C] border-[#E5DDD0]'}`}
      >
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}

function ScoreCard({ score, breakdown, color }) {
  const sc = SCORE_COLORS[color];
  return (
    <div className="bg-white border border-[#E5DDD0] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[0.6rem] uppercase tracking-[0.15em] text-[#6B6560] font-medium">Score de profil</p>
        <span className={`text-2xl font-semibold tabular-nums ${sc.text}`}>{score}<span className="text-sm font-light text-[#6B6560]">/100</span></span>
      </div>
      {/* Global bar */}
      <div className="w-full bg-[#F0EAE0] h-2.5 rounded-full overflow-hidden mb-5">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: sc.bar }}
        />
      </div>
      {/* Breakdown */}
      <div className="space-y-2.5">
        {breakdown.map(({ criterion, points, max }) => (
          <div key={criterion} className="flex items-center gap-3">
            <span className="w-28 text-xs text-[#1C1C1C] font-light shrink-0">{criterion}</span>
            <div className="flex-1 bg-[#F0EAE0] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${max ? (points / max) * 100 : 0}%`, backgroundColor: sc.bar, opacity: 0.7 }}
              />
            </div>
            <span className="text-xs tabular-nums text-[#6B6560] font-light shrink-0 w-12 text-right">
              {points} / {max}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="bg-white border border-[#E5DDD0] p-5">
      <p className="text-[0.6rem] uppercase tracking-[0.15em] text-[#6B6560] font-medium mb-4">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-[#C9A96E] mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[0.6rem] uppercase tracking-[0.08em] text-[#6B6560]/60 font-medium">{label}</p>
        <p className="text-sm text-[#1C1C1C] font-light break-words">{value || '—'}</p>
      </div>
    </div>
  );
}

function CvDownloadButton({ cv }) {
  if (!cv?.data) {
    return (
      <button
        disabled
        title="Fichier non disponible"
        className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E5DDD0] text-[#6B6560]/40 text-xs font-medium uppercase tracking-wider cursor-not-allowed shrink-0"
      >
        <Download size={12} />
        <span className="hidden sm:inline">Télécharger</span>
      </button>
    );
  }

  function handleDownload() {
    const link = document.createElement('a');
    link.href = cv.data;
    link.download = cv.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A96E] hover:bg-[#A8813F] text-white text-xs font-medium uppercase tracking-wider transition-colors shrink-0"
    >
      <Download size={12} />
      <span className="hidden sm:inline">Télécharger</span>
    </button>
  );
}
