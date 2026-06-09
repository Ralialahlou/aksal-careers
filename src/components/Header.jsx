import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Offres d\'emploi' },
    { to: '/candidature', label: 'Candidature' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5DDD0]">
      {/* Top gold strip */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#C9A96E] via-[#EAD8B8] to-[#C9A96E]" />

      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src={`${import.meta.env.BASE_URL}aksal-logo.png`}
            alt="Groupe AKSAL"
            className="h-14 w-auto object-contain"
            style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.10))' }}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-xs tracking-[0.12em] uppercase font-medium transition-colors relative pb-1 ${
                location.pathname === l.to
                  ? 'text-[#C9A96E]'
                  : 'text-[#3D3D3D] hover:text-[#C9A96E]'
              }`}
            >
              {l.label}
              {location.pathname === l.to && (
                <span className="absolute bottom-0 left-0 w-full h-px bg-[#C9A96E]" />
              )}
            </Link>
          ))}
          <a
            href="https://www.linkedin.com/company/groupe-aksal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.12em] uppercase font-medium text-[#3D3D3D] hover:text-[#C9A96E] transition-colors"
          >
            LinkedIn
          </a>
          <Link
            to="/candidature"
            className="ml-2 px-5 py-2.5 bg-[#C9A96E] text-white text-xs tracking-[0.12em] uppercase font-medium hover:bg-[#A8813F] transition-colors"
          >
            Postuler
          </Link>
        </nav>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 text-[#1C1C1C] hover:text-[#C9A96E] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E5DDD0] px-5 pb-5">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={`block py-4 text-xs tracking-[0.12em] uppercase font-medium border-b border-[#E5DDD0] ${
                location.pathname === l.to ? 'text-[#C9A96E]' : 'text-[#3D3D3D]'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://www.linkedin.com/company/groupe-aksal"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-4 text-xs tracking-[0.12em] uppercase font-medium text-[#3D3D3D] border-b border-[#E5DDD0]"
          >
            LinkedIn
          </a>
          <Link
            to="/candidature"
            onClick={() => setMenuOpen(false)}
            className="mt-4 block text-center px-5 py-3 bg-[#C9A96E] text-white text-xs tracking-[0.12em] uppercase font-medium"
          >
            Postuler
          </Link>
        </div>
      )}
    </header>
  );
}
