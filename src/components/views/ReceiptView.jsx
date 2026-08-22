import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  Sparkles, 
  QrCode, 
  Building2,
  ShieldCheck
} from 'lucide-react';

export function ReceiptView() {
  const { 
    selectedPaiementId, 
    setCurrentView, 
    data 
  } = useApp();

  const paiement = data.paiements.find(p => p.id === Number(selectedPaiementId)) || data.paiements[0];
  const eleve = paiement ? data.eleves.find(e => e.id === paiement.eleve_id) : null;
  const classe = eleve ? data.classes.find(c => c.id === eleve.classe_id) : null;
  const frais = paiement ? data.frais.find(f => f.id === paiement.frais_id) : null;

  if (!paiement || !eleve) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-400">Quittance introuvable.</p>
        <button 
          onClick={() => setCurrentView('finance')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs"
        >
          Retour aux finances
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto pb-24 sm:pb-8">
      {/* Action Bar */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => setCurrentView('finance')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux finances</span>
        </button>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer la Quittance</span>
        </button>
      </div>

      {/* Official Receipt Card (Figma / Material Print-Ready Style) */}
      <div className="bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 relative overflow-hidden bulletin-page">
        {/* DRC Emblem & Header */}
        <div className="text-center border-b-2 border-slate-700 pb-5 mb-6 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            RÉPUBLIQUE DÉMOCRATIQUE DU CONGO
          </div>
          <div className="text-xs text-slate-400">
            Ministère de l'Éducation Nationale et Nouvelle Citoyenneté
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-heading tracking-tight mt-1">
            {data.ecoleConfig.nom}
          </h2>
          <div className="text-xs text-blue-400 font-mono">
            {data.ecoleConfig.code_ministeriel} • {data.ecoleConfig.province_educationnelle}
          </div>
          <div className="inline-block mt-3 px-4 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            QUITTANCE OFFICIELLE DE PAIEMENT
          </div>
        </div>

        {/* Reference & Date Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-6 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] block">N° DE QUITTANCE</span>
            <span className="font-bold text-white text-sm">{paiement.reference}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">DATE D'ENCAISSEMENT</span>
            <span className="font-bold text-white">{paiement.date_paiement}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-400 text-[10px] block">MODE DE RÈGLEMENT</span>
            <span className="font-bold text-emerald-400">{paiement.mode}</span>
          </div>
        </div>

        {/* Student & Guardian Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/40 space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">IDENTIFICATION ÉLÈVE</span>
            <div className="text-base font-extrabold text-white font-heading">
              {eleve.nom} {eleve.prenom}
            </div>
            <div className="text-slate-300">
              Matricule : <strong className="font-mono text-blue-400">{eleve.matricule}</strong>
            </div>
            <div className="text-slate-300">
              Classe : <strong>{classe?.nom}</strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/40 space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">PARENT / PAYEUR</span>
            <div className="text-sm font-bold text-white">
              {eleve.nom_parent || 'Tuteur Légal'}
            </div>
            <div className="text-slate-300">
              Téléphone : {eleve.telephone}
            </div>
            <div className="text-slate-400">
              Adresse : {eleve.adresse}
            </div>
          </div>
        </div>

        {/* Payment Line Item Table */}
        <div className="border border-slate-700 rounded-2xl overflow-hidden mb-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800 text-slate-300 font-bold border-b border-slate-700">
              <tr>
                <th className="p-3">Description du Frais Scolaire</th>
                <th className="p-3">Période / Échéance</th>
                <th className="p-3 text-right">Montant Encaissé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="p-3 font-semibold text-white">
                  {frais?.nom || 'Frais de Minerval / Scolarité'}
                </td>
                <td className="p-3 text-slate-400">
                  Année {data.ecoleConfig.annee_courante}
                </td>
                <td className="p-3 text-right font-mono font-extrabold text-emerald-400 text-sm">
                  {Number(paiement.montant_paye).toLocaleString('fr-FR')} CDF
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-800/50 font-bold border-t border-slate-700">
              <tr>
                <td colSpan={2} className="p-3 text-right uppercase text-slate-300">TOTAL PAYÉ :</td>
                <td className="p-3 text-right text-base text-emerald-400 font-mono">
                  {Number(paiement.montant_paye).toLocaleString('fr-FR')} CDF
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer with Signatures & QR Code */}
        <div className="pt-4 border-t-2 border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-white p-1 flex items-center justify-center">
              {/* QR Code Symbol */}
              <div className="w-full h-full border border-black flex flex-col items-center justify-center text-[7px] text-black font-mono font-bold leading-tight text-center">
                <span>RDC-SEC</span>
                <span>{paiement.reference}</span>
                <span>OK</span>
              </div>
            </div>
            <div className="text-[11px] leading-tight">
              <span className="text-white font-bold block">Vérification de Sécurité</span>
              <span>Scannez pour authentifier la quittance sur le serveur de l'établissement.</span>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <div className="text-[11px] text-slate-400">Pour la Direction / Caisse Centrale</div>
            <div className="font-bold text-white uppercase text-xs pt-4">Le Comptable de l'École</div>
            <div className="text-[10px] text-emerald-400 font-mono">SCEAU & SIGNATURE NUMÉRIQUE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
