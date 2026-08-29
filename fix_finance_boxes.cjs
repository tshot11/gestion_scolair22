const fs = require('fs');

let content = fs.readFileSync('src/components/views/FinanceView.jsx', 'utf8');

const tableRegex = /<div className="overflow-x-auto">[\s\S]*?<\/table>\n\s*<\/div>/;
const boxMarkup = `
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-2xl p-5 hover:bg-[#12305A]/70 transition-colors flex flex-col justify-between group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-sm truncate max-w-[200px]">{p.eleve_nom || \`Élève ID: \${p.eleve_id}\`}</h3>
                  <p className="text-xs text-blue-300 mt-0.5">{p.date}</p>
                </div>
                <div className="bg-blue-500/20 text-blue-400 p-2 rounded-xl">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-end border-b border-[#94C5FF]/15 pb-2">
                  <span className="text-xs text-blue-300/70">Motif</span>
                  <span className="text-sm font-medium text-blue-100">{p.motif}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-blue-300/70">Montant</span>
                  <span className="text-xl font-black text-white">{p.montant} {p.devise}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-[#94C5FF]/15">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Validé
                </span>
                <button className="text-xs font-bold text-blue-300 hover:text-white flex items-center gap-1 transition-colors">
                  <FileText className="w-3.5 h-3.5" /> Reçu
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
             <div className="col-span-full p-8 text-center text-blue-300/50">Aucun paiement trouvé.</div>
          )}
        </div>
`;

content = content.replace(tableRegex, boxMarkup);
content = content.replace(/className="bg-\[\#12305A\]\/45 backdrop-blur-md border border-\[\#94C5FF\]\/15 rounded-2xl overflow-hidden"/, 'className="min-h-[300px]"');
content = content.replace(/<div className="p-4 border-b border-\[\#94C5FF\]\/15 flex items-center gap-3">/, '<div className="p-4 bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-xl flex items-center gap-3 mb-2">');

fs.writeFileSync('src/components/views/FinanceView.jsx', content);
