const fs = require('fs');

const content = `
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserPlus, Trash2, Edit, CheckCircle2, XCircle } from 'lucide-react';

export function UserManagementView() {
  const { data, setData, showToast } = useApp();
  const eleves = data?.eleves || [];
  
  const utilisateurs = data?.utilisateurs || [];
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nom: '', email: '', password: '', role: 'ENSEIGNANT', eleve_id: '' });

  const handleEdit = (u) => {
    setEditId(u.id);
    setForm({ nom: u.nom, email: u.email, password: '', role: u.role, eleve_id: u.eleve_id || '' });
    setIsModalOpen(true);
  };
  
  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      setData((prev) => ({
        ...prev,
        utilisateurs: (prev.utilisateurs || []).filter(u => u.id !== id)
      }));
      showToast("Utilisateur supprimé");
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (editId) {
      setData((prev) => ({
        ...prev,
        utilisateurs: (prev.utilisateurs || []).map(u => 
          u.id === editId ? { ...u, nom: form.nom, email: form.email, role: form.role, eleve_id: form.eleve_id ? Number(form.eleve_id) : null } : u
        )
      }));
      showToast("Utilisateur mis à jour");
    } else {
      const newUser = {
        id: Date.now(),
        nom: form.nom,
        email: form.email,
        password: form.password,
        role: form.role,
        eleve_id: form.eleve_id ? Number(form.eleve_id) : null,
        is_active: true
      };
      setData((prev) => ({
        ...prev,
        utilisateurs: [...(prev.utilisateurs || []), newUser]
      }));
      showToast("Utilisateur créé");
    }
    
    setIsModalOpen(false);
    setForm({ nom: '', email: '', password: '', role: 'ENSEIGNANT', eleve_id: '' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 min-h-screen text-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-sm text-blue-200/70 mt-1">Gérez les accès et les rôles de l'application.</p>
        </div>
        <button onClick={() => { setEditId(null); setForm({ nom: '', email: '', password: '', role: 'ENSEIGNANT', eleve_id: '' }); setIsModalOpen(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all">
          <UserPlus className="w-4 h-4" /> Créer un compte
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {utilisateurs.map(u => (
          <div key={u.id} className="bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-2xl p-5 hover:bg-[#12305A]/70 transition-colors flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg shrink-0">
                  {u.nom ? u.nom.charAt(0) : '?'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-bold text-sm truncate">{u.nom}</h3>
                  <p className="text-xs text-blue-200 truncate">{u.email}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                {u.is_active !== false ? 
                   <span className="inline-flex text-blue-400"><CheckCircle2 className="w-5 h-5" /></span> : 
                   <span className="inline-flex text-rose-400"><XCircle className="w-5 h-5" /></span>
                }
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#12305A]/45 border border-[#94C5FF]/15">
                <span className="text-blue-300/70 text-xs">Rôle</span>
                <span className="text-blue-100 font-mono text-xs font-bold">{u.role}</span>
              </div>
              {u.role === 'TUTEUR' && u.eleve_id && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#12305A]/45 border border-[#94C5FF]/15">
                  <span className="text-blue-300/70 text-xs">Parent de</span>
                  <span className="text-blue-100 text-xs font-bold">Élève #{u.eleve_id}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#94C5FF]/15">
              <button onClick={() => handleEdit(u)} className="p-2 text-blue-300 hover:text-white hover:bg-blue-500/20 rounded-xl transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(u.id)} className="p-2 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12305A]/90 border border-[#94C5FF]/15 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#94C5FF]/15">
              <h2 className="text-lg font-bold text-white">{editId ? 'Modifier le compte' : 'Créer un compte'}</h2>
            </div>
            <form onSubmit={handleAdd} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">Nom complet</label>
                <input required={!editId} disabled={!!editId} type="text" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">Email</label>
                <input required disabled={!!editId} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">{editId ? 'Nouveau mot de passe' : 'Mot de passe provisoire'}</label>
                <input required type="text" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              
              {!editId && (
              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">Rôle</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="ENSEIGNANT">Enseignant(e)</option>
                  <option value="ADMIN">Administrateur</option>
                  <option value="PREFET">Préfet des Études</option>
                  <option value="COMPTABLE">Comptable</option>
                  <option value="CAISSIER">Caissier(ère)</option>
                  <option value="TUTEUR">Tuteur / Parent d'élève</option>
                  <option value="ELEVE">Élève</option>
                </select>
              </div>
              )}
              
              {form.role === 'TUTEUR' && !editId && (
                <div>
                  <label className="block text-xs font-semibold text-blue-300 mb-1">Enfant assigné</label>
                  <select value={form.eleve_id} onChange={e => setForm({...form, eleve_id: e.target.value})} required className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                    <option value="">Sélectionner un enfant...</option>
                    {eleves.map(el => (
                      <option key={el.id} value={el.id}>{el.nom} {el.prenom}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-transparent border border-[#94C5FF]/30 text-blue-300 rounded-xl font-bold hover:bg-blue-500/10 transition-colors">Annuler</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-colors">{editId ? 'Mettre à jour' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/components/views/UserManagementView.jsx', content);
