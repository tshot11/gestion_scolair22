const fs = require('fs');
let content = fs.readFileSync('src/components/views/ClassesView.jsx', 'utf8');

// Remove the accidental wrapper
content = content.replace(
  `{currentUser?.role === 'ADMIN' && (<div className="flex flex-wrap items-center gap-2">`,
  `<div className="flex flex-wrap items-center gap-2">`
);

// Now wrap just the buttons to add class, add room, etc.
// Look for handleOpenNewClass
content = content.replace(
  `<button
            onClick={handleOpenNewClass}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une Classe</span>
          </button>`,
  `{currentUser?.role === 'ADMIN' && (
          <button
            onClick={handleOpenNewClass}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une Classe</span>
          </button>
  )}`
);

// Look for handleOpenNewRoom
content = content.replace(
  `<button
            onClick={handleOpenNewRoom}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Salle</span>
          </button>`,
  `{currentUser?.role === 'ADMIN' && (
          <button
            onClick={handleOpenNewRoom}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Salle</span>
          </button>
  )}`
);

fs.writeFileSync('src/components/views/ClassesView.jsx', content);
console.log("Fixed ClassesView");
