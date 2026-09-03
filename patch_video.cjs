const fs = require('fs');
let content = fs.readFileSync('src/components/views/VideoConferenceView.jsx', 'utf8');

const newContent = `import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import {
  Video,
  Phone,
  Users,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  ScreenShare,
  Plus,
  Calendar,
  Settings,
} from "lucide-react";
import { Button } from "../ui/Button";

export function VideoConferenceView() {
  const { currentUser, showToast, data, setData } = useApp();
  const [inCall, setInCall] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [activeMeeting, setActiveMeeting] = useState(null);
  
  const isParent = currentUser?.role_id === "parent" || currentUser?.role_id === "TUTEUR" || currentUser?.role === "TUTEUR" || currentUser?.role === "PARENT" || currentUser?.role_id === "eleve";
  const jitsiContainer = useRef(null);
  const jitsiApiRef = useRef(null);

  const activeMeetings = data?.activeMeetings || [];

  const handleJoin = (meetingId, title) => {
    setActiveMeeting({ id: meetingId, title: title || meetingId });
    setInCall(true);
    showToast(\`Connexion à la salle \${title || meetingId}...\`);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!meetingTitle.trim()) {
       showToast("Veuillez entrer un titre pour la réunion.", "error");
       return;
    }
    const newId = Math.random().toString(36).substring(2, 9);
    
    const newMeeting = {
       id: newId,
       title: meetingTitle,
       createdAt: new Date().toISOString(),
       hostId: currentUser?.id,
       hostName: currentUser?.first_name || currentUser?.role_id || "Professeur"
    };
    
    setData(prev => ({
       ...prev,
       activeMeetings: [newMeeting, ...(prev.activeMeetings || [])]
    }));

    setActiveMeeting(newMeeting);
    setInCall(true);
    showToast("Création de la salle de réunion...");
  };

  const handleEndCall = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }
    
    if (!isParent && activeMeeting) {
      setData(prev => ({
        ...prev,
        activeMeetings: (prev.activeMeetings || []).filter(m => m.id !== activeMeeting.id)
      }));
    }
    
    setActiveMeeting(null);
    setInCall(false);
    showToast("Appel terminé.");
  };

  useEffect(() => {
    if (inCall && activeMeeting && jitsiContainer.current) {
      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => initJitsi();
        document.body.appendChild(script);
      } else {
        initJitsi();
      }

      function initJitsi() {
        if (jitsiApiRef.current) {
           jitsiApiRef.current.dispose();
        }
        
        const domain = "meet.jit.si";
        const options = {
            roomName: "GestionScolaireRDC_" + activeMeeting.id,
            width: "100%",
            height: "100%",
            parentNode: jitsiContainer.current,
            userInfo: {
                displayName: currentUser?.first_name || currentUser?.role_id || "Utilisateur"
            },
            configOverwrite: {
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                prejoinPageEnabled: false
            },
            interfaceConfigOverwrite: {
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'profile', 'chat',
                    'settings', 'videoquality', 'filmstrip', 'feedback',
                    'shortcuts', 'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
                ]
            }
        };
        
        jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);
        
        jitsiApiRef.current.addListener('videoConferenceLeft', () => {
             handleEndCall();
        });
      }
    }
    
    return () => {
      if (jitsiApiRef.current) {
         jitsiApiRef.current.dispose();
         jitsiApiRef.current = null;
      }
    }
  }, [inCall, activeMeeting, currentUser]);

  if (inCall) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col p-4 sm:p-6 lg:p-8 min-h-[85vh] gap-4 pb-24 sm:pb-8">
        <div className="flex items-center justify-between bg-[#12305A]/45 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 px-6 py-4 shadow-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-heading">{activeMeeting?.title || "Salle de Réunion Virtuelle"}</h2>
              <p className="text-xs text-blue-300/70 font-mono">ID: {activeMeeting?.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2">
                 <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">En direct</span>
             </div>
             <button
                onClick={handleEndCall}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg shadow-rose-600/30 border border-rose-500/50 flex items-center gap-2 text-xs"
              >
                <PhoneOff className="w-4 h-4" />
                <span className="hidden sm:inline">Quitter la réunion</span>
             </button>
          </div>
        </div>

        {/* Real Video Grid */}
        <div className="flex-1 bg-[#0B1736] rounded-2xl border border-[#94C5FF]/20 relative overflow-hidden flex items-center justify-center shadow-2xl min-h-[60vh]">
            <div ref={jitsiContainer} className="w-full h-full min-h-[60vh] absolute inset-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full pb-24 sm:pb-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight mb-2">
          Visioconférence & Réunions
        </h1>
        <p className="text-sm text-blue-300/70">
          Rejoignez un cours en ligne ou une réunion parents-professeurs en haute définition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Create Card (Admin/Teacher) */}
        {!isParent && (
          <div className="bg-[#12305A]/45 backdrop-blur-xl rounded-[24px] p-6 sm:p-8 border border-[#94C5FF]/15 shadow-2xl relative overflow-hidden group hover:border-[#94C5FF]/30 transition-all">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all"></div>
            <div className="absolute bottom-0 right-0 p-8 opacity-5">
              <Calendar className="w-32 h-32 text-emerald-300" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20 shadow-inner">
                  <Plus className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-white font-heading mb-2">
                  Nouvelle réunion
                </h2>
                <p className="text-xs text-blue-300/70 mb-8 leading-relaxed">
                  Démarrez une réunion instantanée sécurisée pour vos élèves ou collègues. Un lien unique sera généré et visible par les parents/élèves.
                </p>
              </div>
              
              <form onSubmit={handleCreate} className="mt-auto space-y-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-2 uppercase tracking-wider">
                    Titre de la réunion
                  </label>
                  <input
                    type="text"
                    required
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="Ex: Cours de Mathématiques, Réunion parents..."
                    className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 transition shadow-inner"
                  />
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  icon={Video}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/20 border-none"
                >
                  Démarrer la visioconférence
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Join Card (Active Meetings) */}
        <div className="bg-[#12305A]/45 backdrop-blur-xl rounded-[24px] p-6 sm:p-8 border border-[#94C5FF]/15 shadow-2xl relative overflow-hidden group hover:border-[#94C5FF]/30 transition-all flex flex-col h-full">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-all"></div>
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Video className="w-32 h-32 text-blue-300" />
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/30 shadow-inner shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white font-heading mb-2">
              Réunions en cours
            </h2>
            <p className="text-xs text-blue-300/70 mb-6 leading-relaxed">
              Sélectionnez une réunion active pour la rejoindre instantanément.
            </p>
            
            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[300px]">
              {activeMeetings.length > 0 ? (
                activeMeetings.map((meeting) => (
                   <div key={meeting.id} className="p-4 rounded-xl bg-[#0B1736]/60 border border-[#94C5FF]/20 hover:border-blue-400/50 transition flex items-center justify-between gap-3 group/item">
                       <div className="min-w-0">
                           <h3 className="text-sm font-bold text-white truncate">{meeting.title}</h3>
                           <p className="text-xs text-blue-300/60 mt-1 truncate">Animé par: {meeting.hostName}</p>
                       </div>
                       <Button
                          variant="primary"
                          onClick={() => handleJoin(meeting.id, meeting.title)}
                          className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-1.5 text-xs whitespace-nowrap shrink-0 opacity-90 group-hover/item:opacity-100"
                        >
                          Rejoindre
                        </Button>
                   </div>
                ))
              ) : (
                <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#94C5FF]/20 rounded-xl bg-[#12305A]/30">
                    <VideoOff className="w-8 h-8 text-blue-300/30 mb-2" />
                    <p className="text-sm text-blue-300/50">Aucune réunion en cours</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/views/VideoConferenceView.jsx', newContent);
console.log("VideoConferenceView patched for Jitsi API!");
