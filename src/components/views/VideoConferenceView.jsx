import React, { useState, useEffect, useRef } from "react";
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
        "error",
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
    showToast(`Connexion à la salle ${meetingId}...`);
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
  /* Re-assign stream to video element when it mounts if we are in call */ useEffect(() => {
    if (inCall && videoRef.current && streamRef.current && !isAudioOnly) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [inCall, isAudioOnly]);
  /* Clean up on unmount */ useEffect(() => {
    return () => {
      stopMedia();
    };
  }, []);
  if (inCall) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col p-2 sm:p-4 min-h-[70vh]">
        {" "}
        {/* Real Video Grid */}{" "}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          <div className="bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/80 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 relative overflow-hidden flex items-center justify-center shadow-lg">
            {" "}
            {!isAudioOnly ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                /* Mute local video to prevent echo */ className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="w-32 h-32 rounded-[14px] bg-blue-900/50 border border-[#94C5FF]/15 flex items-center justify-center">
                {" "}
                <Users className="w-12 h-12 text-[#B8C7DF] " />{" "}
              </div>
            )}{" "}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-2">
              {" "}
              <span className="w-2 h-2 rounded-[14px] bg-blue-500 animate-pulse"></span>{" "}
              Vous ({currentUser?.role_id}){" "}
            </div>{" "}
            {!micOn && (
              <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-md p-2 rounded-xl text-white">
                {" "}
                <MicOff className="w-4 h-4" />{" "}
              </div>
            )}{" "}
          </div>{" "}
          <div className="bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/40 backdrop-blur-md rounded-2xl border border-dashed border-[#94C5FF]/15 relative overflow-hidden flex flex-col items-center justify-center gap-4">
            {" "}
            <div className="w-20 h-20 rounded-[14px] bg-[#12305A]/45 border border-[#94C5FF]/15 flex items-center justify-center animate-pulse">
              {" "}
              <Users className="w-8 h-8 text-[#B8C7DF] " />{" "}
            </div>{" "}
            <p className="text-sm font-medium text-[#F5F9FF]0">
              En attente des autres participants...
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* Controls */}{" "}
        <div className="mt-4 bg-[#12305A]/45 A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/80 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 p-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 shadow-xl">
          {" "}
          <button
            onClick={toggleMic}
            className={`p-4 rounded-2xl transition-all shadow-lg ${micOn ? "bg-[#12305A]/45 hover:bg-[#12305A]/45 text-white" : "bg-red-500 hover:bg-red-400 text-white"}`}
          >
            {" "}
            {micOn ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}{" "}
          </button>{" "}
          {!isAudioOnly && (
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-2xl transition-all shadow-lg ${videoOn ? "bg-[#12305A]/45 hover:bg-[#12305A]/45 text-white" : "bg-red-500 hover:bg-red-400 text-white"}`}
            >
              {" "}
              {videoOn ? (
                <Video className="w-6 h-6" />
              ) : (
                <VideoOff className="w-6 h-6" />
              )}{" "}
            </button>
          )}{" "}
          <button className="p-4 rounded-2xl bg-[#12305A]/45 hover:bg-[#12305A]/45 text-white transition-all shadow-lg hidden sm:block">
            {" "}
            <ScreenShare className="w-6 h-6" />{" "}
          </button>{" "}
          <button
            onClick={handleEndCall}
            className="p-4 px-8 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg shadow-red-500/30 flex items-center gap-3 active:scale-95"
          >
            {" "}
            <PhoneOff className="w-6 h-6" />{" "}
            <span className="hidden sm:inline">Quitter</span>{" "}
          </button>{" "}
        </div>{" "}
      </div>
    );
  }
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      {" "}
      <div className="mb-8">
        {" "}
        <h1 className="text-2xl sm:text-3xl font-black text-[#F5F9FF] tracking-tight mb-2">
          {" "}
          Visioconférence & Réunions{" "}
        </h1>{" "}
        <p className="text-sm text-[#F5F9FF]0">
          {" "}
          Rejoignez un cours en ligne ou une réunion parents-professeurs.{" "}
        </p>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {" "}
        {/* Join Card */}{" "}
        <div className="bg-white A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#94C5FF]/15 C5FF]/15 shadow-xl relative overflow-hidden">
          {" "}
          <div className="absolute top-0 right-0 p-8 opacity-10">
            {" "}
            <Video className="w-32 h-32" />{" "}
          </div>{" "}
          <div className="relative z-10">
            {" "}
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
              {" "}
              <Users className="w-6 h-6" />{" "}
            </div>{" "}
            <h2 className="text-xl font-bold text-[#F5F9FF] mb-2">
              Rejoindre une réunion
            </h2>{" "}
            <p className="text-sm text-[#mb-6">
              Saisissez le code fourni par l'enseignant ou l'administration.
            </p>{" "}
            <form onSubmit={(e) => handleJoin(e, false)} className="space-y-4">
              {" "}
              <input
                type="text"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                placeholder="Ex: abc-defg-hij"
                className="w-full bg-slate-50 :bg-[#0B1736]/60 border border-[#94C5FF]/15 C5FF]/15 rounded-xl px-4 py-3 text-[#F5F9FF] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />{" "}
              <div className="flex gap-3">
                {" "}
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={!meetingId.trim()}
                  icon={Video}
                >
                  {" "}
                  Rejoindre avec Vidéo{" "}
                </Button>{" "}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleJoin(null, true)}
                  disabled={!meetingId.trim()}
                  icon={Phone}
                >
                  {" "}
                  Audio seul{" "}
                </Button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>{" "}
        {/* Create Card (Admin/Teacher) */}{" "}
        {(currentUser?.role_id === "admin" ||
          currentUser?.role_id === "enseignant") && (
          <div className="bg-white backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#94C5FF]/15 shadow-xl relative overflow-hidden">
            {" "}
            <div className="absolute top-0 right-0 p-8 opacity-10">
              {" "}
              <Calendar className="w-32 h-32" />{" "}
            </div>{" "}
            <div className="relative z-10">
              {" "}
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                {" "}
                <Plus className="w-6 h-6" />{" "}
              </div>{" "}
              <h2 className="text-xl font-bold text-[#F5F9FF] mb-2">
                Nouvelle réunion
              </h2>{" "}
              <p className="text-sm text-[#mb-6">
                Démarrez une réunion instantanée pour vos élèves ou collègues.
              </p>{" "}
              <div className="space-y-4">
                {" "}
                <Button
                  variant="primary"
                  fullWidth
                  icon={Video}
                  onClick={() => handleCreate(false)}
                  className="!bg-blue-500 hover:!bg-blue-400 !shadow-blue-500/30"
                >
                  {" "}
                  Démarrer une visioconférence{" "}
                </Button>{" "}
                <Button
                  variant="outline"
                  fullWidth
                  icon={Phone}
                  onClick={() => handleCreate(true)}
                >
                  {" "}
                  Démarrer un appel audio{" "}
                </Button>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}
