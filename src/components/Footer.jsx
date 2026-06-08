import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-white mt-auto">
      {/* Gold top strip */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#C9A96E] via-[#EAD8B8] to-[#C9A96E]" />

      <div className="max-w-6xl mx-auto px-5 py-14">
        {/* Top section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          {/* Brand */}
          <div className="flex-1 max-w-xs">
            <img
              src="/aksal-logo.png"
              alt="Groupe AKSAL"
              className="h-14 w-auto object-contain brightness-0 invert mb-6"
            />
            <p className="text-white/50 text-sm leading-relaxed font-light">
              Opérateur de référence du retail et du luxe au Maroc. Rejoignez une équipe animée par la passion de l'excellence.
            </p>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-3">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.15em] text-[#C9A96E] mb-1">
              Recrutement
            </p>
            <Link to="/" className="text-sm text-white/60 hover:text-[#C9A96E] transition-colors font-light">Offres d'emploi</Link>
            <Link to="/candidature" className="text-sm text-white/60 hover:text-[#C9A96E] transition-colors font-light">Candidature spontanée</Link>
            <a
              href="https://www.linkedin.com/company/groupe-aksal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-[#C9A96E] transition-colors font-light"
            >
              LinkedIn
            </a>
          </div>

          {/* Locations */}
          <div className="flex flex-col gap-3">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.15em] text-[#C9A96E] mb-1">
              Nos malls
            </p>
            <p className="text-sm text-white/60 font-light">Morocco Mall Casablanca</p>
            <p className="text-sm text-white/60 font-light">Morocco Mall Marrakech</p>
            <p className="text-sm text-white/60 font-light">Siège Social · Casablanca</p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.15em] text-[#C9A96E] mb-1">
              Contact
            </p>
            <a
              href="mailto:careers@groupeaksal.com"
              className="text-sm text-white/60 hover:text-[#C9A96E] transition-colors font-light"
            >
              careers@groupeaksal.com
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[0.7rem] text-white/30 tracking-wide">© 2026 Groupe AKSAL. Tous droits réservés.</p>
          <p className="text-[0.7rem] text-white/30 tracking-wide">Morocco Mall · Casablanca · Marrakech</p>
        </div>
      </div>
    </footer>
  );
}
