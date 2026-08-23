const fs = require('fs');
const file = 'src/components/views/ResultsView.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add currentUser to useApp extraction
content = content.replace(
  "  const { \n    data, \n    saveResultat, \n    setCurrentView, \n    setSelectedEleveId,\n    showToast \n  } = useApp();",
  "  const { \n    data, \n    saveResultat, \n    setCurrentView, \n    setSelectedEleveId,\n    showToast,\n    currentUser \n  } = useApp();"
);

// Define allowedClassesIds and allowedCoursIds
const insertionPoint = "const classStudents = data.eleves.filter(e => e.classe_id === Number(selectedClassId));";
const definitions = `
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

  const classStudents = data.eleves.filter(e => e.classe_id === Number(selectedClassId));
`;

content = content.replace(insertionPoint, definitions);

fs.writeFileSync(file, content);
