const fs = require('fs');
let content = fs.readFileSync('src/components/views/FinanceView.jsx', 'utf8');

const replacement = `  const { data, currentUser } = useApp();
  const [search, setSearch] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  
  const isParent = currentUser?.role_id === "parent" || currentUser?.role_id === "TUTEUR" || currentUser?.role === "TUTEUR" || currentUser?.role === "PARENT";
  
  const paiements = data?.paiements || [];
  
  let filtered = paiements;
  
  if (isParent) {
    const parentChildrenIds = (data?.eleves || [])
      .filter((e) => e.email_tuteur === currentUser.email || e.id === currentUser.eleve_id)
      .map(e => e.id);
    filtered = paiements.filter(p => parentChildrenIds.includes(p.eleve_id));
  } else {
    filtered = paiements.filter(p => 
       (p.motif || "").toLowerCase().includes(search.toLowerCase()) || 
       (p.eleve_nom || "").toLowerCase().includes(search.toLowerCase())
    );
  }

  if (isParent) {
    return (
      <>
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
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 min-h-screen text-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-blue-400" />
            Finances de mon enfant
          </h1>
          <p className="text-sm text-blue-200/70 mt-1">Consultez l'état des paiements et réglez les frais scolaires.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
           <div className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 p-5 rounded-2xl flex flex-col justify-center">
             <div className="text-blue-300 text-sm font-semibold mb-2">Total Déjà Payé</div>
             <div className="text-3xl font-black text-white">{filtered.reduce((sum, p) => sum + p.montant, 0)} <span className="text-lg text-blue-300/50">USD</span></div>
           </div>
           <div className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 p-5 rounded-2xl flex flex-col justify-center items-start">
             <div className="text-blue-300 text-sm font-semibold mb-2">Paiement Rapide</div>
             <button onClick={() => setIsPaymentModalOpen(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all">
                <Plus className="w-4 h-4" /> Payer maintenant
             </button>
           </div>
        </div>

        <h2 className="text-lg font-bold text-white mb-4 border-b border-[#94C5FF]/15 pb-2">Historique des Paiements</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-2xl p-5 hover:bg-[#12305A]/70 transition-colors flex flex-col justify-between group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-sm truncate max-w-[200px]">{p.motif}</h3>
                  <p className="text-xs text-blue-300 mt-0.5">{p.date}</p>
                </div>
                <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
                            
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-blue-300/70">Montant</span>
                  <span className="text-xl font-black text-white">{p.montant} {p.devise}</span>
                </div>
              </div>
                            
              <div className="flex items-center justify-between pt-3 border-t border-[#94C5FF]/15">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Payé
                </span>
                <button className="text-xs font-bold text-blue-300 hover:text-white flex items-center gap-1 transition-colors">
                  <FileText className="w-3.5 h-3.5" /> Reçu
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
             <div className="col-span-full p-8 text-center bg-[#0B1736]/40 rounded-xl border border-[#94C5FF]/10 text-blue-300/50">Aucun paiement effectué.</div>
          )}
        </div>
      </div>
      </>
    );
  }
`;

content = content.replace(`  const { data } = useApp();
  const [search, setSearch] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  
  const paiements = data?.paiements || [];
  
  const filtered = paiements.filter(p => 
     (p.motif || "").toLowerCase().includes(search.toLowerCase()) || 
     (p.eleve_nom || "").toLowerCase().includes(search.toLowerCase())
  );`, replacement);

fs.writeFileSync('src/components/views/FinanceView.jsx', content);
console.log("FinanceView patched!");
