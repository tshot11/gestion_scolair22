import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Fingerprint, 
  UserCheck, 
  UserX, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  Calendar,
  Sparkles,
  Users
} from 'lucide-react';

export function AttendanceView() {
  const { 
    data, 
    togglePointage, 
    showToast,
    stats
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState(6);
  const today = '2026-08-20';

  // Filter students for active class
  const classStudents = data.eleves.filter(e => e.classe_id === Number(selectedClassId));
  const currentClass = data.classes.find(c => c.id === Number(selectedClassId));

  // Mark all present in selected class
  const handleMarkAllPresent = () => {
    classStudents.forEach(e => {
      togglePointage(e.id, 'present');
    });
    showToast(`Tous les élèves de ${currentClass?.nom || 'la classe'} sont marqués présents.`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              Pointage & Appel Quotidien
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              En direct
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Enregistrement des présences pour la journée du <strong className="text-white">20 Août 2026</strong>
          </p>
        </div>

        {/* Quick bulk action */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            Marquer toute la classe Présente
          </button>
        </div>
      </div>

      {/* Class Selector Capsule and Live Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Class Selection Box */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60 flex flex-col justify-between">
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
            Sélectionner la classe
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {data.classes.map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
          <div className="text-[11px] text-slate-400 mt-2">
            Salle : <strong>{data.salles.find(s => s.id === currentClass?.salle_id)?.nom || 'Salle'}</strong>
          </div>
        </div>

        {/* Metric: Présents */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Présents en classe</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-heading">{stats.presentCount}</div>
            <span className="text-[10px] text-slate-400">À l'heure</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Metric: Absents */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Absents non justifiés</span>
            <div className="text-2xl font-extrabold text-rose-400 font-heading">{stats.absentCount}</div>
            <span className="text-[10px] text-slate-400">Avertissement requis</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <UserX className="w-5 h-5" />
          </div>
        </div>

        {/* Metric: Retards & Malades */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Retards & Malades</span>
            <div className="text-2xl font-extrabold text-amber-400 font-heading">
              {stats.retardCount + stats.maladeCount}
            </div>
            <span className="text-[10px] text-slate-400">{stats.retardCount} retard(s), {stats.maladeCount} malade(s)</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Attendance List (Interactive Tap Grid) */}
      <div className="bg-slate-800/40 rounded-3xl border border-slate-700/60 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white font-heading">
              Liste des élèves : {currentClass?.nom} ({classStudents.length} élèves)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Toucher le bouton de statut pour changer l'état
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {classStudents.map((eleve) => {
            const pointage = data.pointages.find(p => p.eleve_id === eleve.id && p.date === today);
            const currentStatus = pointage ? pointage.statut : 'non_pointe';

            return (
              <div
                key={eleve.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/50 hover:border-slate-600 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {eleve.photo ? (
                      <img src={eleve.photo} alt={eleve.nom} className="w-full h-full object-cover" />
                    ) : (
                      <span>{eleve.prenom[0]}{eleve.nom[0]}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {eleve.nom} {eleve.prenom}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {eleve.matricule} • {eleve.telephone}
                    </div>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="grid grid-cols-4 sm:flex items-center gap-1.5">
                  {/* Présent */}
                  <button
                    onClick={() => togglePointage(eleve.id, 'present')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 ${
                      currentStatus === 'present'
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-emerald-300 border border-slate-800'
                    }`}
                  >
                    <span>Présent</span>
                  </button>

                  {/* Retard */}
                  <button
                    onClick={() => togglePointage(eleve.id, 'retard')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 ${
                      currentStatus === 'retard'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-amber-300 border border-slate-800'
                    }`}
                  >
                    <span>Retard</span>
                  </button>

                  {/* Malade */}
                  <button
                    onClick={() => togglePointage(eleve.id, 'malade')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 ${
                      currentStatus === 'malade'
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-blue-300 border border-slate-800'
                    }`}
                  >
                    <span>Malade</span>
                  </button>

                  {/* Absent */}
                  <button
                    onClick={() => togglePointage(eleve.id, 'absent')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 ${
                      currentStatus === 'absent'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-rose-300 border border-slate-800'
                    }`}
                  >
                    <span>Absent</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {classStudents.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            Aucun élève inscrit dans cette classe.
          </div>
        )}
      </div>
    </div>
  );
}
