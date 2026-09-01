const fs = require('fs');
let content = fs.readFileSync('src/components/views/DisciplineView.jsx', 'utf8');

const replacement = `  const {
    data,
    addIncident,
    closeIncident,
    setCurrentView,
    setSelectedEleveId,
    currentUser,
  } = useApp();
  
  const isParent = currentUser?.role_id === "parent" || currentUser?.role_id === "TUTEUR" || currentUser?.role === "TUTEUR" || currentUser?.role === "PARENT";
  
  let incidentsToDisplay = data?.incidents || [];
  
  if (isParent) {
    const parentChildrenIds = (data?.eleves || [])
      .filter((e) => e.email_tuteur === currentUser.email || e.id === currentUser.eleve_id)
      .map(e => e.id);
      
    incidentsToDisplay = incidentsToDisplay.filter(inc => parentChildrenIds.includes(inc.eleve_id));
  }
`;

content = content.replace(`  const {
    data,
    addIncident,
    closeIncident,
    setCurrentView,
    setSelectedEleveId,
  } = useApp();`, replacement);

content = content.replace(`{(data?.incidents || []).map((inc) => {`, `{incidentsToDisplay.map((inc) => {`);

const buttonReplacement = `</div>{ !isParent && <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition active:scale-95"
        ><Plus className="w-4 h-4" /> Consigner un Incident
        </button>}</div>`;

content = content.replace(`</div><button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition active:scale-95"
        ><Plus className="w-4 h-4" /> Consigner un Incident
        </button></div>`, buttonReplacement);

const closeReplacement = `                {!isClosed && !isParent ? (
                  <button
                    onClick={() => closeIncident(inc.id)}
                    className="px-3 py-1 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white font-semibold transition border border-blue-500/30"
                  >
                    
                    Clôturer dossier
                  </button>
                ) : isClosed ? (
                  <span className="text-blue-400 font-mono text-[10px]">
                    Clôturé le {inc.date_cloture}
                  </span>
                ) : <span className="text-rose-400 font-mono text-[10px]">Dossier Actif</span>}
              </div></div>`;
              
content = content.replace(`                {!isClosed ? (
                  <button
                    onClick={() => closeIncident(inc.id)}
                    className="px-3 py-1 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white font-semibold transition border border-blue-500/30"
                  >
                    
                    Clôturer dossier
                  </button>
                ) : (
                  <span className="text-blue-400 font-mono text-[10px]">
                    Clôturé le {inc.date_cloture}
                  </span>
                )}
              </div></div>`, closeReplacement);
              
const noIncidents = `{incidentsToDisplay.length === 0 && (
          <div className="col-span-full p-10 text-center text-blue-300/50 bg-[#12305A]/30 rounded-2xl border border-[#94C5FF]/10 flex flex-col items-center gap-3">
            <ShieldAlert className="w-10 h-10 opacity-30" />
            <p>Aucun dossier disciplinaire disponible.</p>
          </div>
        )}`;
content = content.replace(`{incidentsToDisplay.map((inc) => {`, noIncidents + '\n        {incidentsToDisplay.map((inc) => {');

const headerReplace = `        <div><h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
            
            {isParent ? "Dossier Disciplinaire" : "Discipline & Registre des Sanctions"}
          </h2><p className="text-xs sm:text-sm text-blue-300/70">
            
            {isParent ? "Historique de conduite de votre enfant." : "Suivi des conduites scolaires, avertissements et décisions du conseil"}
          </p></div>`;

content = content.replace(`<div><h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
            
            Discipline & Registre des Sanctions
          </h2><p className="text-xs sm:text-sm text-blue-300/70">
            
            Suivi des conduites scolaires, avertissements et décisions du
            conseil
          </p></div>`, headerReplace);

fs.writeFileSync('src/components/views/DisciplineView.jsx', content);
console.log("DisciplineView patched!");
