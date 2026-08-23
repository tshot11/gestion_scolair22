const fs = require('fs');
const file = 'src/components/views/ResultsView.jsx';
let content = fs.readFileSync(file, 'utf8');

const effectBlock = `  // Auto-select first allowed class if current is invalid
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

const definitionsBlock = `
  let allowedClassesIds = null;
  let allowedCoursIds = null;

  if (currentUser?.role_id === 'enseignant') {
    // 1. Get courses taught by this teacher
    const myCourses = data.cours.filter(c => String(c.enseignant_id) === String(currentUser.id));
    allowedCoursIds = myCourses.map(c => c.id);
    
    // 2. Get classes where these courses are taught OR where teacher is titulaire
    const classesFromCourses = myCourses.map(c => c.classe_id);
    const classesTitulaire = data.classes.filter(c => String(c.prof_id) === String(currentUser.id)).map(c => c.id);
    
    allowedClassesIds = [...new Set([...classesFromCourses, ...classesTitulaire])];
  }
`;

// Remove both blocks
content = content.replace(effectBlock, '');
content = content.replace(definitionsBlock, '');

// Re-insert them in the correct order after the state variables
content = content.replace(
  "const [selectedPeriodId, setSelectedPeriodId] = useState(4);",
  "const [selectedPeriodId, setSelectedPeriodId] = useState(4);\n" + definitionsBlock + "\n" + effectBlock
);

fs.writeFileSync(file, content);
