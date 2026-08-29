const fs = require('fs');

let content = fs.readFileSync('src/components/views/UserManagementView.jsx', 'utf8');

const tableRegex = /<div className="overflow-x-auto">[\s\S]*?<\/table>\n\s*<\/div>/;
const boxMarkup = `
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {utilisateurs.map(u => (
            <div key={u.id} className="bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-2xl p-5 hover:bg-[#12305A]/70 transition-colors flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg shrink-0">
                    {u.nom ? u.nom.charAt(0) : '?'}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{u.nom}</h3>
                    <p className="text-xs text-blue-200">{u.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {u.is_active !== false ? 
                    <span className="inline-flex text-blue-400"><CheckCircle2 className="w-5 h-5" /></span> : 
                    <span className="inline-flex text-rose-400"><XCircle className="w-5 h-5" /></span>
                  }
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#12305A]/45 border border-[#94C5FF]/15">
                  <span className="text-blue-300/70 text-xs">Rôle</span>
                  <span className="text-blue-100 font-mono text-xs font-bold">{u.role}</span>
                </div>
                {u.role === 'TUTEUR' && u.eleve_id && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#12305A]/45 border border-[#94C5FF]/15">
                    <span className="text-blue-300/70 text-xs">Parent de</span>
                    <span className="text-blue-100 text-xs font-bold">Élève #{u.eleve_id}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#94C5FF]/15">
                <button onClick={() => handleEdit(u)} className="p-2 text-blue-300 hover:text-white hover:bg-blue-500/20 rounded-xl transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(u.id)} className="p-2 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
`;

content = content.replace(tableRegex, boxMarkup);

// Also remove the rounded-2xl overflow-hidden wrapper background to make it just a container for the grid
content = content.replace(/className="bg-\[\#12305A\]\/45 backdrop-blur-md border border-\[\#94C5FF\]\/15 rounded-2xl overflow-hidden min-h-\[300px\] relative"/, 'className="min-h-[300px] relative"');

fs.writeFileSync('src/components/views/UserManagementView.jsx', content);
