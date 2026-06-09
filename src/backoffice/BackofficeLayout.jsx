import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users } from 'lucide-react';
import { isAuthenticated, logout } from './auth.jsx';

export default function BackofficeLayout() {
  const navigate = useNavigate();

  if (!isAuthenticated()) return <Navigate to="/backoffice/login" replace />;

  function handleLogout() {
    logout();
    navigate('/backoffice/login', { replace: true });
  }

  const navClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-[0.1em] font-medium border-b-2 transition-colors ${
      isActive
        ? 'text-[#C9A96E] border-[#C9A96E]'
        : 'text-[#6B6560] border-transparent hover:text-[#1C1C1C]'
    }`;

  return (
    <div className="min-h-dvh flex flex-col bg-[#FAF8F5]">
      {/* Gold strip */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#C9A96E] via-[#EAD8B8] to-[#C9A96E]" />

      {/* Top bar */}
      <header className="bg-white border-b border-[#E5DDD0] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <img
              src="/aksal-logo.png"
              alt="AKSAL"
              className="h-8 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.06))' }}
            />
            <span className="hidden sm:block text-[0.6rem] uppercase tracking-[0.15em] text-[#6B6560] font-medium pl-3 border-l border-[#E5DDD0]">
              Back-office RH
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-[#6B6560] hover:text-[#C9A96E] transition-colors font-medium uppercase tracking-wider"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>

        {/* Tab nav */}
        <div className="max-w-7xl mx-auto px-5 flex gap-1 -mb-px">
          <NavLink to="/backoffice/dashboard"    className={navClass} end>
            <LayoutDashboard size={13} />
            Tableau de bord
          </NavLink>
          <NavLink to="/backoffice/candidatures" className={navClass}>
            <Users size={13} />
            Candidatures
          </NavLink>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-5 py-8">
        <Outlet />
      </main>
    </div>
  );
}
