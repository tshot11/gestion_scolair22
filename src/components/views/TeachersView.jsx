import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus, GraduationCap, Users, Shield, MapPin, X, BookOpen, Trash2, Edit, Camera } from 'lucide-react';

export function TeachersView() {
  const { data, setData, addTeacher, deleteTeacher, showToast } = useApp();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', email: '', photo: '' });
  const enseignants = data?.enseignants || [];

  const filtered = enseignants.filter(e => 
    (e.nom + ' ' + e.prenom + ' ' + e.email).toLowerCase().includes(search.toLowerCase())
  );

  
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, photo: reader.result });
      reader.readAsDataURL(file);
    }
  };

    const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet enseignant ?")) {
      deleteTeacher(id);
    }
  };

      const handleAdd = (e) => {
    e.preventDefault();
    setData(prev => ({
        ...prev,
        enseignants: [...(prev.enseignants || []), { id: Date.now(), ...form, is_active: true }]
    }));
    showToast("Enseignant ajouté");
    setIsModalOpen(false);
    setForm({ nom: '', prenom: '', telephone: '', email: '', photo: '' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 min-h-screen text-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-500" />
            Corps Professoral
          </h1>
          <p className="text-sm text-blue-200/70 mt-1">Gérez les enseignants et leurs affectations.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all">
          <Plus className="w-4 h-4" /> Nouvel Enseignant
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-[#12305A]/45 backdrop-blur-md p-4 rounded-2xl border border-[#94C5FF]/15">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/50" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom, prénom ou email..." className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl py-2 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(prof => (
          <div key={prof.id} className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl p-5 hover:bg-[#12305A]/70 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              
              {prof.photo ? (
                <img src={prof.photo} alt={prof.nom} className="w-12 h-12 rounded-xl object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg font-bold">
                  {prof.nom.charAt(0)}{prof.prenom.charAt(0)}
                </div>
              )}

              
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-bold text-sm">{prof.nom} {prof.prenom}</h3>
                    <span className="text-xs text-blue-300/70">{prof.email}</span>
                  </div>
                  <button onClick={() => handleDelete(prof.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

            </div>
            <div className="text-xs text-blue-200/80 mb-1">
              Tel: <span className="text-white">{prof.telephone || 'Non renseigné'}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12305A]/90 border border-[#94C5FF]/15 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#94C5FF]/15 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Ajouter un enseignant</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-blue-300 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">Photo de profil</label>
                <div className="flex items-center gap-3">
                  {form.photo ? (
                    <img src={form.photo} alt="Preview" className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#0B1736]/60 border border-[#94C5FF]/15 flex items-center justify-center text-blue-300/50">
                      <Camera className="w-5 h-5" />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-xs text-blue-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">Nom</label>
                <input required type="text" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">Prénom</label>
                <input required type="text" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">Email</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">Téléphone</label>
                <input required type="text" value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-colors">
                Enregistrer l'enseignant
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
