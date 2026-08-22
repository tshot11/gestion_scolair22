const fs = require('fs');
const file = 'src/components/views/TeachersView.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add fields to initial state
content = content.replace(/nom: '', prenom: '', email: '', telephone: '', \\n    matricule: '', specialite: '', statut: 'Actif',/g, 
  "nom: '', prenom: '', email: '', telephone: '', \\n    matricule: '', specialite: '', statut: 'Actif', \\n    adresse: '', photo: '', password: 'password123',");

content = content.replace(/matricule: \\\`ENS-\\\${Math.floor\\(Math.random\\(\\) \\* 10000\\)}\\\`, specialite: '', statut: 'Actif',/g,
  "matricule: \`ENS-\${Math.floor(Math.random() * 10000)}\`, specialite: '', statut: 'Actif', adresse: '', photo: '', password: 'password123',");

content = content.replace(/nom: teacher.nom \\|\\| '',\\n        prenom: teacher.prenom \\|\\| '',\\n        email: teacher.email \\|\\| '',\\n        telephone: teacher.telephone \\|\\| '',\\n        matricule: teacher.matricule \\|\\| '',\\n        specialite: teacher.specialite \\|\\| '',\\n        statut: teacher.statut \\|\\| 'Actif',/g,
  "nom: teacher.nom || '',\\n        prenom: teacher.prenom || '',\\n        email: teacher.email || '',\\n        telephone: teacher.telephone || '',\\n        matricule: teacher.matricule || '',\\n        specialite: teacher.specialite || '',\\n        statut: teacher.statut || 'Actif',\\n        adresse: teacher.adresse || '',\\n        photo: teacher.photo || '',\\n        password: '', // On cache le password existant");

// 2. Make handleSave async and add API call
const handleSaveRegex = /const handleSave = \(e\) => \{\n    e\.preventDefault\(\);\n    \n    setData\(prev => \{/m;
const newHandleSave = `const handleSave = async (e) => {
    e.preventDefault();
    
    if (!editingId) {
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
    }

    setData(prev => {`;

content = content.replace(handleSaveRegex, newHandleSave);

// 3. Add fields to the form
const formRegex = /<div className="space-y-1\.5">\s*<label className="text-xs font-medium text-slate-400">Matricule<\/label>\s*<input type="text" required value=\{formData\.matricule\} onChange=\{e => setFormData\(\{\.\.\.formData, matricule: e\.target\.value\}\)\} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2\.5 text-sm text-white focus:border-blue-500 focus:outline-none" \/>\s*<\/div>/;

const extraFields = `<div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Matricule</label>
                      <input type="text" required value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Adresse</label>
                      <input type="text" value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Photo de profil (URL)</label>
                      <input type="text" placeholder="https://..." value={formData.photo} onChange={e => setFormData({...formData, photo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    {!editingId && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-emerald-400">Mot de passe de connexion</label>
                        <input type="text" required minLength="6" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-emerald-950/20 border border-emerald-800/50 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
                      </div>
                    )}`;

content = content.replace(formRegex, extraFields);
fs.writeFileSync(file, content);
