import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Save, Search, CheckCircle2 } from 'lucide-react';

export function ResultsView() {
  const { data, saveResultat, showToast } = useApp();
  const [selectedClass, setSelectedClass] = useState(data?.classes?.[0]?.id || 1);
  const [selectedType, setSelectedType] = useState('EXAMEN');
  const [selectedTrimestre, setSelectedTrimestre] = useState(1);
  const [selectedCours, setSelectedCours] = useState(data?.cours?.[0]?.id || 1);
  const [grades, setGrades] = useState({});
  const [saved, setSaved] = useState(false);

  const eleves = data?.eleves?.filter(e => e.classe_id === selectedClass) || [];

  const handleGradeChange = (eleveId, val) => {
    setGrades(prev => ({ ...prev, [eleveId]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    Object.entries(grades).forEach(([eleveId, note]) => {
      if (note !== '' && note !== null) {
        saveResultat({
          eleve_id: Number(eleveId),
          cours_id: selectedCours,
          periode_id: Number(selectedTrimestre),
          note: Number(note),
          type: selectedType
        });
      }
    });
    setSaved(true);
    showToast("Cotes enregistrées avec succès");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 min-h-screen text-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Award className="w-8 h-8 text-blue-500" />
            Saisie des Cotes
          </h1>
          <p className="text-sm text-blue-200/70 mt-1">Enregistrement des notes par période et type d'évaluation.</p>
        </div>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all">
          <Save className="w-4 h-4" /> Enregistrer les cotes
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-blue-500/20 border border-blue-500/50 text-blue-300 rounded-xl flex items-center gap-2 text-sm font-bold">
          <CheckCircle2 className="w-4 h-4" /> Cotes enregistrées avec succès !
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 bg-[#12305A]/45 backdrop-blur-md p-4 rounded-2xl border border-[#94C5FF]/15">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-blue-300 mb-1">Classe</label>
          <select value={selectedClass} onChange={e => setSelectedClass(Number(e.target.value))} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
            {data?.classes?.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-blue-300 mb-1">Période</label>
          <select value={selectedTrimestre} onChange={e => setSelectedTrimestre(e.target.value)} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
            {data?.periodes?.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-blue-300 mb-1">Cours</label>
          <select value={selectedCours} onChange={e => setSelectedCours(Number(e.target.value))} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
            {data?.cours?.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-blue-300 mb-1">Type d'évaluation</label>
          <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
            <option value="EXERCICE">Exercice journalier</option>
            <option value="INTERROGATION">Interrogation</option>
            <option value="EXAMEN">Examen</option>
          </select>
        </div>
      </div>

      <div className="min-h-[300px]">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {eleves.map(e => (
            <div key={e.id} className="bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-2xl p-4 hover:bg-[#12305A]/70 transition-colors flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {e.nom.charAt(0)}{e.prenom.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{e.nom} {e.prenom}</h3>
                    <p className="text-xs text-blue-300 font-mono">{e.matricule}</p>
                  </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#94C5FF]/15">
                 <span className="text-xs font-bold text-blue-300/70">Cote (/20)</span>
                 <input 
                   type="number" 
                   min="0" max="20"
                   value={grades[e.id] || ''} 
                   onChange={evt => handleGradeChange(e.id, evt.target.value)}
                   className="w-20 bg-[#12305A]/45 border border-[#94C5FF]/30 rounded-xl px-3 py-1.5 text-white text-center font-bold focus:outline-none focus:border-blue-500"
                   placeholder="-"
                 />
              </div>
            </div>
          ))}
          {eleves.length === 0 && (
            <div className="col-span-full p-8 text-center text-blue-300/50">Aucun élève dans cette classe.</div>
          )}
        </div>

      </div>
    </div>
  );
}
