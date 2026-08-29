const fs = require('fs');

let content = fs.readFileSync('src/data/initialData.js', 'utf8');

const missingData = `
  frais: [],
  incidents: [],
  horaires: [],
  messages: [],
  ecoleConfig: {
    nom: "Complexe Scolaire TSHOT",
    code_ministeriel: "CS-101",
    province_educationnelle: "Kinshasa",
    annee_courante: "2025-2026",
    periode_active: "3ème Période",
    taux_change_usd: 2800
  },
`;

content = content.replace(/discipline: \[\]/, 'discipline: [],' + missingData);

fs.writeFileSync('src/data/initialData.js', content);
