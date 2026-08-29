const fs = require('fs');
let content = fs.readFileSync('./src/components/views/LandingPageView.jsx', 'utf8');

// Replace the hardcoded slides with a state initialized from data.ecoleConfig.landingSlides
const defaultSlides = `[
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
  ]`;

content = content.replace(/const slides = \[[\s\S]*?\];/, `const slides = data?.ecoleConfig?.landingSlides || ${defaultSlides};`);
content = content.replace('const ImageSlider = ({ onAction }) => {', 'const ImageSlider = ({ onAction, data }) => {');
content = content.replace('<ImageSlider />', '<ImageSlider data={data} />');

fs.writeFileSync('./src/components/views/LandingPageView.jsx', content, 'utf8');
