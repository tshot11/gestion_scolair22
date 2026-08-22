import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  School, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Clock 
} from 'lucide-react';

export function CoursesView() {
  const { data, currentUser } = useApp();

  let displayedCours = data.cours;
  if (currentUser?.role === 'ENSEIGNANT') {
    const teacherRecord = data.enseignants.find(t => t.email === currentUser.email);
    if (teacherRecord) {
      displayedCours = data.cours.filter(c => c.enseignant_id === teacherRecord.id);
    } else {
      displayedCours = [];
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
          Programme des Cours & Matières
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Syllabus officiels, pondérations et coefficients de délibération
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedCours.map((course) => {
          const teacher = data.enseignants.find(t => t.id === course.enseignant_id);
          const option = data.options.find(o => o.id === course.option_id);

          return (
            <div
              key={course.id}
              className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-3xl p-5 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">
                      {course.code}
                    </span>
                    <h3 className="text-sm font-bold text-white font-heading mt-0.5">
                      {course.nom}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 font-mono font-bold text-xs border border-blue-500/30">
                    Coeff {course.coefficient}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {course.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/50 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Enseignant : <strong>{teacher ? `${teacher.nom} ${teacher.prenom}` : 'Non assigné'}</strong></span>
                </div>
                {option && (
                  <div className="text-[11px] text-slate-400">
                    Option : <span className="text-blue-300">{option.nom}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
