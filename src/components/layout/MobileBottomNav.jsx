import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Users, 
  Fingerprint, 
  Wallet, 
  Menu, 
  Award, 
  BookOpen, 
  HeartHandshake 
} from 'lucide-react';

export function MobileBottomNav({ onOpenMenu }) {
  const { currentView, setCurrentView, stats, currentUser, hasPermission } = useApp();

  // Role-adapted bottom items
  let navItems = [];

  if (currentUser?.role_id === 'parent') {
    navItems = [
      { id: 'parents', label: 'Mon Espace', icon: HeartHandshake },
      { id: 'bulletin', label: 'Bulletin', icon: Award },
      { id: 'recu', label: 'Quittances', icon: Wallet },
      { id: 'more', label: 'Menu', icon: Menu, action: onOpenMenu }
    ];
  } else if (currentUser?.role_id === 'enseignant') {
    navItems = [
      { id: 'resultats', label: 'Palmarès', icon: Award },
      { id: 'presences', label: 'Présences', icon: Fingerprint, badge: `${stats.presenceRate}%` },
      { id: 'bulletin', label: 'Bulletins', icon: BookOpen },
      { id: 'more', label: 'Menu', icon: Menu, action: onOpenMenu }
    ];
  } else if (currentUser?.role_id === 'comptable') {
    navItems = [
      { id: 'finance', label: 'Trésorerie', icon: Wallet },
      { id: 'recu', label: 'Quittances', icon: BookOpen },
      { id: 'eleves', label: 'Élèves', icon: Users, badge: stats.total_eleves },
      { id: 'more', label: 'Menu', icon: Menu, action: onOpenMenu }
    ];
  } else {
    // Admin / Default
    navItems = [
      { id: 'dashboard', label: 'Accueil', icon: Home },
      { id: 'eleves', label: 'Élèves', icon: Users, badge: stats.total_eleves },
      { id: 'presences', label: 'Présences', icon: Fingerprint, badge: `${stats.presenceRate}%` },
      { id: 'finance', label: 'Finances', icon: Wallet },
      { id: 'more', label: 'Menu', icon: Menu, action: onOpenMenu }
    ];
  }

  // Filter items by permission except action menu
  const accessibleItems = navItems.filter(item => item.action || hasPermission(item.id));

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800/90 px-1.5 py-1 safe-bottom select-none">
      <div className="flex items-center justify-around w-full max-w-md mx-auto">
        {accessibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || 
            (item.id === 'eleves' && currentView === 'eleve-detail') || 
            (item.id === 'finance' && currentView === 'recu') ||
            (item.id === 'resultats' && currentView === 'palmares');
          
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
              className={`relative flex flex-col items-center justify-center min-h-[46px] min-w-[56px] px-1 py-1 rounded-xl transition-all duration-200 active:scale-90 ${
                isActive 
                  ? 'text-blue-400 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={item.label}
            >
              {/* Active Indicator Top Dot */}
              {isActive && (
                <span className="absolute top-0.5 w-6 h-0.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/80"></span>
              )}
              
              <div className="relative mt-0.5">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2] text-blue-400' : 'stroke-[1.8]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2.5 px-1 py-0.2 rounded-full text-[8px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight whitespace-nowrap ${isActive ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
