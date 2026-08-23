import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Save, 
  Search, 
  Filter, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2,
  TrendingUp,
  School
} from 'lucide-react';

export function ResultsView() {
  const { 
    data, 
    saveResultat, 
    setCurrentView, 
    setSelectedEleveId,
    showToast,
    currentUser 
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState(6);
  const [selectedCoursId, setSelectedCoursId] = useState(1);
  const [selectedPeriodId, setSelectedPeriodId] = useState(4);

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

  // Auto-select first allowed class if current is invalid
  React.useEffect(() => {
    if (allowedClassesIds && allowedClassesIds.length > 0) {
      if (!allowedClassesIds.includes(Number(selectedClassId))) {
        setSelectedClassId(allowedClassesIds[0]);
      }
    }
  }, [allowedClassesIds, selectedClassId]);

  // Auto-select first allowed course for the selected class
  React.useEffect(() => {
    let availableCourses = data.cours.filter(c => c.classe_id === Number(selectedClassId));
    if (allowedCoursIds) {
      availableCourses = availableCourses.filter(c => allowedCoursIds.includes(c.id));
    }
    if (availableCourses.length > 0 && !availableCourses.find(c => c.id === Number(selectedCoursId))) {
      setSelectedCoursId(availableCourses[0].id);
    }
  }, [selectedClassId, allowedCoursIds, selectedCoursId, data.cours]);




  
  const classStudents = data.eleves.filter(e => e.classe_id === Number(selectedClassId));

  const currentClass = data.classes.find(c => c.id === Number(selectedClassId));
  const currentCourse = data.cours.find(c => c.id === Number(selectedCoursId));
  const currentPeriod = data.periodes.find(p => p.id === Number(selectedPeriodId));

  // Local state for interactive editing of marks
  const [gradesState, setGradesState] = useState({});

  const handleDetailChange = (eleveId, field, val) => {
    setGradesState(prev => {
      const current = prev[eleveId] || {};
      const updated = { ...current, [field]: Number(val) };
      const interro = updated.note_interrogation ?? (current.note_interrogation ?? 0);
      const exo = updated.note_exercice ?? (current.note_exercice ?? 0);
      const exam = updated.note_examen ?? (current.note_examen ?? 0);
      updated.note = interro + exo + exam;
      return { ...prev, [eleveId]: updated };
    });
  };

  const handleGradeChange = (eleveId, val) => {
    setGradesState(prev => ({
      ...prev,
      [eleveId]: {
        ...prev[eleveId],
        note: val
      }
    }));
  };

  const handleAppreciationChange = (eleveId, val) => {
    setGradesState(prev => ({
      ...prev,
      [eleveId]: {
        ...prev[eleveId],
        appreciation: val
      }
    }));
  };

  const handleSaveAll = () => {
    classStudents.forEach(eleve => {
      const existing = data.resultats.find(r => 
        r.eleve_id === eleve.id && 
        r.cours_id === Number(selectedCoursId) && 
        r.periode_id === Number(selectedPeriodId)
      );

      const modifiedNote = gradesState[eleve.id]?.note !== undefined ? gradesState[eleve.id].note : (existing?.note || 12);
      const modifiedAppreciation = gradesState[eleve.id]?.appreciation !== undefined ? gradesState[eleve.id].appreciation : (existing?.appreciation || 'Travail convenable');

      saveResultat({
        eleve_id: eleve.id,
        cours_id: Number(selectedCoursId),
        periode_id: Number(selectedPeriodId),
        note: Number(modifiedNote),
        appreciation: modifiedAppreciation,
        enseignant_id: currentCourse?.enseignant_id || 1
      });
    });
    showToast(`Toutes les cotes de ${currentCourse?.nom} ont été enregistrées avec succès !`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
            Palmarès & Saisie des Cotes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Encodage des points par discipline et calcul des moyennes périodiques
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            Enregistrer les Cotes
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Classe</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {data.classes.filter(c => allowedClassesIds === null || allowedClassesIds.includes(c.id)).map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Cours / Matière</label>
          <select
            value={selectedCoursId}
            onChange={(e) => setSelectedCoursId(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {data.cours.filter(c => c.classe_id === Number(selectedClassId) && (allowedCoursIds === null || allowedCoursIds.includes(c.id))).map(c => (
              <option key={c.id} value={c.id}>{c.nom} (Coeff {c.coefficient})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Période d'évaluation</label>
          <select
            value={selectedPeriodId}
            onChange={(e) => setSelectedPeriodId(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {data.periodes.map(p => (
              <option key={p.id} value={p.id}>{p.nom} {p.active ? '(En cours)' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-slate-800/40 rounded-3xl border border-slate-700/60 overflow-hidden">
        <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white font-heading">
              Feuille de Cotes : {currentCourse?.nom} ({currentClass?.nom})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Note sur <strong className="text-white">20 points</strong> • Coeff {currentCourse?.coefficient}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
              <tr>
                <th className="p-3">Élève</th>
                <th className="p-3 font-mono">Matricule</th>
                <th className="p-3 text-center w-24">Interro</th>
                <th className="p-3 text-center w-24">Exercice</th>
                <th className="p-3 text-center w-24">Examen</th>
                <th className="p-3 text-center w-24">Total Période</th>
                <th className="p-3">Appréciation Pédagogique</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {classStudents.map((eleve) => {
                const res = data.resultats.find(r => 
                  r.eleve_id === eleve.id && 
                  r.cours_id === Number(selectedCoursId) && 
                  r.periode_id === Number(selectedPeriodId)
                );
                
                const currentInterro = gradesState[eleve.id]?.note_interrogation ?? 0;
                const currentExo = gradesState[eleve.id]?.note_exercice ?? 0;
                const currentExam = gradesState[eleve.id]?.note_examen ?? 0;

                const currentVal = gradesState[eleve.id]?.note !== undefined ? gradesState[eleve.id].note : (res ? res.note : 0);
                const currentApp = gradesState[eleve.id]?.appreciation !== undefined ? gradesState[eleve.id].appreciation : (res ? res.appreciation : 'Travail satisfaisant');

                return (
                  <tr key={eleve.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {eleve.prenom[0]}
                        </div>
                        <span>{eleve.nom} {eleve.prenom}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-400">{eleve.matricule}</td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="20"
                        value={currentInterro}
                        onChange={(e) => handleDetailChange(eleve.id, 'note_interrogation', e.target.value)}
                        className="w-16 text-center font-mono font-bold text-sm px-1 py-1.5 rounded-xl border bg-slate-900 border-slate-700 focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="20"
                        value={currentExo}
                        onChange={(e) => handleDetailChange(eleve.id, 'note_exercice', e.target.value)}
                        className="w-16 text-center font-mono font-bold text-sm px-1 py-1.5 rounded-xl border bg-slate-900 border-slate-700 focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="20"
                        value={currentExam}
                        onChange={(e) => handleDetailChange(eleve.id, 'note_examen', e.target.value)}
                        className="w-16 text-center font-mono font-bold text-sm px-1 py-1.5 rounded-xl border bg-slate-900 border-slate-700 focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <div className={`w-16 mx-auto text-center font-mono font-bold text-sm px-1 py-1.5 rounded-xl border ${
                          currentVal >= 14 ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40' :
                          currentVal >= 10 ? 'bg-blue-950/40 text-blue-300 border-blue-500/40' :
                          'bg-rose-950/40 text-rose-300 border-rose-500/40'
                        }`}>
                        {currentVal}
                      </div>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={currentApp}
                        onChange={(e) => handleAppreciationChange(eleve.id, e.target.value)}
                        placeholder="Appréciation..."
                        className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedEleveId(eleve.id);
                          setCurrentView('bulletin');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-[11px] font-semibold transition"
                      >
                        Bulletin
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
