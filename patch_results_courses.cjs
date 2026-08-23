const fs = require('fs');
const file = 'src/components/views/ResultsView.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "{data.cours.filter(c => allowedCoursIds === null || allowedCoursIds.includes(c.id)).map(c => (",
  "{data.cours.filter(c => c.classe_id === Number(selectedClassId) && (allowedCoursIds === null || allowedCoursIds.includes(c.id))).map(c => ("
);

fs.writeFileSync(file, content);
