import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ArrowLeft, LogOut, Home, Lock } from 'lucide-react';

export function AccessDeniedView({ requestedView }) {
  const { currentUser, setCurrentView, logout, systemRoles } = useApp();
  const currentRole = currentUser ? systemRoles[currentUser.role_id] : null;

  return (
    <div className="p-6 sm:p-12 flex flex-col items-center justify-center text-center max-w-lg mx-auto min-h-[60vh]">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-xl shadow-rose-500/10">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-white font-heading mb-2">
        Accès Restreint
      </h2>

      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
        Votre profil actuel (<strong className="text-slate-200">{currentUser?.role || 'Utilisateur'}</strong>) ne dispose pas des autorisations nécessaires pour accéder au module <strong className="text-rose-400 font-mono">"{requestedView}"</strong>.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {currentRole?.defaultView && (
          <button
            onClick={() => setCurrentView(currentRole.defaultView)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition"
          >
            <Home className="w-4 h-4" />
            <span>Mon Espace ({currentRole.label})</span>
          </button>
        )}

        <button
          onClick={() => setCurrentView('login')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
        >
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Changer de Rôle</span>
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 font-semibold text-xs border border-slate-800 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
