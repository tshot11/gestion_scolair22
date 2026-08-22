import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Shield, CheckCircle2, XCircle, Key, Plus, 
  Search, ShieldAlert, BadgeCheck, X, FileEdit, Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function UserManagementView() {
  const { currentUser, showToast } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New User Form State
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    role: 'ENSEIGNANT' // Default
  });
  
  const [submitting, setSubmitting] = useState(false);

  const roles = [
    { id: 'ADMIN', label: 'Administrateur', icon: ShieldAlert, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { id: 'DIRECTEUR', label: 'Directeur (Primaire)', icon: Shield, color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20' },
    { id: 'PREFET', label: 'Préfet (Secondaire)', icon: Shield, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { id: 'ENSEIGNANT', label: 'Enseignant', icon: BadgeCheck, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'CAISSIER', label: 'Caissier / Finance', icon: Key, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'PARENT', label: 'Parent / Tuteur', icon: Users, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    { id: 'ELEVE', label: 'Élève', icon: Users, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
  ];

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Erreur récupération utilisateurs:", error);
      showToast("Erreur lors de la récupération des utilisateurs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (submitting) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        showToast("Compte utilisateur créé avec succès !");
        setUsers([...users, { ...data.user, createdAt: new Date().toISOString(), is_active: true }]);
        setIsModalOpen(false);
        setFormData({ nom: '', email: '', password: '', role: 'ENSEIGNANT' });
      } else {
        showToast(data.error || "Erreur lors de la création", "error");
      }
    } catch (error) {
      showToast("Erreur réseau", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    // confirm removed
    
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        showToast("Utilisateur supprimé avec succès", "success");
        setUsers(users.filter(u => u.id !== userId));
      } else {
        const data = await res.json();
        showToast(data.error || "Erreur lors de la suppression", "error");
      }
    } catch (error) {
      showToast("Erreur réseau", "error");
    }
  };

  const getRoleStyle = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.color : 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  const getRoleLabel = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.label : roleId;
  };

  if (currentUser?.role_id !== 'admin') {
    return (
      <div className="p-8 text-center text-rose-400">
        <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-bold font-heading">Accès Interdit</h2>
        <p className="text-sm mt-2 opacity-80">Seul l'Administrateur peut gérer les utilisateurs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-500" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Création centralisée des comptes. Vous seul (Administrateur) pouvez attribuer les mots de passe.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/25"
        >
          <UserPlus className="w-4 h-4" />
          Créer un compte
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700/50">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Utilisateur</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email (Identifiant)</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Rôle RBAC</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Statut</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Créé le</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">Chargement...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">Aucun utilisateur trouvé</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs border border-slate-700">
                          {user.nom.charAt(0)}
                        </div>
                        <span className="font-semibold text-white text-sm">{user.nom}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-300 font-mono text-xs">{user.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${getRoleStyle(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {user.is_active ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/10 text-rose-400 mx-auto">
                          <XCircle className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-400 text-right">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                        title="Supprimer l'utilisateur"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                Créer un nouveau compte
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Nom complet
                </label>
                <input 
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                  placeholder="Ex: Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Email (Sert d'identifiant)
                </label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-mono"
                  placeholder="jean.dupont@ecole.cd"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Mot de passe initial
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-mono"
                    placeholder="Mot de passe temporaire"
                  />
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">
                  L'utilisateur utilisera ce mot de passe pour se connecter. Il est encrypté immédiatement dans la base de données.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Rôle (Permissions)
                </label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm appearance-none"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/25"
                >
                  {submitting ? 'Création...' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
