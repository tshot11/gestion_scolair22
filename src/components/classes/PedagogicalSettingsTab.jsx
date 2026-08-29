import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  Sliders,
  Sparkles,
  BookOpen,
  GraduationCap,
  Building,
  ShieldAlert,
} from "lucide-react";

export function PedagogicalSettingsTab() {
  const { data, updatePedagogieConfig, showToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState("cycles_niveaux"); // cycles_niveaux | options | types_salles | normes

  // Local states for editing
  const [cycles, setCycles] = useState(data?.cycles || []);
  const [niveaux, setNiveaux] = useState(data?.niveaux || []);
  const [options, setOptions] = useState(data?.options || []);
  const [typesSalles, setTypesSalles] = useState(data?.typesSalles || []);
  const [normes, setNormes] = useState(
    data?.normesPedagogiques || {
      capacite_recommandee_defaut: 35,
      seuil_alerte_defaut: 40,
      capacite_max_defaut: 45,
      surface_minimale_par_eleve: 1.3,
    }
  );

  // New item draft states
  const [newCycle, setNewCycle] = useState({ nom: "", description: "" });
  const [newNiveau, setNewNiveau] = useState({ nom: "", cycle_id: 1 });
  const [newOption, setNewOption] = useState({ nom: "", code: "", section: "Scientifique", filiere: "Générale" });
  const [newTypeSalle, setNewTypeSalle] = useState({ nom: "", description: "" });

  /* Cycle Actions */
  const handleAddCycle = (e) => {
    e.preventDefault();
    if (!newCycle.nom.trim()) return;
    const nextId = (cycles.length > 0 ? Math.max(...cycles.map((c) => c.id)) : 0) + 1;
    const updated = [...cycles, { id: nextId, nom: newCycle.nom.trim(), description: newCycle.description }];
    setCycles(updated);
    updatePedagogieConfig({ cycles: updated });
    setNewCycle({ nom: "", description: "" });
    showToast("Cycle scolaire ajouté !");
  };

  const handleDeleteCycle = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce cycle ?")) {
      const updated = cycles.filter((c) => c.id !== id);
      setCycles(updated);
      updatePedagogieConfig({ cycles: updated });
    }
  };

  /* Niveau Actions */
  const handleAddNiveau = (e) => {
    e.preventDefault();
    if (!newNiveau.nom.trim()) return;
    const nextId = (niveaux.length > 0 ? Math.max(...niveaux.map((n) => n.id)) : 0) + 1;
    const updated = [...niveaux, { id: nextId, nom: newNiveau.nom.trim(), cycle_id: Number(newNiveau.cycle_id) }];
    setNiveaux(updated);
    updatePedagogieConfig({ niveaux: updated });
    setNewNiveau({ nom: "", cycle_id: cycles[0]?.id || 1 });
    showToast("Niveau d'étude ajouté !");
  };

  const handleDeleteNiveau = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce niveau ?")) {
      const updated = niveaux.filter((n) => n.id !== id);
      setNiveaux(updated);
      updatePedagogieConfig({ niveaux: updated });
    }
  };

  /* Option Actions */
  const handleAddOption = (e) => {
    e.preventDefault();
    if (!newOption.nom.trim()) return;
    const nextId = (options.length > 0 ? Math.max(...options.map((o) => o.id)) : 0) + 1;
    const updated = [
      ...options,
      {
        id: nextId,
        nom: newOption.nom.trim(),
        code: newOption.code.trim() || `OPT-${nextId}`,
        section: newOption.section,
        filiere: newOption.filiere,
      },
    ];
    setOptions(updated);
    updatePedagogieConfig({ options: updated });
    setNewOption({ nom: "", code: "", section: "Scientifique", filiere: "Générale" });
    showToast("Option MINEPST ajoutée !");
  };

  const handleDeleteOption = (id) => {
    if (window.confirm("Supprimer cette option pédagogique ?")) {
      const updated = options.filter((o) => o.id !== id);
      setOptions(updated);
      updatePedagogieConfig({ options: updated });
    }
  };

  /* Type Salle Actions */
  const handleAddTypeSalle = (e) => {
    e.preventDefault();
    if (!newTypeSalle.nom.trim()) return;
    const nextId = (typesSalles.length > 0 ? Math.max(...typesSalles.map((t) => t.id)) : 0) + 1;
    const updated = [...typesSalles, { id: nextId, nom: newTypeSalle.nom.trim(), description: newTypeSalle.description }];
    setTypesSalles(updated);
    updatePedagogieConfig({ typesSalles: updated });
    setNewTypeSalle({ nom: "", description: "" });
    showToast("Type de salle ajouté !");
  };

  const handleDeleteTypeSalle = (id) => {
    if (window.confirm("Supprimer ce type de salle ?")) {
      const updated = typesSalles.filter((t) => t.id !== id);
      setTypesSalles(updated);
      updatePedagogieConfig({ typesSalles: updated });
    }
  };

  /* Normes Save */
  const handleSaveNormes = (e) => {
    e.preventDefault();
    updatePedagogieConfig({ normesPedagogiques: normes });
    showToast("Normes pédagogiques enregistrées !");
  };

  return (
    <div className="space-y-6">
      {/* Sub-nav Buttons */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#0B1736]/80 rounded-2xl border border-blue-400/20 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab("cycles_niveaux")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
            activeSubTab === "cycles_niveaux"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "text-blue-300/70 hover:text-white hover:bg-white/5"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Cycles & Niveaux d'Étude</span>
        </button>

        <button
          onClick={() => setActiveSubTab("options")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
            activeSubTab === "options"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "text-blue-300/70 hover:text-white hover:bg-white/5"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Sections & Options MINEPST</span>
        </button>

        <button
          onClick={() => setActiveSubTab("types_salles")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
            activeSubTab === "types_salles"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "text-blue-300/70 hover:text-white hover:bg-white/5"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Types de Salles Pédagogiques</span>
        </button>

        <button
          onClick={() => setActiveSubTab("normes")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
            activeSubTab === "normes"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "text-blue-300/70 hover:text-white hover:bg-white/5"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Normes & Seuils d'Alerte</span>
        </button>
      </div>

      {/* SUBTAB 1: CYCLES & NIVEAUX */}
      {activeSubTab === "cycles_niveaux" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cycles Panel */}
          <div className="p-5 rounded-2xl bg-[#10224D]/80 border border-blue-400/20 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Cycles Scolaires ({cycles.length})
              </h3>
            </div>

            <form onSubmit={handleAddCycle} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Nom du cycle (ex: Maternelle, Primaire, EB...)"
                value={newCycle.nom}
                onChange={(e) => setNewCycle({ ...newCycle, nom: e.target.value })}
                className="flex-1 bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-blue-300/40 focus:outline-none focus:border-blue-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </form>

            <div className="space-y-2">
              {cycles.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-[#0B1736]/60 border border-blue-400/15 flex items-center justify-between gap-3 hover:border-blue-400/30 transition text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center text-[10px]">
                      {c.id}
                    </span>
                    <span className="font-bold text-white">{c.nom}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCycle(c.id)}
                    className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20 transition"
                    title="Supprimer le cycle"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Niveaux Panel */}
          <div className="p-5 rounded-2xl bg-[#10224D]/80 border border-blue-400/20 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                Niveaux d'Étude & Promotions ({niveaux.length})
              </h3>
            </div>

            <form onSubmit={handleAddNiveau} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                required
                placeholder="Nom du niveau (ex: 5ème Primaire)"
                value={newNiveau.nom}
                onChange={(e) => setNewNiveau({ ...newNiveau, nom: e.target.value })}
                className="sm:col-span-2 bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-blue-300/40 focus:outline-none focus:border-blue-400"
              />
              <div className="flex gap-2">
                <select
                  value={newNiveau.cycle_id}
                  onChange={(e) => setNewNiveau({ ...newNiveau, cycle_id: e.target.value })}
                  className="flex-1 bg-[#0B1736] border border-blue-400/20 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-400"
                >
                  {cycles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 shrink-0 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {niveaux.map((n) => {
                const cycle = cycles.find((c) => c.id === n.cycle_id);
                return (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-[#0B1736]/60 border border-blue-400/15 flex items-center justify-between gap-3 hover:border-blue-400/30 transition text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{n.nom}</span>
                      <span className="text-[10px] text-blue-300/60 block">
                        Cycle : {cycle?.nom || "Non rattaché"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteNiveau(n.id)}
                      className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20 transition"
                      title="Supprimer le niveau"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: OPTIONS */}
      {activeSubTab === "options" && (
        <div className="p-5 rounded-2xl bg-[#10224D]/80 border border-blue-400/20 space-y-5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                Sections & Options Pédagogiques Officielles (RDC)
              </h3>
              <p className="text-xs text-blue-300/60 mt-0.5">
                Nomenclature MINEPST pour les Humanités et Enseignement Technique
              </p>
            </div>
          </div>

          <form onSubmit={handleAddOption} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-[#0B1736]/60 p-3 rounded-xl border border-blue-400/15 text-xs">
            <input
              type="text"
              required
              placeholder="Nom de l'option (ex: Biologie-Chimie)"
              value={newOption.nom}
              onChange={(e) => setNewOption({ ...newOption, nom: e.target.value })}
              className="bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-white placeholder:text-blue-300/40 focus:outline-none focus:border-blue-400"
            />
            <input
              type="text"
              placeholder="Code (ex: BIO-CHIM)"
              value={newOption.code}
              onChange={(e) => setNewOption({ ...newOption, code: e.target.value })}
              className="bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-white placeholder:text-blue-300/40 focus:outline-none focus:border-blue-400"
            />
            <select
              value={newOption.section}
              onChange={(e) => setNewOption({ ...newOption, section: e.target.value })}
              className="bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-400"
            >
              <option value="Scientifique">Section Scientifique</option>
              <option value="Littéraire">Section Littéraire</option>
              <option value="Commerciale & Gestion">Section Commerciale & Gestion</option>
              <option value="Pédagogique">Section Pédagogique</option>
              <option value="Technique & Professionnelle">Section Technique</option>
              <option value="Arts & Métiers">Section Arts & Métiers</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold flex items-center justify-center gap-1.5 transition shadow-md shadow-blue-500/25"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter l'Option</span>
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {options.map((opt) => (
              <div
                key={opt.id}
                className="p-3.5 rounded-xl bg-[#0B1736]/60 border border-blue-400/15 flex items-start justify-between gap-3 hover:border-blue-400/30 transition text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-400/20">
                      {opt.code}
                    </span>
                    <span className="text-[10px] text-blue-300/60 font-semibold">{opt.section}</span>
                  </div>
                  <h5 className="font-bold text-white text-sm mt-1">{opt.nom}</h5>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteOption(opt.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition"
                  title="Supprimer l'option"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: TYPES DE SALLES */}
      {activeSubTab === "types_salles" && (
        <div className="p-5 rounded-2xl bg-[#10224D]/80 border border-blue-400/20 space-y-5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-400" />
                Typologie des Salles Pédagogiques & Espaces Didactiques
              </h3>
              <p className="text-xs text-blue-300/60 mt-0.5">
                Classification des infrastructures scolaires (classes, labos, ateliers...)
              </p>
            </div>
          </div>

          <form onSubmit={handleAddTypeSalle} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Nouveau type de salle (ex: Salle Polyvalente, Dojo...)"
              value={newTypeSalle.nom}
              onChange={(e) => setNewTypeSalle({ ...newTypeSalle, nom: e.target.value })}
              className="flex-1 bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-blue-300/40 focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {typesSalles.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-xl bg-[#0B1736]/60 border border-blue-400/15 flex items-center justify-between gap-3 hover:border-blue-400/30 transition text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">{t.nom}</h5>
                    <span className="text-[10px] text-blue-300/60">{t.description || "Espace standard"}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteTypeSalle(t.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition"
                  title="Supprimer ce type"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: NORMES & SEUILS */}
      {activeSubTab === "normes" && (
        <form onSubmit={handleSaveNormes} className="p-5 rounded-2xl bg-[#10224D]/80 border border-blue-400/20 space-y-5 shadow-lg">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Normes Pédagogiques & Seuils d'Alerte par Défaut
            </h3>
            <p className="text-xs text-blue-300/60 mt-0.5">
              Ces paramètres calibreront les alertes automatiques et le calcul des surcharges d'effectifs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#0B1736]/60 border border-blue-400/15 space-y-1.5">
              <label className="font-bold text-blue-200 block">
                Capacité Recommandée
              </label>
              <input
                type="number"
                min="10"
                max="80"
                value={normes.capacite_recommandee_defaut}
                onChange={(e) =>
                  setNormes({ ...normes, capacite_recommandee_defaut: Number(e.target.value) })
                }
                className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
              />
              <span className="text-[10px] text-blue-300/60 block">Idéal pour le confort d'apprentissage</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1736]/60 border border-blue-400/15 space-y-1.5">
              <label className="font-bold text-amber-300 block">
                Seuil d'Alerte (Vigilance)
              </label>
              <input
                type="number"
                min="10"
                max="90"
                value={normes.seuil_alerte_defaut}
                onChange={(e) =>
                  setNormes({ ...normes, seuil_alerte_defaut: Number(e.target.value) })
                }
                className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
              />
              <span className="text-[10px] text-amber-400/70 block">Déclenche un voyant orange au tableau de bord</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1736]/60 border border-blue-400/15 space-y-1.5">
              <label className="font-bold text-rose-300 block">
                Capacité Maximale Autorisée
              </label>
              <input
                type="number"
                min="10"
                max="120"
                value={normes.capacite_max_defaut}
                onChange={(e) =>
                  setNormes({ ...normes, capacite_max_defaut: Number(e.target.value) })
                }
                className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
              />
              <span className="text-[10px] text-rose-400/70 block">Plafond strict au-delà duquel il y a surcharge</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1736]/60 border border-blue-400/15 space-y-1.5">
              <label className="font-bold text-emerald-300 block">
                Surface Min. / Élève (m²)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.8"
                max="5.0"
                value={normes.surface_minimale_par_eleve}
                onChange={(e) =>
                  setNormes({ ...normes, surface_minimale_par_eleve: Number(e.target.value) })
                }
                className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
              />
              <span className="text-[10px] text-emerald-400/70 block">Norme d'hygiène et sécurité scolaire</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les Normes Pédagogiques</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
