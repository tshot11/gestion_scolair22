import React from "react";
import { useApp } from "../../context/AppContext";
import {
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
  Sparkles,
  ChevronRight,
  School,
  LogOut,
  Globe,
  Lock,
  Video,
} from "lucide-react";
export function DesktopSidebar() {
  const {
    currentView,
    setCurrentView,
    stats,
    data,
    currentUser,
    logout,
    hasPermission,
  } = useApp();

  const isStudent =
    currentUser?.role_id === "eleve" ||
    currentUser?.role === "ELEVE" ||
    currentUser?.role === "Élève";

  const isParent =
    currentUser?.role_id === "parent" ||
    currentUser?.role_id === "TUTEUR" ||
    currentUser?.role === "TUTEUR" ||
    currentUser?.role === "PARENT";

  const studentSections = [
    {
      title: "PORTAIL ÉLÈVE",
      items: [
        { id: "eleve_portal", label: "Mon Tableau de Bord", icon: Sparkles },
        { id: "bulletin", label: "Mes Notes & Bulletins", icon: Award },
        { id: "visio", label: "Visioconférence Direct", icon: Video },
        { id: "bibliotheque", label: "Bibliothèque Numérique", icon: BookOpen },
        { id: "discipline", label: "Discipline & Conduite", icon: ShieldAlert },
        { id: "communication", label: "Messagerie & Alertes", icon: MessageSquare },
      ],
    },
  ];

  const parentSections = [
    {
      title: "ESPACE PARENT",
      items: [
        { id: "parents", label: "Mes Enfants", icon: Users },
        { id: "bulletin", label: "Voir les résultats", icon: Award },
        { id: "finance", label: "Frais & Paiements", icon: Wallet },
        { id: "presences", label: "Historique Présences", icon: Fingerprint },
        { id: "discipline", label: "Dossier Disciplinaire", icon: ShieldAlert },
      ]
    },
    {
      title: "COMMUNICATION",
      items: [
        { id: "communication", label: "Messagerie & Alertes", icon: MessageSquare },
        { id: "visio", label: "Visioconférence", icon: Video },
      ]
    }
  ];

  let allSections = [];
  if (isStudent) {
    allSections = studentSections;
  } else if (isParent) {
    allSections = parentSections;
  } else {
    allSections = [
    {
      title: "PÉDAGOGIE",
      items: [
        { id: "dashboard", label: "Tableau de bord", icon: Home },
        {
          id: "eleves",
          label: "Élèves & Inscriptions",
          icon: Users,
          badge: stats.total_eleves,
        },
        {
          id: "enseignants",
          label: "Corps Enseignant",
          icon: GraduationCap,
          badge: stats.total_enseignants,
        },
        {
          id: "classes",
          label: "Classes & Salles",
          icon: BookOpen,
          badge: stats.total_classes,
        },
        {
          id: "cours",
          label: "Cours & Matières",
          icon: School,
          badge: stats.total_cours,
        },
        { id: "horaires", label: "Emploi du Temps", icon: Calendar },
      ],
    },
    {
      title: "VIE SCOLAIRE & NOTES",
      items: [
        {
          id: "presences",
          label: "Présences & Pointage",
          icon: Fingerprint,
          badge: `${stats.presenceRate}%`,
        },
        {
          id: "discipline",
          label: "Discipline & Sanctions",
          icon: ShieldAlert,
          badge:
            stats.total_incidents_actifs > 0
              ? stats.total_incidents_actifs
              : null,
          badgeColor: "bg-rose-500/20 text-rose-300",
        },
        { id: "resultats", label: "Palmarès des Cotes", icon: Award },
        { id: "bulletin", label: "Bulletins Scolaires RDC", icon: Award },
      ],
    },
    {
      title: "FINANCE & RELATIONS",
      items: [
        { id: "finance", label: "Trésorerie & Minervals", icon: Wallet },
        {
          id: "parents",
          label: "Espace Parents & Tuteurs",
          icon: HeartHandshake,
        },
        {
          id: "communication",
          label: "Messagerie & Alertes",
          icon: MessageSquare,
          badge: stats.unread_messages > 0 ? stats.unread_messages : null,
          badgeColor: "bg-blue-500/20 text-blue-300",
        },
        { id: "utilisateurs", label: "Comptes Utilisateurs", icon: Lock },
        { id: "parametres", label: "Paramètres École", icon: Settings },
      ],
    },
  ];
  }

  /* Filter sections by user permissions */
  const filteredSections = allSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => hasPermission(item.id)),
    }))
    .filter((section) => section.items.length > 0);
  return (
    <aside className="hidden lg:flex w-64 bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md border-r border-[#94C5FF]/15 flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
      
      {/* Brand Header */}
      <div><div className="p-4 border-b border-[#94C5FF]/15 flex items-center justify-between gap-3"><div className="flex items-center gap-3 min-w-0">{data?.ecoleConfig?.logo ? (
        <img src={data.ecoleConfig.logo} alt="Logo" className="w-10 h-10 object-contain shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-700 shadow-lg shrink-0 border border-[#94C5FF]/15"><School className="w-5 h-5" /></div>
      )}<div className="min-w-0"><h2 className="text-xs font-bold text-white truncate font-heading">
                
                {(data?.ecoleConfig || {}).nom}
              </h2><div className="flex items-center gap-1.5 mt-0.5"><span className="w-1.5 h-1.5 rounded-[14px] bg-emerald-400"></span><span className="text-[10px] text-blue-300/70  font-mono uppercase truncate">
                  
                  {(data?.ecoleConfig || {}).annee_courante}
                </span></div></div></div><button
            onClick={() => setCurrentView("landing")}
            className="p-1.5 rounded-lg text-blue-300/70  hover:text-white hover:bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md transition"
            title="Page d'accueil de l'école (Vitrine)"
          ><Globe className="w-4 h-4" /></button></div>
        {/* Navigation Sections */}
        <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-160px)]">
          
          {filteredSections.map((section, idx) => (
            <div key={idx}><div className="px-3 text-[10px] font-bold text-blue-300/70  uppercase tracking-widest mb-1.5">
                
                {section.title}
              </div><div className="space-y-0.5">
                
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    currentView === item.id ||
                    (item.id === "eleves" && currentView === "eleve-detail") ||
                    (item.id === "finance" && currentView === "recu") ||
                    (item.id === "resultats" && currentView === "palmares") ||
                    (item.id === "parametres" && currentView === "settings");
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${isActive ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20" : "text-blue-300/70  hover:text-blue-100 hover:bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md/70"}`}
                    ><div className="flex items-center gap-2.5 min-w-0"><Icon
                          className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-blue-300/70  group-hover:text-slate-700 "}`}
                        /><span className="truncate">{item.label}</span></div>
                      {item.badge !== undefined && item.badge !== null && (
                        <span
                          className={`px-2 py-0.5 rounded-[14px] text-[10px] font-bold ${isActive ? "bg-[#12305A]/45 text-white" : item.badgeColor || "bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md text-slate-700  border border-[#94C5FF]/15"}`}
                        >
                          
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div></div>
          ))}
        </div></div>
      {/* User Profile Card & Role Switcher */}
      <div className="p-3 border-t border-[#94C5FF]/15 bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md/90"><div className="p-2.5 rounded-2xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md border border-[#94C5FF]/15 space-y-2"><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2.5 min-w-0"><div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-[#94C5FF]/15 flex items-center justify-center font-bold text-xs shrink-0">
                
                {currentUser?.avatar || "US"}
              </div><div className="min-w-0"><div className="text-xs font-bold text-blue-100 truncate">
                  
                  {currentUser
                    ? `${currentUser.first_name} ${currentUser.last_name}`
                    : "Utilisateur"}
                </div><div className="text-[10px] text-blue-400 truncate font-medium">
                  
                  {currentUser?.role || "Session active"}
                </div></div></div></div><div className="flex items-center gap-1.5 pt-1 border-t border-[#94C5FF]/15"><button
              onClick={() => setCurrentView("login")}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-700/40 hover:bg-blue-500/20 text-[11px] text-slate-700  hover:text-white transition flex items-center justify-center gap-1"
              title="Changer de rôle ou d'utilisateur"
            ><Lock className="w-3 h-3 text-amber-400" /><span>Changer de rôle</span></button><button
              onClick={logout}
              className="p-1 rounded-lg bg-slate-700/40 hover:bg-rose-950/50 text-blue-300/70  hover:text-rose-300 transition"
              title="Se déconnecter"
            ><LogOut className="w-3.5 h-3.5" /></button></div></div></div></aside>
  );
}
