import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Award, 
  CreditCard, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Wallet, 
  Fingerprint, 
  ShieldAlert, 
  Trash2, 
  Edit3, 
  Printer,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export function StudentDetailView() {
  const { 
    selectedEleveId, 
    setCurrentView, 
    getEleveDetail, 
    deleteEleve,
    setSelectedPaiementId,
    data
  } = useApp();

  const [activeTab, setActiveTab] = useState('notes'); // notes | presences | finances | discipline

  const eleve = getEleveDetail(selectedEleveId);

  if (!eleve) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-400">Élève non trouvé.</p>
        <button 
          onClick={() => setCurrentView('eleves')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement ${eleve.nom} ${eleve.prenom} du registre ?`)) {
      deleteEleve(eleve.id);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto pb-24 sm:pb-8">
      {/* Top Back Navigation & Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('eleves')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'annuaire</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('bulletin')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition active:scale-95"
          >
            <Award className="w-4 h-4" />
            <span>Voir Bulletin Officiel</span>
          </button>

          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition"
            title="Supprimer l'élève"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Student Identity Card Banner */}
      <div className="bg-slate-800/50 rounded-3xl border border-slate-700/60 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-700 border-2 border-blue-500/40 overflow-hidden flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg">
              {eleve.photo ? (
                <img src={eleve.photo} alt={eleve.nom} className="w-full h-full object-cover" />
              ) : (
                <span>{eleve.prenom[0]}{eleve.nom[0]}</span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                  {eleve.nom} {eleve.prenom}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  eleve.sexe === 'M' 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                    : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                }`}>
                  {eleve.sexe === 'M' ? 'Garçon' : 'Fille'}
                </span>
                {eleve.est_boursier && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Boursier
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                <span className="text-blue-400 font-bold">{eleve.matricule}</span>
                <span>•</span>
                <span className="text-white font-sans font-medium">{eleve.classe?.nom}</span>
                <span>•</span>
                <span>Inscrit le {eleve.date_inscription}</span>
              </div>
            </div>
          </div>

          {/* Academic Badge */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex items-center gap-4 shrink-0">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Moyenne Générale</div>
              <div className="text-2xl font-extrabold text-white font-heading">{eleve.moyenne} <span className="text-xs text-slate-400">/ 20</span></div>
              <div className={`text-xs font-bold ${eleve.mentionColor}`}>{eleve.pourcentage}% • {eleve.mention}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Contact info pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-slate-700/50 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{eleve.adresse}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{eleve.telephone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{eleve.email_parent}</span>
          </div>
        </div>
      </div>

      {/* Detail Tabs Navigation */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'notes'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Cotes & Résultats ({eleve.resultats.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('presences')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'presences'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          <span>Présences & Pointage ({eleve.pointages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finances')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'finances'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Paiements Minerval ({eleve.paiements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('discipline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'discipline'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Discipline & Sanctions ({eleve.incidents.length})</span>
        </button>
      </div>

      {/* Tab 1: Notes & Cotes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 overflow-hidden">
            <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-heading">Relevé des Cotes - {data.ecoleConfig.periode_active}</h3>
              <span className="text-xs text-slate-400">Total Points: <strong className="text-white">{eleve.totalPoints}</strong> / {eleve.totalCoeff * 20}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
                  <tr>
                    <th className="p-3">Matière / Cours</th>
                    <th className="p-3 text-center">Coeff</th>
                    <th className="p-3 text-center">Note / 20</th>
                    <th className="p-3">Appréciation Pédagogique</th>
                    <th className="p-3">Enseignant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {eleve.resultats.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-800/50">
                      <td className="p-3 font-semibold text-white">
                        <div>{res.cours_nom}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{res.cours_code}</div>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-slate-300">{res.coefficient}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-lg font-bold font-mono ${
                          res.note >= 14 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          res.note >= 10 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {res.note.toFixed(1)}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{res.appreciation}</td>
                      <td className="p-3 text-slate-400">{res.enseignant_nom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Présences */}
      {activeTab === 'presences' && (
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 p-4 space-y-3">
          <h3 className="text-sm font-bold text-white font-heading">Historique des Pointages</h3>
          <div className="space-y-2">
            {eleve.pointages.map((pt) => (
              <div key={pt.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/70 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    pt.statut === 'present' ? 'bg-emerald-400' :
                    pt.statut === 'retard' ? 'bg-amber-400' :
                    pt.statut === 'malade' ? 'bg-blue-400' : 'bg-rose-400'
                  }`}></div>
                  <div>
                    <div className="text-xs font-bold text-white capitalize">{pt.statut}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{pt.date} • {pt.heure_arrivee ? `Arrivée à ${pt.heure_arrivee}` : 'Non pointé'}</div>
                  </div>
                </div>
                {pt.motif && (
                  <div className="text-xs text-slate-400 italic max-w-xs truncate">{pt.motif}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Finances */}
      {activeTab === 'finances' && (
        <div className="space-y-4">
          {/* Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400">Total Frais Réglés</span>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                {eleve.totalFraisPayes.toLocaleString('fr-FR')} CDF
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400">Frais Annuels Fixés</span>
              <div className="text-lg font-bold text-white font-mono mt-0.5">
                {eleve.totalFraisTheoriques.toLocaleString('fr-FR')} CDF
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400">Solde Restant à Payer</span>
              <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                {eleve.soldeFraisDu.toLocaleString('fr-FR')} CDF
              </div>
            </div>
          </div>

          {/* Vouchers Table */}
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 overflow-hidden">
            <div className="p-3.5 border-b border-slate-700/60 flex items-center justify-between">
              <h4 className="text-xs font-bold text-white">Quittances & Reçus Déposés</h4>
              <button
                onClick={() => setCurrentView('finance')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                Effectuer un versement
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {eleve.paiements.map((pay) => (
                <div key={pay.id} className="p-3 flex items-center justify-between hover:bg-slate-800/50">
                  <div>
                    <div className="text-xs font-bold text-white">{pay.frais_nom}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{pay.reference} • {pay.mode} • {pay.date_paiement}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {Number(pay.montant_paye).toLocaleString('fr-FR')} CDF
                    </span>
                    <button
                      onClick={() => {
                        setSelectedPaiementId(pay.id);
                        setCurrentView('recu');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-[11px] font-semibold border border-blue-500/30 transition"
                    >
                      Reçu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Discipline */}
      {activeTab === 'discipline' && (
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 p-4 space-y-3">
          <h3 className="text-sm font-bold text-white font-heading">Dossier Disciplinaire</h3>
          {eleve.incidents.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              Aucun avertissement ni sanction disciplinaire dans le dossier. Comportement exemplaire.
            </div>
          ) : (
            <div className="space-y-3">
              {eleve.incidents.map((inc) => (
                <div key={inc.id} className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 uppercase font-mono tracking-wider">{inc.type}</span>
                    <span className="text-[10px] text-slate-400">{inc.date} • Rapporté par {inc.rapporte_par}</span>
                  </div>
                  <p className="text-xs text-slate-200">{inc.description}</p>
                  <div className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    <strong>Sanction appliquée :</strong> {inc.sanction}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
