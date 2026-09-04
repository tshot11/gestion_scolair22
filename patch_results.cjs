const fs = require('fs');
let content = fs.readFileSync('src/components/views/ResultsView.jsx', 'utf8');

// Inject currentUser
content = content.replace(
  `const { data, saveResultat, showToast } = useApp();`,
  `const { data, saveResultat, showToast, currentUser } = useApp();`
);

// Filter courses based on teacher
const oldCoursState = `const [selectedCours, setSelectedCours] = useState(data?.cours?.[0]?.id || 1);`;
const newCoursState = `
  let availableCours = data?.cours || [];
  if (currentUser?.role === 'ENSEIGNANT') {
     const teacher = (data?.enseignants || []).find(t => t.email === currentUser.email);
     if (teacher) {
         availableCours = availableCours.filter(c => c.enseignant_id === teacher.id);
     } else {
         availableCours = [];
     }
  }
  const [selectedCours, setSelectedCours] = useState(availableCours[0]?.id || '');
`;

content = content.replace(oldCoursState, newCoursState);

// Replace mapping of courses in the select
content = content.replace(
  `{(data?.cours || []).map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}`,
  `{availableCours.map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}`
);

fs.writeFileSync('src/components/views/ResultsView.jsx', content);
console.log("Patched ResultsView.jsx");
