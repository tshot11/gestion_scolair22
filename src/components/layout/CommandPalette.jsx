import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  X, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Wallet, 
  Calendar, 
  Fingerprint, 
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export function CommandPalette() {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setCurrentView, 
    setSelectedEleveId, 
    data 
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Filter students
  const filteredStudents = data.eleves.filter(e => 
    `${e.nom} ${e.prenom} ${e.matricule}`.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  // Filter teachers
  const filteredTeachers = data.enseignants.filter(t => 
    `${t.nom} ${t.prenom} ${t.specialite}`.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  // Filter navigation
  const navigationItems = [
    { title: 'Tableau de bord', view: 'dashboard', category: 'Pages' },
    { title: 'Annuaire Élèves', view: 'eleves', category: 'Pages' },
    { title: 'Pointage Présences', view: 'presences', category: 'Pages' },
    { title: 'Trésorerie & Minervals', view: 'finance', category: 'Pages' },
    { title: 'Bulletins Scolaires RDC', view: 'bulletin', category: 'Pages' },
    { title: 'Registre Disciplinaire', view: 'discipline', category: 'Pages' },
    { title: 'Emploi du temps', view: 'horaires', category: 'Pages' },
  ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            placeholder="Rechercher un élève, enseignant, classe ou page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Pages */}
          {navigationItems.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Navigation Rapide
              </div>
              <div className="space-y-1">
                {navigationItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentView(item.view);
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs text-slate-300 hover:bg-blue-600/20 hover:text-blue-400 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Students */}
          {filteredStudents.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Élèves ({filteredStudents.length})
              </div>
              <div className="space-y-1">
                {filteredStudents.map((eleve) => {
                  const classe = data.classes.find(c => c.id === eleve.classe_id);
                  return (
                    <button
                      key={eleve.id}
                      onClick={() => {
                        setSelectedEleveId(eleve.id);
                        setCurrentView('eleve-detail');
                        setIsCommandPaletteOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs bg-slate-800/40 hover:bg-slate-800 text-slate-200 transition border border-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                          {eleve.prenom[0]}{eleve.nom[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{eleve.nom} {eleve.prenom}</div>
                          <div className="text-[10px] text-slate-400">{eleve.matricule} • {classe ? classe.nom : ''}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                        Voir dossier
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Teachers */}
          {filteredTeachers.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Enseignants ({filteredTeachers.length})
              </div>
              <div className="space-y-1">
                {filteredTeachers.map((teacher) => (
                  <button
                    key={teacher.id}
                    onClick={() => {
                      setCurrentView('enseignants');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs bg-slate-800/40 hover:bg-slate-800 text-slate-200 transition border border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">
                        {teacher.nom[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{teacher.nom} {teacher.prenom}</div>
                        <div className="text-[10px] text-slate-400">{teacher.specialite}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {teacher.matricule}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredStudents.length === 0 && filteredTeachers.length === 0 && navigationItems.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs">
              Aucun résultat correspondant à "{query}"
            </div>
          )}
        </div>

        {/* Palette Footer */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between items-center">
          <span>Conseil : Utilisez les flèches ou touchez un élément pour naviguer</span>
          <span className="text-blue-400">Gestion Scolaire RDC</span>
        </div>
      </div>
    </div>
  );
}
