const fs = require('fs');

const content = `import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserPlus, Trash2, Edit, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function UserManagementView() {
  const { data, showToast } = useApp();
  const eleves = data?.eleves || [];
  
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nom: '', email: '', password: '', role: 'ENSEIGNANT', eleve_id: '' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const json = await res.json();
        setUtilisateurs(json.users || []);
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur de chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (u) => {
    setEditId(u.id);
    setForm({ nom: u.nom, email: u.email, password: '', role: u.role, eleve_id: u.eleve_id || '' });
    setIsModalOpen(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      try {
        const res = await fetch(\`/api/users/\${id}\`, { method: 'DELETE' });
        if (res.ok) {
           setUtilisateurs(prev => prev.filter(u => u.id !== id));
           showToast("Utilisateur supprimé");
        } else {
           const err = await res.json();
           showToast(err.error || "Erreur de suppression");
        }
      } catch (e) {
        showToast("Erreur réseau");
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // En mode backend, nous avons /api/users/by-email pour le mot de passe, ou nous pouvons juste appeler ça si besoin.
        // Pour simplifier l'édition on va la limiter au mot de passe côté backend si l'API l'autorise :
        const res = await fetch('/api/users/by-email', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password })
        });
        if (res.ok) {
           showToast("Mot de passe mis à jour");
        } else {
           const err = await res.json();
           showToast(err.error || "Erreur mise à jour");
        }
      } else {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          const json = await res.json();
          setUtilisateurs(prev => [...prev, json.user]);
          showToast("Utilisateur ajouté");
        } else {
           const err = await res.json();
           showToast(err.error || "Erreur lors de la création");
        }
      }
      setEditId(null);
      setIsModalOpen(false);
      setForm({ nom: '', email: '', password: '', role: 'ENSEIGNANT', eleve_id: '' });
      fetchUsers(); // Refresh to get all fields
    } catch(err) {
      showToast("Erreur de connexion");
    }
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

      <div className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl overflow-hidden min-h-[300px] relative">
        {loading ? (
           <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-500/10 border-b border-[#94C5FF]/15 text-blue-300/70 text-xs uppercase">
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rôle</th>
                <th className="p-4 text-center">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#94C5FF]/10 text-sm">
              {utilisateurs.map(u => (
                <tr key={u.id} className="hover:bg-blue-500/10 transition-colors">
                  <td className="p-4 text-white font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {u.nom ? u.nom.charAt(0) : '?'}
                    </div>
                    <div>
                      <div>{u.nom}</div>
                      {u.role === 'TUTEUR' && u.eleve_id && (
                        <div className="text-[10px] text-blue-300/70">Parent de l'élève #{u.eleve_id}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-blue-200">{u.email}</td>
                  <td className="p-4 text-blue-300 font-mono text-xs">{u.role}</td>
                  <td className="p-4 text-center">
                    {u.is_active !== false ? 
                       <span className="inline-flex text-blue-400"><CheckCircle2 className="w-5 h-5" /></span> : 
                       <span className="inline-flex text-rose-400"><XCircle className="w-5 h-5" /></span>
                    }
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleEdit(u)} className="p-1.5 text-blue-300 hover:text-white hover:bg-blue-500/20 rounded-lg mx-1 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg mx-1 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
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
