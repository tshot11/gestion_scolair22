const fs = require('fs');

const content = `import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, CheckCircle2, XCircle, Users, ArrowLeft, Calendar, FileText } from 'lucide-react';

export function AttendanceView() {
  const { data, currentUser, selectedEleveId, togglePointage, setCurrentView } = useApp();
  const [selectedClassId, setSelectedClassId] = useState(1);
  
  const classes = data?.classes || [];
  const eleves = data?.eleves || [];
  const pointages = data?.pointages || [];
  
  const isParentOrStudent = currentUser?.role_id === "parent" || currentUser?.role_id === "TUTEUR" || currentUser?.role_id === "eleve";
  
  if (isParentOrStudent) {
    const targetEleveId = selectedEleveId || currentUser?.eleve_id;
    
    // Parent sees only their children or the specific child selected
    const parentChildren = eleves.filter(
      (e) => e.email_tuteur === currentUser?.email || e.id === currentUser?.eleve_id || e.id === targetEleveId
    );
    
    const [currentChildId, setCurrentChildId] = useState(
       parentChildren.length > 0 ? (parentChildren.find(c => c.id === targetEleveId)?.id || parentChildren[0].id) : null
    );
    
    const child = eleves.find(e => e.id === currentChildId);
    const childPointages = pointages.filter(p => p.eleve_id === currentChildId).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 min-h-screen text-slate-200">
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => setCurrentView(currentUser?.role_id === "eleve" ? "eleve_portal" : "parents")}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 w-fit transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à l'espace principal
          </button>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-400" />
              Historique des Présences
            </h1>
            <p className="text-sm text-blue-200/70 mt-1">Consultez le relevé de présences et d'absences.</p>
          </div>
        </div>

        {parentChildren.length > 1 && (
          <div className="bg-[#12305A]/45 backdrop-blur-md p-4 rounded-2xl border border-[#94C5FF]/15 flex items-center gap-4">
            <label className="text-sm font-semibold text-blue-300">Enfant :</label>
            <select 
              value={currentChildId || ""} 
              onChange={e => setCurrentChildId(Number(e.target.value))} 
              className="bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl py-2 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {parentChildren.map(c => <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>)}
            </select>
          </div>
        )}
        
        {!child ? (
          <div className="p-8 text-center text-blue-300/50 bg-[#12305A]/45 rounded-2xl border border-[#94C5FF]/15">
            Aucun élève associé trouvé.
          </div>
        ) : (
          <div className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <Calendar className="w-5 h-5 text-blue-400" />
               Relevé pour {child.nom} {child.prenom}
            </h2>
            
            {childPointages.length === 0 ? (
               <div className="text-center py-10 text-blue-300/60 flex flex-col items-center gap-3 bg-[#0B1736]/40 rounded-xl border border-[#94C5FF]/10">
                 <FileText className="w-10 h-10 opacity-50" />
                 <p className="text-sm font-semibold">Aucune donnée de présence enregistrée pour le moment.</p>
               </div>
            ) : (
               <div className="space-y-3">
                 {childPointages.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-[#0B1736]/60 border border-[#94C5FF]/10 hover:border-[#94C5FF]/20 transition-colors">
                      <div className="flex items-center gap-4">
                         {p.statut === 'present' ? (
                           <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                             <CheckCircle2 className="w-5 h-5" />
                           </div>
                         ) : p.statut === 'retard' ? (
                           <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                             <Clock className="w-5 h-5" />
                           </div>
                         ) : (
                           <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                             <XCircle className="w-5 h-5" />
                           </div>
                         )}
                         <div>
                           <div className="text-sm font-bold text-slate-100">
                             {new Date(p.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                           </div>
                           <div className="text-xs font-semibold mt-0.5 capitalize flex items-center gap-2">
                             Statut: <span className={
                               p.statut === 'present' ? 'text-emerald-400' : 
                               p.statut === 'retard' ? 'text-amber-400' : 'text-rose-400'
                             }>{p.statut}</span>
                             {p.heure_arrivee && <span className="text-blue-300/50 ml-2">Arrivée: {p.heure_arrivee}</span>}
                           </div>
                         </div>
                      </div>
                      {p.motif && (
                        <div className="hidden sm:block text-xs font-medium text-slate-300 bg-slate-800/80 px-4 py-2 rounded-lg max-w-xs truncate border border-slate-700">
                          {p.motif}
                        </div>
                      )}
                    </div>
                 ))}
               </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // Admin / Teacher View (Appel)
  // ==========================================
  const classStudents = eleves.filter(e => e.classe_id === selectedClassId);
  const today = new Date().toISOString().split("T")[0];

  const isStudentPresent = (id) => {
    return pointages.some(p => p.eleve_id === id && (p.date === today || p.date === "2026-08-20") && p.statut === "present");
  };

  const isStudentAbsent = (id) => {
    return pointages.some(p => p.eleve_id === id && (p.date === today || p.date === "2026-08-20") && p.statut === "absent");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 min-h-screen text-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-400" />
            Appel & Présences
          </h1>
          <p className="text-sm text-blue-200/70 mt-1">Enregistrement quotidien des présences (Cahier d'appel numérique).</p>
        </div>
      </div>

      <div className="bg-[#12305A]/45 backdrop-blur-md p-4 rounded-2xl border border-[#94C5FF]/15 flex flex-col sm:flex-row sm:items-center gap-4">
        <label className="text-sm font-semibold text-blue-300">Sélectionner une classe :</label>
        <select 
          value={selectedClassId} 
          onChange={e => setSelectedClassId(Number(e.target.value))} 
          className="bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl py-2 px-4 text-white text-sm focus:outline-none focus:border-blue-500 flex-1 sm:flex-none sm:w-64"
        >
          {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classStudents.map(eleve => {
          const present = isStudentPresent(eleve.id);
          const absent = isStudentAbsent(eleve.id);

          return (
            <div key={eleve.id} className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl p-4 flex items-center justify-between hover:bg-[#12305A]/70 transition-colors shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  {eleve.nom.charAt(0)}{eleve.prenom.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{eleve.nom} {eleve.prenom}</div>
                  <div className="text-xs text-blue-300/70">Matricule: {eleve.matricule}</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => togglePointage && togglePointage(eleve.id, "present")}
                  className={\`w-9 h-9 rounded-full border flex items-center justify-center transition-all \${
                    present 
                      ? "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20 scale-110" 
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30"
                  }\`} 
                  title="Présent"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => togglePointage && togglePointage(eleve.id, "absent")}
                  className={\`w-9 h-9 rounded-full border flex items-center justify-center transition-all \${
                    absent 
                      ? "bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/20 scale-110" 
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30"
                  }\`} 
                  title="Absent"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        
        {classStudents.length === 0 && (
          <div className="col-span-full p-10 text-center text-blue-300/50 bg-[#12305A]/30 rounded-2xl border border-[#94C5FF]/10 flex flex-col items-center gap-3">
            <Users className="w-10 h-10 opacity-30" />
            <p>Aucun élève trouvé dans cette classe.</p>
          </div>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/views/AttendanceView.jsx', content);
console.log("AttendanceView patched!");
