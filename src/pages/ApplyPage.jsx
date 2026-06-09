import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Upload, X, ChevronDown } from 'lucide-react';
import { useAppData } from '../hooks/useData';
import { addCandidature } from '../utils/storage.js';
import { scoreCandidature } from '../utils/scoring.js';

const initialForm = {
  nom: '', prenom: '', email: '', telephone: '',
  dateNaissance: '', ville: '', langues: [],
  magasinPrefere: '', mall: '', experience: '',
  poste: '', enseigne: '', cv: null, message: '',
};

export default function ApplyPage() {
  const { config, content, loading, error } = useAppData();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    ...initialForm,
    poste:   params.get('poste')   || '',
    enseigne: params.get('enseigne') || '',
    mall:    params.get('mall')    || '',
  });
  const [errors, setErrors]     = useState({});
  const [submitted, setSubmitted] = useState(false);
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

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      setErrors((e) => ({ ...e, cv: 'Format non accepté. Utilisez PDF ou Word.' })); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((e) => ({ ...e, cv: 'Fichier trop volumineux (max 5 Mo).' })); return;
    }
    set('cv', file);
  }

  function validate() {
    const e = {};
    if (!form.nom.trim()) e.nom = 'Requis.';
    if (!form.prenom.trim()) e.prenom = 'Requis.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Adresse invalide.';
    if (!form.telephone.trim() || !/^[0-9+\s\-()]{8,15}$/.test(form.telephone)) e.telephone = 'Numéro invalide.';
    if (!form.dateNaissance) e.dateNaissance = 'Requis.';
    if (!form.ville) e.ville = 'Requis.';
    if (form.langues.length === 0) e.langues = 'Sélectionnez au moins une langue.';
    if (!form.magasinPrefere) e.magasinPrefere = 'Requis.';
    if (!form.experience) e.experience = 'Requis.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      document.querySelector('[data-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitting(true);

    const readFileAsDataUrl = (file) =>
      new Promise((resolve) => {
        if (!file) { resolve(null); return; }
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });

    readFileAsDataUrl(form.cv).then((dataUrl) => {
      const cvMeta = form.cv
        ? { name: form.cv.name, size: form.cv.size, type: form.cv.type, data: dataUrl }
        : null;
      const { score, scoreBreakdown } = scoreCandidature({
        langues: form.langues,
        experience: form.experience,
        cv: cvMeta,
        message: form.message,
      });
      addCandidature({
        id: crypto.randomUUID(),
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        telephone: form.telephone,
        dateNaissance: form.dateNaissance,
        ville: form.ville,
        langues: form.langues,
        magasinPrefere: form.magasinPrefere,
        mall: form.mall,
        experience: form.experience,
        poste: form.poste,
        enseigne: form.enseigne,
        cv: cvMeta,
        message: form.message,
        score,
        scoreBreakdown,
        status: 'À contacter',
        submittedAt: new Date().toISOString(),
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

  const stores     = config.stores.filter((st) => st.id !== 'all');
  const malls      = config.malls.filter((m) => m.id !== 'all');
  const languages  = config.languages;
  const experiences = config.experiences;
  const formCities = config.formCities;

  /* ── Success ─────────────────────────────────────── */
  if (submitted) {
    return (
      <main className="flex-1 flex flex-col min-h-[calc(100dvh-57px)]">
        {/* Top gold strip */}
        <div className="h-0.5 w-full bg-gradient-to-r from-[#C9A96E] via-[#EAD8B8] to-[#C9A96E]" />

        {/* Centred content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">

          {/* Logo */}
          <img
            src={`${import.meta.env.BASE_URL}aksal-logo.png`}
            alt="Groupe AKSAL"
            className="h-20 w-auto object-contain mb-10"
            style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.08))' }}
          />

          {/* Gold divider */}
          <div className="w-12 h-px bg-[#C9A96E] mb-8" />

          {/* Heading */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-light italic text-[#1C1C1C] leading-[1.1] mb-6 max-w-lg"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Merci pour votre intérêt.
          </h1>

          {/* Sub-message */}
          <p className="text-base md:text-lg text-[#6B6560] font-light leading-relaxed max-w-sm mb-3">
            Nous avons bien reçu votre candidature.
          </p>
          <p className="text-base md:text-lg text-[#6B6560] font-light leading-relaxed max-w-sm mb-10">
            Notre équipe vous recontactera dans les plus brefs délais.
          </p>

          {/* Gold divider */}
          <div className="w-12 h-px bg-[#C9A96E] mb-10" />

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/"
              className="px-8 py-3.5 bg-[#C9A96E] text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#A8813F] transition-colors"
            >
              Voir d'autres offres
            </a>
            <button
              onClick={() => { setSubmitted(false); setForm(initialForm); }}
              className="px-8 py-3.5 border border-[#E5DDD0] text-[#6B6560] text-xs uppercase tracking-[0.15em] font-medium hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
            >
              Nouvelle candidature
            </button>
          </div>
        </div>

        {/* Bottom footer strip */}
        <div className="border-t border-[#E5DDD0] py-5 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#6B6560]/50 font-light">
            Groupe AKSAL · Morocco Mall · careers@groupeaksal.com
          </p>
        </div>
      </main>
    );
  }

  /* ── Form ─────────────────────────────────────────── */
  const headline = form.poste
    ? c.headlineWithJob.replace('{poste}', form.poste)
    : c.headlineDefault;

  return (
    <main className="flex-1">
      <section className="bg-white border-b border-[#E5DDD0] py-14 md:py-20 px-5">
        <div className="max-w-2xl mx-auto">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] font-medium text-[#C9A96E] mb-5">{c.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-light italic text-[#1C1C1C] leading-[1.1] mb-4 whitespace-pre-line" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {headline}
          </h1>
          {(form.enseigne || form.mall) && (
            <p className="text-sm text-[#6B6560] font-light">{form.enseigne}{form.mall ? ` · ${form.mall}` : ''}</p>
          )}
          <div className="w-12 h-px bg-[#C9A96E] mt-5" />
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-5 py-10 md:py-14">
        <form onSubmit={handleSubmit} noValidate className="space-y-8">

          <FormSection step="01" title={s.identity}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={fl.nom} error={errors.nom}>
                <Input type="text" value={form.nom} onChange={(e) => set('nom', e.target.value)} placeholder={pl.nom} hasError={!!errors.nom} />
              </Field>
              <Field label={fl.prenom} error={errors.prenom}>
                <Input type="text" value={form.prenom} onChange={(e) => set('prenom', e.target.value)} placeholder={pl.prenom} hasError={!!errors.prenom} />
              </Field>
            </div>
            <Field label={fl.dateNaissance} error={errors.dateNaissance}>
              <Input type="date" value={form.dateNaissance} onChange={(e) => set('dateNaissance', e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
                hasError={!!errors.dateNaissance} />
            </Field>
          </FormSection>

          <FormSection step="02" title={s.contact}>
            <Field label={fl.email} error={errors.email}>
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder={pl.email} autoComplete="email" hasError={!!errors.email} />
            </Field>
            <Field label={fl.telephone} error={errors.telephone}>
              <Input type="tel" value={form.telephone} onChange={(e) => set('telephone', e.target.value)} placeholder={pl.telephone} autoComplete="tel" hasError={!!errors.telephone} />
            </Field>
            <Field label={fl.ville} error={errors.ville}>
              <SelectField value={form.ville} onChange={(e) => set('ville', e.target.value)} hasError={!!errors.ville}>
                <option value="">{pl.ville}</option>
                {formCities.map((city) => <option key={city} value={city}>{city}</option>)}
              </SelectField>
            </Field>
          </FormSection>

          <FormSection step="03" title={s.languages}>
            {errors.langues && <p className="text-xs text-[#C9A96E] mb-3">{errors.langues}</p>}
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <button key={l.id} type="button" onClick={() => toggleLangue(l.id)}
                  className={`px-5 py-2.5 text-xs uppercase tracking-wider font-medium border transition-all ${
                    form.langues.includes(l.id)
                      ? 'bg-[#C9A96E] text-white border-[#C9A96E]'
                      : 'bg-white text-[#6B6560] border-[#E5DDD0] hover:border-[#C9A96E] hover:text-[#C9A96E]'
                  }`}>
                  {l.label}
                </button>
              ))}
            </div>
          </FormSection>

          <FormSection step="04" title={s.position}>
            <Field label={fl.magasinPrefere} error={errors.magasinPrefere}>
              <SelectField value={form.magasinPrefere} onChange={(e) => set('magasinPrefere', e.target.value)} hasError={!!errors.magasinPrefere}>
                <option value="">{pl.magasin}</option>
                {stores.map((st) => <option key={st.id} value={st.label}>{st.label}</option>)}
              </SelectField>
            </Field>
            <Field label={fl.mall}>
              <SelectField value={form.mall} onChange={(e) => set('mall', e.target.value)} hasError={false}>
                <option value="">{pl.mall}</option>
                {malls.map((m) => <option key={m.id} value={m.label}>{m.label}</option>)}
              </SelectField>
            </Field>
            <Field label={fl.experience} error={errors.experience}>
              <SelectField value={form.experience} onChange={(e) => set('experience', e.target.value)} hasError={!!errors.experience}>
                <option value="">{pl.experience}</option>
                {experiences.map((ex) => <option key={ex.id} value={ex.label}>{ex.label}</option>)}
              </SelectField>
            </Field>
          </FormSection>

          <FormSection step="05" title={s.cv}>
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
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full border border-dashed border-[#E5DDD0] hover:border-[#C9A96E] py-8 text-center transition-colors group">
                  <Upload size={18} className="mx-auto mb-2 text-[#E5DDD0] group-hover:text-[#C9A96E] transition-colors" />
                  <p className="text-xs uppercase tracking-wider text-[#6B6560] group-hover:text-[#C9A96E] transition-colors font-medium">{pl.cvUpload}</p>
                  <p className="text-xs text-[#6B6560]/50 mt-1 font-light">{pl.cvFormats}</p>
                </button>
              )}
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="hidden" />
            </Field>
            <Field label={fl.message}>
              <textarea value={form.message} onChange={(e) => set('message', e.target.value)}
                placeholder={pl.message} rows={4}
                className="w-full bg-[#FAF8F5] border border-[#E5DDD0] px-4 py-3 text-sm text-[#1C1C1C] placeholder:text-[#6B6560]/50 font-light focus:outline-none focus:border-[#C9A96E] resize-none transition-colors" />
            </Field>
          </FormSection>

          <p className="text-xs text-[#6B6560]/60 leading-relaxed font-light">{c.privacy}</p>

          <button type="submit" disabled={submitting}
            className="w-full bg-[#C9A96E] hover:bg-[#A8813F] disabled:opacity-60 text-white text-xs uppercase tracking-[0.15em] font-medium py-4 transition-colors flex items-center justify-center gap-3">
            {submitting ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>{c.submitting}</>
            ) : c.submitLabel}
          </button>
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
    <input {...props}
      className={`w-full bg-[#FAF8F5] border ${hasError ? 'border-[#C9A96E]' : 'border-[#E5DDD0]'} px-4 py-3 text-sm text-[#1C1C1C] placeholder:text-[#6B6560]/50 font-light focus:outline-none focus:border-[#C9A96E] transition-colors`} />
  );
}

function SelectField({ hasError, children, ...props }) {
  return (
    <div className="relative">
      <select {...props}
        className={`w-full appearance-none bg-[#FAF8F5] border ${hasError ? 'border-[#C9A96E]' : 'border-[#E5DDD0]'} px-4 py-3 pr-8 text-sm text-[#1C1C1C] font-light focus:outline-none focus:border-[#C9A96E] transition-colors cursor-pointer`}>
        {children}
      </select>
      <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#C9A96E]" />
    </div>
  );
}
