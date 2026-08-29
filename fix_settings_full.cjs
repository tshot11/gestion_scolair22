const fs = require('fs');

const content = `import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Settings,
  School,
  Smartphone,
  Database,
  RefreshCw,
  Download,
  Image, 
  Trash2, 
  Plus, 
  Edit2, 
  X,
  CheckCircle2,
  DollarSign,
  Sparkles,
} from "lucide-react";

export function SettingsView() {
  const {
    data,
    updateEcoleConfig,
    resetToInitialData,
    isMobileSimulator,
    setIsMobileSimulator,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('general');

  const [configForm, setConfigForm] = useState({
    nom: (data?.ecoleConfig || {}).nom || "",
    code_ministeriel: (data?.ecoleConfig || {}).code_ministeriel || "",
    province_educationnelle: (data?.ecoleConfig || {}).province_educationnelle || "",
    annee_courante: (data?.ecoleConfig || {}).annee_courante || "",
    periode_active: (data?.ecoleConfig || {}).periode_active || "",
    taux_change_usd: (data?.ecoleConfig || {}).taux_change_usd || 0,
  });

  const defaultSlides = [
    {
      title: "Rentrée scolaire",
      desc: "Préparez la rentrée en toute sérénité. Découvrez les dates clés, les modalités d'inscription et les réunions d'information.",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
      badge: "Information",
      action: "Voir le calendrier",
    },
    {
      title: "Inscriptions ouvertes",
      desc: "Les inscriptions sont ouvertes. Retrouvez les documents nécessaires, les tarifs et les informations par section.",
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=1200&auto=format&fit=crop",
      badge: "Admission",
      action: "Dossier d'inscription",
    },
    {
      title: "Excellence académique",
      desc: "Découvrez les résultats et les informations importantes concernant la réussite de nos élèves.",
      image: "https://images.unsplash.com/photo-1522661067900-ab828854a284?q=80&w=1200&auto=format&fit=crop",
      badge: "Palmarès",
      action: "Voir les résultats",
    },
  ];

  const [slides, setSlides] = useState((data?.ecoleConfig?.landingSlides || []).length > 0 ? data.ecoleConfig.landingSlides : defaultSlides);
  const [logo, setLogo] = useState(data?.ecoleConfig?.logo || '');

  const handleSaveConfig = (e) => {
    e.preventDefault();
    updateEcoleConfig({
      ...configForm,
      taux_change_usd: Number(configForm.taux_change_usd),
    });
  };

  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      \`ecole_rdc_backup_\${new Date().toISOString().slice(0, 10)}.json\`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Base de données exportée en JSON avec succès !");
  };

  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddSlide = () => {
    setSlides([...slides, { title: "", desc: "", image: "", badge: "", action: "" }]);
  };

  const handleUpdateSlide = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const handleRemoveSlide = (index) => {
    const newSlides = [...slides];
    newSlides.splice(index, 1);
    setSlides(newSlides);
  };

  const handleSaveImagesConfig = () => {
    updateEcoleConfig({
      landingSlides: slides,
      logo: logo
    });
    showToast("Images de l'accueil et logo mis à jour !");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto pb-24 sm:pb-8">
      {/* Tabs Navigation */}
      <div className="flex border-b border-[#94C5FF]/15 gap-4">
        <button
          onClick={() => setActiveTab('general')}
          className={\`pb-2 text-sm font-bold transition-all border-b-2 \${activeTab === 'general' ? 'border-blue-500 text-white' : 'border-transparent text-blue-300/70 hover:text-white'}\`}
        >
          Général
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={\`pb-2 text-sm font-bold transition-all border-b-2 \${activeTab === 'images' ? 'border-blue-500 text-white' : 'border-transparent text-blue-300/70 hover:text-white'}\`}
        >
          Accueil & Images
        </button>
      </div>

      {activeTab === 'general' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              Paramètres & Configuration de l'Établissement
            </h2>
            <p className="text-xs sm:text-sm text-blue-300/70">
              Personnalisation des informations légales RDC, taux de change et
              sauvegarde
            </p>
          </div>

          {/* School Legal Config Card */}
          <div className="bg-[#12305A]/45 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#94C5FF]/15">
              <School className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white font-heading">
                Informations Officielles du Complexe Scolaire
              </h3>
            </div>
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-blue-300 mb-1">
                    Nom de l'Établissement
                  </label>
                  <input
                    type="text"
                    required
                    value={configForm.nom}
                    onChange={(e) =>
                      setConfigForm({ ...configForm, nom: e.target.value })
                    }
                    className="w-full bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-300 mb-1">
                    Code Ministériel (SECOPE / EPST)
                  </label>
                  <input
                    type="text"
                    required
                    value={configForm.code_ministeriel}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        code_ministeriel: e.target.value,
                      })
                    }
                    className="w-full bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-300 mb-1">
                    Province Éducationnelle
                  </label>
                  <input
                    type="text"
                    required
                    value={configForm.province_educationnelle}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        province_educationnelle: e.target.value,
                      })
                    }
                    className="w-full bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-300 mb-1">
                    Année Scolaire en cours
                  </label>
                  <input
                    type="text"
                    required
                    value={configForm.annee_courante}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        annee_courante: e.target.value,
                      })
                    }
                    className="w-full bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-300 mb-1">
                    Période Active
                  </label>
                  <input
                    type="text"
                    required
                    value={configForm.periode_active}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        periode_active: e.target.value,
                      })
                    }
                    className="w-full bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-300 mb-1">
                    Taux de Change (1 USD en Francs Congolais)
                  </label>
                  <input
                    type="number"
                    required
                    value={configForm.taux_change_usd}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        taux_change_usd: e.target.value,
                      })
                    }
                    className="w-full bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-blue-400 font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition active:scale-95"
                >
                  Enregistrer les Modifications
                </button>
              </div>
            </form>
          </div>

          {/* Simulator Mode & Mobile View */}
          <div className="bg-[#12305A]/45 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">
                    Simulateur Mobile / Mode Écran Réduit
                  </h3>
                  <p className="text-xs text-blue-300/70">
                    Tester l'ergonomie tactile mobile et les menus déroulants
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileSimulator(!isMobileSimulator)}
                className={\`px-4 py-2 rounded-xl text-xs font-bold transition \${isMobileSimulator ? "bg-blue-600 text-white" : "bg-[#12305A]/45 backdrop-blur-md text-blue-200 hover:bg-blue-500/20"}\`}
              >
                {isMobileSimulator
                  ? "Mode Mobile Activé"
                  : "Mode Mobile Désactivé"}
              </button>
            </div>
          </div>

          {/* Database Backup & Reset */}
          <div className="bg-[#12305A]/45 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#94C5FF]/15">
              <Database className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white font-heading">
                Gestion des Données & Sauvegarde
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-blue-300">
                Exportez l'intégralité des données (élèves, cotes, paiements,
                présences) au format JSON ou restaurez les données d'origine.
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12305A]/45 backdrop-blur-md hover:bg-blue-500/20 text-blue-100 font-bold text-xs border border-[#94C5FF]/15 transition"
                >
                  <Download className="w-4 h-4" /> Exporter JSON
                </button>
                <button
                  onClick={() => {
                    if (true) {
                      resetToInitialData();
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-xs border border-blue-500/30 transition"
                >
                  <RefreshCw className="w-4 h-4" /> Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'images' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              Images & Accueil
            </h2>
            <p className="text-xs sm:text-sm text-blue-300/70">
              Gérez le logo de l'école et les images défilantes de la page d'accueil (titres, textes, images).
            </p>
          </div>

          <div className="bg-[#12305A]/45 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#94C5FF]/15">
              <Image className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white font-heading">
                Logo de l'Établissement
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-[#0B1736] border border-[#94C5FF]/20 flex items-center justify-center overflow-hidden shrink-0">
                {logo ? (
                  <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <School className="w-10 h-10 text-blue-300/30" />
                )}
              </div>
              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-200 rounded-xl text-xs font-bold border border-blue-500/30 cursor-pointer transition">
                  <Edit2 className="w-3.5 h-3.5" /> Changer le logo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setLogo)} />
                </label>
                <p className="text-[10px] text-blue-300/50 mt-2">Format PNG ou JPG recommandé (Max 2MB). Sera affiché sur le portail et les documents imprimés.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#12305A]/45 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#94C5FF]/15">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-heading">
                  Images de la Page d'Accueil (Diaporama)
                </h3>
              </div>
              <button
                onClick={handleAddSlide}
                className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-500/30 transition flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter une photo
              </button>
            </div>

            <div className="space-y-6">
              {slides.map((slide, index) => (
                <div key={index} className="bg-[#0B1736]/60 rounded-xl border border-[#94C5FF]/10 p-5 relative group transition-all hover:border-[#94C5FF]/30">
                  <button
                    onClick={() => handleRemoveSlide(index)}
                    className="absolute top-3 right-3 p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition z-10"
                    title="Supprimer cette image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="md:col-span-5 flex flex-col gap-2">
                      <div className="aspect-video bg-[#12305A]/40 rounded-xl border border-[#94C5FF]/15 overflow-hidden flex items-center justify-center relative shadow-inner">
                        {slide.image ? (
                          <img src={slide.image} alt="Slide" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center text-blue-300/40">
                            <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <span className="text-[10px] font-medium">Aucune image</span>
                          </div>
                        )}
                        <label className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-200">
                          <span className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2">
                            <Edit2 className="w-3.5 h-3.5" /> Modifier la photo
                          </span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (res) => handleUpdateSlide(index, 'image', res))} />
                        </label>
                      </div>
                    </div>
                    
                    <div className="md:col-span-7 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-blue-300 mb-1">Titre principal</label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => handleUpdateSlide(index, 'title', e.target.value)}
                            placeholder="Ex: Rentrée scolaire"
                            className="w-full bg-[#12305A]/40 border border-[#94C5FF]/15 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-blue-300 mb-1">Badge / Tag (ex: Niveau HD)</label>
                          <input
                            type="text"
                            value={slide.badge}
                            onChange={(e) => handleUpdateSlide(index, 'badge', e.target.value)}
                            placeholder="Ex: Information, HD 1080p..."
                            className="w-full bg-[#12305A]/40 border border-[#94C5FF]/15 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 transition"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[11px] font-bold text-blue-300 mb-1">Paragraphe descriptif / Histoires</label>
                        <textarea
                          value={slide.desc}
                          onChange={(e) => handleUpdateSlide(index, 'desc', e.target.value)}
                          placeholder="Un paragraphe ou une histoire qui accompagne cette photo..."
                          rows={3}
                          className="w-full bg-[#12305A]/40 border border-[#94C5FF]/15 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 resize-none transition"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[11px] font-bold text-blue-300 mb-1">Texte du bouton d'action</label>
                        <input
                          type="text"
                          value={slide.action}
                          onChange={(e) => handleUpdateSlide(index, 'action', e.target.value)}
                          placeholder="Ex: Voir plus, Lire l'histoire..."
                          className="w-full bg-[#12305A]/40 border border-[#94C5FF]/15 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {slides.length === 0 && (
                <div className="text-center p-8 border border-dashed border-[#94C5FF]/20 rounded-xl bg-[#0B1736]/30">
                  <p className="text-sm text-blue-300/60">Aucune image configurée pour l'accueil.</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-5 border-t border-[#94C5FF]/15">
              <button
                onClick={handleSaveImagesConfig}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-lg shadow-blue-600/30 transition flex items-center gap-2 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" /> Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`

fs.writeFileSync('./src/components/views/SettingsView.jsx', content, 'utf8');
