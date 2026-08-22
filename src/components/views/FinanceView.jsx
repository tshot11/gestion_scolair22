import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Printer, 
  X, 
  CheckCircle2,
  FileText
} from 'lucide-react';

export function FinanceView() {
  const { 
    data, 
    stats, 
    setCurrentView, 
    setSelectedPaiementId, 
    addPaiement, 
    addDepense 
  } = useApp();

  const [activeTab, setActiveTab] = useState('paiements'); // paiements | depenses
  const [search, setSearch] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Form state for payment
  const [paymentForm, setPaymentForm] = useState({
    eleve_id: data.eleves[0]?.id || 1,
    frais_id: 3, // Minerval 3ème Trimestre
    montant_paye: 150000,
    mode: 'Espèces (Caisse)'
  });

  // Form state for expense
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    montant: 50000,
    categorie: 'Fournitures scolaires',
    justificatif: 'Facture'
  });

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const created = addPaiement(paymentForm);
    setIsPaymentModalOpen(false);
    setSelectedPaiementId(created.id);
    setCurrentView('recu');
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseForm.description) return;
    addDepense(expenseForm);
    setIsExpenseModalOpen(false);
  };

  // Filtered Payments
  const filteredPayments = data.paiements.filter(p => {
    const eleve = data.eleves.find(e => e.id === p.eleve_id);
    const text = `${p.reference} ${p.mode} ${eleve ? `${eleve.nom} ${eleve.prenom}` : ''}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  // Filtered Expenses
  const filteredExpenses = data.depenses.filter(d => {
    return `${d.description} ${d.categorie} ${d.justificatif}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
            Trésorerie & Caisse Centrale
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Gestion financière des minervals, droits d'examens et dépenses de fonctionnement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Encaisser Frais
          </button>

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition active:scale-95"
          >
            <TrendingDown className="w-4 h-4 text-rose-400" />
            Engager Dépense
          </button>
        </div>
      </div>

      {/* 3 Financial Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Recouvrement */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Recouvrement Global</span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-heading mt-1 font-mono">
              {stats.total_recouvrement.toLocaleString('fr-FR')} <span className="text-xs font-normal">CDF</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              ≈ ${(stats.total_recouvrement / data.ecoleConfig.taux_change_usd).toFixed(1)} USD
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Dépenses */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Dépenses & Charges</span>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-400 font-heading mt-1 font-mono">
              {stats.total_depenses.toLocaleString('fr-FR')} <span className="text-xs font-normal">CDF</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {data.depenses.length} bons de caisse engagés
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* Solde Caisse */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/40 flex items-center justify-between shadow-lg shadow-blue-500/10">
          <div>
            <span className="text-xs text-blue-300 font-medium">Solde Net en Caisse</span>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-heading mt-1 font-mono">
              {stats.solde_caisse.toLocaleString('fr-FR')} <span className="text-xs font-normal text-blue-300">CDF</span>
            </div>
            <span className="text-[11px] text-blue-200 font-semibold mt-1 block">
              Taux: 1 USD = {data.ecoleConfig.taux_change_usd} CDF
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-500/25 text-blue-400 flex items-center justify-center border border-blue-400/40">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-slate-800/40 rounded-3xl border border-slate-700/60 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('paiements')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'paiements'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Encaissements ({filteredPayments.length})
            </button>
            <button
              onClick={() => setActiveTab('depenses')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'depenses'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Dépenses ({filteredExpenses.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par réf, élève..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tab 1: Payments Table */}
        {activeTab === 'paiements' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
                <tr>
                  <th className="p-3">Référence & Date</th>
                  <th className="p-3">Élève & Classe</th>
                  <th className="p-3">Libellé Frais</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3 text-right">Montant (CDF)</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredPayments.map((p) => {
                  const eleve = data.eleves.find(e => e.id === p.eleve_id);
                  const classe = eleve ? data.classes.find(c => c.id === eleve.classe_id) : null;
                  const frais = data.frais.find(f => f.id === p.frais_id);

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/50">
                      <td className="p-3 font-mono">
                        <div className="font-bold text-white">{p.reference}</div>
                        <div className="text-[10px] text-slate-400">{p.date_paiement}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{eleve ? `${eleve.nom} ${eleve.prenom}` : 'Élève'}</div>
                        <div className="text-[10px] text-blue-400">{classe ? classe.nom : ''}</div>
                      </td>
                      <td className="p-3 text-slate-300">{frais ? frais.nom : 'Minerval'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          {p.mode}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">
                        +{Number(p.montant_paye).toLocaleString('fr-FR')}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedPaiementId(p.id);
                            setCurrentView('recu');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-[11px] font-semibold border border-blue-500/30 transition flex items-center gap-1 mx-auto"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Quittance</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Expenses Table */}
        {activeTab === 'depenses' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Motif de la Dépense</th>
                  <th className="p-3">Catégorie</th>
                  <th className="p-3">Justificatif / Pièce</th>
                  <th className="p-3 text-right">Montant Décaissement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredExpenses.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-mono text-slate-400">{d.date}</td>
                    <td className="p-3 font-semibold text-white">{d.description}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {d.categorie}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{d.justificatif}</td>
                    <td className="p-3 text-right font-mono font-bold text-rose-400">
                      -{Number(d.montant).toLocaleString('fr-FR')} CDF
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: New Payment / Frais */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">Encaisser Frais Scolaires</h3>
                  <p className="text-xs text-slate-400">Délivrance de quittance officielle</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Élève bénéficiaire *</label>
                <select
                  value={paymentForm.eleve_id}
                  onChange={(e) => setPaymentForm({ ...paymentForm, eleve_id: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {data.eleves.map(e => (
                    <option key={e.id} value={e.id}>{e.nom} {e.prenom} ({e.matricule})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Type de Frais / Échéance</label>
                <select
                  value={paymentForm.frais_id}
                  onChange={(e) => {
                    const fId = Number(e.target.value);
                    const selected = data.frais.find(f => f.id === fId);
                    setPaymentForm({ 
                      ...paymentForm, 
                      frais_id: fId,
                      montant_paye: selected ? selected.montant : paymentForm.montant_paye
                    });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {data.frais.map(f => (
                    <option key={f.id} value={f.id}>{f.nom} ({f.montant.toLocaleString('fr-FR')} CDF)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Montant perçu (en Francs Congolais CDF)</label>
                <input
                  type="number"
                  required
                  value={paymentForm.montant_paye}
                  onChange={(e) => setPaymentForm({ ...paymentForm, montant_paye: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mode de règlement</label>
                <select
                  value={paymentForm.mode}
                  onChange={(e) => setPaymentForm({ ...paymentForm, mode: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Espèces (Caisse)">Espèces (Caisse Centrale)</option>
                  <option value="Mobile Money (M-Pesa)">Mobile Money (Vodacom M-Pesa)</option>
                  <option value="Airtel Money">Airtel Money</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="Virement bancaire (Equity BCDC)">Virement bancaire (Equity BCDC)</option>
                  <option value="Rawbank IlliCo Cash">Rawbank IlliCo Cash</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/25"
                >
                  Valider & Générer Quittance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Expense */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">Bon de Décaissement</h3>
                  <p className="text-xs text-slate-400">Dépense de fonctionnement de l'école</p>
                </div>
              </div>
              <button 
                onClick={() => setIsExpenseModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Motif / Description de la dépense *</label>
                <input
                  type="text"
                  required
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  placeholder="Ex: Achat de craies et rames de papier"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Catégorie</label>
                <select
                  value={expenseForm.categorie}
                  onChange={(e) => setExpenseForm({ ...expenseForm, categorie: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Fournitures scolaires">Fournitures scolaires</option>
                  <option value="Matériel pédagogique">Matériel pédagogique</option>
                  <option value="Télécoms & Réseaux">Télécoms & Réseaux</option>
                  <option value="Énergie & Maintenance">Énergie & Maintenance</option>
                  <option value="Sécurité & Bâtiment">Sécurité & Bâtiment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Montant décaissé (CDF)</label>
                <input
                  type="number"
                  required
                  value={expenseForm.montant}
                  onChange={(e) => setExpenseForm({ ...expenseForm, montant: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-rose-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Référence Pièce / Facture</label>
                <input
                  type="text"
                  value={expenseForm.justificatif}
                  onChange={(e) => setExpenseForm({ ...expenseForm, justificatif: e.target.value })}
                  placeholder="Facture N°..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition shadow-lg shadow-rose-600/25"
                >
                  Enregistrer Décaissement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
