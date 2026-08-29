import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus, Camera,
  Search,
  Filter,
  GraduationCap,
  User,
  MapPin,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  X,
  Check,
  Award,
  Key,
  Shield,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  Printer,
  Sparkles,
  RefreshCw,
  Video,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  School
} from 'lucide-react';

export function StudentsView() {
  const {
    data,
    addEleve,
    updateEleve,
    deleteEleve,
    setSelectedEleveId,
    setCurrentView,
    showToast
  } = useApp();

  // Filter and Search States
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterNiveau, setFilterNiveau] = useState('all');
  const [filterOption, setFilterOption] = useState('all');
  const [filterSexe, setFilterSexe] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [activeTab, setActiveTab] = useState('identity'); // 'identity' | 'academic' | 'guardian' | 'account'
  const [showPassword, setShowPassword] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [studentCardToPrint, setStudentCardToPrint] = useState(null);

  // Form State
  const initialFormState = {
    id: null,
    matricule: '',
    nom: '',
    postnom: '',
    prenom: '',
    sexe: 'M',
    date_naissance: '',
    lieu_naissance: 'Kinshasa',
    nationalite: 'Congolaise',
    adresse: '',
    telephone: '',
    photo: '',
    niveau_id: '',
    option_id: '',
    classe_id: '',
    nom_tuteur: '',
    lien_tuteur: 'Père',
    telephone_tuteur: '',
    email_tuteur: '',
    profession_tuteur: '',
    email_eleve: '',
    mot_de_passe_eleve: 'eleve123',
    est_boursier: false,
    est_cas_social: false,
    statut: 'actif'
  };

  const [formData, setFormData] = useState(initialFormState);

  const classes = data?.classes || [];
  const options = data?.options || [];
  const niveaux = data?.niveaux || [];
  const eleves = data?.eleves || [];

  // Filtered List
  const filteredEleves = useMemo(() => {
    return eleves.filter((e) => {
      const q = search.toLowerCase();
      const fullName = `${e.nom || ''} ${e.postnom || ''} ${e.prenom || ''}`.toLowerCase();
      const matricule = (e.matricule || '').toLowerCase();
      const email = (e.email_eleve || e.email || '').toLowerCase();
      const tuteur = (e.nom_tuteur || e.nom_parent || '').toLowerCase();

      const matchesSearch =
        !search ||
        fullName.includes(q) ||
        matricule.includes(q) ||
        email.includes(q) ||
        tuteur.includes(q);

      const matchesClass =
        filterClass === 'all' || e.classe_id === Number(filterClass);

      const matchesNiveau =
        filterNiveau === 'all' ||
        (() => {
          const cls = classes.find((c) => c.id === e.classe_id);
          return cls && cls.niveau_id === Number(filterNiveau);
        })();

      const matchesOption =
        filterOption === 'all' ||
        e.option_id === Number(filterOption) ||
        (() => {
          const cls = classes.find((c) => c.id === e.classe_id);
          return cls && cls.option_id === Number(filterOption);
        })();

      const matchesSexe = filterSexe === 'all' || e.sexe === filterSexe;

      return matchesSearch && matchesClass && matchesNiveau && matchesOption && matchesSexe;
    });
  }, [eleves, classes, search, filterClass, filterNiveau, filterOption, filterSexe]);

  // Open Create Modal
  const handleOpenCreate = () => {
    const nextNum = (eleves.length > 0 ? Math.max(...eleves.map((e) => Number(e.id) || 0)) : 0) + 1;
    const generatedMatricule = `2025-${String(nextNum).padStart(4, '0')}`;

    setFormData({
      ...initialFormState,
      matricule: generatedMatricule,
      classe_id: classes[0]?.id || 1,
      option_id: classes[0]?.option_id || 1,
      niveau_id: classes[0]?.niveau_id || 4,
      mot_de_passe_eleve: `pass${Math.floor(1000 + Math.random() * 9000)}`
    });
    setModalMode('create');
    setActiveTab('identity');
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (student) => {
    const studentClass = classes.find((c) => c.id === student.classe_id);
    setFormData({
      ...initialFormState,
      ...student,
      niveau_id: studentClass?.niveau_id || student.niveau_id || '',
      option_id: student.option_id || studentClass?.option_id || '',
      email_eleve: student.email_eleve || student.email || '',
      mot_de_passe_eleve: student.mot_de_passe_eleve || student.password || 'eleve123'
    });
    setModalMode('edit');
    setActiveTab('identity');
    setIsFormModalOpen(true);
  };

  // Auto-generate student email based on name
  const handleNameChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    const nomClean = (field === 'nom' ? value : updated.nom).trim().toLowerCase().replace(/\s+/g, '');
    const prenomClean = (field === 'prenom' ? value : updated.prenom).trim().toLowerCase().replace(/\s+/g, '');

    if (modalMode === 'create' && (nomClean || prenomClean)) {
      updated.email_eleve = `${prenomClean || 'eleve'}.${nomClean || 'nouveau'}@ecole.cd`;
    }
    setFormData(updated);
  };

  // Handle Class Change to auto-fill level and option
  const handleClassChange = (classeId) => {
    const cid = Number(classeId);
    const cls = classes.find((c) => c.id === cid);
    setFormData((prev) => ({
      ...prev,
      classe_id: cid,
      niveau_id: cls?.niveau_id || prev.niveau_id,
      option_id: cls?.option_id || prev.option_id
    }));
  };

  // Generate random password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let pass = '';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, mot_de_passe_eleve: pass }));
    showToast('Nouveau mot de passe généré !', 'info');
  };

  // Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nom || !formData.prenom) {
      showToast('Veuillez renseigner au minimum le nom et le prénom.', 'error');
      return;
    }

    if (modalMode === 'create') {
      addEleve(formData);
    } else {
      updateEleve(formData.id, formData);
    }

    setIsFormModalOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (studentToDelete) {
      deleteEleve(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  // Helper for option badge colors
  const getOptionBadgeColor = (optionId) => {
    switch (Number(optionId)) {
      case 1: // Bio-Chimie
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 2: // Math-Physique
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 3: // Commerciale
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 4: // Littéraire
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 5: // Pédagogie
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 6: // Couture
        return 'bg-pink-500/15 text-pink-300 border-pink-500/30';
      default:
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 min-h-screen text-slate-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#12305A]/45 backdrop-blur-md p-6 rounded-2xl border border-[#94C5FF]/15 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                Gestion des Élèves
              </h1>
              <p className="text-xs sm:text-sm text-blue-200/70">
                Inscriptions, options d'humanités (RDC), tuteurs et comptes d'accès élève.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-blue-600 text-white shadow' : 'text-blue-300/70 hover:text-white'
              }`}
            >
              Grille
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-blue-600 text-white shadow' : 'text-blue-300/70 hover:text-white'
              }`}
            >
              Tableau
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Inscrire un Élève
          </button>
        </div>
      </div>

      {/* Quick Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#12305A]/35 backdrop-blur-sm border border-[#94C5FF]/15 p-4 rounded-2xl">
          <span className="text-xs text-blue-300/70 block">Total Effectif</span>
          <span className="text-2xl font-black text-white">{eleves.length}</span>
          <span className="text-[10px] text-blue-400 block mt-0.5">Élèves enregistrés</span>
        </div>
        <div className="bg-[#12305A]/35 backdrop-blur-sm border border-[#94C5FF]/15 p-4 rounded-2xl">
          <span className="text-xs text-blue-300/70 block">Garçons / Filles</span>
          <span className="text-2xl font-black text-white">
            {eleves.filter((e) => e.sexe === 'M').length}{' '}
            <span className="text-sm font-normal text-blue-300/60">/</span>{' '}
            {eleves.filter((e) => e.sexe === 'F').length}
          </span>
          <span className="text-[10px] text-pink-400 block mt-0.5">Parité de genre</span>
        </div>
        <div className="bg-[#12305A]/35 backdrop-blur-sm border border-[#94C5FF]/15 p-4 rounded-2xl">
          <span className="text-xs text-blue-300/70 block">Humanités & Options</span>
          <span className="text-2xl font-black text-white">
            {eleves.filter((e) => {
              const c = classes.find((cls) => cls.id === e.classe_id);
              return c?.niveau_id === 4;
            }).length}
          </span>
          <span className="text-[10px] text-amber-400 block mt-0.5">Secondaire cycle long</span>
        </div>
        <div className="bg-[#12305A]/35 backdrop-blur-sm border border-[#94C5FF]/15 p-4 rounded-2xl">
          <span className="text-xs text-blue-300/70 block">Portail Élève Connecté</span>
          <span className="text-2xl font-black text-emerald-400">
            {eleves.filter((e) => e.email_eleve || e.email).length}
          </span>
          <span className="text-[10px] text-emerald-400/80 block mt-0.5">Comptes avec mot de passe</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#12305A]/45 backdrop-blur-md p-4 rounded-2xl border border-[#94C5FF]/15 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, matricule, email, tuteur..."
              className="w-full bg-[#0B1736]/70 border border-[#94C5FF]/15 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 placeholder:text-blue-300/40"
            />
          </div>

          {/* Niveau Filter */}
          <div className="md:col-span-2">
            <select
              value={filterNiveau}
              onChange={(e) => {
                setFilterNiveau(e.target.value);
                setFilterClass('all');
              }}
              className="w-full bg-[#0B1736]/70 border border-[#94C5FF]/15 rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">Tous les Niveaux</option>
              {niveaux.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div className="md:col-span-3">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full bg-[#0B1736]/70 border border-[#94C5FF]/15 rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">Toutes les Classes</option>
              {classes
                .filter((c) => filterNiveau === 'all' || c.niveau_id === Number(filterNiveau))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
            </select>
          </div>

          {/* Option Filter */}
          <div className="md:col-span-2">
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="w-full bg-[#0B1736]/70 border border-[#94C5FF]/15 rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">Toutes les Options</option>
              {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Sexe Filter */}
          <div className="md:col-span-1">
            <select
              value={filterSexe}
              onChange={(e) => setFilterSexe(e.target.value)}
              className="w-full bg-[#0B1736]/70 border border-[#94C5FF]/15 rounded-xl py-2.5 px-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">Sexe</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </div>
        </div>

        {/* Active Filters summary */}
        {(search || filterClass !== 'all' || filterNiveau !== 'all' || filterOption !== 'all' || filterSexe !== 'all') && (
          <div className="flex items-center justify-between text-xs text-blue-300 pt-2 border-t border-[#94C5FF]/10">
            <span>
              Résultats trouvés : <strong>{filteredEleves.length}</strong> élève(s)
            </span>
            <button
              onClick={() => {
                setSearch('');
                setFilterClass('all');
                setFilterNiveau('all');
                setFilterOption('all');
                setFilterSexe('all');
              }}
              className="text-blue-400 hover:text-white underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Main Student List */}
      {filteredEleves.length === 0 ? (
        <div className="bg-[#12305A]/35 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Aucun élève correspondant</h3>
          <p className="text-xs text-blue-200/70 max-w-md mx-auto">
            Aucun dossier scolaire ne correspond à votre recherche ou aux filtres sélectionnés.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Inscrire un nouvel élève
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEleves.map((eleve) => {
            const classe = classes.find((c) => c.id === eleve.classe_id);
            const opt = options.find((o) => o.id === (eleve.option_id || classe?.option_id));
            const studentEmail = eleve.email_eleve || eleve.email;
            const studentPassword = eleve.mot_de_passe_eleve || eleve.password || '••••••••';

            return (
              <div
                key={eleve.id}
                className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl p-5 hover:bg-[#12305A]/70 transition-all flex flex-col justify-between shadow-lg relative group"
              >
                <div>
                  {/* Top student identity */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-base font-bold shadow-md shrink-0 overflow-hidden">
                        {eleve.photo ? (
                          <img src={eleve.photo} alt="Photo" className="w-full h-full object-cover" />
                        ) : (
                          <>{eleve.nom ? eleve.nom.charAt(0) : 'E'}
                          {eleve.prenom ? eleve.prenom.charAt(0) : ''}</>
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-extrabold text-base leading-tight">
                          {eleve.nom} {eleve.postnom || ''} {eleve.prenom}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-mono font-bold text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded-md border border-blue-500/20">
                            {eleve.matricule || `ELE-${eleve.id}`}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              eleve.sexe === 'M'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-pink-500/20 text-pink-300'
                            }`}
                          >
                            {eleve.sexe === 'M' ? 'Garçon' : 'Fille'}
                          </span>
                          {eleve.est_boursier && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Boursier
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(eleve)}
                        className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-white transition"
                        title="Modifier le dossier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setStudentToDelete(eleve)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition"
                        title="Supprimer l'élève"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Academic information */}
                  <div className="space-y-2 py-3 border-y border-[#94C5FF]/10 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-300/70 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> Classe :
                      </span>
                      <span className="font-bold text-white text-right">
                        {classe?.nom || 'Non assignée'}
                      </span>
                    </div>

                    {opt && (
                      <div className="flex items-center justify-between">
                        <span className="text-blue-300/70 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-400" /> Option RDC :
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getOptionBadgeColor(opt.id)}`}>
                          {opt.nom}
                        </span>
                      </div>
                    )}

                    {eleve.adresse && (
                      <div className="flex items-center justify-between">
                        <span className="text-blue-300/70 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" /> Adresse :
                        </span>
                        <span className="text-blue-200 text-right truncate max-w-[180px]" title={eleve.adresse}>
                          {eleve.adresse}
                        </span>
                      </div>
                    )}

                    {eleve.nom_tuteur && (
                      <div className="flex items-center justify-between">
                        <span className="text-blue-300/70 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-amber-400" /> Tuteur :
                        </span>
                        <span className="text-amber-200 font-medium text-right">
                          {eleve.nom_tuteur} ({eleve.lien_tuteur || 'Parent'})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Student Portal Login Credentials Tag */}
                  <div className="mt-3 p-2.5 rounded-xl bg-[#0B1736]/60 border border-[#94C5FF]/15 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-blue-300/70 flex items-center gap-1">
                        <Key className="w-3 h-3 text-emerald-400" /> Accès Portail Élève :
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        Actif
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-blue-200 truncate">
                      Email : <strong className="text-white">{studentEmail || 'Non défini'}</strong>
                    </div>
                    <div className="text-[11px] font-mono text-blue-200 flex items-center justify-between">
                      <span>Pass : <strong className="text-blue-300">{studentPassword}</strong></span>
                      <span className="text-[10px] text-blue-300/60">(Visio, Notes, Cours)</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-[#94C5FF]/10 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedEleveId(eleve.id);
                      setCurrentView('eleve-detail');
                    }}
                    className="flex-1 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-blue-500/30"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Fiche Dossier
                  </button>

                  <button
                    onClick={() => {
                      setSelectedEleveId(eleve.id);
                      setCurrentView('bulletin');
                    }}
                    className="p-2 bg-[#12305A]/80 hover:bg-blue-500/20 text-blue-300 hover:text-white rounded-xl text-xs font-bold transition border border-[#94C5FF]/15"
                    title="Voir le bulletin"
                  >
                    <Award className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-blue-200">
              <thead className="bg-[#0B1736]/70 text-blue-300 uppercase font-bold border-b border-[#94C5FF]/15">
                <tr>
                  <th className="py-3.5 px-4">Élève & Matricule</th>
                  <th className="py-3.5 px-4">Classe & Niveau</th>
                  <th className="py-3.5 px-4">Option (RDC)</th>
                  <th className="py-3.5 px-4">Tuteur / Contact</th>
                  <th className="py-3.5 px-4">Compte Élève (Login)</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#94C5FF]/10">
                {filteredEleves.map((eleve) => {
                  const classe = classes.find((c) => c.id === eleve.classe_id);
                  const opt = options.find((o) => o.id === (eleve.option_id || classe?.option_id));
                  const studentEmail = eleve.email_eleve || eleve.email;

                  return (
                    <tr key={eleve.id} className="hover:bg-[#12305A]/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                            {eleve.photo ? (
                              <img src={eleve.photo} alt="Photo" className="w-full h-full object-cover" />
                            ) : (
                              eleve.nom ? eleve.nom[0] : 'E'
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">
                              {eleve.nom} {eleve.postnom || ''} {eleve.prenom}
                            </div>
                            <div className="text-[11px] font-mono text-blue-400">
                              {eleve.matricule || `ELE-${eleve.id}`} • {eleve.sexe === 'M' ? 'M' : 'F'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-white">
                        {classe?.nom || 'Non assignée'}
                      </td>

                      <td className="py-3 px-4">
                        {opt ? (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getOptionBadgeColor(opt.id)}`}>
                            {opt.code || opt.nom}
                          </span>
                        ) : (
                          <span className="text-blue-300/50">Tronc Commun</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-white font-medium">{eleve.nom_tuteur || 'Non renseigné'}</div>
                        <div className="text-[11px] text-blue-300/70">{eleve.telephone_tuteur || eleve.telephone || '-'}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono text-[11px] text-emerald-300">{studentEmail || 'Non configuré'}</div>
                        <div className="text-[10px] text-blue-300/60">Pass: {eleve.mot_de_passe_eleve || 'eleve123'}</div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedEleveId(eleve.id);
                              setCurrentView('eleve-detail');
                            }}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-white transition"
                            title="Voir la fiche"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(eleve)}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-white transition"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setStudentToDelete(eleve)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COMPLETE STUDENT INSCRIPTION & EDIT MODAL                                  */}
      {/* ========================================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0B1736] border border-[#94C5FF]/20 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-6">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#12305A]/80 border-b border-[#94C5FF]/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    {modalMode === 'create' ? "Formulaire d'Inscription Élève" : "Modification du Dossier Élève"}
                  </h2>
                  <p className="text-xs text-blue-200/70">
                    Système scolaire RDC : état civil, affectation classe & option, tuteur et accès portail.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 rounded-xl bg-blue-500/10 text-blue-300 hover:text-white hover:bg-blue-500/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="flex overflow-x-auto border-b border-[#94C5FF]/15 bg-[#12305A]/40 px-4 pt-2 gap-2 scrollbar-hide">
              <button
                type="button"
                onClick={() => setActiveTab('identity')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-2 border-b-2 ${
                  activeTab === 'identity'
                    ? 'border-blue-500 text-white bg-[#0B1736]/80'
                    : 'border-transparent text-blue-300/70 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" /> 1. État Civil & Identité
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('academic')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-2 border-b-2 ${
                  activeTab === 'academic'
                    ? 'border-blue-500 text-white bg-[#0B1736]/80'
                    : 'border-transparent text-blue-300/70 hover:text-white'
                }`}
              >
                <School className="w-3.5 h-3.5" /> 2. Classe & Option (RDC)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('guardian')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-2 border-b-2 ${
                  activeTab === 'guardian'
                    ? 'border-blue-500 text-white bg-[#0B1736]/80'
                    : 'border-transparent text-blue-300/70 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> 3. Tuteur / Responsable
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('account')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-2 border-b-2 ${
                  activeTab === 'account'
                    ? 'border-blue-500 text-white bg-[#0B1736]/80'
                    : 'border-transparent text-blue-300/70 hover:text-white'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-emerald-400" /> 4. Compte & Accès Élève
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
              {/* TAB 1: IDENTITÉ & ÉTAT CIVIL */}
              {activeTab === 'identity' && (
                <div className="space-y-4">
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">
                        Nom de famille <span className="text-rose-400">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.nom}
                        onChange={(e) => handleNameChange('nom', e.target.value)}
                        placeholder="Ex: KASONGO"
                        className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">
                        Postnom
                      </label>
                      <input
                        type="text"
                        value={formData.postnom}
                        onChange={(e) => handleNameChange('postnom', e.target.value)}
                        placeholder="Ex: TSHILOMBO"
                        className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">
                        Prénom <span className="text-rose-400">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.prenom}
                        onChange={(e) => handleNameChange('prenom', e.target.value)}
                        placeholder="Ex: Samuel"
                        className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">Sexe</label>
                      <select
                        value={formData.sexe}
                        onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
                        className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="M">Masculin (Garçon)</option>
                        <option value="F">Féminin (Fille)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">Date de naissance</label>
                      <input
                        type="date"
                        value={formData.date_naissance}
                        onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                        className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">Lieu de naissance</label>
                      <input
                        type="text"
                        value={formData.lieu_naissance}
                        onChange={(e) => setFormData({ ...formData, lieu_naissance: e.target.value })}
                        placeholder="Ex: Kinshasa"
                        className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">
                        Adresse physique de résidence
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/50" />
                        <input
                          type="text"
                          value={formData.adresse}
                          onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                          placeholder="Ex: Av. de la Paix N° 45, Q/Matonge, C/Kalamu"
                          className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">
                        Téléphone de l'élève (optionnel)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/50" />
                        <input
                          type="tel"
                          value={formData.telephone}
                          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                          placeholder="+243 81 234 5678"
                          className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Statut Boursier / Cas Social</span>
                      <span className="text-[11px] text-blue-200/70">Bénéficie d'une exonération ou réduction des frais scolaires</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.est_boursier}
                        onChange={(e) => setFormData({ ...formData, est_boursier: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: CLASSE & OPTION ACADÉMIQUE (RDC) */}
              {activeTab === 'academic' && (
                <div className="space-y-5">
                  <div className="p-3.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-xs text-blue-200 leading-relaxed">
                    🎓 <strong>Organisation du système scolaire en RDC :</strong>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-blue-300/80">
                      <li><strong>Maternelle & Primaire :</strong> Tronc commun fondamental.</li>
                      <li><strong>Éducation de Base (7e & 8e EB) :</strong> Cycle terminal d'orientation générale.</li>
                      <li><strong>Humanités (1ère à 4ème) :</strong> Spécialisation par Section et Option (Bio-Chimie, Math-Physique, Commerciale, Littéraire, etc.).</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">
                        1. Niveau Scolaire / Cycle
                      </label>
                      <select
                        value={formData.niveau_id}
                        onChange={(e) => {
                          const nid = Number(e.target.value);
                          setFormData((prev) => ({ ...prev, niveau_id: nid }));
                        }}
                        className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Sélectionner le cycle</option>
                        {niveaux.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.nom}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">
                        2. Option / Filière d'Humanités (RDC)
                      </label>
                      <select
                        value={formData.option_id}
                        onChange={(e) => setFormData({ ...formData, option_id: Number(e.target.value) })}
                        className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Tronc Commun / Sans Option</option>
                        {options.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.nom} ({opt.section || opt.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-300 mb-1">
                      3. Classe d'affectation <span className="text-rose-400">*</span>
                    </label>
                    <select
                      required
                      value={formData.classe_id}
                      onChange={(e) => handleClassChange(e.target.value)}
                      className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- Choisir la classe de l'élève --</option>
                      {classes.map((cls) => {
                        const opt = options.find((o) => o.id === cls.option_id);
                        return (
                          <option key={cls.id} value={cls.id}>
                            {cls.nom} {opt ? `(${opt.nom})` : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">
                        Numéro Matricule Officiel
                      </label>
                      <input
                        type="text"
                        value={formData.matricule}
                        onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                        placeholder="Ex: 2025-0012"
                        className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">
                        Statut de scolarité
                      </label>
                      <select
                        value={formData.statut}
                        onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                        className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="actif">Actif (Inscrit régulièrement)</option>
                        <option value="en_attente">En attente de régularisation</option>
                        <option value="suspendu">Suspendu temporairement</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: COORDONNÉES DU TUTEUR */}
              {activeTab === 'guardian' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">
                        Nom complet du Tuteur / Responsable <span className="text-rose-400">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.nom_tuteur}
                        onChange={(e) => setFormData({ ...formData, nom_tuteur: e.target.value })}
                        placeholder="Ex: KASONGO MWAMBA Jean"
                        className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">
                        Lien de parenté
                      </label>
                      <select
                        value={formData.lien_tuteur}
                        onChange={(e) => setFormData({ ...formData, lien_tuteur: e.target.value })}
                        className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="Père">Père</option>
                        <option value="Mère">Mère</option>
                        <option value="Tuteur légal">Tuteur légal</option>
                        <option value="Oncle">Oncle</option>
                        <option value="Tante">Tante</option>
                        <option value="Frère/Sœur">Frère / Sœur</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">
                        Téléphone / WhatsApp du Tuteur <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/50" />
                        <input
                          required
                          type="tel"
                          value={formData.telephone_tuteur}
                          onChange={(e) => setFormData({ ...formData, telephone_tuteur: e.target.value })}
                          placeholder="+243 815 123 456"
                          className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <p className="text-[10px] text-blue-300/60 mt-1">Utilisé pour les SMS d'alertes d'absence et rappels de frais.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blue-300 mb-1">
                        Email du Tuteur (Optionnel)
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/50" />
                        <input
                          type="email"
                          value={formData.email_tuteur}
                          onChange={(e) => setFormData({ ...formData, email_tuteur: e.target.value })}
                          placeholder="tuteur@email.com"
                          className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <p className="text-[10px] text-blue-300/60 mt-1">Permet au parent de se connecter à l'espace tuteur.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-300 mb-1">
                      Profession / Fonction du Tuteur
                    </label>
                    <input
                      type="text"
                      value={formData.profession_tuteur}
                      onChange={(e) => setFormData({ ...formData, profession_tuteur: e.target.value })}
                      placeholder="Ex: Fonctionnaire, Ingénieur, Commerçant..."
                      className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: COMPTE DE CONNEXION ÉLÈVE & MOT DE PASSE */}
              {activeTab === 'account' && (
                <div className="space-y-4">
                  {/* Explanatory banner */}
                  <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-xs text-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                      <Sparkles className="w-4 h-4" /> Espace Numérique de l'Élève
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      L'élève utilisera ces identifiants pour se connecter à son portail sécurisé. Il pourra :
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-medium pt-1">
                      <div className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-blue-400" /> Suivre les cours en ligne & visioconférences</div>
                      <div className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-amber-400" /> Consulter ses notes & bulletins</div>
                      <div className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Suivre ses sanctions & discipline</div>
                      <div className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-purple-400" /> Accéder à la bibliothèque numérique</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-300 mb-1">
                      Adresse Email / Identifiant de Connexion Élève <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/50" />
                      <input
                        required
                        type="email"
                        value={formData.email_eleve}
                        onChange={(e) => setFormData({ ...formData, email_eleve: e.target.value })}
                        placeholder="prenom.nom@ecole.cd"
                        className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl py-2.5 pl-10 pr-3 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <p className="text-[10px] text-blue-300/60 mt-1">
                      Cet email sert d'identifiant unique de connexion sur l'écran de bienvenue.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-blue-300">
                        Mot de passe attribué à l'élève <span className="text-rose-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="text-[11px] text-blue-400 hover:text-white flex items-center gap-1 font-bold"
                      >
                        <RefreshCw className="w-3 h-3" /> Générer un mot de passe
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/50" />
                      <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={formData.mot_de_passe_eleve}
                        onChange={(e) => setFormData({ ...formData, mot_de_passe_eleve: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-[#12305A]/60 border border-[#94C5FF]/15 rounded-xl py-2.5 pl-10 pr-10 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-blue-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-emerald-400/80 mt-1">
                      ✓ Ce mot de passe sera immédiatement actif dès l'enregistrement.
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-[#94C5FF]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {activeTab !== 'identity' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'academic') setActiveTab('identity');
                        if (activeTab === 'guardian') setActiveTab('academic');
                        if (activeTab === 'account') setActiveTab('guardian');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-blue-500/10 text-blue-300 hover:text-white text-xs font-bold transition"
                    >
                      Étape précédente
                    </button>
                  )}
                  {activeTab !== 'account' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'identity') setActiveTab('academic');
                        if (activeTab === 'academic') setActiveTab('guardian');
                        if (activeTab === 'guardian') setActiveTab('account');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-blue-600/30 text-blue-200 hover:text-white text-xs font-bold transition flex items-center gap-1"
                    >
                      Suivant <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#12305A]/45 hover:bg-[#12305A]/70 text-blue-300 text-xs font-bold transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    {modalMode === 'create' ? "Enregistrer l'élève & Créer son compte" : 'Mettre à jour le dossier'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL                                                 */}
      {/* ========================================================================= */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B1736] border border-rose-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white">Supprimer cet élève ?</h3>
              <p className="text-xs text-blue-200/70">
                Vous êtes sur le point de retirer définitivement{' '}
                <strong className="text-white">
                  {studentToDelete.nom} {studentToDelete.prenom}
                </strong>{' '}
                ({studentToDelete.matricule}) ainsi que son compte de connexion élève.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 text-center">
              Cette action supprimera également ses pointages, paiements et résultats associés.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#12305A]/45 hover:bg-[#12305A]/70 text-blue-300 text-xs font-bold transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
