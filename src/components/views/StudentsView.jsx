import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Plus, 
  Filter, 
  CreditCard, 
  Users, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  Award, 
  Phone, 
  Mail, 
  Eye, 
  GraduationCap 
} from 'lucide-react';
import { AnimatedStudentCard } from '../ui';

export function StudentsView() {
  const { 
    data, 
    setCurrentView, 
    setSelectedEleveId, 
    addEleve,
    selectedClasseId,
    setSelectedClasseId
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [filterBourse, setFilterBourse] = useState('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedStudentForCard, setSelectedStudentForCard] = useState(null);

  // Form State for new enrollment
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    sexe: 'M',
    date_naissance: '2012-01-15',
    lieu_naissance: 'Kinshasa',
    adresse: 'Kinshasa, RDC',
    telephone: '+243 ',
    email_parent: '',
    nom_parent: '',
    classe_id: 6,
    est_boursier: false,
    est_orphelin: false,
    est_handicape: false,
    est_pris_en_charge: false,
    est_cas_social: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom || !form.prenom) {
      alert('Veuillez renseigner le nom et le prénom.');
      return;
    }
    const created = addEleve({
      ...form,
      classe_id: Number(form.classe_id)
    });
    setIsNewModalOpen(false);
    setSelectedEleveId(created.id);
  };

  // Filtered List
  // Role-based filtering
  let allowedClassesIds = null;
  if (currentUser?.role === 'ENSEIGNANT') {
    const teacherRecord = data.enseignants.find(t => t.email === currentUser.email);
    if (teacherRecord) {
      allowedClassesIds = data.classes
        .filter(c => c.prof_id === teacherRecord.id || data.cours.some(cours => cours.enseignant_id === teacherRecord.id && (cours.classe_id === c.id || !cours.classe_id)))
        .map(c => c.id);
    } else {
      allowedClassesIds = [];
    }
  }

  const filteredEleves = data.eleves.filter(e => {
    // Restrict access for teachers
    if (allowedClassesIds !== null && !allowedClassesIds.includes(e.classe_id)) return false;

    const matchQuery = `${e.nom} ${e.prenom} ${e.matricule} ${e.adresse}`.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === 'all' || e.classe_id === Number(filterClass);
    const matchGender = filterGender === 'all' || e.sexe === filterGender;
    const matchBourse = filterBourse === 'all' || (filterBourse === 'boursier' ? e.est_boursier : !e.est_boursier);
    return matchQuery && matchClass && matchGender && matchBourse;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
            Annuaire des Élèves
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {filteredEleves.length} élève(s) répertorié(s) pour l'année scolaire {data.ecoleConfig.annee_courante}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Inscription
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/60 p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, matricule..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Class Filter */}
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Toutes les classes</option>
            {data.classes.filter(c => allowedClassesIds === null || allowedClassesIds.includes(c.id)).map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Tous les genres</option>
            <option value="M">Garçons (M)</option>
            <option value="F">Filles (F)</option>
          </select>

          {/* Bourse Filter */}
          <select
            value={filterBourse}
            onChange={(e) => setFilterBourse(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="boursier">Boursiers uniquement</option>
          </select>
        </div>
      </div>

      {/* Student Cards Grid with Stable Accordion Expansion */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {filteredEleves.map((eleve) => {
          const classe = data.classes.find(c => c.id === eleve.classe_id);
          return (
            <AnimatedStudentCard
              key={eleve.id}
              eleve={eleve}
              classe={classe}
              onViewDetail={(id) => {
                setSelectedEleveId(id);
                setCurrentView('eleve-detail');
              }}
              onGenerateCard={(student) => setSelectedStudentForCard(student)}
            />
          );
        })}
      </div>

      {filteredEleves.length === 0 && (
        <div className="p-12 text-center bg-slate-800/30 rounded-3xl border border-slate-700/40">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Aucun élève trouvé</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Aucun élève ne correspond à vos critères de recherche. Modifiez vos filtres ou inscrivez un nouvel élève.
          </p>
        </div>
      )}

      {/* Modal: New Student Enrollment */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">Fiche d'Inscription Scolaire</h3>
                  <p className="text-xs text-slate-400">Nouvelle admission • RDC</p>
                </div>
              </div>
              <button 
                onClick={() => setIsNewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nom de famille *</label>
                  <input
                    type="text"
                    required
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value.toUpperCase() })}
                    placeholder="Ex: MUKENDI"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Prénom(s) *</label>
                  <input
                    type="text"
                    required
                    value={form.prenom}
                    onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                    placeholder="Ex: David"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sexe</label>
                  <select
                    value={form.sexe}
                    onChange={(e) => setForm({ ...form, sexe: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="M">Masculin (Garçon)</option>
                    <option value="F">Féminin (Fille)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Classe d'affectation</label>
                  <select
                    value={form.classe_id}
                    onChange={(e) => setForm({ ...form, classe_id: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {data.classes.map(c => (
                      <option key={c.id} value={c.id}>{c.nom}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    value={form.date_naissance}
                    onChange={(e) => setForm({ ...form, date_naissance: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lieu de naissance</label>
                  <input
                    type="text"
                    value={form.lieu_naissance}
                    onChange={(e) => setForm({ ...form, lieu_naissance: e.target.value })}
                    placeholder="Ex: Kinshasa"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nom du Parent / Tuteur</label>
                  <input
                    type="text"
                    value={form.nom_parent}
                    onChange={(e) => setForm({ ...form, nom_parent: e.target.value })}
                    placeholder="Ex: M. Jean Kalala"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Téléphone de contact</label>
                  <input
                    type="text"
                    value={form.telephone}
                    onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                    placeholder="+243 81..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Social Status Toggles */}
              <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50 space-y-2">
                <span className="text-xs font-bold text-slate-300 block mb-1">Statuts Spécifiques & Aides</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.est_boursier}
                      onChange={(e) => setForm({ ...form, est_boursier: e.target.checked })}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span>Boursier de l'école</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.est_orphelin}
                      onChange={(e) => setForm({ ...form, est_orphelin: e.target.checked })}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span>Orphelin</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.est_cas_social}
                      onChange={(e) => setForm({ ...form, est_cas_social: e.target.checked })}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span>Cas social</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
                >
                  Valider l'Inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Student Identity Card Generator */}
      {selectedStudentForCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white font-heading">Carte d'Élève Officielle RDC</h3>
              <button 
                onClick={() => setSelectedStudentForCard(null)}
                className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* DRC Style School ID Card */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 border-2 border-blue-500/40 text-white shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-3">
                <div>
                  <div className="text-[10px] font-bold tracking-wider uppercase text-amber-400">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</div>
                  <div className="text-xs font-extrabold text-white">{data.ecoleConfig.nom}</div>
                </div>
                <div className="w-7 h-7 rounded-full bg-blue-500/30 flex items-center justify-center text-xs font-bold border border-blue-400">
                  RDC
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-20 h-24 rounded-xl bg-slate-800 border-2 border-blue-400/50 overflow-hidden flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {selectedStudentForCard.photo ? (
                    <img src={selectedStudentForCard.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{selectedStudentForCard.prenom[0]}{selectedStudentForCard.nom[0]}</span>
                  )}
                </div>

                <div className="space-y-1 text-xs min-w-0 flex-1">
                  <div className="text-sm font-black text-white font-heading truncate">
                    {selectedStudentForCard.nom} {selectedStudentForCard.prenom}
                  </div>
                  <div className="text-[11px] text-blue-300 font-mono font-bold">
                    ID: {selectedStudentForCard.matricule}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Classe : <strong>{data.classes.find(c => c.id === selectedStudentForCard.classe_id)?.nom}</strong>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Année : {data.ecoleConfig.annee_courante}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-white/15 flex items-center justify-between text-[10px] text-slate-400">
                <span>Le Préfet des Études</span>
                <span className="font-mono text-emerald-400 font-semibold">VALIDÉ • SIGNÉ</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition"
              >
                Imprimer la Carte d'Élève
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
