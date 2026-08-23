const fs = require('fs');
const file = 'src/components/views/TeachersView.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldSaveLogic = `      if (!editingId) {
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

const newSaveLogic = `      try {
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
        } else {
          // Update password if it was edited
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
        }
        
        const resData = await response.json();
        if (!response.ok) {
           if (!editingId || (editingId && response.status !== 404)) {
               // Ignore 404 on update if user doesn't have a login account yet
               showToast("Attention: " + (resData.error || "Erreur lors de l'enregistrement de la connexion."));
           }
        } else {
           showToast(editingId ? "Mot de passe de connexion mis à jour." : "Compte utilisateur de connexion créé.");
        }
      } catch (err) {
        showToast("Erreur serveur lors de la configuration du compte de connexion.");
      }`;

content = content.replace(oldSaveLogic, newSaveLogic);
fs.writeFileSync(file, content);
