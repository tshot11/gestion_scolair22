import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Video,
  X,
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Fingerprint,
  ShieldAlert,
  Award,
  Wallet,
  HeartHandshake,
  MessageSquare,
  Settings,
  ChevronRight,
  LogOut,
  Lock,
  Globe,
  School,
} from "lucide-react";
export function MobileDrawerMenu({ isOpen, onClose }) {
  const {
    currentView,
    setCurrentView,
    stats,
    data,
    currentUser,
    logout,
    hasPermission,
  } = useApp();
  if (!isOpen) return null;

  const isStudent =
    currentUser?.role_id === "eleve" ||
    currentUser?.role === "ELEVE" ||
    currentUser?.role === "Élève";

  const isParent =
    currentUser?.role_id === "parent" ||
    currentUser?.role_id === "TUTEUR" ||
    currentUser?.role === "TUTEUR" ||
    currentUser?.role === "PARENT";

  const studentMenuSections = [
    {
      category: "PORTAIL ÉLÈVE",
      items: [
        { id: "eleve_portal", label: "Mon Tableau de Bord", icon: Home, count: null },
        { id: "bulletin", label: "Mes Notes & Bulletins", icon: Award, count: null },
        { id: "visio", label: "Visioconférence Direct", icon: Video, count: null },
        { id: "bibliotheque", label: "Bibliothèque Scolaire", icon: BookOpen, count: null },
        { id: "discipline", label: "Discipline & Conduite", icon: ShieldAlert, count: null },
        { id: "communication", label: "Messagerie & Alertes", icon: MessageSquare, count: null },
      ],
    },
  ];

  const parentMenuSections = [
    {
      category: "ESPACE PARENT",
      items: [
        { id: "parents", label: "Mes Enfants", icon: Users, count: null },
        { id: "bulletin", label: "Voir les résultats", icon: Award, count: null },
        { id: "recu", label: "Frais & Paiements", icon: Wallet, count: null },
        { id: "presences", label: "Historique Présences", icon: Fingerprint, count: null },
        { id: "discipline", label: "Dossier Disciplinaire", icon: ShieldAlert, count: null },
      ],
    },
    {
      category: "COMMUNICATION",
      items: [
        { id: "communication", label: "Messagerie & Alertes", icon: MessageSquare, count: null },
        { id: "visio", label: "Visioconférence", icon: Video, count: null },
      ],
    },
  ];

  let menuSections = [];
  if (isStudent) {
    menuSections = studentMenuSections;
  } else if (isParent) {
    menuSections = parentMenuSections;
  } else {
    menuSections = [
    {
      category: "PÉDAGOGIE",
      items: [
        { id: "dashboard", label: "Tableau de bord", icon: Home, count: null },
        {
          id: "eleves",
          label: "Élèves & Inscriptions",
          icon: Users,
          count: stats.total_eleves,
        },
        {
          id: "enseignants",
          label: "Corps Enseignant",
          icon: GraduationCap,
          count: stats.total_enseignants,
        },
        {
          id: "classes",
          label: "Classes & Salles",
          icon: BookOpen,
          count: stats.total_classes,
        },
        {
          id: "cours",
          label: "Cours & Matières",
          icon: School,
          count: stats.total_cours,
        },
        {
          id: "horaires",
          label: "Emploi du Temps",
          icon: Calendar,
          count: null,
        },
      ],
    },
    {
      category: "VIE SCOLAIRE & NOTES",
      items: [
        {
          id: "presences",
          label: "Pointage & Présences",
          icon: Fingerprint,
          count: `${stats.presenceRate}%`,
        },
        {
          id: "discipline",
          label: "Discipline & Sanctions",
          icon: ShieldAlert,
          count:
            stats.total_incidents_actifs > 0
              ? stats.total_incidents_actifs
              : null,
          badgeColor: "bg-rose-500/20 text-rose-300",
        },
        {
          id: "resultats",
          label: "Palmarès des Cotes",
          icon: Award,
          count: null,
        },
        {
          id: "bulletin",
          label: "Bulletins Scolaires RDC",
          icon: Award,
          count: null,
        },
      ],
    },
    {
      category: "FINANCES & RELATIONS",
      items: [
        {
          id: "finance",
          label: "Trésorerie & Minervals",
          icon: Wallet,
          count: `${(stats.solde_caisse / 1000).toFixed(0)}k CDF`,
        },
        {
          id: "parents",
          label: "Espace Parents & Tuteurs",
          icon: HeartHandshake,
          count: null,
        },
        { id: "visio", label: "Visioconférence", icon: Video, count: null },
        {
          id: "bibliotheque",
          label: "Bibliothèque",
          icon: BookOpen,
          count: null,
        },
        {
          id: "communication",
          label: "Messagerie & Alertes",
          icon: MessageSquare,
          count: stats.unread_messages > 0 ? stats.unread_messages : null,
          badgeColor: "bg-blue-500/20 text-blue-300",
        },
        {
          id: "utilisateurs",
          label: "Comptes Utilisateurs",
          icon: Lock,
          count: null,
        },
        {
          id: "parametres",
          label: "Configuration École",
          icon: Settings,
          count: null,
        },
      ],
    },
  ];
  }

  /* Filter sections by permissions */
  const filteredSections = menuSections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter((item) => hasPermission(item.id)),
    }))
    .filter((sec) => sec.items.length > 0);
  const handleNavigate = (viewId) => {
    setCurrentView(viewId);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex">
      
      {/* Dark Overlay Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />
      {/* Slide-over Mobile Drawer Sidebar */}
      <div className="relative z-50 w-[85%] max-w-xs bg-[#12305A]/45 backdrop-blur-md border-r border-[#94C5FF]/15 shadow-2xl flex flex-col justify-between h-full overflow-hidden animate-in slide-in-from-left duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#94C5FF]/15 flex items-center justify-between gap-3 bg-[#12305A]/45 backdrop-blur-md shrink-0"><div className="flex items-center gap-3 min-w-0 flex-1">{data?.ecoleConfig?.logo ? (
        <img src={data.ecoleConfig.logo} alt="Logo" className="w-10 h-10 object-contain shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-700 shadow-md shrink-0 border border-[#94C5FF]/15"><School className="w-5 h-5" /></div>
      )}<div className="min-w-0 flex-1"><h2 className="text-xs sm:text-sm font-bold text-white font-heading truncate">
                
                {(data?.ecoleConfig || {}).nom}
              </h2><div className="flex items-center gap-1.5 mt-0.5"><span className="w-1.5 h-1.5 rounded-[14px] bg-emerald-400"></span><span className="text-[10px] text-blue-300/70  font-mono uppercase truncate">
                  
                  {(data?.ecoleConfig || {}).annee_courante}
                </span><span className="text-blue-300/50">•</span><span className="text-[10px] text-blue-400 font-semibold truncate">
                  
                  {currentUser?.role || "Préfet"}
                </span></div></div></div>
          {/* Close Button X */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 flex items-center justify-center text-blue-300/70  hover:text-white transition shrink-0 active:scale-95"
            aria-label="Fermer le menu"
          ><X className="w-4 h-4" /></button></div>
        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          
          {/* Vitrine & Role Switcher */}
          <div className="grid grid-cols-2 gap-2"><button
              type="button"
              onClick={() => handleNavigate("landing")}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md border border-[#94C5FF]/15 text-xs font-semibold text-slate-700  hover:text-white transition"
            ><Globe className="w-3.5 h-3.5 text-blue-400" /><span>Vitrine</span></button><button
              type="button"
              onClick={() => handleNavigate("login")}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md border border-[#94C5FF]/15 text-xs font-semibold text-amber-300 hover:text-amber-200 transition"
            ><Lock className="w-3.5 h-3.5 text-amber-400" /><span>Rôles</span></button></div>
          {/* Section categories */}
          {filteredSections.map((sec, idx) => (
            <div key={idx} className="space-y-1"><h3 className="text-[10px] font-bold uppercase tracking-wider text-blue-300/70  px-2.5">
                
                {sec.category}
              </h3><div className="space-y-0.5">
                
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    currentView === item.id ||
                    (item.id === "eleves" && currentView === "eleve-detail") ||
                    (item.id === "finance" && currentView === "recu") ||
                    (item.id === "resultats" && currentView === "palmares") ||
                    (item.id === "parametres" && currentView === "settings");
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition active:scale-[0.98] ${isActive ? "bg-blue-600/20 text-blue-400 border border-[#94C5FF]/15 font-semibold" : "bg-transparent text-slate-700  hover:bg-[#12305A]/45 backdrop-blur-md hover:text-white"}`}
                    ><div className="flex items-center gap-2.5 min-w-0"><div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-blue-500/30 text-blue-400" : "bg-[#12305A]/45 text-blue-300/70 "}`}
                        ><Icon className="w-3.5 h-3.5" /></div><span className="text-xs font-medium truncate">
                          {item.label}
                        </span></div><div className="flex items-center gap-1.5 shrink-0 ml-2">
                        
                        {item.count && (
                          <span
                            className={`px-2 py-0.5 rounded-[14px] text-[10px] font-bold ${item.badgeColor || "bg-[#12305A]/45 text-slate-700  border border-[#94C5FF]/15"}`}
                          >
                            
                            {item.count}
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-blue-300/50 " /></div></button>
                  );
                })}
              </div></div>
          ))}
        </div>
        {/* Footer with User info & Logout */}
        <div className="p-3 border-t border-[#94C5FF]/15 bg-[#0B1736]/80 shrink-0 safe-bottom"><div className="flex items-center justify-between"><div className="min-w-0 flex-1 pr-2"><div className="text-xs font-bold text-white truncate">
                
                {currentUser?.first_name} {currentUser?.last_name}
              </div><div className="text-[10px] text-blue-300/70  truncate font-mono">
                
                {currentUser?.email || "admin@ecole.cd"}
              </div></div><button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 py-1.5 px-2.5 rounded-xl hover:bg-rose-950/40 border border-rose-500/20 transition font-semibold shrink-0"
              title="Se déconnecter"
            ><LogOut className="w-3.5 h-3.5" /> <span>Quitter</span></button></div></div></div></div>
  );
}
