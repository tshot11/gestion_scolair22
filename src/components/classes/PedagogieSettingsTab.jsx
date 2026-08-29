import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Settings,
  BookOpen,
  Building,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  Check,
  CheckCircle2,
  Sliders,
  Shield,
  Save,
} from "lucide-react";

export function PedagogieSettingsTab() {
  const { data, updatePedagogieConfig, showToast } = useApp();

  const [normes, setNormes] = useState(
    data?.normesPedagogiques || {
      capacite_recommandee_defaut: 35,
      seuil_alerte_defaut: 40,
      capacite_max_defaut: 45,
      ratio_m2_eleve_standard: 1.2,
      ratio_m2_eleve_labo: 2.0,
    }
  );

  const [typesSalles, setTypesSalles] = useState(
    data?.typesSalles || [
      { id: 1, nom: "Salle de classe ordinaire", ratio_m2_eleve: 1.2 },
      { id: 2, nom: "Laboratoire Scientifique (Chimie / Physique)", ratio_m2_eleve: 2.0 },
      { id: 3, nom: "Laboratoire Informatique", ratio_m2_eleve: 1.8 },
      { id: 4, nom: "Salle Polyvalente / Conférence", ratio_m2_eleve: 1.0 },
      { id: 5, nom: "Atelier Technique & Professionnel", ratio_m2_eleve: 2.5 },
      { id: 6, nom: "Bibliothèque / Centre de Documentation", ratio_m2_eleve: 2.0 },
    ]
  );

  const [options, setOptions] = useState(data?.options || []);

  const [newOption, setNewOption] = useState({ nom: "", code: "", section: "Scientifique", filiere: "" });
  const [isAddingOption, setIsAddingOption] = useState(false);

  const [newTypeSalle, setNewTypeSalle] = useState({ nom: "", ratio_m2_eleve: 1.5 });
  const [isAddingTypeSalle, setIsAddingTypeSalle] = useState(false);

  const handleSaveNormes = (e) => {
    e.preventDefault();
    updatePedagogieConfig({
      normesPedagogiques: {
        capacite_recommandee_defaut: Number(normes.capacite_recommandee_defaut),
        seuil_alerte_defaut: Number(normes.seuil_alerte_defaut),
        capacite_max_defaut: Number(normes.capacite_max_defaut),
        ratio_m2_eleve_standard: Number(normes.ratio_m2_eleve_standard),
        ratio_m2_eleve_labo: Number(normes.ratio_m2_eleve_labo),
      },
    });
  };

  const handleAddOption = (e) => {
    e.preventDefault();
    if (!newOption.nom.trim()) return;

    const nextId = (options.length > 0 ? Math.max(...options.map((o) => o.id)) : 0) + 1;
    const updatedOptions = [...options, { id: nextId, ...newOption }];
    setOptions(updatedOptions);
    updatePedagogieConfig({ options: updatedOptions });
    setNewOption({ nom: "", code: "", section: "Scientifique", filiere: "" });
    setIsAddingOption(false);
    showToast(`Option ${newOption.nom} ajoutée avec succès !`);
  };

  const handleDeleteOption = (id) => {
    const updated = options.filter((o) => o.id !== id);
    setOptions(updated);
    updatePedagogieConfig({ options: updated });
    showToast(`Option retirée de la liste.`);
  };

  const handleAddTypeSalle = (e) => {
    e.preventDefault();
    if (!newTypeSalle.nom.trim()) return;

    const nextId = (typesSalles.length > 0 ? Math.max(...typesSalles.map((t) => t.id)) : 0) + 1;
    const updated = [...typesSalles, { id: nextId, nom: newTypeSalle.nom, ratio_m2_eleve: Number(newTypeSalle.ratio_m2_eleve) }];
    setTypesSalles(updated);
    updatePedagogieConfig({ typesSalles: updated });
    setNewTypeSalle({ nom: "", ratio_m2_eleve: 1.5 });
    setIsAddingTypeSalle(false);
    showToast(`Type de salle ajouté.`);
  };

  const handleDeleteTypeSalle = (id) => {
    const updated = typesSalles.filter((t) => t.id !== id);
    setTypesSalles(updated);
    updatePedagogieConfig({ typesSalles: updated });
    showToast(`Type de salle retiré.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div>
        <h3 className="text-base font-extrabold text-white font-heading">
          Paramètres Pédagogiques & Normes d'Espaces Scolaires RDC
        </h3>
        <p className="text-xs text-blue-300/70">
          Configuration dynamique des cycles d'enseignement, options congolaises et seuils d'accueil
        </p>
      </div>

      {/* Normes de Capacité Défaut */}
      <form onSubmit={handleSaveNormes} className="p-5 rounded-2xl bg-[#12305A]/45 border border-[#94C5FF]/15 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            Normes & Capacités par Défaut lors de la Création
          </h4>

          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg"
          >
            <Save className="w-3.5 h-3.5" />
            Enregistrer les normes
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-bold text-emerald-300 block mb-1">
              Capacité Recommandée par défaut
            </label>
            <input
              type="number"
              min={1}
              value={normes.capacite_recommandee_defaut}
              onChange={(e) => setNormes({ ...normes, capacite_recommandee_defaut: Number(e.target.value) })}
              className="w-full bg-black/30 border border-emerald-500/30 rounded-xl px-3 py-2 text-sm font-bold text-emerald-300 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-amber-300 block mb-1">
              Seuil d'Alerte par défaut
            </label>
            <input
              type="number"
              min={1}
              value={normes.seuil_alerte_defaut}
              onChange={(e) => setNormes({ ...normes, seuil_alerte_defaut: Number(e.target.value) })}
              className="w-full bg-black/30 border border-amber-500/30 rounded-xl px-3 py-2 text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-rose-300 block mb-1">
              Capacité Maximale par défaut
            </label>
            <input
              type="number"
              min={1}
              value={normes.capacite_max_defaut}
              onChange={(e) => setNormes({ ...normes, capacite_max_defaut: Number(e.target.value) })}
              className="w-full bg-black/30 border border-rose-500/30 rounded-xl px-3 py-2 text-sm font-bold text-rose-300 focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>
      </form>

      {/* Options & Filières */}
      <div className="p-5 rounded-2xl bg-[#12305A]/45 border border-[#94C5FF]/15 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Options & Filières des Humanités (RDC)
            </h4>
            <p className="text-[11px] text-blue-300/60">
              Liste dynamique des options du secondaire congolais disponibles dans l'établissement
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingOption(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter une option
          </button>
        </div>

        {/* Add option form */}
        {isAddingOption && (
          <form onSubmit={handleAddOption} className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-purple-200 block mb-1">Nom de l'option *</label>
                <input
                  type="text"
                  required
                  value={newOption.nom}
                  onChange={(e) => setNewOption({ ...newOption, nom: e.target.value })}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                  placeholder="ex: Nutrition & Diététique"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-purple-200 block mb-1">Code</label>
                <input
                  type="text"
                  value={newOption.code}
                  onChange={(e) => setNewOption({ ...newOption, code: e.target.value })}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                  placeholder="ex: NUT"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-purple-200 block mb-1">Section</label>
                <input
                  type="text"
                  value={newOption.section}
                  onChange={(e) => setNewOption({ ...newOption, section: e.target.value })}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                  placeholder="ex: Technique"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingOption(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
              >
                Enregistrer l'option
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between gap-2 text-xs"
            >
              <div className="min-w-0">
                <span className="font-bold text-white block truncate">{opt.nom}</span>
                <span className="text-[10px] text-blue-300/60 block">
                  Code : {opt.code} • Section : {opt.section}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteOption(opt.id)}
                className="p-1 rounded-lg hover:bg-rose-600/20 text-blue-300/60 hover:text-rose-400 transition"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Types de Salles Physiques */}
      <div className="p-5 rounded-2xl bg-[#12305A]/45 border border-[#94C5FF]/15 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              Typologies des Locaux & Salles Pédagogiques
            </h4>
            <p className="text-[11px] text-blue-300/60">
              Types de salles et ratios m² recommandés par élève
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingTypeSalle(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter un type
          </button>
        </div>

        {/* Add Type Salle Form */}
        {isAddingTypeSalle && (
          <form onSubmit={handleAddTypeSalle} className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-emerald-200 block mb-1">Désignation du type *</label>
                <input
                  type="text"
                  required
                  value={newTypeSalle.nom}
                  onChange={(e) => setNewTypeSalle({ ...newTypeSalle, nom: e.target.value })}
                  className="w-full bg-black/30 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  placeholder="ex: Salle de Dessin Technique"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-emerald-200 block mb-1">Ratio m²/élève</label>
                <input
                  type="number"
                  step="0.1"
                  value={newTypeSalle.ratio_m2_eleve}
                  onChange={(e) => setNewTypeSalle({ ...newTypeSalle, ratio_m2_eleve: Number(e.target.value) })}
                  className="w-full bg-black/30 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingTypeSalle(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
              >
                Enregistrer le type
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {typesSalles.map((t) => (
            <div
              key={t.id}
              className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between gap-2 text-xs"
            >
              <div className="min-w-0">
                <span className="font-bold text-white block truncate">{t.nom}</span>
                <span className="text-[10px] text-emerald-300 block">
                  Norme : {t.ratio_m2_eleve} m² / élève
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteTypeSalle(t.id)}
                className="p-1 rounded-lg hover:bg-rose-600/20 text-blue-300/60 hover:text-rose-400 transition"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
