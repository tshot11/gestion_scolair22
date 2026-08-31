const fs = require('fs');

const code = `import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
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
  Users,
  ChevronDown,
} from "lucide-react";
import { AnimatedStudentCard } from "../ui";

export function ParentsPortalView() {
  const {
    data,
    getEleveDetail,
    setCurrentView,
    setSelectedEleveId,
    addMessage,
    showToast,
    currentUser,
  } = useApp();

  // Find all children belonging to this parent
  const parentChildren = (data?.eleves || []).filter(
    (e) => e.email_tuteur === currentUser.email || e.id === currentUser.eleve_id
  );

  const defaultChildId = parentChildren.length > 0 ? parentChildren[0].id : currentUser?.eleve_id || 1;

  const [selectedChildId, setSelectedChildId] = useState(defaultChildId);
  const [activeTab, setActiveTab] = useState("dossier"); /* 'dossier', 'direction', 'forum' */
  const [msgInput, setMsgInput] = useState("");
  const [forumInput, setForumInput] = useState("");
  const [selectedAdminId, setSelectedAdminId] = useState("");
  
  /* Parent Notification Preferences State */
  const [notificationPreferences, setNotificationPreferences] = useState({
    smsAlerts: true,
    emailAlerts: true,
    absenceAlerts: true,
    retardAlerts: true,
    gradeAlerts: true,
    feeAlerts: false,
  });

  const eleve = getEleveDetail(selectedChildId);

  if (!eleve) {
    return (
      <div className="p-6 text-blue-200">
        Profil de l'enfant introuvable ou non assigné. Veuillez contacter l'administration.
      </div>
    );
  }

  /* Online admins */
  const onlineAdmins = [
    { id: 1, name: "Dieudonné TSHILOMBO", role: "Préfet", status: "online" },
    {
      id: 7,
      name: "Alice KABUYA",
      role: "Secrétaire / Assistante",
      status: "online",
    },
  ];

  const handleSendToDirection = (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !selectedAdminId) return;
    const admin = onlineAdmins.find(
      (a) => String(a.id) === String(selectedAdminId),
    );
    showToast(\`Message envoyé à \${admin.name} avec succès !\`);
    setMsgInput("");
  };

  const handleSendToForum = (e) => {
    e.preventDefault();
    if (!forumInput.trim()) return;
    showToast("Message publié sur le forum des parents !");
    setForumInput("");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3 font-heading">
            <ShieldCheck className="w-8 h-8 text-purple-400" /> Espace Famille
          </h1>
          <p className="text-sm text-blue-300/70 mt-1">
            Suivi direct, messagerie et forum des parents d'élèves.
          </p>
        </div>
        {parentChildren.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-300/70 font-bold uppercase tracking-wider">Enfant :</span>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(Number(e.target.value))}
              className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              {parentChildren.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.nom} {child.prenom}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        <button
          onClick={() => setActiveTab("dossier")}
          className={\`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all \${
            activeTab === "dossier"
              ? "bg-purple-600 text-white"
              : "bg-[#12305A]/45 backdrop-blur-md text-blue-300 hover:bg-[#94C5FF]/10 border border-transparent hover:border-[#94C5FF]/15"
          }\`}
        >
          Dossier de {eleve.prenom}
        </button>
        <button
          onClick={() => setActiveTab("direction")}
          className={\`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all \${
            activeTab === "direction"
              ? "bg-purple-600 text-white"
              : "bg-[#12305A]/45 backdrop-blur-md text-blue-300 hover:bg-[#94C5FF]/10 border border-transparent hover:border-[#94C5FF]/15"
          }\`}
        >
          Contacter la Direction
        </button>
        <button
          onClick={() => setActiveTab("forum")}
          className={\`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all \${
            activeTab === "forum"
              ? "bg-purple-600 text-white"
              : "bg-[#12305A]/45 backdrop-blur-md text-blue-300 hover:bg-[#94C5FF]/10 border border-transparent hover:border-[#94C5FF]/15"
          }\`}
        >
          Forum & Réunions
        </button>
      </div>

      {activeTab === "dossier" && (
        <div className="space-y-6">
          <AnimatedStudentCard eleve={eleve} onClick={() => {}} />

          {/* Quick Actions / Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => {
                setSelectedEleveId(eleve.id);
                setCurrentView("bulletin");
              }}
              className="bg-[#12305A]/45 backdrop-blur-md hover:bg-[#94C5FF]/10 border border-[#94C5FF]/15 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition group shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-100 group-hover:text-white transition-colors">
                Voir le Bulletin
              </span>
            </button>
            <button
              onClick={() => {
                setSelectedEleveId(eleve.id);
                setCurrentView("recu");
              }}
              className="bg-[#12305A]/45 backdrop-blur-md hover:bg-[#94C5FF]/10 border border-[#94C5FF]/15 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition group shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-100 group-hover:text-white transition-colors">
                Paiements & Reçus
              </span>
            </button>
            <button
              onClick={() => {
                setSelectedEleveId(eleve.id);
                setCurrentView("discipline");
              }}
              className="bg-[#12305A]/45 backdrop-blur-md hover:bg-[#94C5FF]/10 border border-[#94C5FF]/15 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition group shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-100 group-hover:text-white transition-colors">
                Discipline
              </span>
            </button>
            <button
              onClick={() => {
                setSelectedEleveId(eleve.id);
                setCurrentView("presences");
              }}
              className="bg-[#12305A]/45 backdrop-blur-md hover:bg-[#94C5FF]/10 border border-[#94C5FF]/15 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition group shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Fingerprint className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-100 group-hover:text-white transition-colors">
                Présence & Horaires
              </span>
            </button>
          </div>
        </div>
      )}

      {activeTab === "direction" && (
        <div className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-4 font-heading">
            Personnel Connecté
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {onlineAdmins.map((admin) => (
              <div
                key={admin.id}
                className={\`p-4 rounded-xl border transition-colors \${
                  selectedAdminId === String(admin.id)
                    ? "bg-purple-600/20 border-purple-500"
                    : "bg-[#0B1736]/40 border-[#94C5FF]/15 hover:border-purple-400/50 cursor-pointer"
                }\`}
                onClick={() => setSelectedAdminId(String(admin.id))}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#12305A] border border-[#94C5FF]/30 flex items-center justify-center text-blue-100 font-bold">
                      {admin.name[0]}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0B1736] rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {admin.name}
                    </div>
                    <div className="text-xs text-blue-300/70">
                      {admin.role}
                    </div>
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
              className="w-full h-32 bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-purple-500 resize-none transition-colors"
            />
            <button
              type="submit"
              disabled={!msgInput.trim() || !selectedAdminId}
              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 transition-all shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" /> Envoyer au destinataire
            </button>
          </form>
        </div>
      )}

      {activeTab === "forum" && (
        <div className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl p-6 flex flex-col h-[550px] shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#94C5FF]/15">
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                Réunions & Forum des Parents
              </h2>
              <p className="text-xs text-blue-300/70">
                Espace exclusif réservé aux parents et tuteurs.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                <Users className="w-4 h-4" /> 24 en ligne
              </div>
              <button onClick={() => setCurrentView("visio")} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 whitespace-nowrap">
                Vidéoconférence
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 max-w-[85%]">
              <div className="text-xs font-bold text-purple-300 mb-1">
                Comité des Parents
              </div>
              <p className="text-sm text-blue-50">
                Bonjour à tous, la réunion pour la kermesse aura lieu ce vendredi à 15h. Merci de confirmer votre présence.
              </p>
              <div className="text-[10px] text-blue-300/50 mt-2">
                Aujourd'hui, 08:30
              </div>
            </div>
            
            <div className="bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-2xl p-4 max-w-[85%] self-end">
              <div className="text-xs font-bold text-sky-300 mb-1">
                Papa KALALA
              </div>
              <p className="text-sm text-blue-50">
                Moi je serai là ! On parlera aussi de la contribution pour le bus scolaire ?
              </p>
              <div className="text-[10px] text-blue-300/50 mt-2">
                Aujourd'hui, 09:15
              </div>
            </div>
          </div>

          <form onSubmit={handleSendToForum} className="mt-auto relative pt-2">
            <input
              type="text"
              value={forumInput}
              onChange={(e) => setForumInput(e.target.value)}
              placeholder="Participez à la discussion..."
              className="w-full bg-[#0B1736]/80 border border-[#94C5FF]/20 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!forumInput.trim()}
              className="absolute right-2 top-[58%] -translate-y-1/2 w-9 h-9 bg-purple-600 hover:bg-purple-500 rounded-lg flex items-center justify-center text-white disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('./src/components/views/ParentsPortalView.jsx', code, 'utf8');
