const fs = require('fs');
const file = 'src/components/views/TeachersView.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix handleOpenModal missing password
content = content.replace(
  "statut: teacher.statut || 'Actif', adresse: teacher.adresse || '', photo: teacher.photo || '',\n        titulaire_classe_id: data.classes.find(c => c.prof_id === teacher.id)?.id || ''\n      });",
  "statut: teacher.statut || 'Actif', adresse: teacher.adresse || '', photo: teacher.photo || '',\n        password: '',\n        titulaire_classe_id: data.classes.find(c => c.prof_id === teacher.id)?.id || ''\n      });"
);

// 2. Fix handleSave missing update logic
const oldSaveLogic = `    if (!editingId) {
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
          },
          body: JSON.stringify({
            nom: formData.prenom + ' ' + formData.nom,
            email: formData.email,
            password: formData.password,
            role: 'ENSEIGNANT'
          })
        });
        
        const resData = await response.json();
        if (!response.ok) {
           showToast("Erreur lors de la création du compte de connexion : " + (resData.error || "Erreur inconnue"));
           return;
        }
        showToast("Compte utilisateur de connexion créé avec succès.");
      } catch (err) {
        showToast("Impossible de se connecter au serveur pour créer l'utilisateur.");
        return;
      }
    }`;

const newSaveLogic = `    try {
      let response;
      if (!editingId) {
        response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
          },
          body: JSON.stringify({
            nom: formData.prenom + ' ' + formData.nom,
            email: formData.email,
            password: formData.password,
            role: 'ENSEIGNANT'
          })
        });
        const resData = await response.json();
        if (!response.ok) {
           showToast("Erreur lors de la création du compte de connexion : " + (resData.error || "Erreur inconnue"));
           return;
        }
        showToast("Compte utilisateur de connexion créé avec succès.");
      } else if (formData.password && formData.password.trim().length >= 6) {
        // Update password if it was edited and valid
        response = await fetch('/api/users/by-email', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        const resData = await response.json();
        if (!response.ok && response.status !== 404) {
           showToast("Erreur: " + (resData.error || "Erreur lors de l'enregistrement de la connexion."));
        } else if (response.ok) {
           showToast("Mot de passe de connexion mis à jour.");
        }
      }
    } catch (err) {
      showToast("Erreur serveur lors de la configuration du compte de connexion.");
    }`;

content = content.replace(oldSaveLogic, newSaveLogic);

// 3. Fix password input field
const oldPassField = `<div className="space-y-1.5">
  <label className="text-xs font-medium text-emerald-400">Mot de passe de connexion</label>
  <input type="text" required minLength="6" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-emerald-950/20 border border-emerald-800/50 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
</div>`;

const newPassField = `<div className="space-y-1.5">
  <label className="text-xs font-medium text-emerald-400">
    Mot de passe de connexion {editingId && <span className="text-slate-500 font-normal">(Laisser vide pour ne pas modifier)</span>}
  </label>
  <input 
    type="text" 
    required={!editingId} 
    minLength="6" 
    value={formData.password || ''} 
    onChange={e => setFormData({...formData, password: e.target.value})} 
    placeholder={editingId ? "Nouveau mot de passe..." : ""}
    className="w-full bg-emerald-950/20 border border-emerald-800/50 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none placeholder:text-emerald-800/50" 
  />
</div>`;

content = content.replace(oldPassField, newPassField);

fs.writeFileSync(file, content);
