import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { login, isAuthenticated } from './auth.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (isAuthenticated()) navigate('/backoffice/dashboard', { replace: true });
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (login(password)) {
        navigate('/backoffice/dashboard', { replace: true });
      } else {
        setError('Mot de passe incorrect.');
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div className="min-h-dvh bg-[#FAF8F5] flex flex-col items-center justify-center px-5">
      {/* Gold top strip */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C9A96E] via-[#EAD8B8] to-[#C9A96E]" />

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <img
            src={`${import.meta.env.BASE_URL}aksal-logo-gold.png`}
            alt="Groupe AKSAL"
            className="h-16 w-auto mx-auto mb-6"
            style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.08))' }}
          />
          <div className="w-8 h-px bg-[#C9A96E] mx-auto mb-5" />
          <p className="text-[0.6rem] uppercase tracking-[0.2em] font-medium text-[#6B6560]">
            Accès Back-office RH
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E5DDD0] p-8"
        >
          <label className="block text-xs font-light text-[#6B6560] mb-2 tracking-wide">
            Mot de passe
          </label>
          <div className="relative mb-5">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9A96E]" />
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="••••••••"
              autoFocus
              className="w-full bg-[#FAF8F5] border border-[#E5DDD0] pl-9 pr-4 py-3 text-sm text-[#1C1C1C] font-light focus:outline-none focus:border-[#C9A96E] transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-[#C9A96E] mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#C9A96E] hover:bg-[#A8813F] disabled:opacity-50 text-white text-xs uppercase tracking-[0.15em] font-medium py-3.5 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : null}
            Accéder au back-office
          </button>
        </form>

        <p className="text-center text-xs text-[#6B6560]/40 mt-6 font-light">
          Réservé à l'équipe RH · Groupe AKSAL
        </p>
      </div>
    </div>
  );
}
