import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  MapPin, 
  ChevronRight,
  School
} from 'lucide-react';

export function ClassesView() {
  const { data, setCurrentView, setSelectedClasseId, currentUser } = useApp();

  // Filter for teacher: only show classes they are titulaire of, or where they teach a course
  let displayedClasses = data.classes;
  if (currentUser?.role === 'ENSEIGNANT') {
    const teacherRecord = data.enseignants.find(t => t.email === currentUser.email);
    if (teacherRecord) {
      displayedClasses = data.classes.filter(c => 
        c.prof_id === teacherRecord.id || 
        data.cours.some(cours => cours.enseignant_id === teacherRecord.id && (cours.classe_id === c.id || !cours.classe_id))
      );
    } else {
      displayedClasses = []; // No teacher profile found for this user account
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
          Classes & Salles Pédagogiques
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Structure des sections et répartition des effectifs scolaires
        </p>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedClasses.map((classe) => {
          const elevesInClass = data.eleves.filter(e => e.classe_id === classe.id);
          const titulaire = data.enseignants.find(t => t.id === classe.prof_id);
          const salle = data.salles.find(s => s.id === classe.salle_id);
          const niveau = data.niveaux.find(n => n.id === classe.niveau_id);
          const capacityPercent = Math.round((elevesInClass.length / classe.capacite) * 100);

          return (
            <div
              key={classe.id}
              className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-3xl p-5 transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-400 block tracking-wider">
                      {niveau?.nom}
                    </span>
                    <h3 className="text-base font-bold text-white font-heading mt-0.5">
                      {classe.nom}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold text-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Effectif inscrit :</span>
                    <span className="font-bold text-white">{elevesInClass.length} / {classe.capacite} élèves</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        capacityPercent > 90 ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, capacityPercent)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Titulaire : <strong>{titulaire ? `${titulaire.nom} ${titulaire.prenom}` : 'Non assigné'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Local : <strong>{salle ? `${salle.nom} (${salle.code})` : 'Salle standard'}</strong></span>
                  </div>
                </div>
              </div>

              {/* View Students button */}
              <button
                onClick={() => {
                  setSelectedClasseId(classe.id);
                  setCurrentView('eleves');
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-semibold border border-blue-500/30 transition"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Voir les {elevesInClass.length} élèves</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
