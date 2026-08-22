import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Fingerprint, 
  Wallet, 
  MessageSquare, 
  Sparkles,
  Send,
  BellRing,
  AlertTriangle,
  Clock,
  Mail,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { AnimatedStudentCard } from '../ui';

export function ParentsPortalView() {
  const { data, getEleveDetail, setCurrentView, setSelectedEleveId, addMessage, showToast } = useApp();
  const [selectedChildId, setSelectedChildId] = useState(1);
  const [msgInput, setMsgInput] = useState('');

  // Parent Notification Preferences State (Instant Alerts for Absences / Grades)
  const [notificationPreferences, setNotificationPreferences] = useState({
    smsAlerts: true,
    emailAlerts: true,
    absenceAlerts: true,
    retardAlerts: true,
    gradeAlerts: true,
    feeAlerts: false
  });

  const eleve = getEleveDetail(selectedChildId);

  // Check child's live attendance
  const today = '2026-08-20';
  const todayPointage = data.pointages?.find(p => p.eleve_id === selectedChildId && p.date === today);
  const presenceStatus = todayPointage ? todayPointage.statut : 'non_pointe';

  // Toggle notification setting
  const toggleSetting = (key) => {
    setNotificationPreferences(prev => {
      const next = { ...prev, [key]: !prev[key] };
      showToast(next[key] ? `Alerte ${key} activée pour les parents.` : `Alerte ${key} désactivée.`);
      return next;
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    addMessage({
      expediteur: `Parent (${eleve?.nom_parent || 'Tuteur'})`,
      destinataire: 'Direction de l’École',
      sujet: `Suivi scolaire & Message concernant ${eleve?.nom} ${eleve?.prenom}`,
      contenu: msgInput
    });
    setMsgInput('');
  };

  if (!eleve) return null;

  return (
    <div className="p-3 sm:p-6 space-y-5 max-w-6xl mx-auto pb-24 sm:pb-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-lg border border-blue-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-blue-200" />
              <span>Espace Famille & Tuteurs • Suivi en Direct</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold font-heading mt-1">
              Suivi Scolaire & Assiduité en Direct
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Surveillance en temps réel des présences, des cotes, et du minerval de vos enfants.
            </p>
          </div>

          {/* Child Switcher */}
          <div className="bg-black/30 p-2 rounded-2xl border border-white/20 shrink-0">
            <span className="text-[10px] text-blue-200 uppercase font-bold block mb-1">Élève sous tutelle</span>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(Number(e.target.value))}
              className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-400"
            >
              {data.eleves.map(e => (
                <option key={e.id} value={e.id}>{e.nom} {e.prenom} ({e.matricule})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Real-time Tracking & Instant Notification Alert Banner for Parents */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800/90 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
              <BellRing className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white font-heading">
                Système d'Alertes Immédiates aux Parents
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400">
                Notification transmise en direct dès qu'une absence ou un retard est constaté.
              </p>
            </div>
          </div>

          {/* Status badge for selected child */}
          <div className="flex items-center gap-2">
            {presenceStatus === 'present' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Présent ({todayPointage?.heure_arrivee || '07:30'})</span>
              </span>
            )}
            {presenceStatus === 'absent' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-bold animate-pulse">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>ABSENT CE JOUR</span>
              </span>
            )}
            {presenceStatus === 'retard' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>En retard (08:15)</span>
              </span>
            )}
            {presenceStatus === 'non_pointe' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[11px] font-medium">
                <span>Appel en cours...</span>
              </span>
            )}
          </div>
        </div>

        {/* Tracking Notification Channels Configuration (Interactive Toggles) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* SMS Notification */}
          <div 
            onClick={() => toggleSetting('smsAlerts')}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
              notificationPreferences.smsAlerts 
                ? 'bg-blue-600/15 border-blue-500/40' 
                : 'bg-slate-900/40 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">SMS Directs</div>
                <div className="text-[10px] text-slate-400 truncate">{eleve.telephone || '+243 81 ...'}</div>
              </div>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
              notificationPreferences.smsAlerts ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
            }`}>
              {notificationPreferences.smsAlerts ? 'ACTIF' : 'OFF'}
            </span>
          </div>

          {/* Email Notification */}
          <div 
            onClick={() => toggleSetting('emailAlerts')}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
              notificationPreferences.emailAlerts 
                ? 'bg-indigo-600/15 border-indigo-500/40' 
                : 'bg-slate-900/40 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">E-mail Parent</div>
                <div className="text-[10px] text-slate-400 truncate">{eleve.email_parent || 'parent@ecole.cd'}</div>
              </div>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
              notificationPreferences.emailAlerts ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
            }`}>
              {notificationPreferences.emailAlerts ? 'ACTIF' : 'OFF'}
            </span>
          </div>

          {/* Absence & Retard Auto-Alert */}
          <div 
            onClick={() => toggleSetting('absenceAlerts')}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
              notificationPreferences.absenceAlerts 
                ? 'bg-rose-600/15 border-rose-500/40' 
                : 'bg-slate-900/40 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Alertes Absence</div>
                <div className="text-[10px] text-slate-400 truncate">Automatique</div>
              </div>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
              notificationPreferences.absenceAlerts ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
            }`}>
              {notificationPreferences.absenceAlerts ? 'OBLIGATOIRE' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Student Information Card */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm font-bold text-white font-heading">
          Fiche de Renseignements de l'Élève
        </h3>

        <AnimatedStudentCard
          eleve={eleve}
          classe={eleve.classe}
          defaultExpanded={true}
          onViewDetail={(id) => {
            setSelectedEleveId(id);
            setCurrentView('eleve-detail');
          }}
          onGenerateCard={() => {
            setSelectedEleveId(eleve.id);
            setCurrentView('bulletin');
          }}
        />
      </div>

      {/* Child Overview 3 Primary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Academic Mark */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Résultat Périodique</span>
            <div className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5 font-mono">
              {eleve.moyenne} <span className="text-xs text-slate-400">/ 20</span>
            </div>
            <div className={`text-xs font-bold mt-0.5 ${eleve.mentionColor}`}>
              {eleve.pourcentage}% • {eleve.mention}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Presence Today */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Pointage du Jour</span>
            <div className={`text-sm sm:text-base font-bold mt-0.5 flex items-center gap-1.5 ${
              presenceStatus === 'present' ? 'text-emerald-400' : presenceStatus === 'absent' ? 'text-rose-400' : 'text-amber-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                presenceStatus === 'present' ? 'bg-emerald-400 animate-pulse' : presenceStatus === 'absent' ? 'bg-rose-400' : 'bg-amber-400'
              }`}></span>
              <span>{presenceStatus === 'present' ? 'Présent en classe' : presenceStatus === 'absent' ? 'Absent' : 'En retard'}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Arrivé à {todayPointage?.heure_arrivee || '07:30'} • Salle {eleve.classe?.nom}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Fingerprint className="w-5 h-5" />
          </div>
        </div>

        {/* Finance Balance */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Minerval & Scolarité</span>
            <div className="text-base sm:text-lg font-bold text-white mt-0.5 font-mono">
              {eleve.totalFraisPayes.toLocaleString('fr-FR')} <span className="text-[10px] text-slate-400">CDF</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
              {eleve.soldeFraisDu === 0 ? '✓ Dossier en règle' : `Solde: ${eleve.soldeFraisDu.toLocaleString('fr-FR')} CDF`}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Child Marks Breakdown */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800/90 p-4 space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white font-heading">
              Dernières Cotes : {eleve.nom} {eleve.prenom}
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400">Période active : {data.ecoleConfig.periode_active}</p>
          </div>

          <button
            onClick={() => {
              setSelectedEleveId(eleve.id);
              setCurrentView('bulletin');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Bulletin</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {eleve.resultats.slice(0, 6).map((res) => (
            <div key={res.id} className="p-2.5 rounded-xl bg-slate-850 border border-slate-800/70 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate max-w-[150px]">{res.cours_nom}</span>
                <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                  res.note >= 14 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {res.note.toFixed(1)} / 20
                </span>
              </div>
              <p className="text-[10px] text-slate-400 italic truncate">{res.appreciation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Contact with Direction Form */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800/90 p-4 space-y-2.5">
        <h3 className="text-xs sm:text-sm font-bold text-white font-heading flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <span>Envoyer un message à la Direction de l'École</span>
        </h3>
        <form onSubmit={handleSendMessage} className="space-y-2.5">
          <textarea
            rows={2}
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            placeholder="Écrivez votre message ou demande (justificatif d'absence, rendez-vous)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition active:scale-95"
            >
              <Send className="w-3 h-3" />
              <span>Transmettre</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
