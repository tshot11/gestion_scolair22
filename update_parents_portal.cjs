const fs = require('fs');

let content = fs.readFileSync('src/components/views/ParentsPortalView.jsx', 'utf8');

// Add Visio and Discipline button to Quick Actions
const quickActions = `
            <button
              onClick={() => {
                setSelectedEleveId(eleve.id);
                setCurrentView("bulletin");
              }}
              className="bg-[#12305A]/45 backdrop-blur-md hover:bg-blue-500/20 border border-[#94C5FF]/15 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-200">
                Voir le Bulletin
              </span>
            </button>

            <button
              onClick={() => {
                setSelectedEleveId(eleve.id);
                setCurrentView("recu");
              }}
              className="bg-[#12305A]/45 backdrop-blur-md hover:bg-blue-500/20 border border-[#94C5FF]/15 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-200">
                Paiements & Reçus
              </span>
            </button>

            <button
              onClick={() => {
                setSelectedEleveId(eleve.id);
                setCurrentView("discipline");
              }}
              className="bg-[#12305A]/45 backdrop-blur-md hover:bg-blue-500/20 border border-[#94C5FF]/15 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-200">
                Discipline
              </span>
            </button>
`;

content = content.replace(/<button[^>]*>[^<]*<div[^>]*>[^<]*<Award[^>]*><\/div>[^<]*<span[^>]*>[^<]*Voir le Bulletin[^<]*<\/span><\/button>/g, '');
content = content.replace(/<button[^>]*>[^<]*<div[^>]*>[^<]*<Wallet[^>]*><\/div>[^<]*<span[^>]*>[^<]*Paiements & Reçus[^<]*<\/span><\/button>/g, quickActions);

// In Forum, add Visio button
content = content.replace(/<div className="bg-blue-500\/20 text-blue-300 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">/, 
  '<button onClick={() => setCurrentView("visio")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold mr-4">Rejoindre la Vidéoconférence</button><div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">');

fs.writeFileSync('src/components/views/ParentsPortalView.jsx', content);
