import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  X,
  BookOpen,
  Users,
  GraduationCap,
  MapPin,
  Calendar,
  Clock,
  History,
  Award,
  AlertTriangle,
  CheckCircle2,
  FileText,
  UserCheck,
  Building,
  UserX,
  Edit,
  ArrowRight,
  Shield,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  Printer,
  Download,
} from "lucide-react";

export function ClassDetailModal({
  isOpen,
  onClose,
  classId,
  onEditClass,
  onAssignRoom,
  onAssignTitulaire,
}) {
  const { data, getClassStats, setCurrentView, setSelectedEleveId, showToast } = useApp();
  const [activeTab, setActiveTab] = useState("eleves"); // eleves | cours | titulaires | salles | audit
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen || !classId) return null;

  const targetClass = (data?.classes || []).find((c) => c.id === Number(classId));
  if (!targetClass) return null;

  const stats = getClassStats(classId);
  const students = (data?.eleves || []).filter((e) => e.classe_id === targetClass.id);
  const courses = (data?.cours || []).filter(
    (c) => c.classe_id === targetClass.id || !c.classe_id
  );
  const titulaire = (data?.enseignants || []).find((t) => t.id === targetClass.prof_id);
  const salle = (data?.salles || []).find((s) => s.id === targetClass.salle_id);
  const niveau = (data?.niveaux || []).find((n) => n.id === targetClass.niveau_id);
  const option = (data?.options || []).find((o) => o.id === targetClass.option_id);

  const filteredStudents = students.filter((s) => {
    const fullName = `${s.nom || ""} ${s.postnom || ""} ${s.prenom || ""}`.toLowerCase();
    const matricule = (s.matricule || "").toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) || matricule.includes(query);
  });

  const handlePrintRoster = () => {
    showToast("Impression de la liste d'appel officielle générée !");
    window.print();
  };

  const handleExportCSV = () => {
    const headers = "Matricule,Nom,Postnom,Prenom,Sexe,Date Naissance,Statut,Tuteur,Telephone\n";
    const rows = students
      .map(
        (s) =>
          `"${s.matricule || ""}","${s.nom || ""}","${s.postnom || ""}","${s.prenom || ""}","${
            s.sexe || ""
          }","${s.date_naissance || ""}","${s.statut || "actif"}","${s.nom_tuteur || ""}","${
            s.telephone_tuteur || s.telephone || ""
          }"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Liste_Eleves_${targetClass.nom.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Fichier CSV de la classe exporté !");
  };

  return (
    <div className="fixed inset-0 bg-[#070F26]/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#10224D] border border-blue-400/25 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-5 border-b border-blue-400/20 bg-gradient-to-r from-blue-950 via-[#10224D] to-indigo-950/80 flex flex-wrap justify-between items-start gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center font-bold shadow-inner shrink-0">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-400 bg-blue-500/15 px-2.5 py-0.5 rounded-full border border-blue-400/25">
                  {targetClass.cycle || "Enseignement"} • {targetClass.division ? `Division ${targetClass.division}` : "Section Unique"}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    targetClass.statut === "active"
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                      : "bg-slate-500/15 text-slate-300 border-slate-500/30"
                  }`}
                >
                  {targetClass.statut === "active" ? "Active" : "Archivée"}
                </span>
                {targetClass.code && (
                  <span className="text-[11px] text-blue-300/60 font-mono bg-blue-900/40 px-2 py-0.5 rounded-lg border border-blue-400/15">
                    {targetClass.code}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-extrabold text-white font-heading mt-1">
                {targetClass.nom}
              </h2>
              <p className="text-xs text-blue-200/70 flex items-center gap-3 mt-0.5">
                <span>Année : {targetClass.annee_scolaire || "2025-2026"}</span>
                {option && <span>• Option : {option.nom}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditClass(targetClass)}
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-400/25 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Modifier</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-blue-300/70 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick KPI Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#0B1736]/60 border-b border-blue-400/15 text-xs">
          {/* Effectif / Capacité */}
          <div className="p-2.5 rounded-xl bg-[#12305A]/40 border border-blue-400/15 space-y-1">
            <div className="flex justify-between text-blue-300/70">
              <span>Effectif / Capacité</span>
              <span className={`font-bold ${stats?.status_color === "rose" ? "text-rose-400" : stats?.status_color === "amber" ? "text-amber-400" : "text-emerald-400"}`}>
                {stats?.taux_occupation}%
              </span>
            </div>
            <div className="text-sm font-extrabold text-white">
              {students.length} <span className="text-xs text-blue-300/60 font-normal">/ {stats?.capacite_max} max</span>
            </div>
            <div className="w-full h-1.5 bg-blue-900/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  stats?.alert_status === "surcharge"
                    ? "bg-rose-500"
                    : stats?.alert_status === "alerte"
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(100, stats?.taux_occupation || 0)}%` }}
              />
            </div>
          </div>

          {/* Titulaire */}
          <div className="p-2.5 rounded-xl bg-[#12305A]/40 border border-blue-400/15 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-blue-300/60 uppercase block">Titulaire</span>
              <p className="font-bold text-white truncate text-xs">
                {titulaire ? `${titulaire.nom} ${titulaire.prenom}` : "Non assigné"}
              </p>
            </div>
          </div>

          {/* Salle */}
          <div className="p-2.5 rounded-xl bg-[#12305A]/40 border border-blue-400/15 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-blue-300/60 uppercase block">Local Physique</span>
              <p className="font-bold text-white truncate text-xs">
                {salle ? `${salle.nom} (${salle.code})` : "Non assigné"}
              </p>
            </div>
          </div>

          {/* Répartition Sexe */}
          <div className="p-2.5 rounded-xl bg-[#12305A]/40 border border-blue-400/15 space-y-1">
            <span className="text-[10px] text-blue-300/60 uppercase block">Parité Garçons / Filles</span>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-sky-300">♂ {stats?.garcons} G</span>
              <span className="text-pink-300">♀ {stats?.filles} F</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-[#0B1736]/90 border-b border-blue-400/15 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab("eleves")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition shrink-0 ${
              activeTab === "eleves"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-blue-300/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Élèves Inscrits ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("cours")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition shrink-0 ${
              activeTab === "cours"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-blue-300/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cours & Matières ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("titulaires")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition shrink-0 ${
              activeTab === "titulaires"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-blue-300/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Historique Titulaires</span>
          </button>

          <button
            onClick={() => setActiveTab("salles")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition shrink-0 ${
              activeTab === "salles"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-blue-300/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Historique Salles</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition shrink-0 ${
              activeTab === "audit"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-blue-300/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Journal d'Audit</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* TAB 1: ELEVES */}
          {activeTab === "eleves" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 text-blue-300/50 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher un élève par nom ou matricule..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-blue-300/40 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-200 border border-blue-400/20 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exporter CSV</span>
                  </button>
                  <button
                    onClick={handlePrintRoster}
                    className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-200 border border-blue-400/20 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimer Liste</span>
                  </button>
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-blue-400/20 rounded-2xl bg-blue-950/20">
                  <Users className="w-10 h-10 text-blue-400/40 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">Aucun élève trouvé</p>
                  <p className="text-xs text-blue-300/60 mt-0.5">
                    {searchTerm ? "Aucun élève ne correspond à votre recherche." : "Aucun élève n'est encore inscrit dans cette classe."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-blue-400/20">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0B1736] text-blue-200 font-bold border-b border-blue-400/20 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Matricule</th>
                        <th className="py-2.5 px-3">Nom, Postnom & Prénom</th>
                        <th className="py-2.5 px-3">Genre</th>
                        <th className="py-2.5 px-3">Tuteur / Contact</th>
                        <th className="py-2.5 px-3">Statut</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-400/15 bg-[#12305A]/20">
                      {filteredStudents.map((eleve, index) => (
                        <tr key={eleve.id} className="hover:bg-blue-500/10 transition">
                          <td className="py-2.5 px-3 text-blue-300/60 font-mono">{index + 1}</td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-blue-300">
                            {eleve.matricule}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-white">
                            {eleve.nom} {eleve.postnom} {eleve.prenom}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                eleve.sexe === "M"
                                  ? "bg-sky-500/20 text-sky-300"
                                  : "bg-pink-500/20 text-pink-300"
                              }`}
                            >
                              {eleve.sexe === "M" ? "Masculin" : "Féminin"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-blue-200/80">
                            <span className="font-semibold">{eleve.nom_tuteur || "Non renseigné"}</span>
                            <span className="text-[10px] text-blue-300/60 block">
                              {eleve.telephone_tuteur || eleve.telephone || ""}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                              {eleve.statut || "Actif"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedEleveId(eleve.id);
                                setCurrentView("eleve-detail");
                                onClose();
                              }}
                              className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white transition"
                              title="Consulter le dossier de l'élève"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COURS */}
          {activeTab === "cours" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                  Programme Pédagogique ({courses.length} matières)
                </h4>
              </div>

              {courses.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-blue-400/20 rounded-2xl bg-blue-950/20">
                  <BookOpen className="w-8 h-8 text-blue-400/40 mx-auto mb-2" />
                  <p className="text-xs text-blue-300/70">Aucun cours rattaché spécifiquement à cette classe.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {courses.map((cours) => {
                    const prof = (data?.enseignants || []).find((t) => t.id === cours.enseignant_id);
                    return (
                      <div
                        key={cours.id}
                        className="p-3.5 rounded-xl bg-[#0B1736]/60 border border-blue-400/20 flex items-start justify-between gap-3 hover:border-blue-400/40 transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-400/20">
                              {cours.code || "COURS"}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold">
                              Coeff : {cours.ponderation || cours.coefficient || 1}
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-white">{cours.nom}</h5>
                          <p className="text-xs text-blue-300/70 flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                            <span>Prof : {prof ? `${prof.nom} ${prof.prenom}` : "Non assigné"}</span>
                          </p>
                        </div>

                        {cours.volume_horaire && (
                          <span className="text-[11px] font-semibold text-blue-300/80 bg-blue-900/30 px-2 py-1 rounded-lg border border-blue-400/15">
                            {cours.volume_horaire} h/sem
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HISTORIQUE TITULAIRES */}
          {activeTab === "titulaires" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                  Historique Chronologique des Titulaires
                </h4>
                <button
                  onClick={() => onAssignTitulaire(targetClass)}
                  className="px-3 py-1 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold transition"
                >
                  Changer de Titulaire
                </button>
              </div>

              {(!targetClass.titulaire_historique || targetClass.titulaire_historique.length === 0) ? (
                <div className="text-center py-10 border border-dashed border-blue-400/20 rounded-2xl bg-blue-950/20">
                  <GraduationCap className="w-8 h-8 text-purple-400/40 mx-auto mb-2" />
                  <p className="text-xs text-blue-300/70">Aucun historique de titulaire enregistré.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {targetClass.titulaire_historique.map((th, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#0B1736]/60 border border-blue-400/20 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-white">{th.prof_nom}</h5>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                !th.date_fin
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                              }`}
                            >
                              {!th.date_fin ? "Titulaire Actuel" : "Mandat Terminé"}
                            </span>
                          </div>
                          <p className="text-xs text-blue-300/70 mt-0.5">
                            Période : {th.date_debut || "N/A"} → {th.date_fin || "En cours"}
                            {th.motif && <span className="italic text-blue-300/50"> • {th.motif}</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HISTORIQUE SALLES */}
          {activeTab === "salles" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                  Historique des Salles Physiques Affectées
                </h4>
                <button
                  onClick={() => onAssignRoom(targetClass)}
                  className="px-3 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-400/30 text-xs font-semibold transition"
                >
                  Changer de Salle
                </button>
              </div>

              {(!targetClass.salle_historique || targetClass.salle_historique.length === 0) ? (
                <div className="text-center py-10 border border-dashed border-blue-400/20 rounded-2xl bg-blue-950/20">
                  <MapPin className="w-8 h-8 text-blue-400/40 mx-auto mb-2" />
                  <p className="text-xs text-blue-300/70">Aucune salle n'a encore été enregistrée dans l'historique.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {targetClass.salle_historique.map((sh, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#0B1736]/60 border border-blue-400/20 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-white">{sh.salle_nom}</h5>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                !sh.date_fin
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                              }`}
                            >
                              {!sh.date_fin ? "Local Actuel" : "Précédent"}
                            </span>
                          </div>
                          <p className="text-xs text-blue-300/70 mt-0.5">
                            Période : {sh.date_debut || "N/A"} → {sh.date_fin || "En cours"}
                            {sh.motif && <span className="italic text-blue-300/50"> • {sh.motif}</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: AUDIT */}
          {activeTab === "audit" && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                Traçabilité & Journal des Événements
              </h4>

              {(!targetClass.modification_historique || targetClass.modification_historique.length === 0) ? (
                <div className="text-center py-10 border border-dashed border-blue-400/20 rounded-2xl bg-blue-950/20">
                  <History className="w-8 h-8 text-blue-400/40 mx-auto mb-2" />
                  <p className="text-xs text-blue-300/70">Aucune entrée de journal pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {targetClass.modification_historique.map((mod, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0B1736]/60 border border-blue-400/15 flex items-start gap-3 text-xs"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{mod.action}</span>
                          <span className="text-[10px] text-blue-300/50">{mod.date}</span>
                        </div>
                        <p className="text-blue-300/80 text-[11px]">{mod.details}</p>
                        <span className="text-[10px] text-blue-400/70 block">Par : {mod.auteur || "Administration"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-blue-400/20 bg-[#0B1736]/70 flex items-center justify-between">
          <div className="text-xs text-blue-300/60 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Fiche pédagogique certifiée - CS John Tshot</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
          >
            Fermer la vue
          </button>
        </div>
      </div>
    </div>
  );
}
