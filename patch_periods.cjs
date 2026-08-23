const fs = require('fs');
const file = 'src/data/initialData.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "{ id: 6, nom: 'Examen 2ème Semestre', annee_id: 1, active: false, ordre: 6 }",
  "{ id: 6, nom: 'Examen 2ème Semestre', annee_id: 1, active: false, ordre: 6 },\n    { id: 7, nom: 'Proclamation Finale', annee_id: 1, active: false, ordre: 7 }"
);

fs.writeFileSync(file, content);
