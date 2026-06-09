import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Upload, X, ChevronDown } from 'lucide-react';
import { useAppData } from '../hooks/useData';
import { addCandidature } from '../utils/storage.js';
import { scoreCandidature } from '../utils/scoring.js';

const initialForm = {
  nom: '', prenom: '',
  telephone: '', email: '', ville: '', adresse: '',
  magasinSouhaite: '', posteRecherche: '', posteAutre: '', villesSouhaitees: [],
  disponibilite: '',
  experienceRetail: '',
  annéesExperience: '', dernierPoste: '', dernierEmployeur: '', secteurActivite: '',
  niveauEtudes: '', niveauEtudesAutre: '', diplomePrincipal: '',
  langues: [],
  cv: null,
  consentRgpd: false,
  consentCertif: false,
};

export default function ApplyPage() {
  const { config, content, loading, error } = useAppData();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    ...initialForm,
    magasinSouhaite: params.get('enseigne') || '',
    posteRecherche:  params.get('poste')    || '',
  });
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function toggleLangue(id) {
    set('langues', form.langues.includes(id)
      ? form.langues.filter((l) => l !== id)
      : [...form.langues, id]);
  }

  function toggleVille(v) {
    set('villesSouhaitees', form.villesSouhaitees.includes(v)
      ? form.villesSouhaitees.filter((x) => x !== v)
      : [...form.villesSouhaitees, v]);
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
    ];
    if (!allowed.includes(file.type)) {
      setErrors((e) => ({ ...e, cv: 'Format non accepté. Utilisez PDF, DOCX ou JPG.' })); return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((e) => ({ ...e, cv: 'Fichier trop volumineux (max 2 Mo).' })); return;
    }
    set('cv', file);
  }

  function validate() {
    const e = {};
    if (!form.nom.trim())       e.nom       = 'Requis.';
    if (!form.prenom.trim())    e.prenom    = 'Requis.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Adresse invalide.';
    if (!form.telephone.trim() || !/^[0-9+\s\-()]{8,15}$/.test(form.telephone)) e.telephone = 'Numéro invalide.';
    if (!form.ville)            e.ville     = 'Requis.';
    if (!form.magasinSouhaite)  e.magasinSouhaite = 'Requis.';
    if (!form.posteRecherche)   e.posteRecherche  = 'Requis.';
    if (form.posteRecherche === 'Autre' && !form.posteAutre.trim()) e.posteAutre = 'Précisez le poste.';
    if (!form.disponibilite)    e.disponibilite   = 'Requis.';
    if (!form.experienceRetail) e.experienceRetail = 'Requis.';
    if (form.experienceRetail === 'oui' && !form.annéesExperience) e.annéesExperience = 'Requis.';
    if (!form.niveauEtudes)     e.niveauEtudes    = 'Requis.';
    if (form.niveauEtudes === 'Autre' && !form.niveauEtudesAutre.trim()) e.niveauEtudesAutre = 'Précisez.';
    if (form.langues.length === 0) e.langues = 'Sélectionnez au moins une langue.';
    if (!form.cv)               e.cv        = 'Le CV est requis.';
    if (!form.consentRgpd)      e.consentRgpd  = 'Consentement requis.';
    if (!form.consentCertif)    e.consentCertif = 'Certification requise.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstError = document.querySelector('[data-error]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitting(true);

    const readFileAsDataUrl = (file) =>
      new Promise((resolve) => {
        if (!file) { resolve(null); return; }
        const reader = new FileReader();
        reader.onload  = (ev) => resolve(ev.target.result);
        reader.onerror = ()    => resolve(null);
        reader.readAsDataURL(file);
      });

    readFileAsDataUrl(form.cv).then((dataUrl) => {
      const cvMeta = form.cv
        ? { name: form.cv.name, size: form.cv.size, type: form.cv.type, data: dataUrl }
        : null;

      const { score, scoreBreakdown } = scoreCandidature({
        langues:          form.langues,
        experienceRetail: form.experienceRetail,
        annéesExperience: form.annéesExperience,
        disponibilite:    form.disponibilite,
        niveauEtudes:     form.niveauEtudes === 'Autre' ? form.niveauEtudesAutre : form.niveauEtudes,
        cv:               cvMeta,
        dernierPoste:     form.dernierPoste,
        dernierEmployeur: form.dernierEmployeur,
        secteurActivite:  form.secteurActivite,
        diplomePrincipal: form.diplomePrincipal,
        adresse:          form.adresse,
      });

      addCandidature({
        id:               crypto.randomUUID(),
        nom:              form.nom,
        prenom:           form.prenom,
        email:            form.email,
        telephone:        form.telephone,
        ville:            form.ville,
        adresse:          form.adresse,
        magasinSouhaite:  form.magasinSouhaite,
        posteRecherche:   form.posteRecherche === 'Autre' ? form.posteAutre : form.posteRecherche,
        villesSouhaitees: form.villesSouhaitees,
        disponibilite:    form.disponibilite,
        experienceRetail: form.experienceRetail,
        annéesExperience: form.annéesExperience,
        dernierPoste:     form.dernierPoste,
        dernierEmployeur: form.dernierEmployeur,
        secteurActivite:  form.secteurActivite,
        niveauEtudes:     form.niveauEtudes === 'Autre' ? form.niveauEtudesAutre : form.niveauEtudes,
        diplomePrincipal: form.diplomePrincipal,
        langues:          form.langues,
        cv:               cvMeta,
        score,
        scoreBreakdown,
        status:           'À contacter',
        submittedAt:      new Date().toISOString(),
      });

      setSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" /></div>;
  if (error)   return <div className="flex-1 flex items-center justify-center text-sm text-[#6B6560]">{error}</div>;

  const c  = content.apply;
  const fl = c.fields;
  const pl = c.placeholders;
  const s  = c.sections;

  const formStores      = config.formStores      || [];
  const postes          = config.postes          || [];
  const villesSouh      = config.villesSouhaitees || [];
  const disponibilites  = config.disponibilites  || [];
  const niveauxEtudes   = config.niveauxEtudes   || [];
  const languages       = config.languages       || [];
  const experiences     = config.experiences     || [];
  const formCities      = config.formCities      || [];

  /* ── Success ─────────────────────────────────────── */
  if (submitted) {
    return (
      <main className="flex-1 flex flex-col min-h-[calc(100dvh-57px)]">
        <div className="h-0.5 w-full bg-gradient-to-r from-[#C9A96E] via-[#EAD8B8] to-[#C9A96E]" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
          <img
            src={`${import.meta.env.BASE_URL}aksal-logo.png`}
            alt="Groupe AKSAL"
            className="h-20 w-auto object-contain mb-10"
            style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.08))' }}
          />
          <div className="w-12 h-px bg-[#C9A96E] mb-8" />
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-light italic text-[#1C1C1C] leading-[1.1] mb-6 max-w-lg"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {c.success.headline}
          </h1>
          <p className="text-base text-[#6B6560] font-light leading-relaxed max-w-sm mb-3">
            Votre candidature a bien été reçue.
          </p>
          <p className="text-base text-[#6B6560] font-light leading-relaxed max-w-sm mb-10">
            Notre équipe vous recontactera dans les plus brefs délais.
          </p>
          <div className="w-12 h-px bg-[#C9A96E] mb-10" />
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/" className="px-8 py-3.5 bg-[#C9A96E] text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#A8813F] transition-colors">
              {c.success.ctaOffers}
            </a>
            <button
              onClick={() => { setSubmitted(false); setForm(initialForm); }}
              className="px-8 py-3.5 border border-[#E5DDD0] text-[#6B6560] text-xs uppercase tracking-[0.15em] font-medium hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
            >
              {c.success.ctaNew}
            </button>
          </div>
        </div>
        <div className="border-t border-[#E5DDD0] py-5 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#6B6560]/50 font-light">
            Groupe AKSAL · Morocco Mall · careers@groupeaksal.ma
          </p>
        </div>
      </main>
    );
  }

  /* ── Form ─────────────────────────────────────────── */
  const hasRetailExp = form.experienceRetail === 'oui';

  return (
    <main className="flex-1">
      <section className="bg-white border-b border-[#E5DDD0] py-14 md:py-20 px-5">
        <div className="max-w-2xl mx-auto">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] font-medium text-[#C9A96E] mb-5">{c.eyebrow}</p>
          <h1
            className="text-4xl md:text-5xl font-light italic text-[#1C1C1C] leading-[1.1] mb-4 whitespace-pre-line"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {form.posteRecherche && form.posteRecherche !== 'Autre'
              ? `Postuler — ${form.posteRecherche}`
              : c.headlineDefault}
          </h1>
          {form.magasinSouhaite && (
            <p className="text-sm text-[#6B6560] font-light">{form.magasinSouhaite}</p>
          )}
          <div className="w-12 h-px bg-[#C9A96E] mt-5" />
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-5 py-10 md:py-14">
        <form onSubmit={handleSubmit} noValidate className="space-y-8">

          {/* 01 — Informations personnelles */}
          <FormSection step="01" title={s.identity}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={fl.nom} error={errors.nom}>
                <Input type="text" value={form.nom} onChange={(e) => set('nom', e.target.value)} placeholder={pl.nom} hasError={!!errors.nom} />
              </Field>
              <Field label={fl.prenom} error={errors.prenom}>
                <Input type="text" value={form.prenom} onChange={(e) => set('prenom', e.target.value)} placeholder={pl.prenom} hasError={!!errors.prenom} />
              </Field>
            </div>
            <Field label={fl.telephone} error={errors.telephone}>
              <Input type="tel" value={form.telephone} onChange={(e) => set('telephone', e.target.value)} placeholder={pl.telephone} autoComplete="tel" hasError={!!errors.telephone} />
            </Field>
            <Field label={fl.email} error={errors.email}>
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder={pl.email} autoComplete="email" hasError={!!errors.email} />
            </Field>
            <Field label={fl.ville} error={errors.ville}>
              <SelectField value={form.ville} onChange={(e) => set('ville', e.target.value)} hasError={!!errors.ville}>
                <option value="">{pl.ville}</option>
                {formCities.map((city) => <option key={city} value={city}>{city}</option>)}
              </SelectField>
            </Field>
            <Field label={fl.adresse}>
              <Input type="text" value={form.adresse} onChange={(e) => set('adresse', e.target.value)} placeholder={pl.adresse} hasError={false} />
            </Field>
          </FormSection>

          {/* 02 — Informations de candidature */}
          <FormSection step="02" title={s.candidature}>
            <Field label={fl.magasinSouhaite} error={errors.magasinSouhaite}>
              <SelectField value={form.magasinSouhaite} onChange={(e) => set('magasinSouhaite', e.target.value)} hasError={!!errors.magasinSouhaite}>
                <option value="">{pl.magasin}</option>
                {formStores.map((st) => <option key={st} value={st}>{st}</option>)}
              </SelectField>
            </Field>
            <Field label={fl.posteRecherche} error={errors.posteRecherche}>
              <SelectField value={form.posteRecherche} onChange={(e) => set('posteRecherche', e.target.value)} hasError={!!errors.posteRecherche}>
                <option value="">{pl.poste}</option>
                {postes.map((p) => <option key={p} value={p}>{p}</option>)}
              </SelectField>
            </Field>
            {form.posteRecherche === 'Autre' && (
              <Field label={fl.posteAutre} error={errors.posteAutre}>
                <Input type="text" value={form.posteAutre} onChange={(e) => set('posteAutre', e.target.value)} placeholder={pl.posteAutre} hasError={!!errors.posteAutre} />
              </Field>
            )}
            <Field label={fl.villesSouhaitees}>
              <div className="flex flex-wrap gap-2">
                {villesSouh.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => toggleVille(v)}
                    className={`px-4 py-2 text-xs font-medium border transition-all ${
                      form.villesSouhaitees.includes(v)
                        ? 'bg-[#C9A96E] text-white border-[#C9A96E]'
                        : 'bg-white text-[#6B6560] border-[#E5DDD0] hover:border-[#C9A96E] hover:text-[#C9A96E]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </Field>
          </FormSection>

          {/* 03 — Disponibilité */}
          <FormSection step="03" title={s.disponibilite}>
            <Field label={fl.disponibilite} error={errors.disponibilite}>
              <div className="flex flex-wrap gap-2">
                {disponibilites.map((d) => (
                  <RadioChip
                    key={d}
                    label={d}
                    checked={form.disponibilite === d}
                    onChange={() => { set('disponibilite', d); }}
                  />
                ))}
              </div>
              {errors.disponibilite && <p className="mt-2 text-xs text-[#C9A96E]">{errors.disponibilite}</p>}
            </Field>
          </FormSection>

          {/* 04 — Expérience professionnelle */}
          <FormSection step="04" title={s.experience}>
            <Field label={fl.experienceRetail} error={errors.experienceRetail}>
              <div className="flex flex-wrap gap-2">
                {c.experienceRetailOptions.map(({ id, label }) => (
                  <RadioChip
                    key={id}
                    label={label}
                    checked={form.experienceRetail === id}
                    onChange={() => set('experienceRetail', id)}
                  />
                ))}
              </div>
              {errors.experienceRetail && <p className="mt-2 text-xs text-[#C9A96E]">{errors.experienceRetail}</p>}
            </Field>

            {hasRetailExp && (
              <>
                <Field label={fl.annéesExperience} error={errors.annéesExperience}>
                  <SelectField value={form.annéesExperience} onChange={(e) => set('annéesExperience', e.target.value)} hasError={!!errors.annéesExperience}>
                    <option value="">{pl.annéesExperience}</option>
                    {experiences.map((ex) => <option key={ex.id} value={ex.label}>{ex.label}</option>)}
                  </SelectField>
                </Field>
                <Field label={fl.dernierPoste}>
                  <Input type="text" value={form.dernierPoste} onChange={(e) => set('dernierPoste', e.target.value)} placeholder={pl.dernierPoste} hasError={false} />
                </Field>
                <Field label={fl.dernierEmployeur}>
                  <Input type="text" value={form.dernierEmployeur} onChange={(e) => set('dernierEmployeur', e.target.value)} placeholder={pl.dernierEmployeur} hasError={false} />
                </Field>
                <Field label={fl.secteurActivite}>
                  <Input type="text" value={form.secteurActivite} onChange={(e) => set('secteurActivite', e.target.value)} placeholder={pl.secteurActivite} hasError={false} />
                </Field>
              </>
            )}
          </FormSection>

          {/* 05 — Formation */}
          <FormSection step="05" title={s.formation}>
            <Field label={fl.niveauEtudes} error={errors.niveauEtudes}>
              <SelectField value={form.niveauEtudes} onChange={(e) => set('niveauEtudes', e.target.value)} hasError={!!errors.niveauEtudes}>
                <option value="">{pl.niveauEtudes}</option>
                {niveauxEtudes.map((n) => <option key={n} value={n}>{n}</option>)}
              </SelectField>
            </Field>
            {form.niveauEtudes === 'Autre' && (
              <Field label={fl.niveauEtudesAutre} error={errors.niveauEtudesAutre}>
                <Input type="text" value={form.niveauEtudesAutre} onChange={(e) => set('niveauEtudesAutre', e.target.value)} placeholder={pl.niveauEtudesAutre} hasError={!!errors.niveauEtudesAutre} />
              </Field>
            )}
            <Field label={fl.diplomePrincipal}>
              <Input type="text" value={form.diplomePrincipal} onChange={(e) => set('diplomePrincipal', e.target.value)} placeholder={pl.diplomePrincipal} hasError={false} />
            </Field>
            <Field label={fl.langues} error={errors.langues}>
              <div className="flex flex-wrap gap-2">
                {languages.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => toggleLangue(l.id)}
                    className={`px-5 py-2.5 text-xs uppercase tracking-wider font-medium border transition-all ${
                      form.langues.includes(l.id)
                        ? 'bg-[#C9A96E] text-white border-[#C9A96E]'
                        : 'bg-white text-[#6B6560] border-[#E5DDD0] hover:border-[#C9A96E] hover:text-[#C9A96E]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              {errors.langues && <p className="mt-2 text-xs text-[#C9A96E]">{errors.langues}</p>}
            </Field>
          </FormSection>

          {/* 06 — CV */}
          <FormSection step="06" title={s.cv}>
            <Field label={fl.cv} error={errors.cv}>
              {form.cv ? (
                <div className="flex items-center gap-4 border border-[#C9A96E]/30 bg-[#FBF7F1] px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1C1C1C] font-medium truncate">{form.cv.name}</p>
                    <p className="text-xs text-[#6B6560] font-light">{(form.cv.size / 1024).toFixed(0)} Ko</p>
                  </div>
                  <button type="button" onClick={() => set('cv', null)} className="p-1 text-[#6B6560] hover:text-[#C9A96E] transition-colors" aria-label="Supprimer">
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full border border-dashed border-[#E5DDD0] hover:border-[#C9A96E] py-8 text-center transition-colors group"
                >
                  <Upload size={18} className="mx-auto mb-2 text-[#E5DDD0] group-hover:text-[#C9A96E] transition-colors" />
                  <p className="text-xs uppercase tracking-wider text-[#6B6560] group-hover:text-[#C9A96E] transition-colors font-medium">{pl.cvUpload}</p>
                  <p className="text-xs text-[#6B6560]/50 mt-1 font-light">{pl.cvFormats}</p>
                </button>
              )}
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg" onChange={handleFile} className="hidden" />
            </Field>
          </FormSection>

          {/* 07 — Consentement */}
          <FormSection step="07" title={s.consentement}>
            <div className="space-y-4">
              <ConsentCheckbox
                id="consentRgpd"
                checked={form.consentRgpd}
                onChange={(v) => set('consentRgpd', v)}
                text={c.consentRgpdText}
                error={errors.consentRgpd}
              />
              <ConsentCheckbox
                id="consentCertif"
                checked={form.consentCertif}
                onChange={(v) => set('consentCertif', v)}
                text={c.consentCertifText}
                error={errors.consentCertif}
              />
            </div>
          </FormSection>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#C9A96E] hover:bg-[#A8813F] disabled:opacity-60 text-white text-xs uppercase tracking-[0.15em] font-medium py-4 transition-colors flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {c.submitting}
              </>
            ) : c.submitLabel}
          </button>

          <p className="text-center text-xs text-[#6B6560]/40 font-light">
            ✉ Votre dossier sera transmis à careers@groupeaksal.ma
          </p>
        </form>
      </section>
    </main>
  );
}

/* ── Sub-components ──────────────────────────────── */

function FormSection({ step, title, children }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 pb-4 border-b border-[#E5DDD0]">
        <span className="text-[0.6rem] font-medium text-[#C9A96E] tabular-nums">{step}</span>
        <h2 className="text-[0.65rem] uppercase tracking-[0.15em] font-medium text-[#1C1C1C]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div data-error={error ? true : undefined}>
      <label className="block text-xs font-light text-[#6B6560] mb-1.5 tracking-wide">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-[#C9A96E]">{error}</p>}
    </div>
  );
}

function Input({ hasError, ...props }) {
  return (
    <input
      {...props}
      className={`w-full bg-[#FAF8F5] border ${hasError ? 'border-[#C9A96E]' : 'border-[#E5DDD0]'} px-4 py-3 text-sm text-[#1C1C1C] placeholder:text-[#6B6560]/50 font-light focus:outline-none focus:border-[#C9A96E] transition-colors`}
    />
  );
}

function SelectField({ hasError, children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full appearance-none bg-[#FAF8F5] border ${hasError ? 'border-[#C9A96E]' : 'border-[#E5DDD0]'} px-4 py-3 pr-8 text-sm text-[#1C1C1C] font-light focus:outline-none focus:border-[#C9A96E] transition-colors cursor-pointer`}
      >
        {children}
      </select>
      <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#C9A96E]" />
    </div>
  );
}

function RadioChip({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`px-5 py-2.5 text-xs uppercase tracking-wider font-medium border transition-all ${
        checked
          ? 'bg-[#C9A96E] text-white border-[#C9A96E]'
          : 'bg-white text-[#6B6560] border-[#E5DDD0] hover:border-[#C9A96E] hover:text-[#C9A96E]'
      }`}
    >
      {label}
    </button>
  );
}

function ConsentCheckbox({ id, checked, onChange, text, error }) {
  return (
    <div data-error={error ? true : undefined}>
      <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
        <div
          className={`w-5 h-5 shrink-0 border flex items-center justify-center mt-0.5 transition-colors ${
            checked ? 'bg-[#C9A96E] border-[#C9A96E]' : 'bg-white border-[#E5DDD0] group-hover:border-[#C9A96E]'
          }`}
          onClick={() => onChange(!checked)}
        >
          {checked && (
            <svg viewBox="0 0 12 10" className="w-3 h-3 text-white fill-none stroke-current stroke-2">
              <polyline points="1,5 4.5,8.5 11,1" />
            </svg>
          )}
        </div>
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <span className="text-xs text-[#1C1C1C] font-light leading-relaxed">{text}</span>
      </label>
      {error && <p className="mt-1.5 text-xs text-[#C9A96E] pl-8">{error}</p>}
    </div>
  );
}
