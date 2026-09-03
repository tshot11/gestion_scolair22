const fs = require('fs');
let content = fs.readFileSync('src/components/views/ParentsPortalView.jsx', 'utf8');

const importAdd = `import { AnimatedStudentCard } from "../ui";
import { Video } from "lucide-react";`;
content = content.replace(`import { AnimatedStudentCard } from "../ui";`, importAdd);

const activeMeetingCode = `  const {
    data,
    getEleveDetail,
    setCurrentView,
    setSelectedEleveId,
    showToast,
    currentUser,
  } = useApp();

  const activeMeetings = data?.activeMeetings || [];
`;
content = content.replace(`  const {
    data,
    getEleveDetail,
    setCurrentView,
    setSelectedEleveId,
    showToast,
    currentUser,
  } = useApp();`, activeMeetingCode);

const bannerCode = `      {/* Header section with Child Selector */}
      
      {activeMeetings.length > 0 && (
         <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:bg-emerald-500/20 transition group" onClick={() => setCurrentView("visio")}>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse shrink-0">
                  <Video className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="text-white font-bold text-sm">Une réunion vidéo est en cours !</h3>
                  <p className="text-xs text-emerald-200/70">Cliquez ici pour rejoindre la salle de visioconférence.</p>
               </div>
            </div>
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-500/20 whitespace-nowrap">
               Rejoindre
            </button>
         </div>
      )}
`;
content = content.replace(`      {/* Header section with Child Selector */}`, bannerCode);

fs.writeFileSync('src/components/views/ParentsPortalView.jsx', content);
console.log("ParentsPortalView patched for active meetings!");
