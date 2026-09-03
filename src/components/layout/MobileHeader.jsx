import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Search,
  Bell,
  Menu,
  ArrowLeft,
  School,
  Globe,
  Sparkles,
} from "lucide-react";
export function MobileHeader({ onOpenMenu }) {
  const {
    currentView,
    setCurrentView,
    setIsCommandPaletteOpen,
    stats,
    data,
    currentUser,
    goBack,
    canGoBack,
  } = useApp();
  const getTitle = () => {
    switch (currentView) {
      case "dashboard":
        return "Tableau de Bord";
      case "eleves":
        return "Annuaire Élèves";
      case "eleve-detail":
        return "Fiche Élève";
      case "enseignants":
        return "Corps Enseignant";
      case "classes":
        return "Classes & Salles";
      case "cours":
        return "Cours & Matières";
      case "horaires":
        return "Emploi du Temps";
      case "presences":
        return "Présences & Appel";
      case "discipline":
        return "Discipline & Suivi";
      case "resultats":
      case "palmares":
        return "Palmarès & Cotes";
      case "bulletin":
        return "Bulletin Scolaire";
      case "finance":
        return "Trésorerie & Caisse";
      case "recu":
        return "Quittance Paiement";
      case "parents":
        return "Espace Parents";
      case "communication":
        return "Messagerie & Alertes";
      case "parametres":
      case "settings":
        return "Paramètres École";
      default:
        return "Gestion Scolaire RDC";
    }
  };
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md/95 backdrop-blur-md border-b border-[#94C5FF]/15 px-3.5 py-2.5 w-full max-w-full select-none space-y-2">
      
      {/* Line 1: [☰ Hamburger] [Logo + Title] [Search + 🔔 Bell] */}
      <div className="flex items-center justify-between gap-2">
        
        {/* Left: Hamburger & View Title */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1"><button
            type="button"
            onClick={onOpenMenu}
            className="w-10 h-10 rounded-xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md hover:bg-blue-500/20 active:bg-slate-600 border border-[#94C5FF]/15 flex items-center justify-center text-blue-100 hover:text-white transition active:scale-95 shrink-0 shadow-sm"
            aria-label="Ouvrir le menu de navigation"
          ><Menu className="w-5 h-5 text-blue-400" /></button>
          {canGoBack && (
            <button
              type="button"
              onClick={goBack}
              className="w-10 h-10 rounded-xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md hover:bg-blue-500/20 active:bg-slate-600 border border-[#94C5FF]/15 flex items-center justify-center text-blue-100 hover:text-white transition active:scale-95 shrink-0 shadow-sm"
              aria-label="Retour"
            ><ArrowLeft className="w-5 h-5 text-blue-400" /></button>
          )}
          <div className="flex items-center gap-2 min-w-0 flex-1">{data?.ecoleConfig?.logo ? (
        <img src={data.ecoleConfig.logo} alt="Logo" className="w-8 h-8 object-contain shrink-0" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-700 shrink-0 shadow-sm border border-[#94C5FF]/15"><School className="w-4 h-4" /></div>
      )}<h1 className="text-sm sm:text-base font-bold text-white font-heading truncate">
              
              {getTitle()}
            </h1></div></div>
        {/* Right: Quick Search & Notification Bell */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isParentOrStudent && (
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-9 h-9 rounded-xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md border border-[#94C5FF]/15 flex items-center justify-center text-slate-700  hover:text-white hover:bg-blue-500/20 transition active:scale-95"
            title="Recherche globale (Ctrl+K)"
            aria-label="Recherche"
          ><Search className="w-4 h-4" /></button>
          )}<button
            type="button"
            onClick={() => setCurrentView("communication")}
            className="relative w-9 h-9 rounded-xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md border border-[#94C5FF]/15 flex items-center justify-center text-slate-700  hover:text-white hover:bg-blue-500/20 transition active:scale-95"
            title="Notifications & Alertes"
            aria-label="Notifications"
          ><Bell className="w-4 h-4" />
            {stats.unread_notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-[14px] border border-slate-900 animate-pulse"></span>
            )}
          </button></div></div>
      {/* Line 2: Year • Role • Public Vitrine */}
      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#94C5FF]/15 text-blue-300/70  gap-2"><div className="flex items-center gap-1.5 truncate"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/15 border border-[#94C5FF]/15 text-blue-300 font-mono text-[10px] font-bold"><span className="w-1.5 h-1.5 rounded-[14px] bg-emerald-400"></span><span>{(data?.ecoleConfig || {}).annee_courante}</span></span><span className="text-blue-300/50">•</span><span className="text-emerald-400 font-semibold truncate text-[11px]">
            
            {currentUser?.role || "Préfet des Études"}
          </span></div><button
          type="button"
          onClick={() => setCurrentView("landing")}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md hover:bg-blue-500/20 text-slate-700  hover:text-blue-300 text-[10px] font-medium transition shrink-0 border border-[#94C5FF]/15"
          title="Consulter la vitrine de l'école"
        ><Globe className="w-3 h-3 text-blue-400" /> <span>Vitrine</span></button></div></header>
  );
}
