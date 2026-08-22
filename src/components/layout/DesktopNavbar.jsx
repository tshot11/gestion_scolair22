import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft,
  Search, 
  Bell, 
  Smartphone, 
  Monitor, 
  Plus, 
  RotateCcw,
  Sparkles,
  ChevronDown,
  Globe,
  LogOut,
  Lock
} from 'lucide-react';

export function DesktopNavbar() {
  const { 
    currentView, 
    setCurrentView, 
    setIsCommandPaletteOpen, 
    stats, 
    isMobileSimulator, 
    setIsMobileSimulator,
    data,
    currentUser,
    logout,
    resetToDefaultData,
    goBack,
    canGoBack
  } = useApp();

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Tableau de Bord & Métriques Clés';
      case 'eleves': return 'Annuaire des Élèves & Inscriptions';
      case 'eleve-detail': return 'Fiche & Dossier Individuel Élève';
      case 'enseignants': return 'Répertoire du Corps Enseignant';
      case 'classes': return 'Structure des Classes & Salles de Cours';
      case 'cours': return 'Programme des Cours & Coefficients';
      case 'horaires': return 'Grille des Emplois du Temps';
      case 'presences': return 'Pointage Quotidien & Taux d’Assiduité';
      case 'discipline': return 'Discipline & Registre des Sanctions';
      case 'resultats': 
      case 'palmares': return 'Palmarès des Cotes & Notes Périodiques';
      case 'bulletin': return 'Bulletin Scolaire Officiel RDC';
      case 'finance': return 'Trésorerie, Minervals & Caisse Centrale';
      case 'recu': return 'Quittance Officielle de Paiement';
      case 'parents': return 'Espace Parents & Tuteurs';
      case 'communication': return 'Centre de Messagerie & Diffusion d’Alertes';
      case 'parametres': 
      case 'settings': return 'Configuration de l’Établissement';
      default: return 'Gestion Scolaire RDC';
    }
  };

  return (
    <header className="hidden lg:flex h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl px-6 items-center justify-between sticky top-0 z-30">
      {/* Title & Path */}
      <div className="flex items-center gap-4">
        {canGoBack && (
          <button 
            type="button"
            onClick={goBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700/80 flex items-center justify-center text-slate-200 hover:text-white transition shadow-sm shrink-0"
            aria-label="Retour"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
          </button>
        )}
        <div>
        <h1 className="text-base font-bold text-white font-heading">
          {getTitle()}
        </h1>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{data.ecoleConfig.province_educationnelle}</span>
          <span>•</span>
          <span className="text-blue-400 font-medium">{data.ecoleConfig.periode_active}</span>
          {currentUser && (
            <>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{currentUser.role}</span>
            </>
          )}
        </div>
      </div>

      </div>
      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Command Search Bar Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-600 transition w-56 text-xs shadow-inner"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="flex-1 text-left">Recherche globale...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px] font-mono text-slate-300 border border-slate-600">
            ⌘K
          </kbd>
        </button>

        {/* Device Switcher (Mobile vs Desktop Frame) */}
        <button
          onClick={() => setIsMobileSimulator(!isMobileSimulator)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
            isMobileSimulator
              ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 shadow-sm shadow-blue-500/20'
              : 'bg-slate-800/70 text-slate-300 border-slate-700/60 hover:bg-slate-700'
          }`}
          title="Basculer entre la vue smartphone et la vue plein écran web"
        >
          {isMobileSimulator ? (
            <>
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span className="hidden lg:inline">Mode Mobile</span>
            </>
          ) : (
            <>
              <Monitor className="w-4 h-4 text-slate-400" />
              <span className="hidden lg:inline">Simulateur Mobile</span>
            </>
          )}
        </button>

        {/* Public Landing Button */}
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/70 text-slate-300 border border-slate-700/60 hover:text-white hover:bg-slate-700 text-xs font-medium transition"
          title="Page d'accueil de l'école (Vitrine)"
        >
          <Globe className="w-4 h-4 text-blue-400" />
          <span className="hidden xl:inline">Vitrine École</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setCurrentView('communication')}
          className="relative p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          title="Notifications & Messages"
        >
          <Bell className="w-4 h-4" />
          {stats.unread_notifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-900"></span>
          )}
        </button>

        {/* Reset Demo Data Button */}
        <button
          onClick={() => {
            if (true) {
              resetToDefaultData();
            }
          }}
          className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
          title="Réinitialiser données d'exemple"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

