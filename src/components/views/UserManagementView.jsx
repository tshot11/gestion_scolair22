
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserPlus, Trash2, Edit, CheckCircle2, XCircle, Key, Eye, EyeOff, Copy, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

export function UserManagementView() {
  const { data, setData, showToast } = useApp();
  const eleves = data?.eleves || [];
  const utilisateurs = data?.utilisateurs || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [form, setForm] = useState({ nom: '', email: '', password: '', role: 'ENSEIGNANT', eleve_id: '' });

  const getEffectivePassword = (u) => {
    if (u.password) return u.password;
    if (u.role === 'ADMIN') return 'admin123';
    if (u.role === 'ELEVE') {
      const el = eleves.find(e => e.id === u.eleve_id || (e.email_eleve && e.email_eleve.toLowerCase() === (u.email || '').toLowerCase()));
      if (el?.mot_de_passe_eleve) return el.mot_de_passe_eleve;
      return 'eleve123';
    }
    if (u.role === 'ENSEIGNANT') return '123';
    if (u.role === 'PREFET') return '123';
    if (u.role === 'COMPTABLE' || u.role === 'CAISSIER') return '123';
    if (u.role === 'TUTEUR') return '123';
    return '123';
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyPassword = (id, pwd) => {
    navigator.clipboard?.writeText(pwd);
    setCopiedId(id);
    showToast("Mot de passe copié dans le presse-papiers !");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEdit = (u) => {
    setEditId(u.id);
    const currentPass = getEffectivePassword(u);
    setForm({ nom: u.nom, email: u.email, password: currentPass, role: u.role, eleve_id: u.eleve_id || '' });
    setIsModalOpen(true);
  };
  
  const handleDeleteClick = (u) => {
    setUserToDelete(u);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    const targetId = userToDelete.id;
    const targetName = userToDelete.nom;

    setData((prev) => ({
      ...prev,
      utilisateurs: (prev.utilisateurs || []).filter(u => u.id !== targetId)
    }));

    // Async backend delete attempt
    try {
      const token = localStorage.getItem("auth_token");
      fetch(`/api/users/${targetId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      }).catch(() => {});
    } catch {}

    showToast(`Utilisateur "${targetName}" supprimé avec succès`);
    setUserToDelete(null);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (editId) {
      setData((prev) => {
        const updatedUsers = (prev.utilisateurs || []).map(u => 
          u.id === editId ? { 
            ...u, 
            nom: form.nom, 
            email: form.email, 
            password: form.password,
            role: form.role, 
            eleve_id: form.eleve_id ? Number(form.eleve_id) : null 
          } : u
        );

        // Si l'utilisateur est un élève, synchroniser aussi mot_de_passe_eleve dans la table eleves
        let updatedEleves = prev.eleves || [];
        if (form.role === 'ELEVE' && form.eleve_id) {
          const elId = Number(form.eleve_id);
          updatedEleves = updatedEleves.map(el => 
            el.id === elId ? { ...el, mot_de_passe_eleve: form.password, email_eleve: form.email } : el
          );
        }

        return {
          ...prev,
          utilisateurs: updatedUsers,
          eleves: updatedEleves
        };
      });

      // Synchroniser avec le backend par API
      try {
        const token = localStorage.getItem("auth_token");
        fetch('/api/users/by-email', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ email: form.email, password: form.password })
        }).catch(() => {});
      } catch {}

      showToast("Compte utilisateur et mot de passe mis à jour !");
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

      setData((prev) => {
        let updatedEleves = prev.eleves || [];
        if (form.role === 'ELEVE' && form.eleve_id) {
          const elId = Number(form.eleve_id);
          updatedEleves = updatedEleves.map(el => 
            el.id === elId ? { ...el, mot_de_passe_eleve: form.password, email_eleve: form.email } : el
          );
        }

        return {
          ...prev,
          utilisateurs: [...(prev.utilisateurs || []), newUser],
          eleves: updatedEleves
        };
      });

      // Synchroniser avec le backend
      try {
        const token = localStorage.getItem("auth_token");
        fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            nom: newUser.nom,
            email: newUser.email,
            password: newUser.password,
            role: newUser.role,
            eleve_id: newUser.eleve_id
          })
        }).catch(() => {});
      } catch {}

      showToast("Compte utilisateur créé avec succès !");
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
          <p className="text-sm text-blue-200/70 mt-1">Consultez, créez et gérez les comptes d'accès ainsi que les mots de passe des utilisateurs.</p>
        </div>
        <button 
          onClick={() => { 
            setEditId(null); 
            setForm({ nom: '', email: '', password: '123', role: 'ENSEIGNANT', eleve_id: '' }); 
            setIsModalOpen(true); 
          }} 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Créer un compte
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {utilisateurs.map(u => {
          const userPassword = getEffectivePassword(u);
          const isVisible = !!visiblePasswords[u.id];
          const isCopied = copiedId === u.id;

          return (
            <div key={u.id} className="bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-2xl p-5 hover:bg-[#12305A]/70 transition-colors flex flex-col justify-between">
              <div>
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
                       <span className="inline-flex text-emerald-400" title="Compte actif"><CheckCircle2 className="w-5 h-5" /></span> : 
                       <span className="inline-flex text-rose-400" title="Compte inactif"><XCircle className="w-5 h-5" /></span>
                    }
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#12305A]/45 border border-[#94C5FF]/15">
                    <span className="text-blue-300/70 text-xs">Rôle</span>
                    <span className="text-blue-100 font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">{u.role}</span>
                  </div>

                  {/* Mot de passe visible avec toggle et copie */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#12305A]/60 border border-amber-500/20">
                    <span className="text-amber-300/80 text-xs flex items-center gap-1.5 font-medium">
                      <Key className="w-3.5 h-3.5 text-amber-400" /> Mot de passe
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-amber-200 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 select-all">
                        {isVisible ? userPassword : '••••••••'}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => togglePasswordVisibility(u.id)} 
                        className="p-1 text-blue-300 hover:text-white transition"
                        title={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleCopyPassword(u.id, userPassword)} 
                        className="p-1 text-blue-300 hover:text-white transition"
                        title="Copier le mot de passe"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {u.role === 'TUTEUR' && u.eleve_id && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#12305A]/45 border border-[#94C5FF]/15">
                      <span className="text-blue-300/70 text-xs">Parent de</span>
                      <span className="text-blue-100 text-xs font-bold">Élève #{u.eleve_id}</span>
                    </div>
                  )}

                  {u.role === 'ELEVE' && u.eleve_id && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#12305A]/45 border border-[#94C5FF]/15">
                      <span className="text-blue-300/70 text-xs">Fiche Élève</span>
                      <span className="text-emerald-300 text-xs font-bold">ID #{u.eleve_id}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#94C5FF]/15">
                <button 
                  onClick={() => handleEdit(u)} 
                  className="px-3 py-1.5 text-blue-300 hover:text-white hover:bg-blue-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Modifier le compte et le mot de passe"
                >
                  <Edit className="w-3.5 h-3.5" /> Modifier
                </button>
                <button 
                  onClick={() => handleDeleteClick(u)} 
                  className="px-3 py-1.5 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Supprimer définitivement l'utilisateur"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Confirmation de Suppression */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12305A] border border-rose-500/30 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Supprimer l'utilisateur</h3>
                <p className="text-xs text-blue-200/70">Cette action est irréversible.</p>
              </div>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed">
              Voulez-vous vraiment supprimer le compte de <strong className="text-white">{userToDelete.nom}</strong> (<span className="text-blue-300 font-mono text-xs">{userToDelete.email}</span>) ?
            </p>
            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setUserToDelete(null)} 
                className="flex-1 py-2.5 bg-transparent border border-[#94C5FF]/30 text-blue-300 rounded-xl text-xs font-bold hover:bg-blue-500/10 transition-colors"
              >
                Annuler
              </button>
              <button 
                type="button" 
                onClick={handleConfirmDelete} 
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 transition-colors"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Création / Modification */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12305A]/95 border border-[#94C5FF]/15 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#94C5FF]/15 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {editId ? <Edit className="w-5 h-5 text-blue-400" /> : <UserPlus className="w-5 h-5 text-blue-400" />}
                {editId ? 'Modifier le compte & mot de passe' : 'Créer un nouveau compte'}
              </h2>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">Nom complet</label>
                <input 
                  required 
                  type="text" 
                  value={form.nom} 
                  onChange={e => setForm({...form, nom: e.target.value})} 
                  className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" 
                  placeholder="Ex: Samuel Kasongo"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">Email / Identifiant</label>
                <input 
                  required 
                  type="email" 
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                  className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" 
                  placeholder="Ex: samuel.kasongo@ecole.cd"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" /> {editId ? 'Mot de passe (Modifiable)' : 'Mot de passe initial'}
                </label>
                <input 
                  required 
                  type="text" 
                  value={form.password} 
                  onChange={e => setForm({...form, password: e.target.value})} 
                  className="w-full bg-[#0B1736]/60 border border-amber-500/30 rounded-xl px-3 py-2 text-amber-200 font-mono text-sm focus:outline-none focus:border-amber-400" 
                  placeholder="Saisissez le mot de passe..."
                />
                <p className="text-[11px] text-blue-300/60 mt-1">L'utilisateur utilisera ce mot de passe exact pour se connecter à son portail.</p>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-blue-300 mb-1">Rôle dans l'établissement</label>
                <select 
                  value={form.role} 
                  onChange={e => setForm({...form, role: e.target.value})} 
                  className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="ELEVE">Élève</option>
                  <option value="ENSEIGNANT">Enseignant(e)</option>
                  <option value="ADMIN">Administrateur</option>
                  <option value="PREFET">Préfet des Études</option>
                  <option value="COMPTABLE">Comptable</option>
                  <option value="CAISSIER">Caissier(ère)</option>
                  <option value="TUTEUR">Tuteur / Parent d'élève</option>
                </select>
              </div>
              
              {(form.role === 'TUTEUR' || form.role === 'ELEVE') && (
                <div>
                  <label className="block text-xs font-semibold text-blue-300 mb-1">
                    {form.role === 'ELEVE' ? "Lier à l'élève dans le registre" : "Enfant / Élève assigné"}
                  </label>
                  <select 
                    value={form.eleve_id} 
                    onChange={e => setForm({...form, eleve_id: e.target.value})} 
                    className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Sélectionner un élève...</option>
                    {eleves.map(el => (
                      <option key={el.id} value={el.id}>{el.matricule ? `[${el.matricule}] ` : ''}{el.nom} {el.prenom}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex gap-2 pt-3 border-t border-[#94C5FF]/15">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-2.5 bg-transparent border border-[#94C5FF]/30 text-blue-300 rounded-xl font-bold hover:bg-blue-500/10 transition-colors text-xs"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-colors text-xs"
                >
                  {editId ? 'Enregistrer les modifications' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

