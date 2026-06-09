import { Link } from 'react-router-dom';

function AksalDropletSvg({ className }) {
  /*
    Inline SVG recreation of the AKSAL droplet logo — all white for dark backgrounds.
    Droplet shape clipped; 4-row triangular grid (16 small triangles) inside.
    Stroke matches footer bg (#1C1C1C) to produce the grid-line separation effect.
  */
  return (
    <svg viewBox="0 0 80 102" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Groupe AKSAL">
      <defs>
        <clipPath id="ak-drop">
          <path d="M40,85 C4,71 2,22 40,9 C78,22 76,71 40,85Z" />
        </clipPath>
      </defs>

      {/* Triangle grid — 10 up + 6 down = 16 triangles */}
      <g clipPath="url(#ak-drop)" fill="white" stroke="#1C1C1C" strokeWidth="0.7" strokeLinejoin="round">
        {/* Row 0: 1 up */}
        <polygon points="40,22 34.5,31.5 45.5,31.5" />
        {/* Row 1: 2 up + 1 down */}
        <polygon points="34.5,31.5 29,41 40,41" />
        <polygon points="45.5,31.5 40,41 51,41" />
        <polygon points="34.5,31.5 45.5,31.5 40,41" />
        {/* Row 2: 3 up + 2 down */}
        <polygon points="29,41 23.5,50.5 34.5,50.5" />
        <polygon points="40,41 34.5,50.5 45.5,50.5" />
        <polygon points="51,41 45.5,50.5 56.5,50.5" />
        <polygon points="29,41 40,41 34.5,50.5" />
        <polygon points="40,41 51,41 45.5,50.5" />
        {/* Row 3: 4 up + 3 down */}
        <polygon points="23.5,50.5 18,60 29,60" />
        <polygon points="34.5,50.5 29,60 40,60" />
        <polygon points="45.5,50.5 40,60 51,60" />
        <polygon points="56.5,50.5 51,60 62,60" />
        <polygon points="23.5,50.5 34.5,50.5 29,60" />
        <polygon points="34.5,50.5 45.5,50.5 40,60" />
        <polygon points="45.5,50.5 56.5,50.5 51,60" />
      </g>

      {/* Droplet outline */}
      <path d="M40,85 C4,71 2,22 40,9 C78,22 76,71 40,85Z" stroke="white" strokeWidth="1.3" />

      {/* AKSAL wordmark */}
      <text
        x="38.25" y="97"
        textAnchor="middle"
        fontFamily="Jost, sans-serif"
        fontSize="10"
        fontWeight="500"
        letterSpacing="3.5"
        fill="white"
      >AKSAL</text>
    </svg>
  );
}

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
            <AksalDropletSvg className="h-16 w-auto mb-6" />
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
