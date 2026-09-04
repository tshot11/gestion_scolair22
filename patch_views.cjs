const fs = require('fs');

// 1. Patch CoursesView.jsx
let coursesContent = fs.readFileSync('src/components/views/CoursesView.jsx', 'utf8');

// Add button for Admin in CoursesView
const titleHTML = `Programme des Cours & Matières
        </h2>
        <p className="text-xs sm:text-sm text-blue-300/70">
          Syllabus officiels, pondérations et coefficients de délibération
        </p>
      </div>`;

const newTitleHTML = `Programme des Cours & Matières
        </h2>
        <p className="text-xs sm:text-sm text-blue-300/70">
          Syllabus officiels, pondérations et coefficients de délibération
        </p>
      </div>
      
      {currentUser?.role === "ADMIN" && (
        <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 transition-all"
        >
            <Plus className="w-4 h-4" />
            Créer un cours
        </button>
      )}`;

if (!coursesContent.includes('setIsAddModalOpen(true)')) {
    coursesContent = coursesContent.replace(titleHTML, newTitleHTML);
    fs.writeFileSync('src/components/views/CoursesView.jsx', coursesContent);
    console.log("Patched CoursesView");
}

// 2. Patch ClassesView.jsx
let classesContent = fs.readFileSync('src/components/views/ClassesView.jsx', 'utf8');

// Hide "Créer une Classe", "Ajouter une Salle", "Affectations" from non-admins
classesContent = classesContent.replace(
  /<div className="flex flex-wrap items-center gap-2">/g,
  `{currentUser?.role === 'ADMIN' && (<div className="flex flex-wrap items-center gap-2">`
);
classesContent = classesContent.replace(
  /<span>Affectations & Cours<\/span>\n          <\/button>\n        <\/div>/g,
  `<span>Affectations & Cours</span>\n          </button>\n        </div>)}`
);

fs.writeFileSync('src/components/views/ClassesView.jsx', classesContent);
console.log("Patched ClassesView");
