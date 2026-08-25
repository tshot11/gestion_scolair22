import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus, CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, FileText, CheckCircle2 } from 'lucide-react';

export function FinanceView() {
  const { data } = useApp();
  const [search, setSearch] = useState("");
  
  const paiements = data?.paiements || [];
  
  const filtered = paiements.filter(p => 
    p.motif.toLowerCase().includes(search.toLowerCase()) || 
    p.eleve_nom?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 min-h-screen text-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-blue-400" />
            Finances & Comptabilité
          </h1>
          <p className="text-sm text-blue-200/70 mt-1">Gestion des paiements, frais scolaires et trésorerie.</p>
        </div>
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-slate-900 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all">
          <Plus className="w-4 h-4" /> Enregistrer un paiement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 p-5 rounded-2xl">
          <div className="text-blue-300 text-sm font-semibold mb-2">Total Encaissé</div>
          <div className="text-3xl font-black text-white">45,500 <span className="text-lg text-blue-300/50">USD</span></div>
        </div>
        <div className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 p-5 rounded-2xl">
          <div className="text-blue-300 text-sm font-semibold mb-2">Restes à recouvrer</div>
          <div className="text-3xl font-black text-white">12,200 <span className="text-lg text-blue-300/50">USD</span></div>
        </div>
        <div className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 p-5 rounded-2xl">
          <div className="text-blue-300 text-sm font-semibold mb-2">Dépenses (Mois)</div>
          <div className="text-3xl font-black text-white">8,400 <span className="text-lg text-blue-300/50">USD</span></div>
        </div>
      </div>

      <div className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#94C5FF]/15 flex items-center gap-3">
          <Search className="w-4 h-4 text-blue-300/50" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un paiement..." className="bg-transparent border-none text-white text-sm focus:outline-none flex-1" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-500/10 border-b border-[#94C5FF]/15 text-blue-300/70 text-xs uppercase">
                <th className="p-4">Date</th>
                <th className="p-4">Élève</th>
                <th className="p-4">Motif</th>
                <th className="p-4 text-right">Montant</th>
                <th className="p-4 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#94C5FF]/10 text-sm">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-blue-500/10 transition-colors">
                  <td className="p-4 text-blue-200">{p.date}</td>
                  <td className="p-4 text-white font-medium">{p.eleve_nom || `Élève ID: ${p.eleve_id}`}</td>
                  <td className="p-4 text-blue-200">{p.motif}</td>
                  <td className="p-4 text-right text-white font-bold">{p.montant} {p.devise}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Validé
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-blue-300/50">Aucun paiement trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
