const fs = require('fs');
const file = 'src/components/views/CoursesView.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { useApp } from '../../context/AppContext';",
  "import { useApp } from '../../context/AppContext';\nimport { Plus, X } from 'lucide-react';"
);

content = content.replace(
  "const { data } = useApp();",
  "const { data, showToast, currentUser } = useApp();\n  const [isAddModalOpen, setIsAddModalOpen] = useState(false);\n  const [newCourse, setNewCourse] = useState({ nom: '', coefficient: 1, volume_horaire: 2, classe_id: '', enseignant_id: '', syllabus_url: '' });"
);

const handleAdd = `
  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.nom) return;
    data.cours.push({
      id: Math.max(...data.cours.map(c => c.id)) + 1,
      ...newCourse,
      classe_id: newCourse.classe_id ? Number(newCourse.classe_id) : null,
      enseignant_id: newCourse.enseignant_id ? Number(newCourse.enseignant_id) : null
    });
    showToast('Cours ajouté avec succès !');
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
            <BookOpen className="w-8 h-8 text-amber-400" />
            Programme de Cours
          </h1>
          <p className="text-sm text-slate-400 mt-1">Matières enseignées, pondérations et attributions.</p>
        </div>
        {(currentUser?.role_id === 'admin' || currentUser?.role_id === 'prefet') && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            Nouveau Cours
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
              <h2 className="text-lg font-bold text-white">Ajouter un Cours</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCourse} className="p-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Nom du cours</label>
                <input 
                  type="text" required
                  value={newCourse.nom} onChange={e => setNewCourse({...newCourse, nom: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  placeholder="ex: Mathématiques, Histoire..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Pondération / Coeff</label>
                  <input 
                    type="number" min="1" required
                    value={newCourse.coefficient} onChange={e => setNewCourse({...newCourse, coefficient: Number(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Heures (Vol. Horaire)</label>
                  <input 
                    type="number" min="1" required
                    value={newCourse.volume_horaire} onChange={e => setNewCourse({...newCourse, volume_horaire: Number(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Classe</label>
                <select 
                  value={newCourse.classe_id} onChange={e => setNewCourse({...newCourse, classe_id: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Tronc commun (Toutes) --</option>
                  {data.classes.map(c => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Enseignant</label>
                <select 
                  value={newCourse.enseignant_id} onChange={e => setNewCourse({...newCourse, enseignant_id: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Non attribué --</option>
                  {data.enseignants.map(t => (
                    <option key={t.id} value={t.id}>{t.nom} {t.prenom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Lien Syllabus (Optionnel)</label>
                <input 
                  type="url"
                  value={newCourse.syllabus_url} onChange={e => setNewCourse({...newCourse, syllabus_url: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  placeholder="https://..."
                />
              </div>
              <button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg transition">
                Créer le cours
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
