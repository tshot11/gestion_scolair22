import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  Search, 
  Plus, 
  BookOpen, 
  Calendar,
  Sparkles
} from 'lucide-react';

export function TeachersView() {
  const { data } = useApp();
  const [search, setSearch] = useState('');

  const filteredTeachers = data.enseignants.filter(t => {
    return `${t.nom} ${t.prenom} ${t.specialite} ${t.matricule}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
            Corps Enseignant & Professeurs
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {data.enseignants.length} enseignants affectés • Année {data.ecoleConfig.annee_courante}
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher enseignant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => {
          const taughtCourses = data.cours.filter(c => c.enseignant_id === teacher.id);
          const titulaireClass = data.classes.find(c => c.prof_id === teacher.id);

          return (
            <div
              key={teacher.id}
              className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-3xl p-5 transition group space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-300 overflow-hidden flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                    {teacher.photo ? (
                      <img src={teacher.photo} alt={teacher.nom} className="w-full h-full object-cover" />
                    ) : (
                      <span>{teacher.prenom[0]}{teacher.nom[0]}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-heading group-hover:text-blue-400 transition">
                      {teacher.nom} {teacher.prenom}
                    </h3>
                    <div className="text-xs text-purple-400 font-medium">{teacher.specialite}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{teacher.matricule}</div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30 capitalize">
                  {teacher.statut}
                </span>
              </div>

              {titulaireClass && (
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span>Titulaire de : <strong>{titulaireClass.nom}</strong></span>
                </div>
              )}

              {/* Assigned Subjects */}
              <div className="space-y-1.5 border-t border-slate-700/50 pt-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Cours dispensés ({taughtCourses.length})</span>
                <div className="flex flex-wrap gap-1.5">
                  {taughtCourses.map(c => (
                    <span key={c.id} className="px-2 py-0.5 rounded-lg bg-slate-900 text-[10px] text-slate-300 border border-slate-700">
                      {c.nom}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-1 text-xs text-slate-400 border-t border-slate-700/50 pt-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-300">{teacher.telephone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-300">{teacher.email}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
