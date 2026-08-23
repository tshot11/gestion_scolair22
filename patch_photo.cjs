const fs = require('fs');
const file = 'src/components/views/TeachersView.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldPhotoInput = `                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Photo de profil (URL)</label>
                      <input type="text" placeholder="https://..." value={formData.photo} onChange={e => setFormData({...formData, photo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" />
                    </div>`;

const newPhotoInput = `                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Photo de profil</label>
                      <div className="flex items-center gap-4">
                        {formData.photo && (
                          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-700 bg-slate-800">
                            <img src={formData.photo} alt="Aperçu" className="w-full h-full object-cover object-top" />
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData({...formData, photo: reader.result});
                              };
                              reader.readAsDataURL(file);
                            }
                          }} 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30 cursor-pointer" 
                        />
                      </div>
                    </div>`;

content = content.replace(oldPhotoInput, newPhotoInput);
fs.writeFileSync(file, content);
