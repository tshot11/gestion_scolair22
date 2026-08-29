const fs = require('fs');

let content = fs.readFileSync('./src/components/views/LandingPageView.jsx', 'utf8');

const oldCyclesState = `  const [cycles, setCycles] = useState([
    {
      titre: "École maternelle",
      badge: "3 à 5 ans",
      desc: "Un environnement sécurisant et stimulant pour les premiers apprentissages, l'éveil social et le développement de la créativité.",
      image:
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=1000&auto=format&fit=crop",
    },
    {
      titre: "École primaire",
      badge: "6 à 11 ans",
      desc: "Acquisition solide des savoirs fondamentaux, apprentissage de la rigueur et développement du sens critique.",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop",
    },
    {
      titre: "Humanités & secondaire",
      badge: "12 à 18 ans",
      desc: "Préparation aux examens d'État avec accompagnement personnalisé et suivi pédagogique.",
      image:
        "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop",
    },
  ]);
  
  const handleActualiteImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newActs = [...actualites];
        newActs[index].image = reader.result;
        setActualites(newActs);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCycleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCycles = [...cycles];
        newCycles[index].image = reader.result;
        setCycles(newCycles);
      };
      reader.readAsDataURL(file);
    }
  };`;

const newCyclesState = `  const defaultCycles = [
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

  const cycles = (data?.ecoleConfig?.landingCycles || []).length === 3 ? data.ecoleConfig.landingCycles : defaultCycles;`;

content = content.replace(oldCyclesState, newCyclesState);

const oldAdminInput = `{isAdmin && (
                      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <label className="cursor-pointer p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/20 transition-all flex items-center gap-2">
                          <Settings className="w-3.5 h-3.5" /> Changer
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCycleImageChange(idx, e)} />
                        </label>
                      </div>
                    )}`;
content = content.replace(oldAdminInput, '');

fs.writeFileSync('./src/components/views/LandingPageView.jsx', content, 'utf8');

