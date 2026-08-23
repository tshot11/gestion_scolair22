const fs = require('fs');
const file = 'src/components/views/DashboardView.jsx';
let content = fs.readFileSync(file, 'utf8');

// For the eleve role, we want them to see their own info instead of the admin dashboard.
const eleveDashboard = `
  if (currentUser?.role_id === 'eleve') {
    const student = data.eleves.find(e => e.id === currentUser.eleve_id);
    if (!student) return <div className="p-6 text-white">Profil étudiant introuvable.</div>;
    
    return (
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Espace Étudiant</h1>
            <p className="text-sm text-slate-400 mt-1">
              Bienvenue, {student.prenom} {student.nom}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/50">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-blue-400" />
              Mes Résultats
            </h3>
            <div className="text-2xl font-bold text-white mb-1">
              {student.moyenne || '0'} <span className="text-sm text-slate-400">/ 20</span>
            </div>
            <p className="text-xs text-slate-400">Moyenne de la période en cours</p>
            <button onClick={() => setCurrentView('bulletin')} className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition">
              Voir mon bulletin complet
            </button>
          </div>
          
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/50">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Discipline & Présences
            </h3>
            <div className="text-sm text-slate-300">
              Absences non justifiées: <span className="font-bold text-rose-400">{data.presences?.filter(p => p.eleve_id === student.id && p.statut === 'absent').length || 0}</span>
            </div>
            <button onClick={() => setCurrentView('discipline')} className="mt-5 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition">
              Voir mon dossier disciplinaire
            </button>
          </div>
        </div>
      </div>
    );
  }
`;

content = content.replace(
  "  const collectionRate = totalFraisTheoriqueGlobal > 0 \n     ? Math.min(100, Math.round((stats.total_recouvrement / totalFraisTheoriqueGlobal) * 100)) \n     : 0;",
  "  const collectionRate = totalFraisTheoriqueGlobal > 0 \n     ? Math.min(100, Math.round((stats.total_recouvrement / totalFraisTheoriqueGlobal) * 100)) \n     : 0;\n" + eleveDashboard
);

fs.writeFileSync(file, content);
