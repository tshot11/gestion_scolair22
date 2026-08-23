const fs = require('fs');
const file = 'src/components/views/ResultsView.jsx';
let content = fs.readFileSync(file, 'utf8');

const effect = `
  // Auto-select first allowed class if current is invalid
  React.useEffect(() => {
    if (allowedClassesIds && allowedClassesIds.length > 0) {
      if (!allowedClassesIds.includes(Number(selectedClassId))) {
        setSelectedClassId(allowedClassesIds[0]);
      }
    }
  }, [allowedClassesIds, selectedClassId]);

  // Auto-select first allowed course for the selected class
  React.useEffect(() => {
    let availableCourses = data.cours.filter(c => c.classe_id === Number(selectedClassId));
    if (allowedCoursIds) {
      availableCourses = availableCourses.filter(c => allowedCoursIds.includes(c.id));
    }
    if (availableCourses.length > 0 && !availableCourses.find(c => c.id === Number(selectedCoursId))) {
      setSelectedCoursId(availableCourses[0].id);
    }
  }, [selectedClassId, allowedCoursIds, selectedCoursId, data.cours]);
`;

// Insert after periodId state
content = content.replace(
  "const [selectedPeriodId, setSelectedPeriodId] = useState(4);",
  "const [selectedPeriodId, setSelectedPeriodId] = useState(4);\n" + effect
);

fs.writeFileSync(file, content);
