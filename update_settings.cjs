const fs = require('fs');

let content = fs.readFileSync('./src/components/views/SettingsView.jsx', 'utf8');

// I will insert cycles state next to slides state
content = content.replace(
  'const [slides, setSlides] = useState((data?.ecoleConfig?.landingSlides || []).length > 0 ? data.ecoleConfig.landingSlides : defaultSlides);',
  `const [slides, setSlides] = useState((data?.ecoleConfig?.landingSlides || []).length > 0 ? data.ecoleConfig.landingSlides : defaultSlides);
  
  const defaultCycles = [
    {
      titre: "École maternelle",
      badge: "3 à 5 ans",
      desc: "Un environnement sécurisant et stimulant pour les premiers apprentissages, l'éveil social et le développement de la créativité.",
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=1000&auto=format&fit=crop",
    },
    {
      titre: "École primaire",
      badge: "6 à 11 ans",
      desc: "Acquisition solide des savoirs fondamentaux, apprentissage de la rigueur et développement du sens critique.",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop",
    },
    {
      titre: "Humanités & secondaire",
      badge: "12 à 18 ans",
      desc: "Préparation aux examens d'État avec accompagnement personnalisé et suivi pédagogique.",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop",
    },
  ];
  const [cycles, setCycles] = useState((data?.ecoleConfig?.landingCycles || []).length === 3 ? data.ecoleConfig.landingCycles : defaultCycles);`
);

// update handleSaveImagesConfig
content = content.replace(
  'landingSlides: slides,',
  'landingSlides: slides,\n      landingCycles: cycles,'
);

// update the UI
const cyclesUI = `

          {/* Les 3 sections/cycles */}
          <div className="bg-[#12305A]/45 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#94C5FF]/15">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white font-heading">
                Les 3 Cycles / Sections (Cartes de la page d'accueil)
              </h3>
            </div>

            <div className="space-y-6">
              {cycles.map((cycle, index) => (
                <div key={index} className="bg-[#0B1736]/60 rounded-xl border border-[#94C5FF]/10 p-5 relative group transition-all hover:border-[#94C5FF]/30">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="md:col-span-4 flex flex-col gap-2">
                      <div className="aspect-video bg-[#12305A]/40 rounded-xl border border-[#94C5FF]/15 overflow-hidden flex items-center justify-center relative shadow-inner">
                        {cycle.image ? (
                          <img src={cycle.image} alt="Cycle" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center text-blue-300/40">
                            <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          </div>
                        )}
                        <label className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-200">
                          <span className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2">
                            <Edit2 className="w-3.5 h-3.5" /> Modifier la photo
                          </span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (res) => {
                            const newCycles = [...cycles];
                            newCycles[index].image = res;
                            setCycles(newCycles);
                          })} />
                        </label>
                      </div>
                    </div>
                    
                    <div className="md:col-span-8 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-blue-300 mb-1">Titre de la section</label>
                          <input
                            type="text"
                            value={cycle.titre}
                            onChange={(e) => {
                              const newCycles = [...cycles];
                              newCycles[index].titre = e.target.value;
                              setCycles(newCycles);
                            }}
                            className="w-full bg-[#12305A]/40 border border-[#94C5FF]/15 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-blue-300 mb-1">Badge (ex: 3 à 5 ans)</label>
                          <input
                            type="text"
                            value={cycle.badge}
                            onChange={(e) => {
                              const newCycles = [...cycles];
                              newCycles[index].badge = e.target.value;
                              setCycles(newCycles);
                            }}
                            className="w-full bg-[#12305A]/40 border border-[#94C5FF]/15 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 transition"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-blue-300 mb-1">Description courte</label>
                        <textarea
                          value={cycle.desc}
                          onChange={(e) => {
                            const newCycles = [...cycles];
                            newCycles[index].desc = e.target.value;
                            setCycles(newCycles);
                          }}
                          rows={2}
                          className="w-full bg-[#12305A]/40 border border-[#94C5FF]/15 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 resize-none transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
`;

// Insert the new UI before the save button of images
content = content.replace(
  '<div className="flex justify-end pt-5 border-t border-[#94C5FF]/15">',
  cyclesUI + '\n            <div className="flex justify-end pt-5 border-t border-[#94C5FF]/15">'
);

fs.writeFileSync('./src/components/views/SettingsView.jsx', content, 'utf8');

