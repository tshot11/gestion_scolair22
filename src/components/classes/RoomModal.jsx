import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { X, Building, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, MapPin } from "lucide-react";

export function RoomModal({ isOpen, onClose, editingRoom = null }) {
  const { data, addRoom, updateRoom, showToast } = useApp();

  const typesSalles = data?.typesSalles || [];

  const [formData, setFormData] = useState({
    code: "",
    nom: "",
    type: "Salle de classe ordinaire",
    type_id: 1,
    batiment: "Bâtiment Principal A",
    etage: "Rez-de-chaussée",
    porte: "Porte 01",
    localisation: "",
    longueur: 8.5,
    largeur: 6.0,
    hauteur: 3.0,
    surface: 51.0,
    places_assises: 40,
    capacite: 40,
    capacite_max: 40,
    etat: "bon_etat",
    disponible: true,
    description: "",
  });

  useEffect(() => {
    if (editingRoom) {
      setFormData({
        code: editingRoom.code || "",
        nom: editingRoom.nom || "",
        type: editingRoom.type || "Salle de classe ordinaire",
        type_id: editingRoom.type_id || 1,
        batiment: editingRoom.batiment || "Bâtiment Principal A",
        etage: editingRoom.etage || "Rez-de-chaussée",
        porte: editingRoom.porte || "Porte 01",
        localisation: editingRoom.localisation || "",
        longueur: editingRoom.longueur || 8.5,
        largeur: editingRoom.largeur || 6.0,
        hauteur: editingRoom.hauteur || 3.0,
        surface: editingRoom.surface || Number(((editingRoom.longueur || 8.5) * (editingRoom.largeur || 6.0)).toFixed(2)),
        places_assises: editingRoom.places_assises || editingRoom.capacite || 40,
        capacite: editingRoom.capacite || 40,
        capacite_max: editingRoom.capacite_max || editingRoom.capacite || 40,
        etat: editingRoom.etat || "bon_etat",
        disponible: editingRoom.disponible !== undefined ? editingRoom.disponible : true,
        description: editingRoom.description || "",
      });
    } else {
      const nextNum = ((data?.salles || []).length > 0 ? Math.max(...(data?.salles || []).map((s) => s.id)) : 0) + 1;
      setFormData({
        code: `A-${100 + nextNum}`,
        nom: "",
        type: "Salle de classe ordinaire",
        type_id: 1,
        batiment: "Bâtiment Principal A",
        etage: "Rez-de-chaussée",
        porte: `Porte ${String(nextNum).padStart(2, "0")}`,
        localisation: "Aile Ouest",
        longueur: 8.5,
        largeur: 6.0,
        hauteur: 3.0,
        surface: 51.0,
        places_assises: 40,
        capacite: 40,
        capacite_max: 40,
        etat: "bon_etat",
        disponible: true,
        description: "",
      });
    }
  }, [editingRoom, isOpen]);

  if (!isOpen) return null;

  const handleDimensionChange = (field, value) => {
    const num = Number(value) || 0;
    setFormData((prev) => {
      const updated = { ...prev, [field]: num };
      const surf = Number((updated.longueur * updated.largeur).toFixed(2));
      return { ...updated, surface: surf };
    });
  };

  const handleTypeChange = (typeId) => {
    const tId = Number(typeId);
    const selectedType = typesSalles.find((t) => t.id === tId);
    setFormData((prev) => ({
      ...prev,
      type_id: tId,
      type: selectedType?.nom || prev.type,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nom.trim()) {
      showToast("Veuillez renseigner le nom de la salle", "error");
      return;
    }

    const payload = {
      ...formData,
      longueur: Number(formData.longueur),
      largeur: Number(formData.largeur),
      hauteur: Number(formData.hauteur),
      surface: Number(formData.surface),
      places_assises: Number(formData.places_assises),
      capacite: Number(formData.capacite_max),
      capacite_max: Number(formData.capacite_max),
    };

    if (editingRoom) {
      updateRoom(editingRoom.id, payload, "Modification des spécifications de la salle");
    } else {
      addRoom(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#070F26]/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#10224D] border border-blue-400/25 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-blue-400/20 flex justify-between items-center bg-gradient-to-r from-blue-900/40 to-[#10224D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center font-bold">
              <Building className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                {editingRoom ? "Modifier la Salle Pédagogique" : "Ajouter une Salle Physique"}
              </h2>
              <p className="text-xs text-blue-300/70">
                Spécifications techniques, bâtiment, surface et capacité
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
          {/* Section 1: Identification */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              1. Identification de la Salle
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Code Salle / Identifiant *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: A-101, LAB-SC-01"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Nom de la Salle / Intitulé *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Salle Patrice Lumumba"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Type de Salle Pédagogique
                </label>
                <select
                  value={formData.type_id}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                >
                  {typesSalles.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Bâtiment
                </label>
                <select
                  value={formData.batiment}
                  onChange={(e) => setFormData({ ...formData, batiment: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="Bâtiment Principal A">Bâtiment Principal A</option>
                  <option value="Bâtiment B - Éducation de Base">Bâtiment B - Éducation de Base</option>
                  <option value="Bâtiment C - Sciences & Technologies">Bâtiment C - Sciences & Technologies</option>
                  <option value="Bâtiment Administratif">Bâtiment Administratif</option>
                  <option value="Annexe Maternelle">Annexe Maternelle</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Étage
                </label>
                <select
                  value={formData.etage}
                  onChange={(e) => setFormData({ ...formData, etage: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="Rez-de-chaussée">Rez-de-chaussée</option>
                  <option value="1er Étage">1er Étage</option>
                  <option value="2ème Étage">2ème Étage</option>
                  <option value="Sous-sol">Sous-sol</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Porte / Numéro
                </label>
                <input
                  type="text"
                  placeholder="ex: Porte 01, Porte 12"
                  value={formData.porte}
                  onChange={(e) => setFormData({ ...formData, porte: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Localisation précise
                </label>
                <input
                  type="text"
                  placeholder="ex: Aile Ouest - Face jardin"
                  value={formData.localisation}
                  onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dimensions & Surface */}
          <div className="space-y-4 pt-3 border-t border-blue-400/20">
            <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              2. Dimensions Métriques & Surface
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Longueur (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="50"
                  value={formData.longueur}
                  onChange={(e) => handleDimensionChange("longueur", e.target.value)}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Largeur (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="50"
                  value={formData.largeur}
                  onChange={(e) => handleDimensionChange("largeur", e.target.value)}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Hauteur (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={formData.hauteur}
                  onChange={(e) => handleDimensionChange("hauteur", e.target.value)}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Surface calculée (m²)
                </label>
                <input
                  type="number"
                  readOnly
                  value={formData.surface}
                  className="w-full bg-[#0B1736]/70 border border-blue-400/20 rounded-xl px-3 py-2 text-sm font-bold text-blue-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Capacité & État */}
          <div className="space-y-4 pt-3 border-t border-blue-400/20">
            <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
              3. Capacité & État Opérationnel
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Places Assises
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={formData.places_assises}
                  onChange={(e) => setFormData({ ...formData, places_assises: Number(e.target.value) })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  Capacité Maximale *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="200"
                  value={formData.capacite_max}
                  onChange={(e) => setFormData({ ...formData, capacite_max: Number(e.target.value) })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 block mb-1">
                  État Physique & Entretien
                </label>
                <select
                  value={formData.etat}
                  onChange={(e) => setFormData({ ...formData, etat: e.target.value })}
                  className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="bon_etat">Bon État (Opérationnelle)</option>
                  <option value="a_surveiller">À Surveiller (Réparations mineures)</option>
                  <option value="maintenance">En Maintenance (Travaux en cours)</option>
                  <option value="a_renover">À Rénover</option>
                  <option value="hors_service">Hors Service (Indisponible)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-blue-200 block mb-1">
                Description & Équipements initiaux
              </label>
              <textarea
                rows="2"
                placeholder="Description de la salle, ventilation, orientation, matériel installé..."
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
              {editingRoom ? "Enregistrer les modifications" : "Créer la salle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
