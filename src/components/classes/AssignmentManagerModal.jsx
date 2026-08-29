import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  X,
  MapPin,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Building,
  Users,
  ShieldAlert,
  ArrowRight,
  Info,
} from "lucide-react";

export function AssignmentManagerModal({
  isOpen,
  onClose,
  targetClass = null,
  targetRoom = null,
  type = "room", // 'room' | 'titulaire' | 'both'
}) {
  const { data, assignClassRoom, updateClass, showToast, currentUser } = useApp();

  const [selectedClassId, setSelectedClassId] = useState(targetClass?.id || "");
  const [selectedRoomId, setSelectedRoomId] = useState(targetClass?.salle_id || targetRoom?.id || "");
  const [selectedProfId, setSelectedProfId] = useState(targetClass?.prof_id || "");
  const [motif, setMotif] = useState("Réorganisation pédagogique");

  const classes = data?.classes || [];
  const salles = data?.salles || [];
  const enseignants = data?.enseignants || [];

  useEffect(() => {
    if (targetClass) {
      setSelectedClassId(targetClass.id);
      setSelectedRoomId(targetClass.salle_id || "");
      setSelectedProfId(targetClass.prof_id || "");
    }
  }, [targetClass]);

  useEffect(() => {
    if (targetRoom && !targetClass) {
      setSelectedRoomId(targetRoom.id);
    }
  }, [targetRoom, targetClass]);

  if (!isOpen) return null;

  const currentSelectedClass = classes.find((c) => c.id === Number(selectedClassId));
  const currentSelectedRoom = salles.find((s) => s.id === Number(selectedRoomId));
  const currentSelectedProf = enseignants.find((p) => p.id === Number(selectedProfId));

  const classStudentsCount = currentSelectedClass
    ? (data?.eleves || []).filter((e) => e.classe_id === currentSelectedClass.id).length
    : 0;

  // Capacity / conflict checks
  const isRoomOverloaded =
    currentSelectedRoom &&
    currentSelectedRoom.capacite_max < classStudentsCount;

  const isRoomInMaintenance =
    currentSelectedRoom &&
    (currentSelectedRoom.etat === "maintenance" || currentSelectedRoom.etat === "hors_service");

  const otherClassesInRoom =
    currentSelectedRoom &&
    classes.filter(
      (c) =>
        c.salle_id === currentSelectedRoom.id &&
        c.id !== Number(selectedClassId) &&
        c.statut === "active"
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClassId) {
      showToast("Veuillez sélectionner une classe", "error");
      return;
    }

    if (type === "room" || type === "both") {
      assignClassRoom(selectedClassId, selectedRoomId, motif, currentUser?.first_name || "Direction");
    }

    if (type === "titulaire" || type === "both") {
      updateClass(
        selectedClassId,
        { prof_id: selectedProfId ? Number(selectedProfId) : null },
        motif
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#070F26]/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#10224D] border border-blue-400/25 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-5 border-b border-blue-400/20 bg-gradient-to-r from-blue-900/40 to-[#10224D] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center font-bold">
              {type === "titulaire" ? (
                <GraduationCap className="w-5 h-5 text-purple-400" />
              ) : (
                <MapPin className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                {type === "titulaire"
                  ? "Affectation du Titulaire de Classe"
                  : type === "room"
                  ? "Affectation Salle Pédagogique"
                  : "Affectation Classe & Espace"}
              </h2>
              <p className="text-xs text-blue-300/70">
                Gestion des ressources avec contrôle de capacité en temps réel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-300/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Step 1: Select Class */}
          <div>
            <label className="text-xs font-semibold text-blue-200 block mb-1">
              Classe Pédagogique Cible *
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400 font-bold"
            >
              <option value="">-- Choisir une classe --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.nom} ({cls.cycle})
                </option>
              ))}
            </select>
            {currentSelectedClass && (
              <span className="text-[11px] text-blue-300/70 block mt-1">
                Effectif actuel : <strong className="text-white">{classStudentsCount} élèves</strong>
              </span>
            )}
          </div>

          {/* Step 2: Room selection (if applicable) */}
          {(type === "room" || type === "both") && (
            <div>
              <label className="text-xs font-semibold text-blue-200 block mb-1">
                Salle Physique à Affecter
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
              >
                <option value="">-- Aucune salle (Désaffecter) --</option>
                {salles.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nom} ({s.code}) - Capacité : {s.capacite_max} places [{s.batiment}]
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step 3: Titulaire selection (if applicable) */}
          {(type === "titulaire" || type === "both") && (
            <div>
              <label className="text-xs font-semibold text-blue-200 block mb-1">
                Enseignant Titulaire à Nommer
              </label>
              <select
                value={selectedProfId}
                onChange={(e) => setSelectedProfId(e.target.value)}
                className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
              >
                <option value="">-- Aucun titulaire (Vacant) --</option>
                {enseignants.map((ens) => (
                  <option key={ens.id} value={ens.id}>
                    {ens.nom} {ens.prenom} ({ens.specialite || "Enseignant"})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Warnings and Conflicts Display */}
          {isRoomOverloaded && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-rose-300 font-bold">Risque de Surcharge d'Effectif !</strong>
                <p className="text-[11px] opacity-90 mt-0.5">
                  La salle offre <strong>{currentSelectedRoom.capacite_max} places</strong>, alors que la classe compte déjà <strong>{classStudentsCount} élèves inscrits</strong>.
                </p>
              </div>
            </div>
          )}

          {isRoomInMaintenance && (
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-300 font-bold">Salle en Travaux ou Maintenance</strong>
                <p className="text-[11px] opacity-90 mt-0.5">
                  Cette salle est actuellement signalée en état "{currentSelectedRoom.etat}".
                </p>
              </div>
            </div>
          )}

          {otherClassesInRoom && otherClassesInRoom.length > 0 && (
            <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-200 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-blue-300 font-bold">Espace Partagé</strong>
                <p className="text-[11px] opacity-90 mt-0.5">
                  Cette salle est également affectée à : {otherClassesInRoom.map((c) => c.nom).join(", ")}.
                </p>
              </div>
            </div>
          )}

          {/* Reason / Motif */}
          <div>
            <label className="text-xs font-semibold text-blue-200 block mb-1">
              Motif de l'affectation / Remarque d'audit
            </label>
            <input
              type="text"
              placeholder="ex: Rentrée scolaire, augmentation effectif, rotation de locaux..."
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-blue-400/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-blue-400/25 text-blue-300 hover:bg-white/5"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/25 transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirmer l'Affectation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
