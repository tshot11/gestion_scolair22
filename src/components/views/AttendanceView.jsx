import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, CheckCircle2, XCircle, Users } from 'lucide-react';

export function AttendanceView() {
  const { data } = useApp();
  const [selectedClassId, setSelectedClassId] = useState(1);
  const classes = data?.classes || [];
  const eleves = data?.eleves || [];

  const classStudents = eleves.filter(e => e.classe_id === selectedClassId);

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

      <div className="bg-[#12305A]/45 backdrop-blur-md p-4 rounded-2xl border border-[#94C5FF]/15 flex items-center gap-4">
        <label className="text-sm font-semibold text-blue-300">Classe :</label>
        <select value={selectedClassId} onChange={e => setSelectedClassId(Number(e.target.value))} className="bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl py-2 px-4 text-white text-sm focus:outline-none focus:border-blue-500">
          {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classStudents.map(eleve => (
          <div key={eleve.id} className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl p-4 flex items-center justify-between hover:bg-[#12305A]/70 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                {eleve.nom.charAt(0)}{eleve.prenom.charAt(0)}
              </div>
              <div>
                <div className="text-white font-bold text-sm">{eleve.nom} {eleve.prenom}</div>
                <div className="text-xs text-blue-300/70">{eleve.matricule}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors" title="Présent">
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors" title="Absent">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {classStudents.length === 0 && (
          <div className="col-span-full p-8 text-center text-blue-300/50">Aucun élève trouvé dans cette classe.</div>
        )}
      </div>
    </div>
  );
}
