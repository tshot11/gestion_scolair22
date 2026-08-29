import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  ArrowLeft,
  Award,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Wallet,
  Fingerprint,
  ShieldAlert,
  Trash2,
  Edit,
  Printer,
  Sparkles,
  ChevronRight,
  User,
  Key,
  BookOpen,
  Layers,
  School
} from "lucide-react";

export function StudentDetailView() {
  const {
    selectedEleveId,
    setCurrentView,
    getEleveDetail,
    deleteEleve,
    setSelectedPaiementId,
    data,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState("notes"); /* notes | presences | finances | discipline */
  const eleve = getEleveDetail(selectedEleveId);

  if (!eleve) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto space-y-4">
        <p className="text-blue-200/70 text-sm">Élève non trouvé dans le registre.</p>
        <button
          onClick={() => setCurrentView("eleves")}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition"
        >
          Retour à la liste des élèves
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Voulez-vous vraiment supprimer définitivement l'élève ${eleve.nom} ${eleve.prenom} ?`)) {
      deleteEleve(eleve.id);
      setCurrentView("eleves");
    }
  };

  const classe = eleve.classe || (data?.classes || []).find((c) => c.id === eleve.classe_id);
  const opt = (data?.options || []).find((o) => o.id === (eleve.option_id || classe?.option_id));
  const studentEmail = eleve.email_eleve || eleve.email;
  const studentPassword = eleve.mot_de_passe_eleve || eleve.password || "eleve123";

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto pb-24 sm:pb-8 text-slate-200">
      {/* Top Back Navigation & Action Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => setCurrentView("eleves")}
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-300 hover:text-white px-4 py-2 rounded-xl bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux élèves</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView("bulletin")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition active:scale-95"
          >
            <Award className="w-4 h-4" />
            <span>Bulletin Officiel</span>
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white transition"
            title="Supprimer l'élève"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Student Identity Card Banner */}
      <div className="bg-[#12305A]/55 rounded-3xl border border-[#94C5FF]/15 p-6 shadow-xl relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-blue-400/30 overflow-hidden flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-lg">
              {eleve.photo ? (
                <img src={eleve.photo} alt={eleve.nom} className="w-full h-full object-cover" />
              ) : (
                <span>
                  {eleve.nom?.[0]}
                  {eleve.prenom?.[0]}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {eleve.nom} {eleve.postnom || ""} {eleve.prenom}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    eleve.sexe === "M"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                  }`}
                >
                  {eleve.sexe === "M" ? "Garçon" : "Fille"}
                </span>
                {eleve.est_boursier && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Boursier
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-blue-300/80 font-mono flex-wrap">
                <span className="text-blue-400 font-bold bg-blue-500/15 px-2 py-0.5 rounded border border-blue-500/20">
                  {eleve.matricule || `2025-${eleve.id}`}
                </span>
                <span>•</span>
                <span className="text-white font-sans font-bold">
                  {classe?.nom || "Classe non assignée"}
                </span>
                {opt && (
                  <>
                    <span>•</span>
                    <span className="text-indigo-300 font-sans font-bold">
                      Option {opt.nom}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Academic Badge */}
          <div className="p-4 rounded-2xl bg-[#0B1736]/70 border border-[#94C5FF]/15 flex items-center gap-4 shrink-0 shadow-md">
            <div>
              <div className="text-[10px] text-blue-300/70 uppercase font-bold tracking-wider">
                Moyenne Générale
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {eleve.moyenne}
                <span className="text-xs text-blue-300/70 font-sans"> / 20</span>
              </div>
              <div className={`text-xs font-bold ${eleve.mentionColor || 'text-emerald-400'}`}>
                {eleve.pourcentage}% • {eleve.mention || 'Très Bien'}
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Contact info pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#94C5FF]/15 text-xs text-blue-200">
          <div className="flex items-center gap-2 bg-[#0B1736]/50 p-2.5 rounded-xl border border-[#94C5FF]/10">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">Adresse : {eleve.adresse || "Kinshasa, RDC"}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0B1736]/50 p-2.5 rounded-xl border border-[#94C5FF]/10">
            <User className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">
              Tuteur : {eleve.nom_tuteur || eleve.nom_parent || "Non renseigné"} ({eleve.telephone_tuteur || eleve.telephone || "-"})
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[#0B1736]/50 p-2.5 rounded-xl border border-[#94C5FF]/10">
            <Key className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate font-mono">
              Login Élève : {studentEmail || "Non configuré"} ({studentPassword})
            </span>
          </div>
        </div>
      </div>

      {/* Detail Tabs Navigation */}
      <div className="flex gap-2 border-b border-[#94C5FF]/15 pb-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab("notes")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "notes"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-blue-300 hover:text-white bg-[#12305A]/45 hover:bg-blue-500/20"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Cotes & Résultats ({eleve.resultats?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("presences")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "presences"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-blue-300 hover:text-white bg-[#12305A]/45 hover:bg-blue-500/20"
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          <span>Présences & Pointage ({eleve.pointages?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("finances")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "finances"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-blue-300 hover:text-white bg-[#12305A]/45 hover:bg-blue-500/20"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Frais Scolaires & Minerval ({eleve.paiements?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("discipline")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "discipline"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-blue-300 hover:text-white bg-[#12305A]/45 hover:bg-blue-500/20"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Discipline & Sanctions ({eleve.incidents?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Notes & Cotes */}
      {activeTab === "notes" && (
        <div className="space-y-4">
          <div className="bg-[#12305A]/45 backdrop-blur-md rounded-3xl border border-[#94C5FF]/15 overflow-hidden shadow-xl">
            <div className="p-4 sm:p-5 border-b border-[#94C5FF]/15 flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-black text-white">
                Relevé des Cotes - {(data?.ecoleConfig || {}).periode_active || "4ème Période"}
              </h3>
              <span className="text-xs text-blue-300/80 font-mono">
                Total Points : <strong className="text-white">{eleve.totalPoints}</strong> / {eleve.totalCoeff * 20}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-blue-200">
                <thead className="bg-[#0B1736]/70 text-blue-300 font-bold border-b border-[#94C5FF]/15 uppercase">
                  <tr>
                    <th className="p-3.5">Matière / Cours</th>
                    <th className="p-3.5 text-center">Coeff</th>
                    <th className="p-3.5 text-center">Note / 20</th>
                    <th className="p-3.5">Appréciation Pédagogique</th>
                    <th className="p-3.5">Enseignant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#94C5FF]/10">
                  {(eleve.resultats || []).map((res) => (
                    <tr key={res.id} className="hover:bg-[#12305A]/60">
                      <td className="p-3.5 font-bold text-white">
                        <div>{res.cours_nom}</div>
                        <div className="text-[10px] text-blue-400 font-mono">{res.cours_code}</div>
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-white">
                        {res.coefficient}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg font-bold font-mono ${
                            res.note >= 14
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : res.note >= 10
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {Number(res.note).toFixed(1)}
                        </span>
                      </td>
                      <td className="p-3.5 text-blue-200">{res.appreciation || "Satisfaisant"}</td>
                      <td className="p-3.5 text-blue-300/80">{res.enseignant_nom || "Enseignant titulaire"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Présences */}
      {activeTab === "presences" && (
        <div className="bg-[#12305A]/45 backdrop-blur-md rounded-3xl border border-[#94C5FF]/15 p-5 space-y-4">
          <h3 className="text-sm font-black text-white">Historique des Pointages & Présences</h3>
          <div className="space-y-2">
            {(eleve.pointages || []).map((pt) => (
              <div
                key={pt.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0B1736]/60 border border-[#94C5FF]/10"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      pt.statut === "present"
                        ? "bg-emerald-400"
                        : pt.statut === "retard"
                        ? "bg-amber-400"
                        : "bg-rose-400"
                    }`}
                  ></div>
                  <div>
                    <div className="text-xs font-bold text-white capitalize">{pt.statut}</div>
                    <div className="text-[10px] text-blue-300/70 font-mono">
                      {pt.date} • {pt.heure_arrivee ? `Arrivée à ${pt.heure_arrivee}` : "Non pointé"}
                    </div>
                  </div>
                </div>
                {pt.motif && <div className="text-xs text-blue-300 italic max-w-xs truncate">{pt.motif}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Finances */}
      {activeTab === "finances" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15">
              <span className="text-xs text-blue-300/70 block">Total Frais Réglés</span>
              <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                {Number(eleve.totalFraisPayes || 0).toLocaleString("fr-FR")} CDF
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15">
              <span className="text-xs text-blue-300/70 block">Frais Annuels Fixés</span>
              <div className="text-xl font-black text-white font-mono mt-1">
                {Number(eleve.totalFraisTheoriques || 0).toLocaleString("fr-FR")} CDF
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15">
              <span className="text-xs text-blue-300/70 block">Solde Restant à Payer</span>
              <div className="text-xl font-black text-amber-400 font-mono mt-1">
                {Number(eleve.soldeFraisDu || 0).toLocaleString("fr-FR")} CDF
              </div>
            </div>
          </div>

          <div className="bg-[#12305A]/45 backdrop-blur-md rounded-3xl border border-[#94C5FF]/15 overflow-hidden">
            <div className="p-4 border-b border-[#94C5FF]/15 flex items-center justify-between">
              <h4 className="text-xs font-bold text-white">Quittances & Reçus Déposés</h4>
              <button
                onClick={() => setCurrentView("finance")}
                className="text-xs text-blue-400 hover:text-white font-bold"
              >
                Effectuer un versement
              </button>
            </div>
            <div className="divide-y divide-[#94C5FF]/10">
              {(eleve.paiements || []).map((pay) => (
                <div key={pay.id} className="p-3.5 flex items-center justify-between hover:bg-[#12305A]/60">
                  <div>
                    <div className="text-xs font-bold text-white">{pay.frais_nom}</div>
                    <div className="text-[10px] text-blue-300/70 font-mono">
                      {pay.reference} • {pay.mode} • {pay.date_paiement}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {Number(pay.montant_paye).toLocaleString("fr-FR")} CDF
                    </span>
                    <button
                      onClick={() => {
                        setSelectedPaiementId(pay.id);
                        setCurrentView("recu");
                      }}
                      className="px-3 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-200 hover:text-white text-xs font-bold border border-blue-500/30 transition"
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
      {activeTab === "discipline" && (
        <div className="bg-[#12305A]/45 backdrop-blur-md rounded-3xl border border-[#94C5FF]/15 p-5 space-y-4">
          <h3 className="text-sm font-black text-white">Dossier Disciplinaire de l'Élève</h3>
          {(eleve.incidents || []).length === 0 ? (
            <div className="p-8 text-center text-blue-300/70 text-xs bg-[#0B1736]/40 rounded-2xl border border-emerald-500/20">
              Aucun avertissement ni sanction disciplinaire dans le dossier. Comportement exemplaire.
            </div>
          ) : (
            <div className="space-y-3">
              {(eleve.incidents || []).map((inc) => (
                <div
                  key={inc.id}
                  className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 uppercase font-mono tracking-wider">
                      {inc.type || inc.motif}
                    </span>
                    <span className="text-[10px] text-blue-300/70">
                      {inc.date_incident || inc.date} • Rapporté par {inc.rapporte_par || "Préfecture"}
                    </span>
                  </div>
                  <p className="text-xs text-white">{inc.description}</p>
                  <div className="text-[11px] text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                    <strong>Sanction appliquée :</strong> {inc.sanction || "Avertissement verbal"}
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
