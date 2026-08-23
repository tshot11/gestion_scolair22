const fs = require('fs');
const file = 'src/context/AppContext.jsx';
let content = fs.readFileSync(file, 'utf8');

const insertion = `
        if (!parsed.periodes.find(p => p.nom === 'Proclamation Finale')) {
          parsed.periodes.push({ id: 7, nom: 'Proclamation Finale', annee_id: 1, active: false, ordre: 7 });
        }
`;

content = content.replace(
  "if (!parsed.notes) parsed.notes = [];",
  "if (!parsed.notes) parsed.notes = [];\n" + insertion
);

fs.writeFileSync(file, content);
