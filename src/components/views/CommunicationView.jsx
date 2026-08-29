import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  MessageSquare,
  Send,
  Search,
  Bell,
  Mail,
  CheckCheck,
  Sparkles,
  Plus,
} from "lucide-react";
export function CommunicationView() {
  const { data, addMessage, showToast } = useApp();
  const [search, setSearch] = useState("");
  const [selectedMsgId, setSelectedMsgId] = useState(
    (data?.messages || [])[0]?.id || 1,
  ); /* New Message Form */
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [form, setForm] = useState({
    destinataire: "Tous les Parents d’Élèves",
    sujet: "",
    contenu: "",
  });
  const handleSend = (e) => {
    e.preventDefault();
    if (!form.sujet || !form.contenu) return;
    const msg = addMessage({
      expediteur: "Direction des Études",
      destinataire: form.destinataire,
      sujet: form.sujet,
      contenu: form.contenu,
    });
    setIsComposeOpen(false);
    setSelectedMsgId(msg.id);
    setForm({
      destinataire: "Tous les Parents d’Élèves",
      sujet: "",
      contenu: "",
    });
  };
  const filteredMessages = (data?.messages || []).filter((m) => {
    return `${m.sujet} ${m.expediteur} ${m.destinataire} ${m.contenu}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });
  const activeMsg =
    (data?.messages || []).find((m) => m.id === selectedMsgId) || (data?.messages || [])[0];
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
            
            Messagerie & Alertes Scolaires
          </h2><p className="text-xs sm:text-sm text-blue-300/70">
            
            Circulaires officielles, convocations et communications
            parents-direction
          </p></div><button
          onClick={() => setIsComposeOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition active:scale-95"
        ><Plus className="w-4 h-4" /> Rédiger une Circulaire
        </button></div>
      {/* Message List and Reading Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left: Message Thread List */}
        <div className="bg-[#12305A]/45 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 p-4 space-y-3"><div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/70" /><input
              type="text"
              placeholder="Filtrer les messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-blue-200/40 focus:outline-none focus:border-blue-500"
            /></div><div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedMsgId(msg.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1.5 ${selectedMsgId === msg.id ? "bg-blue-600/20 border-[#94C5FF]/15" : "bg-[#12305A]/45 backdrop-blur-md/70 border-[#94C5FF]/15 hover:bg-[#12305A]/45 backdrop-blur-md"}`}
              ><div className="flex items-center justify-between text-[10px] text-blue-300/70"><span className="font-semibold text-blue-400 truncate max-w-[140px]">
                    {msg.expediteur}
                  </span><span>{(msg.date || "").split(" ")[0]}</span></div><div className="text-xs font-bold text-white truncate">
                  {msg.sujet}
                </div><p className="text-[11px] text-slate-700 line-clamp-2">
                  {msg.contenu}
                </p></div>
            ))}
          </div></div>
        {/* Right: Message Reader */}
        <div className="lg:col-span-2 bg-[#12305A]/45 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 p-6 space-y-4 flex flex-col justify-between">
          
          {activeMsg ? (
            <div className="space-y-4"><div className="pb-4 border-b border-[#94C5FF]/15 space-y-2"><div className="flex items-center justify-between"><span className="px-3 py-1 rounded-[14px] bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-[#94C5FF]/15">
                    
                    Circulaire Officielle
                  </span><span className="text-xs text-blue-300/70 font-mono">
                    {activeMsg.date}
                  </span></div><h3 className="text-lg font-bold text-white font-heading">
                  {activeMsg.sujet}
                </h3><div className="flex items-center gap-4 text-xs text-slate-700"><div>
                    De : <strong>{activeMsg.expediteur}</strong>
                  </div><div>
                    À : <strong>{activeMsg.destinataire}</strong>
                  </div></div></div><div className="text-xs text-blue-100 leading-relaxed whitespace-pre-line bg-[#12305A]/45 backdrop-blur-md p-5 rounded-2xl border border-[#94C5FF]/15">
                
                {activeMsg.contenu}
              </div></div>
          ) : (
            <div className="text-center py-16 text-blue-300/50 text-xs">
              
              Sélectionnez un message pour le lire
            </div>
          )}
          <div className="pt-4 border-t border-[#94C5FF]/15 flex items-center justify-between text-xs text-blue-300/70"><span className="flex items-center gap-1.5 text-blue-400"><CheckCheck className="w-4 h-4" /> Diffusé sur l'application
              mobile des parents
            </span></div></div></div>
      {/* Modal Compose Message */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"><div className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl w-full max-w-lg shadow-2xl p-6"><div className="flex items-center justify-between pb-4 border-b border-[#94C5FF]/15"><h3 className="text-base font-bold text-white font-heading">
                Nouvelle Circulaire aux Familles
              </h3><button
                onClick={() => setIsComposeOpen(false)}
                className="text-blue-300 hover:text-white"
              >
                ✕
              </button></div><form onSubmit={handleSend} className="space-y-4 py-4"><div><label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destinataires
                </label><select
                  value={form.destinataire}
                  onChange={(e) =>
                    setForm({ ...form, destinataire: e.target.value })
                  }
                  className="w-full bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                ><option value="Tous les Parents d’Élèves">
                    Tous les Parents d’Élèves
                  </option><option value="Parents 6ème Secondaire">
                    Parents 6ème Secondaire
                  </option><option value="Parents 4ème Éducation de Base">
                    Parents 4ème Éducation de Base
                  </option><option value="Corps Enseignant">
                    Corps Enseignant
                  </option></select></div><div><label className="block text-xs font-semibold text-slate-700 mb-1">
                  Objet du message *
                </label><input
                  type="text"
                  required
                  value={form.sujet}
                  onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                  placeholder="Ex: Calendrier des Examens du 2ème Semestre"
                  className="w-full bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                /></div><div><label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contenu de la circulaire *
                </label><textarea
                  required
                  rows={4}
                  value={form.contenu}
                  onChange={(e) =>
                    setForm({ ...form, contenu: e.target.value })
                  }
                  placeholder="Rédigez le communiqué officiel..."
                  className="w-full bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                /></div><div className="flex justify-end gap-2 pt-4 border-t border-[#94C5FF]/15"><button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#12305A]/45 backdrop-blur-md text-slate-700 text-xs font-semibold"
                >
                  
                  Annuler
                </button><button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-600/25"
                >
                  
                  Diffuser le message
                </button></div></form></div></div>
      )}
    </div>
  );
}
