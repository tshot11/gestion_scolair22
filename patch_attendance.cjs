const fs = require('fs');
const file = 'src/components/views/AttendanceView.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add currentUser
content = content.replace(
  "    stats\n  } = useApp();",
  "    stats,\n    currentUser\n  } = useApp();"
);

const definitions = `
  let displayedClasses = data.classes;
  if (currentUser?.role_id === 'enseignant') {
    // Only classes where they teach or are titulaire
    const myCourses = data.cours.filter(c => String(c.enseignant_id) === String(currentUser.id));
    const classesFromCourses = myCourses.map(c => c.classe_id);
    const classesTitulaire = data.classes.filter(c => String(c.prof_id) === String(currentUser.id)).map(c => c.id);
    const allowedClassesIds = [...new Set([...classesFromCourses, ...classesTitulaire])];
    displayedClasses = data.classes.filter(c => allowedClassesIds.includes(c.id));
  }
`;

content = content.replace(
  "  const today = '2026-08-20';",
  "  const today = '2026-08-20';\n" + definitions
);

const effect = `
  // Auto-select first allowed class if current is invalid
  React.useEffect(() => {
    if (displayedClasses.length > 0 && !displayedClasses.find(c => c.id === Number(selectedClassId))) {
      setSelectedClassId(displayedClasses[0].id);
    }
  }, [displayedClasses, selectedClassId]);
`;

content = content.replace(
  "  const handleMarkAllPresent = () => {",
  effect + "\n  const handleMarkAllPresent = () => {"
);

fs.writeFileSync(file, content);
