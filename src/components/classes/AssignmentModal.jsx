import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { X, ArrowRightLeft, Building, BookOpen, AlertTriangle, CheckCircle2, ShieldAlert, Check } from "lucide-react";

export function AssignmentModal({ isOpen, onClose, initialClass = null, initialRoom = null }) {
  const { data, assignClassRoom, showToast, currentUser } = useApp();

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [motif, setMotif] = useState("Affectation officielle d'espace pédagogique");
  const [overrideWarning, setOverrideWarning] = useState(false);

  useEffect(() => {
    if (initialClass) {
      setSelectedClassId(String(initialClass.id));
      setSelectedRoomId(initialClass.salle_id ? String(initialClass.salle_id) : "");
    } else if (initialRoom) {
      setSelectedRoomId(String(initialRoom.id));
      const occupyingClass = (data?.classes || []).find((c) => c.salle_id === initialRoom.id && c.statut === "active");
      setSelectedClassId(occupyingClass ? String(occupyingClass.id) : "");
    }
  }, [initialClass, initialRoom, isOpen]);

  if (!isOpen) return null;

  const classes = data?.classes || [];
  const salles = data?.salles || [];

  const targetClass = classes.find((c) => c.id === Number(selectedClassId));
  const targetRoom = salles.find((s) => s.id === Number(selectedRoomId));

  const classStudentsCount = targetClass
    ? (data?.eleves || []).filter((e) => e.classe_id === targetClass.id && e.statut !== "inactif").length
    : 0;

  // Conflict and capacity checks
  const warnings = [];
  if (targetClass && targetRoom) {
    if (targetRoom.etat === "maintenance" || targetRoom.etat === "hors_service") {
      warnings.push(`La salle ${targetRoom.nom} est en état de maintenance (${targetRoom.etat}).`);
    }

    if (targetRoom.capacite_max < classStudentsCount) {
      warnings.push(
        `Capacité insuffisante : La salle offre ${targetRoom.capacite_max} places pour un effectif actuel de ${classStudentsCount} élèves (+${classStudentsCount - targetRoom.capacite_max} en sureffectif).`
      );
    }

    const otherClasses = classes.filter(
      (c) => c.salle_id === targetRoom.id && c.id !== targetClass.id && c.statut === "active"
    );
    if (otherClasses.length > 0) {
      warnings.push(
        `Cette salle est déjà assignée à la classe ${otherClasses.map((c) => c.nom).join(", ")}. Cette action créera une salle partagée.`
      );
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClassId) {
      showToast("Veuillez sélectionner une classe.");
      return;
    }

    if (warnings.length > 0 && !overrideWarning) {
      showToast("Veuillez cocher la confirmation d'affectation malgré les avertissements.");
      return;
    }

    assignClassRoom(
      Number(selectedClassId),
      selectedRoomId ? Number(selectedRoomId) : null,
      motif,
      currentUser?.first_name || "Administration"
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0B1736]/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0e214a] border border-[#94C5FF]/20 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-[#94C5FF]/15 flex justify-between items-center bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-blue-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center shrink-0">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white font-heading">
                Affectation Classe & Salle Pédagogique
              </h2>
              <p className="text-xs text-blue-300/70">
                Attribution des espaces physiques avec contrôle de capacité
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white p-2 rounded-xl hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Class Select */}
          <div>
            <label className="text-xs font-bold text-blue-200 block mb-1">
              Classe Pédagogique *
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              required
              className="w-full bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400"
            >
              <option value="" className="bg-[#0B1736] text-slate-400">
                -- Sélectionner une classe --
              </option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id} className="bg-[#0B1736] text-white">
                  {cls.nom} ({cls.code}) • {cls.cycle}
                </option>
              ))}
            </select>
          </div>

          {/* Room Select */}
          <div>
            <label className="text-xs font-bold text-blue-200 block mb-1">
              Salle Physique / Espace attribué
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400"
            >
              <option value="" className="bg-[#0B1736] text-slate-400">
                -- Aucune salle (Retirer l'affectation actuelle) --
              </option>
              {salles.map((salle) => (
                <option key={salle.id} value={salle.id} className="bg-[#0B1736] text-white">
                  {salle.nom} ({salle.code}) • Capacité: {salle.capacite_max || salle.capacite} places • {salle.batiment}
                </option>
              ))}
            </select>
          </div>

          {/* Real-time comparison preview */}
          {targetClass && targetRoom && (
            <div className="p-4 rounded-2xl bg-blue-900/20 border border-blue-500/20 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-blue-200">
                <span>Vérification de Concordance</span>
                <span className={targetRoom.capacite_max >= classStudentsCount ? "text-emerald-300" : "text-rose-300"}>
                  {classStudentsCount} élèves / {targetRoom.capacite_max} places
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-black/20 border border-white/5 space-y-0.5">
                  <span className="text-[10px] text-blue-300/60 uppercase block">Classe</span>
                  <span className="font-bold text-white truncate block">{targetClass.nom}</span>
                  <span className="text-[11px] text-blue-300">Effectif : {classStudentsCount} élèves</span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/20 border border-white/5 space-y-0.5">
                  <span className="text-[10px] text-blue-300/60 uppercase block">Salle</span>
                  <span className="font-bold text-white truncate block">{targetRoom.nom}</span>
                  <span className="text-[11px] text-emerald-300">Capacité : {targetRoom.capacite_max} places</span>
                </div>
              </div>
            </div>
          )}

          {/* Warnings list if any */}
          {warnings.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Avertissements de compatibilité ({warnings.length})</span>
              </div>

              <ul className="space-y-1 text-[11px] text-amber-200/90 pl-5 list-disc">
                {warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>

              <label className="flex items-start gap-2 pt-2 border-t border-amber-500/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={overrideWarning}
                  onChange={(e) => setOverrideWarning(e.target.checked)}
                  className="mt-0.5 rounded border-amber-500/40 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[11px] text-amber-100 font-semibold">
                  Je valide cette affectation malgré les avertissements indiqués.
                </span>
              </label>
            </div>
          )}

          {/* Motif input */}
          <div>
            <label className="text-xs font-bold text-blue-200 block mb-1">
              Motif de l'affectation (Audit)
            </label>
            <input
              type="text"
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              className="w-full bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400 placeholder-blue-300/30"
              placeholder="ex: Réorganisation des salles du 1er trimestre"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#94C5FF]/15 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-blue-300 hover:text-white hover:bg-white/5 transition"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Confirmer l'affectation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
