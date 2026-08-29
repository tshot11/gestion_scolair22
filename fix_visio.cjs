const fs = require('fs');

const content = `import React, { useState, useEffect, useRef } from "react";
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
  const { currentUser, showToast } = useApp();
  const [inCall, setInCall] = useState(false);
  const [meetingId, setMeetingId] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (window.location.hash.includes("meet=")) {
      const meet = window.location.hash.split("meet=")[1];
      setMeetingId(meet);
      setInCall(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const startMedia = async (video) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMicOn(true);
      setVideoOn(video);
    } catch (err) {
      console.error("Erreur d'accès aux médias:", err);
      showToast(
        "Impossible d'accéder à la caméra ou au microphone. Vérifiez vos autorisations.",
        "error"
      );
    }
  };

  const stopMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleJoin = async (e, audioOnly = false) => {
    e?.preventDefault();
    if (!meetingId) return;
    setIsAudioOnly(audioOnly);
    setInCall(true);
    showToast(\`Connexion à la salle \${meetingId}...\`);
    await startMedia(!audioOnly);
  };

  const handleCreate = async (audioOnly = false) => {
    const newId = Math.random().toString(36).substring(2, 9);
    setMeetingId(newId);
    setIsAudioOnly(audioOnly);
    setInCall(true);
    showToast("Création de la salle de réunion...");
    await startMedia(!audioOnly);
  };

  const handleEndCall = () => {
    stopMedia();
    setInCall(false);
    showToast("Appel terminé.");
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micOn;
        setMicOn(!micOn);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoOn;
        setVideoOn(!videoOn);
      }
    }
  };

  useEffect(() => {
    if (inCall && videoRef.current && streamRef.current && !isAudioOnly) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [inCall, isAudioOnly]);

  useEffect(() => {
    return () => {
      stopMedia();
    };
  }, []);

  if (inCall) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col p-4 sm:p-6 lg:p-8 min-h-[80vh] gap-6 pb-24 sm:pb-8">
        <div className="flex items-center justify-between bg-[#12305A]/45 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 px-6 py-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-heading">Salle de Réunion Virtuelle</h2>
              <p className="text-xs text-blue-300/70 font-mono">ID: {meetingId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">En direct</span>
          </div>
        </div>

        {/* Real Video Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
          <div className="bg-[#0B1736] rounded-2xl border border-[#94C5FF]/20 relative overflow-hidden flex items-center justify-center shadow-2xl">
            {!isAudioOnly ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="w-32 h-32 rounded-[20px] bg-blue-900/40 border border-[#94C5FF]/20 flex items-center justify-center">
                <Users className="w-12 h-12 text-blue-300/50 " />
              </div>
            )}
            <div className="absolute top-4 left-4 bg-[#0B1736]/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#94C5FF]/15 text-white text-xs font-bold flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-[14px] bg-blue-500"></span>
              Vous ({currentUser?.first_name || currentUser?.role_id})
            </div>
            {!micOn && (
              <div className="absolute top-4 right-4 bg-rose-500/90 backdrop-blur-md p-2 rounded-xl text-white shadow-lg border border-rose-500/30">
                <MicOff className="w-4 h-4" />
              </div>
            )}
          </div>
          
          <div className="bg-[#12305A]/30 backdrop-blur-md rounded-2xl border border-dashed border-[#94C5FF]/20 relative overflow-hidden flex flex-col items-center justify-center gap-4 shadow-inner">
            <div className="w-24 h-24 rounded-[24px] bg-[#12305A]/50 border border-[#94C5FF]/15 flex items-center justify-center animate-pulse shadow-lg">
              <Users className="w-10 h-10 text-blue-300/40 " />
            </div>
            <p className="text-sm font-semibold text-blue-300/60">
              En attente des autres participants...
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#12305A]/45 backdrop-blur-xl rounded-2xl border border-[#94C5FF]/15 p-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 shadow-2xl">
          <button
            onClick={toggleMic}
            className={\`p-4 rounded-[18px] transition-all shadow-lg border \${micOn ? "bg-slate-700/50 hover:bg-slate-600/60 text-white border-white/10" : "bg-rose-500 hover:bg-rose-400 text-white border-rose-400/50"}\`}
            title={micOn ? "Désactiver le micro" : "Activer le micro"}
          >
            {micOn ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </button>
          {!isAudioOnly && (
            <button
              onClick={toggleVideo}
              className={\`p-4 rounded-[18px] transition-all shadow-lg border \${videoOn ? "bg-slate-700/50 hover:bg-slate-600/60 text-white border-white/10" : "bg-rose-500 hover:bg-rose-400 text-white border-rose-400/50"}\`}
              title={videoOn ? "Désactiver la caméra" : "Activer la caméra"}
            >
              {videoOn ? (
                <Video className="w-6 h-6" />
              ) : (
                <VideoOff className="w-6 h-6" />
              )}
            </button>
          )}
          <button className="p-4 rounded-[18px] bg-slate-700/50 hover:bg-slate-600/60 text-white border border-white/10 transition-all shadow-lg hidden sm:flex" title="Partager l'écran">
            <ScreenShare className="w-6 h-6" />
          </button>
          <button
            onClick={handleEndCall}
            className="px-8 py-4 rounded-[18px] bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg shadow-rose-600/30 border border-rose-500/50 flex items-center gap-3 active:scale-95 ml-2"
          >
            <PhoneOff className="w-6 h-6" />
            <span className="hidden sm:inline">Quitter la réunion</span>
          </button>
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
        {/* Join Card */}
        <div className="bg-[#12305A]/45 backdrop-blur-xl rounded-[24px] p-6 sm:p-8 border border-[#94C5FF]/15 shadow-2xl relative overflow-hidden group hover:border-[#94C5FF]/30 transition-all">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-all"></div>
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Video className="w-32 h-32 text-blue-300" />
          </div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/30 shadow-inner">
              <Users className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white font-heading mb-2">
              Rejoindre une réunion
            </h2>
            <p className="text-xs text-blue-300/70 mb-8 leading-relaxed">
              Saisissez le code fourni par l'enseignant ou l'administration pour accéder à votre salle.
            </p>
            
            <form onSubmit={(e) => handleJoin(e, false)} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-blue-300 mb-2 uppercase tracking-wider">
                  ID de la réunion
                </label>
                <input
                  type="text"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  placeholder="Ex: abc-defg-hij"
                  className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/20 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-blue-400 transition shadow-inner"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20"
                  disabled={!meetingId.trim()}
                  icon={Video}
                >
                  Avec Vidéo
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 bg-[#12305A]/60 hover:bg-[#12305A] text-blue-200 border-[#94C5FF]/20 rounded-xl"
                  onClick={() => handleJoin(null, true)}
                  disabled={!meetingId.trim()}
                  icon={Phone}
                >
                  Audio seul
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Create Card (Admin/Teacher) */}
        {(currentUser?.role_id === "admin" || currentUser?.role_id === "ENSEIGNANT" || currentUser?.role === "Enseignant") && (
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
                  Démarrez une réunion instantanée sécurisée pour vos élèves ou collègues. Un lien unique sera généré.
                </p>
              </div>
              
              <div className="mt-auto space-y-3 pt-2">
                <Button
                  variant="primary"
                  fullWidth
                  icon={Video}
                  onClick={() => handleCreate(false)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/20 border-none"
                >
                  Démarrer une visioconférence
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  icon={Phone}
                  onClick={() => handleCreate(true)}
                  className="bg-[#12305A]/60 hover:bg-[#12305A] text-emerald-200 border-[#94C5FF]/20 rounded-xl"
                >
                  Démarrer un appel audio
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
`

fs.writeFileSync('./src/components/views/VideoConferenceView.jsx', content, 'utf8');
