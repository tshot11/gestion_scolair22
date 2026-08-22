import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, Phone, Mail, MapPin, Search, Plus, BookOpen, 
  Trash2, Edit, X, Save, PlusCircle, AlertCircle
} from 'lucide-react';

export function TeachersView() {
  const { data, setData, showToast, deleteTeacher } = useApp();
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nom: '', prenom: '', email: '', telephone: '', 
    matricule: '', specialite: '', statut: 'Actif', adresse: '', photo: '', password: 'password123',
    titulaire_classe_id: ''
  });
  
  const [coursList, setCoursList] = useState([]); // {id, nom, code, coefficient, classe_id, isNew}

  const filteredTeachers = data.enseignants.filter(t => {
    return `${t.nom} ${t.prenom} ${t.specialite} ${t.matricule}`.toLowerCase().includes(search.toLowerCase());
  });

  const handleOpenModal = (teacher = null) => {
    if (teacher) {
      setEditingId(teacher.id);
      setFormData({
        nom: teacher.nom || '',
        prenom: teacher.prenom || '',
        email: teacher.email || '',
        telephone: teacher.telephone || '',
        matricule: teacher.matricule || '',
        specialite: teacher.specialite || '',
        statut: teacher.statut || 'Actif', adresse: teacher.adresse || '', photo: teacher.photo || '',
        titulaire_classe_id: data.classes.find(c => c.prof_id === teacher.id)?.id || ''
      });
      // Load their courses
      const teacherCourses = data.cours.filter(c => c.enseignant_id === teacher.id);
      setCoursList(teacherCourses.map(c => ({ ...c, isNew: false })));
    } else {
      setEditingId(null);
      setFormData({
        nom: '', prenom: '', email: '', telephone: '', 
        matricule: `ENS-${Math.floor(Math.random() * 10000)}`, specialite: '', statut: 'Actif', adresse: '', photo: '', password: 'password123',
        titulaire_classe_id: ''
      });
      setCoursList([]);
    }
    setIsModalOpen(true);
  };

  const handleAddCourse = () => {
    setCoursList([...coursList, { id: Date.now(), nom: '', code: '', coefficient: 1, classe_id: '', isNew: true }]);
  };

  const handleCourseChange = (id, field, value) => {
    setCoursList(coursList.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleRemoveCourse = (id) => {
    setCoursList(coursList.filter(c => c.id !== id));
  };

  const handleSave = async (e) => {
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

    setData(prev => {
      let updatedEnseignants = [...prev.enseignants];
      let updatedCours = [...prev.cours];
      let updatedClasses = [...prev.classes];
      let teacherId = editingId;

      // 1. Save Teacher
      if (editingId) {
        updatedEnseignants = updatedEnseignants.map(t => 
          t.id === editingId ? { ...t, ...formData } : t
        );
      } else {
        teacherId = (prev.enseignants.length > 0 ? Math.max(...prev.enseignants.map(t => t.id)) : 0) + 1;
        updatedEnseignants.push({ id: teacherId, ...formData });
      }

      // 2. Update Titulaire Classe
      updatedClasses = updatedClasses.map(c => {
        // Remove this teacher from any previous class
        if (c.prof_id === teacherId) {
          return { ...c, prof_id: null };
        }
        return c;
      });
      if (formData.titulaire_classe_id) {
        updatedClasses = updatedClasses.map(c => 
          c.id === Number(formData.titulaire_classe_id) ? { ...c, prof_id: teacherId } : c
        );
      }

      // 3. Update Courses
      // Remove courses that were deleted
      const keptCourseIds = coursList.filter(c => !c.isNew).map(c => c.id);
      updatedCours = updatedCours.filter(c => c.enseignant_id !== teacherId || keptCourseIds.includes(c.id));

      // Add or update courses
      let maxCoursId = prev.cours.length > 0 ? Math.max(...prev.cours.map(c => c.id)) : 0;
      
      coursList.forEach(courseItem => {
        if (courseItem.isNew) {
          maxCoursId++;
          updatedCours.push({
            id: maxCoursId,
            nom: courseItem.nom,
            code: courseItem.code,
            coefficient: Number(courseItem.coefficient),
            enseignant_id: teacherId,
            classe_id: courseItem.classe_id ? Number(courseItem.classe_id) : null,
            description: `Cours de ${courseItem.nom}`
          });
        } else {
          updatedCours = updatedCours.map(c => 
            c.id === courseItem.id ? { 
              ...c, 
              nom: courseItem.nom, 
              code: courseItem.code, 
              coefficient: Number(courseItem.coefficient),
              classe_id: courseItem.classe_id ? Number(courseItem.classe_id) : c.classe_id
            } : c
          );
        }
      });

      return {
        ...prev,
        enseignants: updatedEnseignants,
        classes: updatedClasses,
        cours: updatedCours
      };
    });

    showToast(editingId ? "Enseignant mis à jour avec succès" : "Enseignant ajouté avec succès");
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (true) {
      setData(prev => ({
        ...prev,
        enseignants: prev.enseignants.filter(t => t.id !== id),
        classes: prev.classes.map(c => c.prof_id === id ? { ...c, prof_id: null } : c),
        cours: prev.cours.map(c => c.enseignant_id === id ? { ...c, enseignant_id: null } : c)
      }));
      showToast("Enseignant supprimé.");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
            Corps Enseignant & Professeurs
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {data.enseignants.length} enseignants affectés • Année {data.ecoleConfig?.annee_courante || '2025-2026'}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher enseignant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau</span>
          </button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => {
          const taughtCourses = data.cours.filter(c => c.enseignant_id === teacher.id);
          const titulaireClass = data.classes.find(c => c.prof_id === teacher.id);
          return (
            <div
              key={teacher.id}
              className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-3xl p-5 transition group space-y-4 relative"
            >
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => handleOpenModal(teacher)} className="p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(teacher.id)} className="p-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-start justify-between gap-3 pr-16">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-300 overflow-hidden flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                    {teacher.photo ? (
                      <img src={teacher.photo} alt={teacher.nom} className="w-full h-full object-cover" />
                    ) : (
                      <span>{teacher.prenom[0]}{teacher.nom[0]}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-heading group-hover:text-blue-400 transition">
                      {teacher.nom} {teacher.prenom}
                    </h3>
                    <div className="text-xs text-purple-400 font-medium">{teacher.specialite}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{teacher.matricule}</div>
                  </div>
                </div>
              </div>
              
              {titulaireClass && (
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span>Titulaire : <strong>{titulaireClass.nom}</strong></span>
                </div>
              )}

              {/* Assigned Subjects */}
              <div className="space-y-1.5 border-t border-slate-700/50 pt-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Cours dispensés ({taughtCourses.length})</span>
                <div className="flex flex-wrap gap-1.5">
                  {taughtCourses.map(c => {
                     const cls = data.classes.find(cl => cl.id === c.classe_id);
                     return (
                      <span key={c.id} className="px-2 py-1 rounded-lg bg-slate-900 text-[10px] text-slate-300 border border-slate-700 flex flex-col">
                        <span className="font-bold">{c.nom} (Coeff {c.coefficient})</span>
                        {cls && <span className="text-slate-500 text-[9px]">{cls.nom}</span>}
                      </span>
                     )
                  })}
                  {taughtCourses.length === 0 && <span className="text-xs text-slate-500 italic">Aucun cours</span>}
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-1 text-xs text-slate-400 border-t border-slate-700/50 pt-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-300">{teacher.telephone || 'Non renseigné'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-300">{teacher.email || 'Non renseigné'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Teacher Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-white font-heading">
                {editingId ? "Modifier l'enseignant" : "Nouvel enseignant"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              <form id="teacher-form" onSubmit={handleSave} className="space-y-6">
                
                {/* Informations de base */}
                <div>
                  <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Informations Personnelles
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Nom</label>
                      <input type="text" required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Prénom</label>
                      <input type="text" required value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Téléphone</label>
                      <input type="tel" value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Email</label>
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Spécialité (ex: Mathématiques)</label>
                      <input type="text" value={formData.specialite} onChange={e => setFormData({...formData, specialite: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
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
                    )}
                  </div>
                </div>

                {/* Affectation / Classe Titulaire */}
                <div className="bg-blue-950/20 border border-blue-900/30 rounded-2xl p-4">
                  <h4 className="text-sm font-bold text-blue-300 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Titulariat de Classe (Optionnel)
                  </h4>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">Sélectionnez la classe (ou le grade) dont cet enseignant est le titulaire principal :</label>
                    <select 
                      value={formData.titulaire_classe_id} 
                      onChange={e => setFormData({...formData, titulaire_classe_id: e.target.value})} 
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">-- Aucune classe (Professeur non-titulaire) --</option>
                      {data.classes.map(c => (
                        <option key={c.id} value={c.id}>{c.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Cours Dispensés */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Cours Dispensés & Pondérations
                    </h4>
                    <button 
                      type="button" 
                      onClick={handleAddCourse}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg"
                    >
                      <PlusCircle className="w-4 h-4" /> Ajouter un cours
                    </button>
                  </div>
                  
                  {coursList.length === 0 ? (
                    <div className="text-center py-6 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800">
                      <AlertCircle className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">Aucun cours assigné. Cliquez sur "Ajouter un cours".</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {coursList.map((course, index) => (
                        <div key={course.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                          <div className="sm:col-span-4 space-y-1">
                            <label className="text-[10px] text-slate-500">Nom du cours</label>
                            <input type="text" required placeholder="Ex: Mathématiques" value={course.nom} onChange={e => handleCourseChange(course.id, 'nom', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white" />
                          </div>
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] text-slate-500">Code</label>
                            <input type="text" placeholder="MATH" value={course.code} onChange={e => handleCourseChange(course.id, 'code', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white uppercase font-mono" />
                          </div>
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] text-slate-500">Coefficient</label>
                            <input type="number" min="1" step="0.5" required value={course.coefficient} onChange={e => handleCourseChange(course.id, 'coefficient', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white text-center" />
                          </div>
                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-[10px] text-slate-500">Classe / Grade (Optionnel)</label>
                            <select value={course.classe_id || ''} onChange={e => handleCourseChange(course.id, 'classe_id', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white">
                              <option value="">Général</option>
                              {data.classes.map(c => (
                                <option key={c.id} value={c.id}>{c.nom}</option>
                              ))}
                            </select>
                          </div>
                          <div className="sm:col-span-1 flex justify-end pt-5">
                            <button type="button" onClick={() => handleRemoveCourse(course.id)} className="p-2 text-rose-500 hover:bg-rose-500/20 rounded-lg transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
              {editingId ? (
                <button 
                  type="button" 
                  onClick={() => {
                    if (true) {
                      deleteTeacher(editingId);
                      setIsModalOpen(false);
                    }
                  }} 
                  className="px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition"
                >
                  Supprimer
                </button>
              ) : <div></div>}
              <div className="flex items-center gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition">
                Annuler
              </button>
              <button form="teacher-form" type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/20">
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
