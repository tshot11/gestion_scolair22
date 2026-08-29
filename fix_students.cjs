const fs = require('fs');
let content = fs.readFileSync('./src/components/views/StudentsView.jsx', 'utf8');

// Add Camera import
content = content.replace('Plus,', 'Plus, Camera,');

const photoInput = `
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#94C5FF]/15">
                    <div className="w-20 h-20 rounded-2xl bg-[#0B1736] border border-[#94C5FF]/20 flex items-center justify-center overflow-hidden shrink-0">
                      {formData.photo ? (
                        <img src={formData.photo} alt="Photo élève" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-blue-300/30" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Photo de profil de l'élève</h4>
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-200 rounded-lg text-xs font-bold border border-blue-500/30 cursor-pointer transition">
                        <Camera className="w-3.5 h-3.5" /> Charger une photo
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setFormData({...formData, photo: reader.result});
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                      <p className="text-[10px] text-blue-300/50 mt-1">Format portrait recommandé (JPG/PNG).</p>
                    </div>
                  </div>
`;

content = content.replace(
  '{/* TAB 1: IDENTITÉ & ÉTAT CIVIL */}\n              {activeTab === \'identity\' && (\n                <div className="space-y-4">',
  `{/* TAB 1: IDENTITÉ & ÉTAT CIVIL */}\n              {activeTab === 'identity' && (\n                <div className="space-y-4">` + photoInput
);

// We should also replace the avatar placeholder in the student card (grid) and table with the actual photo if it exists.
// Grid view avatar:
content = content.replace(
  '<div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-base font-bold shadow-md shrink-0">\n                        {eleve.nom ? eleve.nom.charAt(0) : \'E\'}\n                        {eleve.prenom ? eleve.prenom.charAt(0) : \'\'}\n                      </div>',
  `<div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-base font-bold shadow-md shrink-0 overflow-hidden">
                        {eleve.photo ? (
                          <img src={eleve.photo} alt="Photo" className="w-full h-full object-cover" />
                        ) : (
                          <>{eleve.nom ? eleve.nom.charAt(0) : 'E'}
                          {eleve.prenom ? eleve.prenom.charAt(0) : ''}</>
                        )}
                      </div>`
);

// Table view avatar:
content = content.replace(
  '<div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">\n                            {eleve.nom ? eleve.nom[0] : \'E\'}\n                          </div>',
  `<div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                            {eleve.photo ? (
                              <img src={eleve.photo} alt="Photo" className="w-full h-full object-cover" />
                            ) : (
                              eleve.nom ? eleve.nom[0] : 'E'
                            )}
                          </div>`
);


fs.writeFileSync('./src/components/views/StudentsView.jsx', content, 'utf8');
