import React, { useState } from 'react';
import { useApp } from './context/AppContext';

// Layout Components
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { DesktopNavbar } from './components/layout/DesktopNavbar';
import { MobileHeader } from './components/layout/MobileHeader';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { MobileDrawerMenu } from './components/layout/MobileDrawerMenu';
import { CommandPalette } from './components/layout/CommandPalette';

// View Components
import { LandingPageView } from './components/views/LandingPageView';
import { LoginView } from './components/views/LoginView';
import { AccessDeniedView } from './components/views/AccessDeniedView';
import { DashboardView } from './components/views/DashboardView';
import { StudentsView } from './components/views/StudentsView';
import { StudentDetailView } from './components/views/StudentDetailView';
import { AttendanceView } from './components/views/AttendanceView';
import { FinanceView } from './components/views/FinanceView';
import { ReceiptView } from './components/views/ReceiptView';
import { BulletinView } from './components/views/BulletinView';
import { ResultsView } from './components/views/ResultsView';
import { TeachersView } from './components/views/TeachersView';
import { ClassesView } from './components/views/ClassesView';
import { CoursesView } from './components/views/CoursesView';
import { TimetableView } from './components/views/TimetableView';
import { DisciplineView } from './components/views/DisciplineView';
import { ParentsPortalView } from './components/views/ParentsPortalView';
import { CommunicationView } from './components/views/CommunicationView';
import { SettingsView } from './components/views/SettingsView';
import { UserManagementView } from './components/views/UserManagementView';

import { CheckCircle2, Smartphone, Monitor } from 'lucide-react';

export function App() {
  const { 
    currentView, 
    toastMessage, 
    isMobileSimulator, 
    setIsMobileSimulator,
    isAuthenticated,
    hasPermission
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If on Landing Page or Login View, show standalone full-width page
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
        <LandingPageView />
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
        <LoginView />
      </div>
    );
  }

  const renderView = () => {
    // Check permission
    if (!hasPermission(currentView)) {
      if (!isAuthenticated) {
        return <LoginView />;
      }
      return <AccessDeniedView requestedView={currentView} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'eleves':
        return <StudentsView />;
      case 'eleve-detail':
        return <StudentDetailView />;
      case 'presences':
        return <AttendanceView />;
      case 'finance':
        return <FinanceView />;
      case 'recu':
        return <ReceiptView />;
      case 'bulletin':
        return <BulletinView />;
      case 'palmares':
      case 'resultats':
        return <ResultsView />;
      case 'enseignants':
        return <TeachersView />;
      case 'classes':
        return <ClassesView />;
      case 'cours':
        return <CoursesView />;
      case 'horaires':
        return <TimetableView />;
      case 'discipline':
        return <DisciplineView />;
      case 'parents':
        return <ParentsPortalView />;
      case 'communication':
        return <CommunicationView />;
      case 'utilisateurs':
        return <UserManagementView />;
      case 'settings':
      case 'parametres':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Command Palette */}
      <CommandPalette />

      {/* Mobile Drawer Menu */}
      <MobileDrawerMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Mobile Simulator Mode Wrapper or Standard Responsive App */}
      {isMobileSimulator ? (
        <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6 bg-slate-950/90">
          {/* Top Bar Switcher */}
          <div className="mb-3 flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-blue-400" />
              Simulateur Mobile React Native (iPhone / Android)
            </span>
            <button
              onClick={() => setIsMobileSimulator(false)}
              className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Passer en Plein Écran Web
            </button>
          </div>

          {/* Smartphone Mockup Frame */}
          <div className="w-full max-w-[420px] h-[860px] max-h-[92vh] bg-slate-950 border-[6px] border-slate-800 rounded-[48px] shadow-2xl flex flex-col overflow-hidden relative">
            {/* Dynamic Island / Camera Notch */}
            <div className="w-28 h-5 bg-slate-900 rounded-full mx-auto mt-2 shrink-0 border border-slate-800"></div>

            {/* Mobile Header */}
            <MobileHeader onOpenMenu={() => setIsMobileMenuOpen(true)} />

            {/* Scrollable View Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar">
              {renderView()}
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav onOpenMenu={() => setIsMobileMenuOpen(true)} />

            {/* Home Indicator bar */}
            <div className="w-32 h-1 bg-slate-700/60 rounded-full mx-auto my-1.5 shrink-0"></div>
          </div>
        </div>
      ) : (
        /* Standard Responsive Layout (Full 100% width on Mobile, Sidebar + Navbar on Desktop) */
        <div className="flex-1 flex flex-row min-h-screen w-full max-w-full overflow-x-hidden">
          {/* Desktop Left Sidebar: hidden on mobile (< lg), flex on desktop (lg:flex) */}
          <DesktopSidebar />

          {/* Main Content Area: 100% width on mobile */}
          <div className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
            {/* Top Desktop Navbar */}
            <DesktopNavbar onOpenMenu={() => setIsMobileMenuOpen(true)} />
            
            {/* Top Mobile Header */}
            <MobileHeader onOpenMenu={() => setIsMobileMenuOpen(true)} />

            {/* Page View Container */}
            <main className="flex-1 overflow-y-auto w-full max-w-full overflow-x-hidden">
              {renderView()}
            </main>

            {/* Fixed Mobile Bottom Navigation */}
            <MobileBottomNav onOpenMenu={() => setIsMobileMenuOpen(true)} />
          </div>
        </div>
      )}
    </div>
  );
}

