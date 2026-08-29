import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { X, BookOpen, GraduationCap, MapPin, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, Building } from "lucide-react";

export function ClassModal({ isOpen, onClose, editingClass = null }) {
  const { data, addClass, updateClass, showToast } = useApp();

  const [formData, setFormData] = useState({
    nom: "",
    code: "",
    division: "A",
    cycle_id: 4,
    niveau_id: 12,
    option_id: "",
    section: "Scientifique",
    filiere: "",
    capacite_recommandee: 35,
    seuil_alerte: 40,
    capacite_max: 45,
    prof_id: "",
    salle_id: "",
    statut: "active",
    description: "",
    annee_scolaire: data?.ecoleConfig?.annee_courante || "2025-2026",
  });

  const cycles = data?.cycles || [];
  const niveaux = data?.niveaux || [];
  const options = data?.options || [];
  const enseignants = data?.enseignants || [];
  const salles = data?.salles || [];

  // Filter levels based on chosen cycle
  const filteredNiveaux = niveaux.filter(
    (n) => !formData.cycle_id || Number(n.cycle_id) === Number(formData.cycle_id)
  );

  useEffect(() => {
    if (editingClass) {
      setFormData({
        nom: editingClass.nom || "",
        code: editingClass.code || "",
        division: editingClass.division || "A",
        cycle_id: editingClass.cycle_id || 4,
        niveau_id: editingClass.niveau_id || (filteredNiveaux[0]?.id || 1),
        option_id: editingClass.option_id || "",
        section: editingClass.section || "Générale",
        filiere: editingClass.filiere || "",
        capacite_recommandee: editingClass.capacite_recommandee || 35,
        seuil_alerte: editingClass.seuil_alerte || 40,
        capacite_max: editingClass.capacite_max || editingClass.capacite || 45,
        prof_id: editingClass.prof_id || "",
        salle_id: editingClass.salle_id || "",
        statut: editingClass.statut || "active",
        description: editingClass.description || "",
        annee_scolaire: editingClass.annee_scolaire || data?.ecoleConfig?.annee_courante || "2025-2026",
      });
    } else {
      // Auto-generate suggested name & code for new class
      const defaultCycle = cycles[3] || cycles[0] || { id: 4, nom: "Humanités" };
      const defaultNiveau = filteredNiveaux[0] || niveaux[0] || { id: 12, nom: "1ère Humanités" };
      setFormData({
        nom: "",
        code: "",
        division: "A",
        cycle_id: defaultCycle.id,
        niveau_id: defaultNiveau.id,
        option_id: "",
        section: "Scientifique",
        filiere: "",
        capacite_recommandee: data?.normesPedagogiques?.capacite_recommandee_defaut || 35,
        seuil_alerte: data?.normesPedagogiques?.seuil_alerte_defaut || 40,
        capacite_max: data?.normesPedagogiques?.capacite_max_defaut || 45,
        prof_id: "",
        salle_id: "",
        statut: "active",
        description: "",
        annee_scolaire: data?.ecoleConfig?.annee_courante || "2025-2026",
      });
    }
  }, [editingClass, isOpen]);

  if (!isOpen) return null;

  const handleCycleChange = (cycleId) => {
    const cId = Number(cycleId);
    const selectedCycle = cycles.find((c) => c.id === cId);
    const matchedNiveaux = niveaux.filter((n) => Number(n.cycle_id) === cId);
    const firstNiveau = matchedNiveaux[0] || null;

    setFormData((prev) => ({
      ...prev,
      cycle_id: cId,
      cycle: selectedCycle?.nom || "",
      niveau_id: firstNiveau ? firstNiveau.id : "",
      annee_etude: firstNiveau ? firstNiveau.nom : "",
    }));
  };

  const handleOptionChange = (optionId) => {
    const optId = optionId ? Number(optionId) : null;
    const selectedOpt = options.find((o) => o.id === optId);

    setFormData((prev) => ({
      ...prev,
      option_id: optId,
      section: selectedOpt?.section || prev.section,
      filiere: selectedOpt?.filiere || prev.filiere,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nom.trim()) {
      showToast("Veuillez saisir un nom pour la classe", "error");
      return;
    }

    const selectedCycle = cycles.find((c) => c.id === Number(formData.cycle_id));
    const selectedNiveau = niveaux.find((n) => n.id === Number(formData.niveau_id));

    const payload = {
      ...formData,
      cycle: selectedCycle?.nom || "Non spécifié",
      annee_etude: selectedNiveau?.nom || "Non spécifié",
      capacite_recommandee: Number(formData.capacite_recommandee),
      seuil_alerte: Number(formData.seuil_alerte),
      capacite_max: Number(formData.capacite_max),
      capacite: Number(formData.capacite_max),
      prof_id: formData.prof_id ? Number(formData.prof_id) : null,
      salle_id: formData.salle_id ? Number(formData.salle_id) : null,
    };

    if (editingClass) {
      updateClass(editingClass.id, payload, "Modification des paramètres de la classe");
    } else {
      addClass(payload);
    }

    onClose();
  };

  // Selected room check
  const selectedRoomObj = salles.find((s) => s.id === Number(formData.salle_id));
  const roomWarning =
    selectedRoomObj && selectedRoomObj.capacite_max < Number(formData.capacite_max);

  return (
    <div className="fixed inset-0 bg-[#070F26]/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#10224D] border border-blue-400/25 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-blue-400/20 flex justify-between items-center bg-gradient-to-r from-blue-900/40 to-[#10224D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                {editingClass ? "Modifier la Classe Pédagogique" : "Créer une Nouvelle Classe"}
              </h2>
              <p className="text-xs text-blue-300/70">
                Structure pédagogique, titulaire et affectation de salle (RDC)
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Main Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              1. Identification & Nomenclature
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Nom complet de la classe *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: 1ère Humanité Scientifique A"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white placeholder:text-blue-300/40 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Code / Réf
                </label>
                <input
                  type="text"
                  placeholder="ex: HUM-1-BIO"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white placeholder:text-blue-300/40 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Cycle Scolaire
                </label>
                <select
                  value={formData.cycle_id}
                  onChange={(e) => handleCycleChange(e.target.value)}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                >
                  {cycles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Niveau d'étude
                </label>
                <select
                  value={formData.niveau_id}
                  onChange={(e) => setFormData({ ...formData, niveau_id: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                >
                  {filteredNiveaux.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Division / Lettre
                </label>
                <input
                  type="text"
                  placeholder="ex: A, B, C ou Unique"
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Option (MINEPST / Secondaire)
                </label>
                <select
                  value={formData.option_id || ""}
                  onChange={(e) => handleOptionChange(e.target.value)}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="">Aucune / Troncs communs (Primaire/EB)</option>
                  {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.nom} ({opt.section})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Statut de la classe
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="active">Active (Enseignement en cours)</option>
                  <option value="inactive">Inactive</option>
                  <option value="archivee">Archivée</option>
                </select>
              </div>
            </div>
          </div>

          {/* Capacités et Normes */}
          <div className="space-y-4 pt-3 border-t border-blue-400/20">
            <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
              2. Normes d'Effectifs & Capacités
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Capacité Recommandée
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.capacite_recommandee}
                  onChange={(e) =>
                    setFormData({ ...formData, capacite_recommandee: Number(e.target.value) })
                  }
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                />
                <span className="text-[10px] text-blue-300/50 block mt-0.5">Idéal pédagogique</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Seuil d'Alerte
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.seuil_alerte}
                  onChange={(e) =>
                    setFormData({ ...formData, seuil_alerte: Number(e.target.value) })
                  }
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                />
                <span className="text-[10px] text-amber-400/70 block mt-0.5">Alerte vigilance</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Capacité Maximale *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={formData.capacite_max}
                  onChange={(e) =>
                    setFormData({ ...formData, capacite_max: Number(e.target.value) })
                  }
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400 font-bold text-emerald-400"
                />
                <span className="text-[10px] text-rose-400/70 block mt-0.5">Plafond strict</span>
              </div>
            </div>
          </div>

          {/* Titulaire et Salle */}
          <div className="space-y-4 pt-3 border-t border-blue-400/20">
            <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
              3. Affectations Administratives & Locaux
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Enseignant Titulaire (Maître de classe)
                </label>
                <select
                  value={formData.prof_id || ""}
                  onChange={(e) => setFormData({ ...formData, prof_id: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="">-- Aucun titulaire assigné --</option>
                  {enseignants.map((ens) => (
                    <option key={ens.id} value={ens.id}>
                      {ens.nom} {ens.prenom} ({ens.specialite || "Enseignant"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Salle Physique / Espace Pédagogique
                </label>
                <select
                  value={formData.salle_id || ""}
                  onChange={(e) => setFormData({ ...formData, salle_id: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="">-- Aucune salle physique assignée --</option>
                  {salles.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nom} ({s.code}) - Capacité : {s.capacite_max} places ({s.batiment})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {roomWarning && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Attention : La capacité de la salle sélectionnée ({selectedRoomObj.capacite_max} places) est inférieure à la capacité max de la classe ({formData.capacite_max} places).
                </span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-blue-200 block mb-1">
                Description & Remarques pédagogiques
              </label>
              <textarea
                rows="2"
                placeholder="Objectifs pédagogiques, orientation de classe, spécificités..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-blue-400/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-blue-400/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-200 text-xs font-semibold transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {editingClass ? "Enregistrer les modifications" : "Créer la classe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
