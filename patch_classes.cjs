const fs = require('fs');
const file = 'src/components/views/ClassesView.jsx';
let content = fs.readFileSync(file, 'utf8');

// The admin needs to be able to add a class.
// Looking at the imports, we can use useState to handle a modal for adding a class.
content = content.replace(
  "import { useApp } from '../../context/AppContext';",
  "import { useApp } from '../../context/AppContext';\nimport { Plus, X } from 'lucide-react';"
);

content = content.replace(
  "const { data, setCurrentView } = useApp();",
  "const { data, setCurrentView, showToast, currentUser } = useApp();\n  const [isAddModalOpen, setIsAddModalOpen] = useState(false);\n  const [newClass, setNewClass] = useState({ nom: '', section: 'Primaire', niveau: 1, prof_id: '', salle_id: '' });"
);

const handleAdd = `
  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClass.nom) return;
    data.classes.push({
      id: Math.max(...data.classes.map(c => c.id)) + 1,
      ...newClass,
      eleves_count: 0
    });
    showToast('Classe ajoutée avec succès !');
    setIsAddModalOpen(false);
  };
`;
content = content.replace(
  "return (",
  handleAdd + "\n  return ("
);

const header = `
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <School className="w-8 h-8 text-indigo-400" />
            Salles & Classes
          </h1>
          <p className="text-sm text-slate-400 mt-1">Gestion des locaux, titulariat et répartition des élèves.</p>
        </div>
        {(currentUser?.role_id === 'admin' || currentUser?.role_id === 'prefet') && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Classe
          </button>
        )}
      </div>
`;
content = content.replace(
  /<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">[\s\S]*?<\/div>\s*<\/div>/,
  header
);

const modal = `
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
              <h2 className="text-lg font-bold text-white">Ajouter une Classe</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddClass} className="p-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Nom de la classe</label>
                <input 
                  type="text" required
                  value={newClass.nom} onChange={e => setNewClass({...newClass, nom: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="ex: 1ère Primaire A"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Section</label>
                  <select 
                    value={newClass.section} onChange={e => setNewClass({...newClass, section: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option>Maternelle</option>
                    <option>Primaire</option>
                    <option>Secondaire</option>
                    <option>Humanités</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Niveau</label>
                  <input 
                    type="number" min="1" required
                    value={newClass.niveau} onChange={e => setNewClass({...newClass, niveau: Number(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Titulaire (Optionnel)</label>
                <select 
                  value={newClass.prof_id} onChange={e => setNewClass({...newClass, prof_id: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Sans titulaire --</option>
                  {data.enseignants.map(t => (
                    <option key={t.id} value={t.id}>{t.nom} {t.prenom}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition">
                Créer la classe
              </button>
            </form>
          </div>
        </div>
      )}
`;

content = content.replace(
  "    </div>\n  );\n}",
  modal + "\n    </div>\n  );\n}"
);

fs.writeFileSync(file, content);
