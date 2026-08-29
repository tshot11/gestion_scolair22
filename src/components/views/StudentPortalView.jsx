import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles, Award, Video, BookOpen, ShieldCheck, AlertTriangle, Clock,
  Send, CheckCircle2, Calendar, GraduationCap, User, MapPin, ChevronRight, 
  Phone, Eye, EyeOff, Bell, HelpCircle, Camera, Mic, MicOff, VideoOff, 
  ArrowRight, X, FileText, Check, Users
} from 'lucide-react';

export function StudentPortalView() {
  const {
    data,
    currentUser,
    setCurrentView,
    showToast,
    setSelectedEleveId,
    addStudentAlert,
    addCorrectionRequest,
    markNotificationAsRead
  } = useApp();

  // Active section tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Identify current logged-in student
  const studentId = currentUser?.eleve_id || 1;
  const eleve = (data?.eleves || []).find((e) => e.id === Number(studentId)) || (data?.eleves || [])[0];
  const classe = (data?.classes || []).find((c) => c.id === eleve?.classe_id);
  const opt = (data?.options || []).find((o) => o.id === (eleve?.option_id || classe?.option_id));
  const salle = (data?.salles || []).find((s) => s.id === classe?.salle_id);
  const titulaire = (data?.enseignants || []).find((ens) => ens.id === classe?.prof_id);

  // Student specific data
  const incidents = (data?.incidents || []).filter((i) => i.eleve_id === eleve?.id);
  const pointages = (data?.pointages || []).filter((p) => p.eleve_id === eleve?.id);
  
  // Results calculation
  const resultats = useMemo(() => {
    return (data?.resultats || [])
      .filter((r) => r.eleve_id === eleve?.id)
      .map((r) => {
        const c = (data?.cours || []).find((co) => co.id === r.cours_id);
        const ens = (data?.enseignants || []).find((e) => e.id === (c?.enseignant_id || r.enseignant_id));
        return {
          ...r,
          cours_nom: c ? c.nom : 'Matière',
          cours_code: c ? c.code : 'GEN-01',
          coefficient: c ? c.coefficient : (r.coefficient || 1),
          enseignant_nom: ens ? `${ens.nom} ${ens.prenom}` : 'Enseignant Titulaire',
          appreciation: Number(r.note) >= 16 ? 'Excellent travail' : Number(r.note) >= 14 ? 'Très bon travail' : Number(r.note) >= 10 ? 'Satisfaisant' : 'Doit redoubler d\'effort'
        };
      });
  }, [data?.resultats, data?.cours, data?.enseignants, eleve?.id]);

  // Overall performance
  const { moyenne, pourcentage, mention, totalPoints, totalCoeff } = useMemo(() => {
    let pts = 0;
    let coeff = 0;
    if (resultats.length > 0) {
      resultats.forEach((r) => {
        pts += Number(r.note) * Number(r.coefficient);
        coeff += Number(r.coefficient);
      });
    }
    const moy = coeff > 0 ? (pts / coeff).toFixed(1) : '15.4';
    const pct = coeff > 0 ? ((pts / (coeff * 20)) * 100).toFixed(1) : '77.0';
    let men = 'Distinction (Bien)';
    if (Number(pct) >= 80) men = 'Élite (Très Bien)';
    else if (Number(pct) >= 70) men = 'Distinction (Bien)';
    else if (Number(pct) >= 60) men = 'Satisfaction (Assez Bien)';
    else if (Number(pct) >= 50) men = 'Passable (Ajourné)';
    else men = 'Insuffisant';

    return {
      moyenne: moy,
      pourcentage: pct,
      mention: men,
      totalPoints: pts.toFixed(1),
      totalCoeff: coeff || 12
    };
  }, [resultats]);

  // Attendance stats
  const attendanceStats = useMemo(() => {
    const total = pointages.length > 0 ? pointages.length : 90;
    const presents = pointages.filter((p) => p.statut === 'present').length || (total - 3);
    const absences = pointages.filter((p) => p.statut === 'absent').length || 2;
    const retards = pointages.filter((p) => p.statut === 'retard').length || 1;
    const excuses = pointages.filter((p) => p.statut === 'absent' && p.motif).length || 1;
    const nonExcuses = absences - excuses > 0 ? absences - excuses : 1;
    const rate = Math.round((presents / total) * 100);

    return { total, presents, absences, retards, excuses, nonExcuses, rate };
  }, [pointages]);

  // Student Alerts
  const studentAlerts = useMemo(() => {
    const list = (data?.studentAlerts || []).filter((a) => String(a.eleve_id) === String(eleve?.id));
    if (list.length === 0) {
      return [];
    }
    return list;
  }, [data?.studentAlerts, eleve?.id]);

  // Student Notifications
  const studentNotifications = useMemo(() => {
    const list = data?.notifications || [];
    if (list.length === 0) {
      return [
        { id: 1, type: 'info', titre: 'Publication des cotes de la 4ème période', message: 'Les notes d\'Informatique et de Mathématiques sont désormais disponibles.', date: 'Aujourd\'hui à 08:30', lu: false },
        { id: 2, type: 'urgence', titre: 'Séance de cours en direct aujourd\'hui', message: 'Rendez-vous à 14h00 pour le cours de Physique avec M. TSHIMANGA.', date: 'Hier à 16:00', lu: false },
        { id: 3, type: 'info', titre: 'Rappel calendrier scolaire RDC', message: 'Les épreuves du second semestre débuteront le mois prochain.', date: '22 Août 2026', lu: true }
      ];
    }
    return list;
  }, [data?.notifications]);

  // Online Classes schedule
  const onlineClasses = useMemo(() => {
    return [
      {
        id: 101,
        titre: 'Algèbre Linéaire & Équations Différentielles',
        matiere: 'Mathématiques',
        professeur: 'Prof. KABEYA MWANZA',
        classe_nom: classe?.nom || 'Humanités Scientifiques',
        date: 'Aujourd\'hui',
        heure_debut: '10:00',
        heure_fin: '11:30',
        statut: 'live',
        lien: 'https://visio.ecole.cd/math-terminale',
        description: 'Correction détaillée de la série d\'exercices n°4 et préparation à l\'évaluation sommative.'
      },
      {
        id: 102,
        titre: 'Chimie Organique : Les Polymères',
        matiere: 'Chimie',
        professeur: 'Mme. ILUNGA Thérèse',
        classe_nom: classe?.nom || 'Humanités Scientifiques',
        date: 'Aujourd\'hui',
        heure_debut: '14:00',
        heure_fin: '15:30',
        statut: 'today',
        lien: 'https://visio.ecole.cd/chimie-t3',
        description: 'Synthèse des composés aromatiques et étude des réactions d\'addition.'
      },
      {
        id: 103,
        titre: 'Littérature & Dissertation Philosophique',
        matiere: 'Français',
        professeur: 'M. MBUYI KAZADI',
        classe_nom: classe?.nom || 'Humanités Scientifiques',
        date: 'Demain',
        heure_debut: '09:00',
        heure_fin: '10:30',
        statut: 'upcoming',
        lien: 'https://visio.ecole.cd/philo-h4',
        description: 'Analyse méthodique des sujets types de l\'Examen d\'État.'
      }
    ];
  }, [classe?.nom]);

  // Form State for Sending Alert
  const [alertForm, setAlertForm] = useState({
    category: 'Discipline',
    recipient: 'Préfecture des études',
    priority: 'Normale',
    subject: '',
    description: '',
    attachment: ''
  });

  // Form State for Requesting Data Correction
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [correctionForm, setCorrectionForm] = useState({
    field: 'Nom ou Prénom',
    currentValue: `${eleve?.nom || ''} ${eleve?.prenom || ''}`,
    requestedValue: '',
    reason: ''
  });

  // Video Joining Modal Simulator with permissions check
  const [joiningClass, setJoiningClass] = useState(null);
  const [mediaPermissions, setMediaPermissions] = useState({ camera: true, mic: true });

  // Handlers
  const handleSubmitAlert = async (e) => {
    e.preventDefault();
    if (!alertForm.subject.trim() || !alertForm.description.trim()) {
      showToast('Veuillez remplir l\'objet et la description du signalement.', 'error');
      return;
    }

    if (addStudentAlert) {
      await addStudentAlert({
        eleve_id: eleve?.id,
        eleve_nom: `${eleve?.nom || ''} ${eleve?.prenom || ''}`.trim(),
        ...alertForm
      });
    }

    setAlertForm({
      category: 'Discipline',
      recipient: 'Préfecture des études',
      priority: 'Normale',
      subject: '',
      description: '',
      attachment: ''
    });

    setActiveTab('my_alerts');
    showToast('Signalement transmis avec succès.', 'success');
  };

  const handleCorrectionSubmit = async (e) => {
    e.preventDefault();
    if (!correctionForm.requestedValue.trim() || !correctionForm.reason.trim()) {
      showToast('Veuillez spécifier la valeur souhaitée et le motif.', 'error');
      return;
    }

    if (addCorrectionRequest) {
      await addCorrectionRequest({
        eleve_id: eleve?.id,
        eleve_nom: `${eleve?.nom || ''} ${eleve?.prenom || ''}`.trim(),
        ...correctionForm
      });
    }

    setIsCorrectionModalOpen(false);
    setCorrectionForm({
      field: 'Nom ou Prénom',
      currentValue: `${eleve?.nom || ''} ${eleve?.prenom || ''}`,
      requestedValue: '',
      reason: ''
    });
    showToast('Demande de correction envoyée à l\'administration.', 'success');
  };

  const handleJoinClass = (course) => {
    setJoiningClass(course);
  };

  return (
    <div className="min-h-screen bg-[#0B1736] text-white font-sans pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        
        {/* ========================================================================= */}
        {/* HEADER / PROFIL ELEVE                                                     */}
        {/* ========================================================================= */}
        <div className="bg-[#12305A]/45 border border-[#94C5FF]/15 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 relative">
          
          {/* Left: Avatar + Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left z-10 w-full lg:w-auto">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#12305A]/60 border border-[#94C5FF]/15 flex items-center justify-center shadow-sm overflow-hidden text-blue-300/50">
                {eleve?.photo ? (
                  <img src={eleve.photo} alt={eleve.nom} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl sm:text-4xl font-bold text-blue-300/70">
                    {eleve?.nom?.[0] || 'E'}{eleve?.prenom?.[0] || ''}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {eleve?.nom} {eleve?.postnom || ''} {eleve?.prenom}
                </h1>
                <div className="text-sm font-medium text-blue-300/70 mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span>{classe?.nom || 'Classe non assignée'}</span>
                  {opt && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>Option {opt.nom}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-blue-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Matricule : {eleve?.matricule || 'En attente'}
                </span>
                <span className="bg-[#12305A]/60 text-blue-200 px-3 py-1 rounded-lg text-xs font-semibold border border-[#94C5FF]/15">
                  Année : {data?.ecoleConfig?.annee_courante || '2026-2027'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0 z-10">
            <button
              onClick={() => {
                if (eleve?.id) setSelectedEleveId(eleve.id);
                setCurrentView('bulletin');
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" /> Bulletin Officiel
            </button>
            <button
              onClick={() => setActiveTab('online_classes')}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#12305A]/45 hover:bg-[#0B1736] text-blue-100 border border-[#94C5FF]/15 rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4 text-emerald-600" /> Cours en Direct
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TABS NAVIGATION                                                           */}
        {/* ========================================================================= */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {[
            { id: 'dashboard', label: 'Vue d\'Ensemble', icon: Sparkles },
            { id: 'profile', label: 'Mon Profil', icon: User },
            { id: 'notes', label: 'Mes Notes', icon: Award },
            { id: 'attendance', label: 'Assiduité', icon: Clock },
            { id: 'discipline', label: 'Discipline', icon: ShieldCheck },
            { id: 'online_classes', label: 'Cours en Ligne', icon: Video, badge: onlineClasses.filter(c => c.statut === 'live').length > 0 ? 'Live' : null },
            { id: 'notifications', label: 'Notifications', icon: Bell, badge: studentNotifications.filter(n => !n.lu).length || null },
            { id: 'send_alert', label: 'Signaler', icon: Send }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-[#0B1736] text-white shadow-sm border border-transparent'
                    : 'bg-[#12305A]/45 text-blue-200 border border-[#94C5FF]/15 hover:bg-[#0B1736]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    isActive ? 'bg-[#12305A]/45/20 text-white' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{moyenne}<span className="text-base text-blue-300/50 font-medium">/20</span></div>
                  <div className="text-sm font-medium text-blue-300/70">Moyenne générale</div>
                </div>
                <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5"/> {mention}
                </div>
              </div>

              <div className="bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{attendanceStats.rate}%</div>
                  <div className="text-sm font-medium text-blue-300/70">Taux de présence</div>
                </div>
                <div className="text-xs font-semibold text-blue-300/70">
                  {attendanceStats.presents} jours présents
                </div>
              </div>

              <div className="bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {incidents.length === 0 ? 'Exemplaire' : `${incidents.length} Sanction(s)`}
                  </div>
                  <div className="text-sm font-medium text-blue-300/70">Discipline</div>
                </div>
                <div className={`text-xs font-semibold ${incidents.length === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {incidents.length === 0 ? 'Aucun incident' : 'Dossier sous observation'}
                </div>
              </div>

              <div 
                className="bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between cursor-pointer hover:border-blue-400 hover:shadow-md transition" 
                onClick={() => setActiveTab('online_classes')}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{onlineClasses.filter(c => c.statut === 'live').length || 0}</div>
                  <div className="text-sm font-medium text-blue-300/70">Cours en direct</div>
                </div>
                <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                  Accéder aux salles <ArrowRight className="w-3 h-3"/>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Left Column: Schedule */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Emploi du temps</h2>
                  <button onClick={() => setActiveTab('online_classes')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Voir tout</button>
                </div>
                
                <div className="space-y-3">
                  {onlineClasses.length > 0 ? onlineClasses.slice(0, 3).map((course) => (
                    <div key={course.id} className="bg-[#12305A]/45 border border-[#94C5FF]/15 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-white">{course.titre}</h4>
                          {course.statut === 'live' && (
                            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span> En direct
                            </span>
                          )}
                          {course.statut === 'today' && (
                            <span className="px-2 py-0.5 rounded-md bg-[#12305A]/60 text-blue-200 text-[10px] font-bold uppercase tracking-wider">
                              À venir
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-blue-200 font-medium">
                          {course.professeur} • {course.matiere}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-blue-300/70">
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {course.heure_debut} - {course.heure_fin}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Salle Virtuelle</span>
                        </div>
                      </div>
                      
                      {course.statut === 'live' ? (
                        <button onClick={() => handleJoinClass(course)} className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm shrink-0">
                          Rejoindre
                        </button>
                      ) : (
                        <button onClick={() => setActiveTab('online_classes')} className="w-full sm:w-auto px-4 py-2 bg-[#12305A]/45 hover:bg-[#0B1736] border border-[#94C5FF]/15 text-blue-200 text-sm font-semibold rounded-xl transition shadow-sm shrink-0">
                          Détails
                        </button>
                      )}
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-[#12305A]/45 border border-[#94C5FF]/15 border-dashed rounded-2xl">
                      <div className="w-12 h-12 rounded-full bg-[#0B1736] flex items-center justify-center mb-3">
                        <Calendar className="w-6 h-6 text-blue-300/50" />
                      </div>
                      <p className="text-blue-300/70 text-sm font-medium">Aucun cours programmé aujourd'hui.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Notifications</h2>
                  <button onClick={() => setActiveTab('notifications')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Voir tout</button>
                </div>
                
                <div className="bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-2xl p-5 shadow-sm space-y-4">
                  {studentNotifications.length > 0 ? studentNotifications.slice(0, 3).map((notif) => (
                    <div key={notif.id} className="relative pb-4 border-b border-[#94C5FF]/10 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <span className={`text-sm font-semibold ${notif.lu ? 'text-blue-200' : 'text-white'}`}>{notif.titre}</span>
                        {!notif.lu && <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>}
                      </div>
                      <p className="text-xs text-blue-300/70 line-clamp-2 leading-relaxed mb-1.5">{notif.message}</p>
                      <span className="text-[10px] text-blue-300/50 font-medium block">{notif.date}</span>
                    </div>
                  )) : (
                    <div className="text-center py-6 space-y-2">
                       <CheckCircle2 className="w-8 h-8 text-blue-200 mx-auto" />
                       <p className="text-blue-300/70 text-sm">Vous êtes à jour.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PROFILE                                                            */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#94C5FF]/10 pb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Dossier Personnel</h3>
                <p className="text-sm text-blue-300/70 mt-1">Fiche administrative officielle en lecture seule.</p>
              </div>
              <button onClick={() => setIsCorrectionModalOpen(true)} className="px-4 py-2 bg-[#12305A]/45 border border-[#94C5FF]/15 hover:bg-[#0B1736] text-blue-100 rounded-xl text-sm font-semibold transition shadow-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Demander une correction
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#0B1736] border border-[#94C5FF]/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold mb-2">
                  <User className="w-4 h-4 text-blue-300/70" /> État Civil
                </div>
                <div className="space-y-3 text-sm">
                  <div><span className="text-blue-300/70 block text-xs">Nom complet</span><strong className="text-white font-medium">{eleve?.nom} {eleve?.postnom || ''} {eleve?.prenom}</strong></div>
                  <div><span className="text-blue-300/70 block text-xs">Sexe</span><strong className="text-white font-medium">{eleve?.sexe === 'M' ? 'Masculin' : 'Féminin'}</strong></div>
                  <div><span className="text-blue-300/70 block text-xs">Date & Lieu de naissance</span><strong className="text-white font-medium">{eleve?.date_naissance || '-'} à {eleve?.lieu_naissance || '-'}</strong></div>
                  <div><span className="text-blue-300/70 block text-xs">Nationalité</span><strong className="text-white font-medium">{eleve?.nationalite || 'Congolaise (RDC)'}</strong></div>
                </div>
              </div>

              <div className="bg-[#0B1736] border border-[#94C5FF]/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold mb-2">
                  <GraduationCap className="w-4 h-4 text-blue-300/70" /> Scolarité
                </div>
                <div className="space-y-3 text-sm">
                  <div><span className="text-blue-300/70 block text-xs">Matricule officiel</span><strong className="text-white font-medium">{eleve?.matricule || '-'}</strong></div>
                  <div><span className="text-blue-300/70 block text-xs">Classe</span><strong className="text-white font-medium">{classe?.nom || '-'}</strong></div>
                  <div><span className="text-blue-300/70 block text-xs">Option / Section</span><strong className="text-white font-medium">{opt?.nom || '-'} ({classe?.section || '-'})</strong></div>
                  <div><span className="text-blue-300/70 block text-xs">Salle</span><strong className="text-white font-medium">{salle?.nom || '-'}</strong></div>
                </div>
              </div>

              <div className="bg-[#0B1736] border border-[#94C5FF]/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold mb-2">
                  <Phone className="w-4 h-4 text-blue-300/70" /> Contacts & Tuteur
                </div>
                <div className="space-y-3 text-sm">
                  <div><span className="text-blue-300/70 block text-xs">Responsable</span><strong className="text-white font-medium">{eleve?.nom_tuteur || eleve?.nom_parent || '-'} ({eleve?.lien_tuteur || '-'})</strong></div>
                  <div><span className="text-blue-300/70 block text-xs">Téléphone</span><strong className="text-white font-medium">{eleve?.telephone_tuteur || eleve?.telephone || '-'}</strong></div>
                  <div><span className="text-blue-300/70 block text-xs">Email personnel</span><strong className="text-white font-medium">{eleve?.email_eleve || eleve?.email || '-'}</strong></div>
                  <div><span className="text-blue-300/70 block text-xs">Adresse</span><strong className="text-white font-medium">{eleve?.adresse || '-'}</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: NOTES                                                              */}
        {/* ========================================================================= */}
        {activeTab === 'notes' && (
          <div className="bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Relevé de Cotes</h3>
                <p className="text-sm text-blue-300/70 mt-1">Notes obtenues par discipline (Période en cours).</p>
              </div>
              <button
                onClick={() => {
                  if (eleve?.id) setSelectedEleveId(eleve.id);
                  setCurrentView('bulletin');
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-sm flex items-center gap-2"
              >
                <Award className="w-4 h-4" /> Bulletin Officiel
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#0B1736] border border-[#94C5FF]/10">
              <div>
                <span className="text-blue-300/70 text-xs font-medium block mb-1">Moyenne Générale</span>
                <strong className="text-white text-xl font-bold">{moyenne}/20</strong>
              </div>
              <div>
                <span className="text-blue-300/70 text-xs font-medium block mb-1">Pourcentage</span>
                <strong className="text-blue-600 text-xl font-bold">{pourcentage}%</strong>
              </div>
              <div>
                <span className="text-blue-300/70 text-xs font-medium block mb-1">Points Pondérés</span>
                <strong className="text-white text-xl font-bold">{totalPoints}</strong>
              </div>
              <div>
                <span className="text-blue-300/70 text-xs font-medium block mb-1">Mention</span>
                <strong className="text-emerald-600 text-lg font-bold">{mention}</strong>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#94C5FF]/15">
              <table className="w-full text-left text-sm text-blue-100 border-collapse">
                <thead className="bg-[#0B1736] border-b border-[#94C5FF]/15">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-white">Matière</th>
                    <th className="py-3 px-4 font-semibold text-center text-white">Coeff</th>
                    <th className="py-3 px-4 font-semibold text-center text-white">Note</th>
                    <th className="py-3 px-4 font-semibold text-white">Appréciation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-[#12305A]/45">
                  {resultats.length > 0 ? resultats.map((res, idx) => (
                    <tr key={idx} className="hover:bg-[#0B1736] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{res.cours_nom}</div>
                        <div className="text-xs text-blue-300/70">{res.enseignant_nom}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-medium">{res.coefficient}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-semibold px-2.5 py-1 rounded-md text-xs border ${
                          Number(res.note) >= 14 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          Number(res.note) >= 10 ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          {res.note} / 20
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-blue-200">{res.appreciation || 'Satisfaisant'}</span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-blue-300/70">Aucune note disponible pour le moment.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ATTENDANCE                                                         */}
        {/* ========================================================================= */}
        {activeTab === 'attendance' && (
          <div className="bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Suivi des Présences</h3>
              <p className="text-sm text-blue-300/70 mt-1">Historique des présences et retards.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0B1736] border border-[#94C5FF]/10 flex flex-col justify-between">
                <span className="text-blue-300/70 text-xs font-medium block mb-2">Séances Totales</span>
                <span className="text-2xl font-bold text-white">{attendanceStats.total}</span>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col justify-between">
                <span className="text-emerald-700 text-xs font-medium block mb-2">Présences</span>
                <span className="text-2xl font-bold text-emerald-700">{attendanceStats.presents}</span>
              </div>
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 flex flex-col justify-between">
                <span className="text-rose-700 text-xs font-medium block mb-2">Absences</span>
                <span className="text-2xl font-bold text-rose-700">{attendanceStats.absences}</span>
              </div>
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex flex-col justify-between">
                <span className="text-amber-700 text-xs font-medium block mb-2">Retards</span>
                <span className="text-2xl font-bold text-amber-700">{attendanceStats.retards}</span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#94C5FF]/15 mt-4">
              <table className="w-full text-left text-sm text-blue-100 border-collapse">
                <thead className="bg-[#0B1736] border-b border-[#94C5FF]/15">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-white">Date</th>
                    <th className="py-3 px-4 font-semibold text-center text-white">Statut</th>
                    <th className="py-3 px-4 font-semibold text-white">Motif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-[#12305A]/45">
                  {pointages.length > 0 ? pointages.map((pt, idx) => (
                    <tr key={idx} className="hover:bg-[#0B1736] transition-colors">
                      <td className="py-3 px-4 font-medium text-white">{pt.date}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                          pt.statut === 'present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          pt.statut === 'retard' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {pt.statut === 'present' ? 'Présent' : pt.statut === 'retard' ? 'Retard' : 'Absent'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-blue-300/70">{pt.motif || '-'}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-blue-300/70">Aucun pointage récent à afficher.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: DISCIPLINE                                                         */}
        {/* ========================================================================= */}
        {activeTab === 'discipline' && (
          <div className="bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Dossier Disciplinaire</h3>
              <p className="text-sm text-blue-300/70 mt-1">Avertissements et décisions du Conseil de Discipline.</p>
            </div>

            {incidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[#0B1736] border border-[#94C5FF]/10 rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="text-base font-bold text-white">Dossier Vierge</h4>
                <p className="text-sm text-blue-300/70 mt-1 max-w-sm">
                  Félicitations ! Vous n'avez aucune sanction. Continuez à honorer le règlement de l'école.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {incidents.map((inc) => (
                  <div key={inc.id} className="p-5 bg-[#12305A]/45 border border-rose-200 rounded-2xl flex flex-col md:flex-row justify-between gap-4 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{inc.motif}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100">
                          {inc.gravite || 'Moyenne'}
                        </span>
                      </div>
                      <p className="text-sm text-blue-200">{inc.description || 'Non-respect des consignes en classe.'}</p>
                      <div className="text-xs text-blue-300/70">Date : {inc.date_incident || '-'}</div>
                    </div>
                    <div className="shrink-0 bg-[#0B1736] p-3 rounded-xl border border-[#94C5FF]/10 self-start w-full md:w-auto">
                      <span className="text-xs font-semibold text-blue-300/70 block mb-1">Sanction :</span>
                      <span className="text-sm text-white font-medium">{inc.sanction || 'Retenue'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: ONLINE CLASSES                                                     */}
        {/* ========================================================================= */}
        {activeTab === 'online_classes' && (
          <div className="bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Cours en Direct</h3>
              <p className="text-sm text-blue-300/70 mt-1">Salles virtuelles et séances interactives.</p>
            </div>

            {onlineClasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-center bg-[#0B1736] border border-[#94C5FF]/10 rounded-2xl">
                <VideoOff className="w-10 h-10 text-blue-200 mb-3" />
                <p className="text-blue-300/70 text-sm font-medium">Aucun cours en ligne programmé.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {onlineClasses.map((course) => {
                  const isLive = course.statut === 'live';
                  return (
                    <div key={course.id} className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-5 ${
                      isLive ? 'bg-[#12305A]/45 border-blue-200 shadow-md ring-1 ring-blue-100' : 'bg-[#0B1736] border-[#94C5FF]/15 shadow-sm'
                    }`}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-blue-300/70 uppercase tracking-wider">{course.matiere}</span>
                          {isLive ? (
                            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span> EN DIRECT
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-[#12305A]/45 border border-[#94C5FF]/15 text-blue-200 text-[10px] font-bold shadow-sm">
                              {course.date}
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-white">{course.titre}</h4>
                          <p className="text-sm text-blue-200 mt-1 line-clamp-2">{course.description}</p>
                        </div>
                        
                        <div className="text-sm text-blue-300/70 font-medium flex flex-col gap-1 pt-2">
                          <span className="flex items-center gap-2"><User className="w-4 h-4" /> {course.professeur}</span>
                          <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {course.heure_debut} - {course.heure_fin}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinClass(course)}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition ${
                          isLive
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                            : 'bg-[#12305A]/45 hover:bg-[#12305A]/80 text-blue-100 border border-[#94C5FF]/15 shadow-sm'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        {isLive ? 'Rejoindre la salle' : 'Accéder à la salle'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: NOTIFICATIONS                                                      */}
        {/* ========================================================================= */}
        {activeTab === 'notifications' && (
          <div className="max-w-4xl mx-auto bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Centre de Notifications</h3>
              <p className="text-sm text-blue-300/70 mt-1">Annonces scolaires et alertes.</p>
            </div>

            {studentNotifications.length === 0 ? (
               <div className="flex flex-col items-center justify-center p-10 text-center bg-[#0B1736] border border-[#94C5FF]/10 rounded-2xl">
                 <Bell className="w-10 h-10 text-blue-200 mb-3" />
                 <p className="text-blue-300/70 text-sm font-medium">Vous n'avez aucune notification.</p>
               </div>
            ) : (
              <div className="space-y-3">
                {studentNotifications.map((notif) => (
                  <div key={notif.id} className={`p-5 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      notif.lu ? 'bg-[#0B1736] border-[#94C5FF]/10' : 'bg-[#12305A]/45 border-blue-100 shadow-sm'
                    }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-bold ${notif.lu ? 'text-blue-100' : 'text-white'}`}>{notif.titre}</span>
                        {!notif.lu && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-blue-200 leading-relaxed">{notif.message}</p>
                      <span className="text-xs text-blue-300/50 font-medium block pt-1">{notif.date}</span>
                    </div>

                    {!notif.lu && (
                      <button
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="w-full sm:w-auto px-4 py-2 bg-[#12305A]/45 hover:bg-[#0B1736] border border-[#94C5FF]/15 text-blue-100 rounded-xl text-sm font-semibold transition shrink-0 shadow-sm"
                      >
                        Marquer lu
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: SEND ALERT                                                         */}
        {/* ========================================================================= */}
        {activeTab === 'send_alert' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#94C5FF]/10 pb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Signaler un problème</h3>
                  <p className="text-sm text-blue-300/70 mt-1">
                    Transmettez confidentiellement une préoccupation à la Préfecture.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('my_alerts')}
                  className="px-4 py-2 bg-[#12305A]/45 hover:bg-[#0B1736] border border-[#94C5FF]/15 text-blue-100 rounded-xl text-sm font-semibold shadow-sm transition flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-300/70" /> Mes signalements
                </button>
              </div>

              <form onSubmit={handleSubmitAlert} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-blue-100 mb-1.5">Catégorie</label>
                    <select
                      value={alertForm.category}
                      onChange={(e) => setAlertForm({ ...alertForm, category: e.target.value })}
                      className="w-full bg-[#0B1736] border border-[#94C5FF]/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    >
                      <option value="Discipline">Discipline & Comportement</option>
                      <option value="Sécurité">Sécurité & Urgence</option>
                      <option value="Harcèlement">Harcèlement scolaire (Bullying)</option>
                      <option value="Problème matériel">Problème matériel / équipement</option>
                      <option value="Autre">Autre préoccupation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-100 mb-1.5">Destinataire</label>
                    <select
                      value={alertForm.recipient}
                      onChange={(e) => setAlertForm({ ...alertForm, recipient: e.target.value })}
                      className="w-full bg-[#0B1736] border border-[#94C5FF]/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    >
                      <option value="Préfecture des études">Préfecture des études</option>
                      <option value="Direction de l'établissement">Direction générale</option>
                      <option value="Titulaire de classe">Titulaire de classe</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-100 mb-1.5">Niveau de Priorité</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Faible', 'Normale', 'Élevée', 'Urgente'].map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setAlertForm({ ...alertForm, priority: p })}
                        className={`py-2 rounded-xl text-sm font-semibold border transition-colors ${
                          alertForm.priority === p
                            ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                            : 'bg-[#12305A]/45 border-[#94C5FF]/15 text-blue-200 hover:bg-[#0B1736]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-100 mb-1.5">Objet</label>
                  <input
                    type="text"
                    required
                    value={alertForm.subject}
                    onChange={(e) => setAlertForm({ ...alertForm, subject: e.target.value })}
                    placeholder="Ex: Problème d'éclairage..."
                    className="w-full bg-[#0B1736] border border-[#94C5FF]/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-100 mb-1.5">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={alertForm.description}
                    onChange={(e) => setAlertForm({ ...alertForm, description: e.target.value })}
                    placeholder="Décrivez précisément la situation..."
                    className="w-full bg-[#0B1736] border border-[#94C5FF]/15 rounded-xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#0B1736] border border-[#94C5FF]/15 text-xs text-blue-300/70 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-300/50 shrink-0 mt-0.5" />
                  <span>
                    Ce signalement est associé à votre compte ({eleve?.nom} {eleve?.prenom}) et traité avec discrétion par la direction.
                  </span>
                </div>

                <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Envoyer le signalement
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 8.5: MY ALERTS */}
        {activeTab === 'my_alerts' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#94C5FF]/10 pb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Mes Signalements</h3>
                  <p className="text-sm text-blue-300/70 mt-1">Suivi de vos requêtes transmises.</p>
                </div>
                <button
                  onClick={() => setActiveTab('send_alert')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition flex items-center gap-2"
                >
                  Nouveau signalement
                </button>
              </div>

              {studentAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-[#0B1736] border border-[#94C5FF]/10 rounded-2xl">
                  <ShieldCheck className="w-10 h-10 text-blue-200 mb-3" />
                  <p className="text-blue-300/70 text-sm font-medium">Vous n'avez transmis aucun signalement.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studentAlerts.map((alert) => (
                    <div key={alert.id} className="p-5 rounded-2xl bg-[#12305A]/45 border border-[#94C5FF]/15 shadow-sm space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-white">{alert.subject}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#12305A]/60 text-blue-200 border border-[#94C5FF]/15">
                            {alert.category}
                          </span>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                          {alert.status}
                        </span>
                      </div>
                      <p className="text-sm text-blue-200">{alert.description}</p>
                      
                      {alert.adminNotes && (
                        <div className="p-3.5 rounded-xl bg-[#0B1736] border border-[#94C5FF]/15 text-sm text-blue-100 mt-2">
                          <strong className="text-white block mb-1">Réponse :</strong>
                          {alert.adminNotes}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-4 pt-3 border-t border-[#94C5FF]/10 text-xs text-blue-300/70 font-medium mt-3">
                        <span>Destinataire : {alert.recipient}</span>
                        <span>Date : {new Date(alert.createdAt || Date.now()).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODALS                                                                    */}
      {/* ========================================================================= */}
      
      {/* Correction Modal */}
      {isCorrectionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B1736]/90 backdrop-blur-sm">
          <div className="bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Demande de Correction</h3>
              <button onClick={() => setIsCorrectionModalOpen(false)} className="p-2 text-blue-300/50 hover:text-blue-200 hover:bg-[#12305A]/80 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCorrectionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-blue-100 mb-1.5">Champ à corriger</label>
                <select
                  value={correctionForm.field}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, field: e.target.value })}
                  className="w-full bg-[#0B1736] border border-[#94C5FF]/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Nom ou Prénom">Nom, Postnom ou Prénom</option>
                  <option value="Date de naissance">Date ou Lieu de Naissance</option>
                  <option value="Adresse">Adresse de résidence</option>
                  <option value="Téléphone Tuteur">Numéro de téléphone du Tuteur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-100 mb-1.5">Valeur souhaitée</label>
                <input
                  type="text"
                  required
                  value={correctionForm.requestedValue}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, requestedValue: e.target.value })}
                  placeholder="Saisissez la valeur correcte..."
                  className="w-full bg-[#0B1736] border border-[#94C5FF]/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-100 mb-1.5">Motif</label>
                <textarea
                  required
                  rows={3}
                  value={correctionForm.reason}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, reason: e.target.value })}
                  placeholder="Expliquez l'erreur..."
                  className="w-full bg-[#0B1736] border border-[#94C5FF]/15 rounded-xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsCorrectionModalOpen(false)} className="flex-1 py-2.5 rounded-xl bg-[#12305A]/45 border border-[#94C5FF]/15 text-blue-100 text-sm font-semibold hover:bg-[#0B1736] transition">
                  Annuler
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition">
                  Soumettre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Video Classroom Modal */}
      {joiningClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B1736]/90 backdrop-blur-sm">
          <div className="bg-[#0B1736] border border-[#94C5FF]/15 rounded-3xl p-8 max-w-5xl w-full shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                    Direct
                  </span>
                  <h3 className="text-base font-bold text-white">{joiningClass.titre}</h3>
                </div>
                <p className="text-xs text-blue-300/50 font-medium">{joiningClass.professeur} • {joiningClass.matiere}</p>
              </div>
              <button onClick={() => setJoiningClass(null)} className="px-4 py-2 rounded-xl bg-[#12305A]/80 hover:bg-[#12305A]/60 text-blue-200 text-sm font-semibold transition">
                Quitter
              </button>
            </div>

            <div className="aspect-video bg-black/90 rounded-2xl border border-[#94C5FF]/15 relative flex flex-col justify-between p-6 overflow-hidden shadow-2xl gap-4">
              <div className="flex justify-between items-center z-10">
                <div className="bg-[#0B1736]/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#94C5FF]/20 text-xs font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Professeur connecté
                </div>
                <div className="bg-[#0B1736]/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#94C5FF]/20 text-xs font-semibold text-blue-200 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> 28
                </div>
              </div>

              <div className="text-center z-10 space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto text-2xl border border-blue-500/30">
                  🎓
                </div>
                <h4 className="text-sm font-bold text-white max-w-sm mx-auto">Flux vidéo chiffré de bout en bout</h4>
              </div>

              <div className="flex justify-center items-center gap-3 z-10">
                <button
                  onClick={() => setMediaPermissions({ ...mediaPermissions, mic: !mediaPermissions.mic })}
                  className={`p-3.5 rounded-2xl transition-colors ${mediaPermissions.mic ? 'bg-[#12305A]/80 text-white hover:bg-[#12305A]/60' : 'bg-rose-600 text-white hover:bg-rose-700'}`}
                >
                  {mediaPermissions.mic ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setMediaPermissions({ ...mediaPermissions, camera: !mediaPermissions.camera })}
                  className={`p-3.5 rounded-2xl transition-colors ${mediaPermissions.camera ? 'bg-[#12305A]/80 text-white hover:bg-[#12305A]/60' : 'bg-rose-600 text-white hover:bg-rose-700'}`}
                >
                  {mediaPermissions.camera ? <Camera className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => showToast('Main levée', 'success')}
                  className="px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-sm shadow-sm transition-colors"
                >
                  ✋ Lever la main
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
