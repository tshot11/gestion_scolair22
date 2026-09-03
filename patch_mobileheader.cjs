const fs = require('fs');
let content = fs.readFileSync('src/components/layout/MobileHeader.jsx', 'utf8');

const isParentOrStudentDef = `  const {
    currentView,
    setCurrentView,
    setIsCommandPaletteOpen,
    canGoBack,
    goBack,
    stats,
    currentUser,
  } = useApp();
  
  const isParentOrStudent = currentUser?.role_id === "parent" || currentUser?.role_id === "TUTEUR" || currentUser?.role === "TUTEUR" || currentUser?.role === "PARENT" || currentUser?.role_id === "eleve" || currentUser?.role === "ELEVE" || currentUser?.role === "Élève";
`;
content = content.replace(`  const {
    currentView,
    setCurrentView,
    setIsCommandPaletteOpen,
    canGoBack,
    goBack,
    stats,
  } = useApp();`, isParentOrStudentDef);

const searchButton = `        {/* Right: Quick Search & Notification Bell */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isParentOrStudent && (
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-9 h-9 rounded-xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md border border-[#94C5FF]/15 flex items-center justify-center text-slate-700  hover:text-white hover:bg-blue-500/20 transition active:scale-95"
            title="Recherche globale (Ctrl+K)"
            aria-label="Recherche"
          ><Search className="w-4 h-4" /></button>
          )}`;

content = content.replace(`        {/* Right: Quick Search & Notification Bell */}
        <div className="flex items-center gap-1.5 shrink-0"><button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-9 h-9 rounded-xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md border border-[#94C5FF]/15 flex items-center justify-center text-slate-700  hover:text-white hover:bg-blue-500/20 transition active:scale-95"
            title="Recherche globale (Ctrl+K)"
            aria-label="Recherche"
          ><Search className="w-4 h-4" /></button>`, searchButton);

fs.writeFileSync('src/components/layout/MobileHeader.jsx', content);
console.log("MobileHeader patched!");
