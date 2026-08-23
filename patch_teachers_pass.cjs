const fs = require('fs');
const file = 'src/components/views/TeachersView.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/{!editingId && \(\s*<div className="space-y-1\.5">\s*<label className="text-xs font-medium text-emerald-400">Mot de passe de connexion<\/label>\s*<input type="text" required minLength="6" value={formData\.password}.*?<\/div>\s*\)}/s,
`<div className="space-y-1.5">
  <label className="text-xs font-medium text-emerald-400">Mot de passe de connexion</label>
  <input type="text" required minLength="6" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-emerald-950/20 border border-emerald-800/50 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
</div>`);

fs.writeFileSync(file, content);
