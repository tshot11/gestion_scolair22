const fs = require('fs');
let content = fs.readFileSync('src/components/layout/DesktopNavbar.jsx', 'utf8');

const isParentOrStudentDef = `  } = useApp();
  
  const isParentOrStudent = currentUser?.role_id === "parent" || currentUser?.role_id === "TUTEUR" || currentUser?.role === "TUTEUR" || currentUser?.role === "PARENT" || currentUser?.role_id === "eleve" || currentUser?.role === "ELEVE" || currentUser?.role === "Élève";
`;
content = content.replace(`  } = useApp();`, isParentOrStudentDef);

const hideSearch = `      <div className="flex items-center gap-3">
        {!isParentOrStudent && (
          <>
            {/* Command Search Bar Trigger */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md border border-[#94C5FF]/15 text-blue-300/70  hover:text-white hover:border-[#94C5FF]/15 transition w-56 text-xs shadow-inner"
            ><Search className="w-4 h-4 text-blue-300/70 " /><span className="flex-1 text-left">Recherche globale...</span><kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px] font-mono text-slate-700  border border-[#94C5FF]/15">
                
                ⌘K
              </kbd></button>
            {/* Device Switcher (Mobile vs Desktop Frame) */}
            <button
              onClick={() => setIsMobileSimulator(!isMobileSimulator)}
              className={\`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition \${isMobileSimulator ? "bg-blue-600/20 text-blue-400 border-[#94C5FF]/15 shadow-sm shadow-blue-500/20" : "bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md/70 text-slate-700  border-[#94C5FF]/15 hover:bg-blue-500/20"}\`}
              title="Basculer entre la vue smartphone et la vue plein écran web"
            >
              
              {isMobileSimulator ? (
                <><Smartphone className="w-4 h-4 text-blue-400" /><span className="hidden lg:inline">Mode Mobile</span></>
              ) : (
                <><Monitor className="w-4 h-4 text-blue-300/70 " /><span className="hidden lg:inline">Simulateur Mobile</span></>
              )}
            </button>
          </>
        )}`;
content = content.replace(/<div className="flex items-center gap-3">[\s\S]*?{isMobileSimulator \? \([\s\S]*?<><Smartphone className="w-4 h-4 text-blue-400" \/><span className="hidden lg:inline">Mode Mobile<\/span><\/>\s*\) : \(\s*<><Monitor className="w-4 h-4 text-blue-300\/70 " \/><span className="hidden lg:inline">Simulateur Mobile<\/span><\/>\s*\)}\s*<\/button>/, hideSearch);

fs.writeFileSync('src/components/layout/DesktopNavbar.jsx', content);
console.log("DesktopNavbar patched!");
