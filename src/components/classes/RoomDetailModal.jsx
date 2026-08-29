import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  X,
  Building,
  Wrench,
  History,
  BookOpen,
  MapPin,
  Maximize2,
  Users,
  Shield,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Edit,
  Printer,
  Sparkles,
  Layers,
  Calendar,
} from "lucide-react";

export function RoomDetailModal({
  isOpen,
  onClose,
  roomId,
  onEditRoom,
  onAssignClass,
}) {
  const { data, getRoomStats, addRoomEquipment, updateRoomEquipment, deleteRoomEquipment, showToast } = useApp();

  const [activeTab, setActiveTab] = useState("equipements"); // equipements | classes | historique | technique
  const [isAddEquipModalOpen, setIsAddEquipModalOpen] = useState(false);
  const [editingEquip, setEditingEquip] = useState(null);
  const [equipForm, setEquipForm] = useState({
    nom: "",
    quantite: 1,
    etat: "Bon",
    observation: "",
  });

  if (!isOpen || !roomId) return null;

  const targetRoom = (data?.salles || []).find((s) => s.id === Number(roomId));
  if (!targetRoom) return null;

  const roomStats = getRoomStats(roomId);
  const assignedClasses = (data?.classes || []).filter(
    (c) => c.salle_id === targetRoom.id && c.statut === "active"
  );
  const equipements = targetRoom.equipements || [];
  const historique = targetRoom.historique || [];

  const handleOpenAddEquip = () => {
    setEditingEquip(null);
    setEquipForm({ nom: "", quantite: 1, etat: "Bon", observation: "" });
    setIsAddEquipModalOpen(true);
  };

  const handleOpenEditEquip = (eq) => {
    setEditingEquip(eq);
    setEquipForm({
      nom: eq.nom,
      quantite: eq.quantite,
      etat: eq.etat,
      observation: eq.observation || "",
    });
    setIsAddEquipModalOpen(true);
  };

  const handleSaveEquipment = (e) => {
    e.preventDefault();
    if (!equipForm.nom.trim()) {
      showToast("Veuillez saisir le nom de l'équipement", "error");
      return;
    }

    if (editingEquip) {
      updateRoomEquipment(targetRoom.id, editingEquip.id, equipForm);
    } else {
      addRoomEquipment(targetRoom.id, equipForm);
    }

    setIsAddEquipModalOpen(false);
  };

  const handleDeleteEquipment = (eqId) => {
    if (window.confirm("Êtes-vous sûr de vouloir retirer cet équipement de la salle ?")) {
      deleteRoomEquipment(targetRoom.id, eqId);
    }
  };

  const handlePrintInventory = () => {
    showToast("Impression de la fiche d'inventaire de la salle...");
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-[#070F26]/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#10224D] border border-blue-400/25 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-5 border-b border-blue-400/20 bg-gradient-to-r from-blue-950 via-[#10224D] to-indigo-950/80 flex flex-wrap justify-between items-start gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center font-bold shadow-inner shrink-0">
              <Building className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-400 bg-blue-500/15 px-2.5 py-0.5 rounded-full border border-blue-400/25">
                  {targetRoom.type}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    targetRoom.etat === "bon_etat"
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                      : targetRoom.etat === "maintenance" || targetRoom.etat === "hors_service"
                      ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                      : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                  }`}
                >
                  {targetRoom.etat === "bon_etat"
                    ? "Bon État (Opérationnelle)"
                    : targetRoom.etat === "maintenance"
                    ? "En Maintenance"
                    : targetRoom.etat === "hors_service"
                    ? "Hors Service"
                    : "À Surveiller"}
                </span>
                <span className="text-[11px] text-blue-300/60 font-mono bg-blue-900/40 px-2 py-0.5 rounded-lg border border-blue-400/15">
                  {targetRoom.code}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white font-heading mt-1">
                {targetRoom.nom}
              </h2>
              <p className="text-xs text-blue-200/70 flex items-center gap-3 mt-0.5">
                <span>{targetRoom.batiment} • {targetRoom.etage}</span>
                {targetRoom.porte && <span>• {targetRoom.porte}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditRoom(targetRoom)}
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

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#0B1736]/60 border-b border-blue-400/15 text-xs">
          {/* Surface & Dimensions */}
          <div className="p-2.5 rounded-xl bg-[#12305A]/40 border border-blue-400/15 space-y-0.5">
            <span className="text-[10px] text-blue-300/60 uppercase block">Surface & Dimensions</span>
            <div className="text-sm font-extrabold text-white">
              {targetRoom.surface} m²
            </div>
            <p className="text-[10px] text-blue-300/60">
              {targetRoom.longueur}m × {targetRoom.largeur}m (H: {targetRoom.hauteur}m)
            </p>
          </div>

          {/* Capacité & Ratio */}
          <div className="p-2.5 rounded-xl bg-[#12305A]/40 border border-blue-400/15 space-y-0.5">
            <span className="text-[10px] text-blue-300/60 uppercase block">Capacité Places</span>
            <div className="text-sm font-extrabold text-emerald-400">
              {targetRoom.capacite_max} places
            </div>
            <p className="text-[10px] text-blue-300/60">
              Ratio : {roomStats?.surface_par_eleve} m² / élève
            </p>
          </div>

          {/* Classes Occupantes */}
          <div className="p-2.5 rounded-xl bg-[#12305A]/40 border border-blue-400/15 space-y-0.5">
            <span className="text-[10px] text-blue-300/60 uppercase block">Occupation</span>
            <div className="text-sm font-extrabold text-white">
              {assignedClasses.length} classe(s)
            </div>
            <p className="text-[10px] text-blue-300/60">
              Effectif cumulé : {roomStats?.totalStudentsOccupying} élèves
            </p>
          </div>

          {/* Équipements */}
          <div className="p-2.5 rounded-xl bg-[#12305A]/40 border border-blue-400/15 space-y-0.5">
            <span className="text-[10px] text-blue-300/60 uppercase block">Inventaire Matériel</span>
            <div className="text-sm font-extrabold text-sky-400">
              {roomStats?.equipementsCount} unités
            </div>
            <p className="text-[10px] text-emerald-400/80">
              {roomStats?.equipementsEnBonEtat} en bon état
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-[#0B1736]/90 border-b border-blue-400/15 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab("equipements")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition shrink-0 ${
              activeTab === "equipements"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-blue-300/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Équipements & Inventaire ({equipements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("classes")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition shrink-0 ${
              activeTab === "classes"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-blue-300/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Classes Affectées ({assignedClasses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("historique")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition shrink-0 ${
              activeTab === "historique"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-blue-300/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historique Affectations</span>
          </button>

          <button
            onClick={() => setActiveTab("technique")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition shrink-0 ${
              activeTab === "technique"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-blue-300/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Fiche Technique & Sécurité</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* TAB 1: EQUIPEMENTS */}
          {activeTab === "equipements" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                  Matériel Didactique & Mobilier Installé
                </h4>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintInventory}
                    className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-200 border border-blue-400/20 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimer Fiche</span>
                  </button>
                  <button
                    onClick={handleOpenAddEquip}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-blue-500/25"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter Équipement</span>
                  </button>
                </div>
              </div>

              {equipements.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-blue-400/20 rounded-2xl bg-blue-950/20">
                  <Wrench className="w-8 h-8 text-blue-400/40 mx-auto mb-2" />
                  <p className="text-xs text-blue-300/70">Aucun équipement consigné pour le moment dans cette salle.</p>
                  <button
                    onClick={handleOpenAddEquip}
                    className="mt-3 px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white text-xs font-semibold transition"
                  >
                    Ajouter le premier matériel
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-blue-400/20">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0B1736] text-blue-200 font-bold border-b border-blue-400/20 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Désignation du Matériel</th>
                        <th className="py-2.5 px-3">Quantité</th>
                        <th className="py-2.5 px-3">État</th>
                        <th className="py-2.5 px-3">Date Ajout</th>
                        <th className="py-2.5 px-3">Observations</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-400/15 bg-[#12305A]/20">
                      {equipements.map((eq) => (
                        <tr key={eq.id} className="hover:bg-blue-500/10 transition">
                          <td className="py-2.5 px-3 font-bold text-white">
                            {eq.nom}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-blue-300">
                            {eq.quantite}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                eq.etat === "Bon"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : eq.etat === "À surveiller"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-rose-500/20 text-rose-300"
                              }`}
                            >
                              {eq.etat}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-blue-300/70">
                            {eq.date_ajout || "2025-08-20"}
                          </td>
                          <td className="py-2.5 px-3 text-blue-200/80 text-[11px]">
                            {eq.observation || "—"}
                          </td>
                          <td className="py-2.5 px-3 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditEquip(eq)}
                              className="p-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white transition"
                              title="Modifier"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEquipment(eq.id)}
                              className="p-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white transition"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

          {/* TAB 2: CLASSES AFFECTEES */}
          {activeTab === "classes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                  Classes Pédagogiques Occupant cet Espace
                </h4>
                <button
                  onClick={() => onAssignClass(targetRoom)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-400/30 text-xs font-semibold transition"
                >
                  Affecter une Classe
                </button>
              </div>

              {assignedClasses.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-blue-400/20 rounded-2xl bg-blue-950/20">
                  <BookOpen className="w-8 h-8 text-blue-400/40 mx-auto mb-2" />
                  <p className="text-xs text-blue-300/70">Aucune classe pédagogique n'est actuellement affectée à cette salle.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {assignedClasses.map((cls) => {
                    const stCount = (data?.eleves || []).filter((e) => e.classe_id === cls.id).length;
                    const titulaire = (data?.enseignants || []).find((t) => t.id === cls.prof_id);
                    return (
                      <div
                        key={cls.id}
                        className="p-4 rounded-xl bg-[#0B1736]/60 border border-blue-400/20 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-blue-400 font-bold uppercase block">
                              {cls.cycle}
                            </span>
                            <h5 className="text-sm font-bold text-white">{cls.nom}</h5>
                          </div>
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            {stCount} élèves
                          </span>
                        </div>

                        <p className="text-xs text-blue-300/70">
                          Titulaire : {titulaire ? `${titulaire.nom} ${titulaire.prenom}` : "Non assigné"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HISTORIQUE DES AFFECTATIONS */}
          {activeTab === "historique" && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                Journal Historique des Classes Affectées
              </h4>

              {historique.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-blue-400/20 rounded-2xl bg-blue-950/20">
                  <History className="w-8 h-8 text-blue-400/40 mx-auto mb-2" />
                  <p className="text-xs text-blue-300/70">Aucune affectation passée enregistrée.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {historique.map((h, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0B1736]/60 border border-blue-400/15 flex items-start gap-3 text-xs"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{h.classe_nom}</span>
                          <span className="text-[10px] text-blue-300/50">
                            {h.date_debut} → {h.date_fin || "En cours"}
                          </span>
                        </div>
                        <p className="text-blue-300/80 text-[11px]">Motif : {h.motif || "Affectation pédagogique"}</p>
                        <span className="text-[10px] text-blue-400/70 block">Par : {h.modifie_par || "Direction"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FICHE TECHNIQUE */}
          {activeTab === "technique" && (
            <div className="space-y-4 text-xs">
              <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                Caractéristiques Métriques & Conformité Normative
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0B1736]/60 border border-blue-400/20 space-y-2">
                  <h5 className="font-bold text-white">Données Métriques</h5>
                  <div className="space-y-1.5 text-blue-200/80">
                    <div className="flex justify-between">
                      <span className="text-blue-300/60">Longueur :</span>
                      <span className="font-bold text-white">{targetRoom.longueur} mètres</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300/60">Largeur :</span>
                      <span className="font-bold text-white">{targetRoom.largeur} mètres</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300/60">Hauteur sous plafond :</span>
                      <span className="font-bold text-white">{targetRoom.hauteur} mètres</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300/60">Surface au sol :</span>
                      <span className="font-bold text-emerald-400">{targetRoom.surface} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300/60">Volume aéré :</span>
                      <span className="font-bold text-white">
                        {(targetRoom.surface * (targetRoom.hauteur || 3.0)).toFixed(1)} m³
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0B1736]/60 border border-blue-400/20 space-y-2">
                  <h5 className="font-bold text-white">Normes Pédagogiques & Sécurité</h5>
                  <div className="space-y-1.5 text-blue-200/80">
                    <div className="flex justify-between">
                      <span className="text-blue-300/60">Capacité assise :</span>
                      <span className="font-bold text-white">{targetRoom.places_assises} places</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300/60">Ratio actuel :</span>
                      <span className="font-bold text-blue-300">{roomStats?.surface_par_eleve} m² / élève</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300/60">Norme minimale :</span>
                      <span className="font-bold text-white">1.30 m² / élève</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300/60">Issues de secours :</span>
                      <span className="font-bold text-emerald-400">Conforme (Porte 90cm)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-blue-400/20 bg-[#0B1736]/70 flex items-center justify-between">
          <div className="text-xs text-blue-300/60 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Fiche locale certifiée - Direction des Études RDC</span>
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

      {/* Sub-modal: Add/Edit Equipment */}
      {isAddEquipModalOpen && (
        <div className="fixed inset-0 bg-[#070F26]/90 backdrop-blur-sm z-[60] flex items-center justify-center p-3">
          <div className="bg-[#10224D] border border-blue-400/30 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-blue-400/20 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-400" />
                {editingEquip ? "Modifier l'Équipement" : "Ajouter un Matériel / Mobilier"}
              </h3>
              <button
                onClick={() => setIsAddEquipModalOpen(false)}
                className="text-blue-300/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEquipment} className="space-y-3 text-xs">
              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Désignation du matériel *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Bancs-pupitres, Vidéoprojecteur HDMI, Microscopes..."
                  value={equipForm.nom}
                  onChange={(e) => setEquipForm({ ...equipForm, nom: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-blue-200 block mb-1">
                    Quantité
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={equipForm.quantite}
                    onChange={(e) => setEquipForm({ ...equipForm, quantite: Number(e.target.value) })}
                    className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-blue-200 block mb-1">
                    État de conservation
                  </label>
                  <select
                    value={equipForm.etat}
                    onChange={(e) => setEquipForm({ ...equipForm, etat: e.target.value })}
                    className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="Bon">Bon État</option>
                    <option value="À surveiller">À Surveiller</option>
                    <option value="En panne">En Panne</option>
                    <option value="À remplacer">À Remplacer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Observations & Précisions
                </label>
                <input
                  type="text"
                  placeholder="ex: Structure métallique, acheté le 15/08, réf Epson 1080p..."
                  value={equipForm.observation}
                  onChange={(e) => setEquipForm({ ...equipForm, observation: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="pt-3 border-t border-blue-400/20 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEquipModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-blue-400/20 text-blue-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
