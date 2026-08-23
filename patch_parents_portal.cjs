const fs = require('fs');
const file = 'src/components/views/ParentsPortalView.jsx';
let content = fs.readFileSync(file, 'utf8');

// The file was previously dumped, but I'll rewrite it to include the tabs for "Dossier", "Messagerie Direction", "Forum Parents"
content = `import React, { useState } from 'react';
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
  Smartphone,
  Users
} from 'lucide-react';
import { AnimatedStudentCard } from '../ui';

export function ParentsPortalView() {
  const { data, getEleveDetail, setCurrentView, setSelectedEleveId, addMessage, showToast, currentUser } = useApp();
  const [selectedChildId, setSelectedChildId] = useState(currentUser?.eleve_id || 1);
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier', 'direction', 'forum'
  const [msgInput, setMsgInput] = useState('');
  const [forumInput, setForumInput] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState('');

  // Parent Notification Preferences State
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
  const todayPointage = data.presences?.find(p => p.eleve_id === selectedChildId && p.date === today);
  const presenceStatus = todayPointage ? todayPointage.statut : 'non_pointe';
  
  // Online admins
  const onlineAdmins = [
    { id: 1, name: 'Dieudonné TSHILOMBO', role: 'Préfet', status: 'online' },
    { id: 7, name: 'Alice KABUYA', role: 'Secrétaire / Assistante', status: 'online' }
  ];

  const handleSendToDirection = (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !selectedAdminId) return;
    const admin = onlineAdmins.find(a => String(a.id) === String(selectedAdminId));
    showToast(\`Message envoyé à \${admin.name} avec succès !\`);
    setMsgInput('');
  };

  const handleSendToForum = (e) => {
    e.preventDefault();
    if (!forumInput.trim()) return;
    showToast('Message publié sur le forum des parents !');
    setForumInput('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-sky-400" />
            Espace Famille
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Suivi direct, messagerie et forum des parents d'élèves.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        <button onClick={() => setActiveTab('dossier')} className={\`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all \${activeTab === 'dossier' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}\`}>Dossier de l'Enfant</button>
        <button onClick={() => setActiveTab('direction')} className={\`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all \${activeTab === 'direction' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}\`}>Contacter la Direction</button>
        <button onClick={() => setActiveTab('forum')} className={\`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all \${activeTab === 'forum' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}\`}>Forum & Réunions</button>
      </div>

      {activeTab === 'dossier' && (
        <div className="space-y-6">
          <AnimatedStudentCard eleve={eleve} onClick={() => {}} />
          {/* Quick Actions / Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button 
              onClick={() => { setSelectedEleveId(eleve.id); setCurrentView('bulletin'); }}
              className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-300">Voir le Bulletin</span>
            </button>
            <button 
              onClick={() => { setSelectedEleveId(eleve.id); setCurrentView('recu'); }}
              className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-300">Paiements & Reçus</span>
            </button>
            <button 
              className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Fingerprint className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-300">Présence Aujourd'hui</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'direction' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Personnel Connecté</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {onlineAdmins.map(admin => (
              <div key={admin.id} className={\`p-4 rounded-xl border \${selectedAdminId === String(admin.id) ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-900/50 border-slate-700 hover:border-slate-600 cursor-pointer'}\`} onClick={() => setSelectedAdminId(String(admin.id))}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">{admin.name[0]}</div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{admin.name}</div>
                    <div className="text-xs text-slate-400">{admin.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendToDirection} className="space-y-4">
            <textarea 
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              placeholder="Écrivez votre message ou préoccupation ici..."
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
            <button 
              type="submit"
              disabled={!msgInput.trim() || !selectedAdminId}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Envoyer au destinataire
            </button>
          </form>
        </div>
      )}

      {activeTab === 'forum' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-6 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700/50">
            <div>
              <h2 className="text-lg font-bold text-white">Réunions & Forum des Parents</h2>
              <p className="text-xs text-slate-400">Espace exclusif réservé aux parents et tuteurs.</p>
            </div>
            <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
              <Users className="w-4 h-4" />
              24 Parents en ligne
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            <div className="bg-slate-900/50 rounded-2xl p-4 max-w-[80%]">
              <div className="text-xs font-bold text-purple-400 mb-1">Comité des Parents</div>
              <p className="text-sm text-slate-300">Bonjour à tous, la réunion pour la kermesse aura lieu ce vendredi à 15h. Merci de confirmer votre présence.</p>
              <div className="text-[10px] text-slate-500 mt-2">Aujourd'hui, 08:30</div>
            </div>
            <div className="bg-slate-900/50 rounded-2xl p-4 max-w-[80%]">
              <div className="text-xs font-bold text-blue-400 mb-1">Papa KALALA</div>
              <p className="text-sm text-slate-300">Moi je serai là ! On parlera aussi de la contribution pour le bus scolaire ?</p>
              <div className="text-[10px] text-slate-500 mt-2">Aujourd'hui, 09:15</div>
            </div>
          </div>
          
          <form onSubmit={handleSendToForum} className="mt-auto relative">
            <input 
              type="text"
              value={forumInput}
              onChange={(e) => setForumInput(e.target.value)}
              placeholder="Participez à la discussion..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
            />
            <button 
              type="submit"
              disabled={!forumInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
`
fs.writeFileSync(file, content);
