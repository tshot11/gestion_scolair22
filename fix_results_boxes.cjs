const fs = require('fs');

let content = fs.readFileSync('src/components/views/ResultsView.jsx', 'utf8');

const tableRegex = /<div className="overflow-x-auto">[\s\S]*?<\/table>\n\s*<\/div>/;
const boxMarkup = `
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {eleves.map(e => (
            <div key={e.id} className="bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-2xl p-4 hover:bg-[#12305A]/70 transition-colors flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {e.nom.charAt(0)}{e.prenom.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{e.nom} {e.prenom}</h3>
                    <p className="text-xs text-blue-300 font-mono">{e.matricule}</p>
                  </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#94C5FF]/15">
                 <span className="text-xs font-bold text-blue-300/70">Cote (/20)</span>
                 <input 
                   type="number" 
                   min="0" max="20"
                   value={grades[e.id] || ''} 
                   onChange={evt => handleGradeChange(e.id, evt.target.value)}
                   className="w-20 bg-[#12305A]/45 border border-[#94C5FF]/30 rounded-xl px-3 py-1.5 text-white text-center font-bold focus:outline-none focus:border-blue-500"
                   placeholder="-"
                 />
              </div>
            </div>
          ))}
          {eleves.length === 0 && (
            <div className="col-span-full p-8 text-center text-blue-300/50">Aucun élève dans cette classe.</div>
          )}
        </div>
`;

content = content.replace(tableRegex, boxMarkup);
content = content.replace(/className="bg-\[\#12305A\]\/45 backdrop-blur-md border border-\[\#94C5FF\]\/15 rounded-2xl overflow-hidden"/, 'className="min-h-[300px]"');

fs.writeFileSync('src/components/views/ResultsView.jsx', content);
