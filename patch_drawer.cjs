const fs = require('fs');
const file = 'src/components/layout/MobileDrawerMenu.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "{ id: 'parents', label: 'Espace Parents & Tuteurs', icon: HeartHandshake, count: null },",
  "{ id: 'parents', label: 'Espace Parents & Tuteurs', icon: HeartHandshake, count: null },\n        { id: 'bibliotheque', label: 'Bibliothèque', icon: BookOpen, count: null },"
);

fs.writeFileSync(file, content);
