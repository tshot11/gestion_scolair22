import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Home,
  Users,
  Fingerprint,
  Wallet,
  Menu,
  Award,
  BookOpen,
  HeartHandshake,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export function MobileBottomNav({ onOpenMenu }) {
  const { currentView, setCurrentView, stats, currentUser, hasPermission } =
    useApp();
  let navItems = [];
  if (currentUser?.role_id === "eleve" || currentUser?.role === "ELEVE" || currentUser?.role === "Élève") {
    navItems = [
      { id: "eleve_portal", label: "Portail", icon: Home },
      { id: "bulletin", label: "Bulletins", icon: Award },
      { id: "visio", label: "Visio", icon: BookOpen },
      { id: "bibliotheque", label: "Livres", icon: BookOpen },
      { id: "more", label: "Menu", icon: Menu, action: onOpenMenu },
    ];
  } else if (currentUser?.role_id === "parent") {
    navItems = [
      { id: "parents", label: "Mon Espace", icon: HeartHandshake },
      { id: "bulletin", label: "Bulletin", icon: Award },
      { id: "recu", label: "Quittances", icon: Wallet },
      { id: "more", label: "Menu", icon: Menu, action: onOpenMenu },
    ];
  } else if (currentUser?.role_id === "enseignant") {
    navItems = [
      { id: "resultats", label: "Palmarès", icon: Award },
      {
        id: "presences",
        label: "Présences",
        icon: Fingerprint,
        badge: `${stats.presenceRate}%`,
      },
      { id: "bulletin", label: "Bulletins", icon: BookOpen },
      { id: "more", label: "Menu", icon: Menu, action: onOpenMenu },
    ];
  } else if (currentUser?.role_id === "comptable") {
    navItems = [
      { id: "finance", label: "Trésorerie", icon: Wallet },
      { id: "recu", label: "Quittances", icon: BookOpen },
      { id: "eleves", label: "Élèves", icon: Users, badge: stats.total_eleves },
      { id: "more", label: "Menu", icon: Menu, action: onOpenMenu },
    ];
  } else {
    navItems = [
      { id: "dashboard", label: "Accueil", icon: Home },
      { id: "eleves", label: "Élèves", icon: Users, badge: stats.total_eleves },
      {
        id: "presences",
        label: "Présences",
        icon: Fingerprint,
        badge: `${stats.presenceRate}%`,
      },
      { id: "finance", label: "Finances", icon: Wallet },
      { id: "more", label: "Menu", icon: Menu, action: onOpenMenu },
    ];
  }
  const accessibleItems = navItems.filter(
    (item) => item.action || hasPermission(item.id),
  ); /* Fix active item matching to group correctly */
  const getActiveId = () => {
    if (currentView === "eleves" || currentView === "eleve-detail")
      return "eleves";
    if (currentView === "finance" || currentView === "recu")
      return currentUser?.role_id === "comptable" ? "finance" : "finance";
    if (currentView === "resultats" || currentView === "palmares")
      return "resultats";
    return currentView;
  };
  const activeId = getActiveId();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#12305A]/45 backdrop-blur-2xl border-t border-[#94C5FF]/15 pb-safe shadow-[0_-8px_32px_rgba(0,0,0,0.05)] select-none"><div className="flex items-center justify-around w-full max-w-md mx-auto px-2 py-2">
        
        {accessibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  setCurrentView(item.id);
                }
              }}
              className={`relative flex flex-col items-center justify-center min-h-[50px] min-w-[60px] rounded-2xl transition-all duration-300 z-10 ${isActive ? "text-emerald-600" : "text-blue-300/70 hover:text-blue-100"}`}
              aria-label={item.label}
            >
              
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-blue-600/10 rounded-2xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative"><Icon
                  className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"}`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 px-1 py-[1px] rounded-[14px] text-[9px] font-bold bg-red-500 text-white shadow-sm">
                    
                    {item.badge}
                  </span>
                )}
              </div><span
                className={`text-[10px] mt-1 tracking-tight font-medium transition-all duration-300 ${isActive ? "opacity-100 translate-y-0" : "opacity-80 translate-y-0.5"}`}
              >
                
                {item.label}
              </span></button>
          );
        })}
      </div></nav>
  );
}
