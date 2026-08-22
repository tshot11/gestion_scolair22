import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Bell, 
  Menu, 
  School,
  Globe,
  Sparkles
} from 'lucide-react';

export function MobileHeader({ onOpenMenu }) {
  const { 
    currentView, 
    setCurrentView, 
    setIsCommandPaletteOpen, 
    stats, 
    data,
    currentUser
  } = useApp();

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Tableau de Bord';
      case 'eleves': return 'Annuaire Élèves';
      case 'eleve-detail': return 'Fiche Élève';
      case 'enseignants': return 'Corps Enseignant';
      case 'classes': return 'Classes & Salles';
      case 'cours': return 'Cours & Matières';
      case 'horaires': return 'Emploi du Temps';
      case 'presences': return 'Présences & Appel';
      case 'discipline': return 'Discipline & Suivi';
      case 'resultats': 
      case 'palmares': return 'Palmarès & Cotes';
      case 'bulletin': return 'Bulletin Scolaire';
      case 'finance': return 'Trésorerie & Caisse';
      case 'recu': return 'Quittance Paiement';
      case 'parents': return 'Espace Parents';
      case 'communication': return 'Messagerie & Alertes';
      case 'parametres': 
      case 'settings': return 'Paramètres École';
      default: return 'Gestion Scolaire RDC';
    }
  };

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/90 px-3.5 py-2.5 w-full max-w-full select-none space-y-2">
      {/* Line 1: [☰ Hamburger] [Logo + Title] [Search + 🔔 Bell] */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Hamburger & View Title */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button 
            type="button"
            onClick={onOpenMenu}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700/80 flex items-center justify-center text-slate-200 hover:text-white transition active:scale-95 shrink-0 shadow-sm"
            aria-label="Ouvrir le menu de navigation"
          >
            <Menu className="w-5 h-5 text-blue-400" />
          </button>
          
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-700 shrink-0 shadow-sm border border-slate-200">
              <School className="w-4 h-4" />
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white font-heading truncate">
              {getTitle()}
            </h1>
          </div>
        </div>

        {/* Right: Quick Search & Notification Bell */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button 
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700/70 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition active:scale-95"
            title="Recherche globale (Ctrl+K)"
            aria-label="Recherche"
          >
            <Search className="w-4 h-4" />
          </button>

          <button 
            type="button"
            onClick={() => setCurrentView('communication')}
            className="relative w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700/70 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition active:scale-95"
            title="Notifications & Alertes"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {stats.unread_notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-slate-900 animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* Line 2: Year • Role • Public Vitrine */}
      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60 text-slate-400 gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{data.ecoleConfig.annee_courante}</span>
          </span>

          <span className="text-slate-600">•</span>

          <span className="text-emerald-400 font-semibold truncate text-[11px]">
            {currentUser?.role || 'Préfet des Études'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('landing')}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-blue-300 text-[10px] font-medium transition shrink-0 border border-slate-700/60"
          title="Consulter la vitrine de l'école"
        >
          <Globe className="w-3 h-3 text-blue-400" />
          <span>Vitrine</span>
        </button>
      </div>
    </header>
  );
}
