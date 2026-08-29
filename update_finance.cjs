const fs = require('fs');

let content = fs.readFileSync('src/components/views/FinanceView.jsx', 'utf8');

if (!content.includes('isPaymentModalOpen')) {
  // Add state
  content = content.replace(/const \[search, setSearch\] = useState\(""\);/, 'const [search, setSearch] = useState("");\n  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);\n  const [paymentMethod, setPaymentMethod] = useState("");');

  // Add click handler
  content = content.replace(/<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition">/, 
    '<button onClick={() => setIsPaymentModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition">');

  // Add Modal
  const modalHTML = `
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B1736] border border-[#94C5FF]/15 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-[#94C5FF]/15 flex justify-between items-center">
              <h2 className="font-bold text-white">Effectuer un Paiement</h2>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-blue-300 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-blue-300 mb-2 block">Méthode de Paiement</label>
                <div className="grid grid-cols-2 gap-2">
                  {['M-Pesa', 'Airtel Money', 'Orange Money', 'Afrimoney', 'Carte Bancaire'].map(m => (
                    <button key={m} type="button" onClick={() => setPaymentMethod(m)} className={\`p-3 rounded-xl border text-sm font-bold transition \${paymentMethod === m ? "bg-blue-600 border-blue-500 text-white" : "bg-[#12305A]/45 border-[#94C5FF]/15 text-blue-300 hover:bg-blue-500/20"}\`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              {paymentMethod && (
                <form onSubmit={(e) => { e.preventDefault(); setIsPaymentModalOpen(false); alert("Redirection vers la passerelle de paiement..."); }} className="space-y-4 pt-4 border-t border-[#94C5FF]/15">
                   <div>
                     <label className="text-xs font-bold text-blue-300 block mb-1">Montant (USD)</label>
                     <input type="number" required className="w-full bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-xl px-4 py-2 text-white" />
                   </div>
                   <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">
                     Payer avec {paymentMethod}
                   </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
  `;
  
  // Need to import X if not there
  if (!content.includes('X, ')) {
    content = content.replace(/import { Search, Plus/, 'import { Search, Plus, X');
  }

  content = content.replace(/return \(/, `return (\n    <>\n${modalHTML}`);
  content = content.replace(/}\s*;\s*$/, '    </>\n  );\n}');

  fs.writeFileSync('src/components/views/FinanceView.jsx', content);
}
