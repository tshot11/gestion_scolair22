const fs = require('fs');

let code = fs.readFileSync('src/components/views/CoursesView.jsx', 'utf8');
code = code.replace(/const \{ data, currentUser \} = useApp\(\);/, "const { data, setData, currentUser, showToast } = useApp();");

const courseAdd = `
  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.nom) return;
    setData(prev => ({
        ...prev,
        cours: [...prev.cours, {
            id: Math.max(...prev.cours.map(c => c.id), 0) + 1,
            ...newCourse,
            classe_id: newCourse.classe_id ? Number(newCourse.classe_id) : null,
            enseignant_id: newCourse.enseignant_id ? Number(newCourse.enseignant_id) : null,
        }]
    }));
    showToast("Cours ajouté avec succès !");
    setIsAddModalOpen(false);
  };
`;
code = code.replace(/const handleAddCourse = \(e\) => \{[\s\S]*?\n  \};/, courseAdd.trim());
fs.writeFileSync('src/components/views/CoursesView.jsx', code);

let classesCode = fs.readFileSync('src/components/views/ClassesView.jsx', 'utf8');
classesCode = classesCode.replace(/const \{ data, setCurrentView, setSelectedClasseId, currentUser \}\s*=\s*useApp\(\);/, 
  "const { data, setData, setCurrentView, setSelectedClasseId, currentUser, showToast } = useApp();");

const classAdd = `
  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClass.nom) return;
    setData(prev => ({
        ...prev,
        classes: [...prev.classes, {
            id: Math.max(...prev.classes.map(c => c.id), 0) + 1,
            ...newClass,
            niveau_id: newClass.niveau ? 1 : null,
            titulaire_id: newClass.titulaire_id ? Number(newClass.titulaire_id) : null
        }]
    }));
    showToast("Classe ajoutée avec succès !");
    setIsAddModalOpen(false);
  };
`;
classesCode = classesCode.replace(/const handleAddClass = \(e\) => \{[\s\S]*?\n  \};/, classAdd.trim());
fs.writeFileSync('src/components/views/ClassesView.jsx', classesCode);
