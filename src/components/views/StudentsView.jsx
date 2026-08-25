import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus, GraduationCap, Users, User, Shield, MapPin, X, BookOpen } from 'lucide-react';

export function StudentsView() {
  const { data, addEleve } = useApp();
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Student State
  const [form, setForm] = useState({ nom: '', prenom: '', sexe: 'M', classe_id: 1, matricule: '' });

  const classes = data?.classes || [];
  const eleves = data?.eleves || [];

  const filteredEleves = eleves.filter(e => {
    const matchSearch = (e.nom + ' ' + e.prenom + ' ' + e.matricule).toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === "all" || e.classe_id === Number(filterClass);
    return matchSearch && matchClass;
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const newStudent = {
      ...form,
      id: Date.now(), // Generate ID
      matricule: form.matricule || `ELE-${Math.floor(1000 + Math.random() * 9000)}`,
      statut: 'actif'
    };
    if (addEleve) addEleve(newStudent);
    else eleves.push(newStudent); // Fallback
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 min-h-screen text-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            Gestion des Élèves
          </h1>
          <p className="text-sm text-blue-200/70 mt-1">Gérez le dossier scolaire et l'inscription des élèves.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all">
          <Plus className="w-4 h-4" /> Nouvel Élève
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#12305A]/45 backdrop-blur-md p-4 rounded-2xl border border-[#94C5FF]/15">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/50" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom, prénom ou matricule..." className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl py-2 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl py-2 px-4 text-white text-sm focus:outline-none focus:border-blue-500 min-w-[150px]">
          <option value="all">Toutes les classes</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredEleves.map(eleve => {
          const classe = classes.find(c => c.id === eleve.classe_id);
          return (
            <div key={eleve.id} className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl p-5 hover:bg-[#12305A]/70 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg font-bold">
                  {eleve.nom.charAt(0)}{eleve.prenom.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{eleve.nom} {eleve.prenom}</h3>
                  <span className="text-xs text-blue-300/70 font-mono">{eleve.matricule}</span>
                </div>
              </div>
              <div className="space-y-2 text-xs text-blue-200/80">
                <div className="flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5" /> Classe: <span className="text-white font-medium">{classe?.nom || 'Non assignée'}</span></div>
                <div className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> Sexe: {eleve.sexe}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12305A]/90 border border-[#94C5FF]/15 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#94C5FF]/15 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Ajouter un élève</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-blue-300 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">Nom</label>
                <input required type="text" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">Prénom</label>
                <input required type="text" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">Sexe</label>
                <select value={form.sexe} onChange={e => setForm({...form, sexe: e.target.value})} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">Classe</label>
                <select value={form.classe_id} onChange={e => setForm({...form, classe_id: Number(e.target.value)})} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                  {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-colors">
                Enregistrer l'élève
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
