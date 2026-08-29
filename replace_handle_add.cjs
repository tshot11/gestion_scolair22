const fs = require('fs');
let content = fs.readFileSync('src/components/views/UserManagementView.jsx', 'utf8');

const newCode = `  const handleAdd = (e) => {
    e.preventDefault();
    if (editId) {
      setData(prev => ({
        ...prev,
        utilisateurs: prev.utilisateurs.map(u => 
          u.id === editId 
            ? { ...u, nom: form.nom, email: form.email, role: form.role, password: form.password || u.password, eleve_id: form.role === 'TUTEUR' ? form.eleve_id : undefined }
            : u
        )
      }));
      showToast("Utilisateur mis à jour");
    } else {
      setData(prev => ({
        ...prev,
        utilisateurs: [...(prev.utilisateurs || []), {
          id: Date.now().toString(),
          ...form,
          is_active: true,
          createdAt: new Date().toISOString()
        }]
      }));
      showToast("Utilisateur ajouté");
    }
    setEditId(null);
    setIsModalOpen(false);
    setForm({ nom: '', email: '', password: '', role: 'ENSEIGNANT', eleve_id: '' });
  };`;

content = content.replace(/const handleAdd = \(e\) => \{[\s\S]*?setForm\(\{.*?\}\);\s*\};/, newCode);

fs.writeFileSync('src/components/views/UserManagementView.jsx', content);
