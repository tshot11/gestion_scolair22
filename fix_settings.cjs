const fs = require('fs');
let content = fs.readFileSync('./src/components/views/SettingsView.jsx', 'utf8');

// I will just use sed or string replacement for the imports and the body.
content = content.replace(
  'import {',
  `import { Image, Trash2, Plus, Edit2, X,`
);

content = content.replace(
  '  const {',
  `
  const [activeTab, setActiveTab] = useState('general');
  const [slides, setSlides] = useState((data?.ecoleConfig?.landingSlides || []).length > 0 ? data.ecoleConfig.landingSlides : [
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
  ]);
  const [logo, setLogo] = useState(data?.ecoleConfig?.logo || '');

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
      ...data.ecoleConfig,
      landingSlides: slides,
      logo: logo
    });
    showToast("Images de l'accueil et logo mis à jour !");
  };

  const {`
);

content = content.replace(
  '{/* Header */}<div>',
  `{/* Tabs Navigation */}
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
      {/* Header */}<div>`
);

content = content.replace(
  'className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-xs border border-blue-500/30 transition"\n            ><RefreshCw className="w-4 h-4" /> Réinitialiser\n            </button></div></div></div></div>',
  `className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-xs border border-blue-500/30 transition"\n            ><RefreshCw className="w-4 h-4" /> Réinitialiser\n            </button></div></div></div></div>\n      )}

      {activeTab === 'images' && (
        <div className="space-y-6">
          <div className="bg-[#12305A]/45 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#94C5FF]/15">
              <Image className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white font-heading">
                Logo de l'Établissement
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-[#0B1736] border border-[#94C5FF]/20 flex items-center justify-center overflow-hidden">
                {logo ? (
                  <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <School className="w-8 h-8 text-blue-300/30" />
                )}
              </div>
              <div>
                <label className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-200 rounded-xl text-xs font-bold border border-blue-500/30 cursor-pointer transition">
                  Changer le logo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setLogo)} />
                </label>
                <p className="text-[10px] text-blue-300/50 mt-2">Format PNG ou JPG recommandé (Max 2MB).</p>
              </div>
            </div>
          </div>

          <div className="bg-[#12305A]/45 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#94C5FF]/15">
              <div className="flex items-center gap-2.5">
                <Image className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-heading">
                  Images de la Page d'Accueil (Diaporama)
                </h3>
              </div>
              <button
                onClick={handleAddSlide}
                className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs font-bold border border-emerald-500/30 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter une image
              </button>
            </div>

            <div className="space-y-6">
              {slides.map((slide, index) => (
                <div key={index} className="bg-[#0B1736]/60 rounded-xl border border-[#94C5FF]/10 p-4 relative group">
                  <button
                    onClick={() => handleRemoveSlide(index)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg opacity-0 group-hover:opacity-100 transition"
                    title="Supprimer cette image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 flex flex-col gap-2">
                      <div className="aspect-video bg-black/40 rounded-lg border border-[#94C5FF]/15 overflow-hidden flex items-center justify-center relative">
                        {slide.image ? (
                          <img src={slide.image} alt="Slide" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-blue-300/50">Aucune image</span>
                        )}
                        <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                          <span className="px-3 py-1.5 bg-blue-600/80 text-white text-[10px] font-bold rounded-lg border border-blue-500/50">Modifier l'image</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (res) => handleUpdateSlide(index, 'image', res))} />
                        </label>
                      </div>
                    </div>
                    
                    <div className="md:col-span-8 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-blue-300/70 mb-1">Titre principal</label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => handleUpdateSlide(index, 'title', e.target.value)}
                            placeholder="Ex: Rentrée scolaire"
                            className="w-full bg-[#12305A]/40 border border-[#94C5FF]/15 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-blue-300/70 mb-1">Niveau HD / Badge (ex: Information)</label>
                          <input
                            type="text"
                            value={slide.badge}
                            onChange={(e) => handleUpdateSlide(index, 'badge', e.target.value)}
                            placeholder="Ex: Information"
                            className="w-full bg-[#12305A]/40 border border-[#94C5FF]/15 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-blue-300/70 mb-1">Paragraphe descriptif</label>
                        <textarea
                          value={slide.desc}
                          onChange={(e) => handleUpdateSlide(index, 'desc', e.target.value)}
                          placeholder="Description de la photo..."
                          rows={2}
                          className="w-full bg-[#12305A]/40 border border-[#94C5FF]/15 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500 resize-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-blue-300/70 mb-1">Texte du bouton d'action</label>
                        <input
                          type="text"
                          value={slide.action}
                          onChange={(e) => handleUpdateSlide(index, 'action', e.target.value)}
                          placeholder="Ex: Voir le calendrier"
                          className="w-full bg-[#12305A]/40 border border-[#94C5FF]/15 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end pt-4 border-t border-[#94C5FF]/15">
              <button
                onClick={handleSaveImagesConfig}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition active:scale-95"
              >
                Enregistrer toutes les images
              </button>
            </div>
          </div>
        </div>
      )}
    </div>`
);

fs.writeFileSync('./src/components/views/SettingsView.jsx', content, 'utf8');
