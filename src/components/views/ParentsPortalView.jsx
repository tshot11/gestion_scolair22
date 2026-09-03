import React, { useState } from "react";
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
import { Video } from "lucide-react";

export function ParentsPortalView() {
  const {
    data,
    getEleveDetail,
    setCurrentView,
    setSelectedEleveId,
    showToast,
    currentUser,
  } = useApp();

  const activeMeetings = data?.activeMeetings || [];


  // Find all children belonging to this parent
  const parentChildren = (data?.eleves || []).filter(
    (e) => e.email_tuteur === currentUser.email || e.id === currentUser.eleve_id
  );

  const defaultChildId = parentChildren.length > 0 ? parentChildren[0].id : currentUser?.eleve_id || 1;
  const [selectedChildId, setSelectedChildId] = useState(defaultChildId);

  const eleve = data?.eleves?.find((e) => e.id === selectedChildId);

  if (!eleve) {
    return (
      <div className="p-6 text-blue-200">
        Profil de l'enfant introuvable ou non assigné. Veuillez contacter l'administration.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 font-heading">
            <Users className="w-8 h-8 text-blue-400" />
            Mes Enfants
          </h1>
          <p className="text-sm text-blue-200/70 mt-1">
            Sélectionnez un enfant pour consulter ses informations (notes, finances, etc.)
          </p>
        </div>

        {parentChildren.length > 1 && (
          <div className="bg-[#12305A]/45 backdrop-blur-md p-4 rounded-2xl border border-[#94C5FF]/15 flex items-center gap-4">
             <label className="text-sm font-semibold text-blue-300">Enfant :</label>
             <select 
               value={selectedChildId} 
               onChange={e => setSelectedChildId(Number(e.target.value))} 
               className="bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl py-2 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
             >
               {parentChildren.map(c => <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>)}
             </select>
          </div>
        )}
      </div>

      <div className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-4 font-heading border-b border-[#94C5FF]/15 pb-2">
            Fiche Élève
          </h2>
          <div className="max-w-md">
            <AnimatedStudentCard
              eleve={eleve}
              onViewDetail={() => {
                setSelectedEleveId(eleve.id);
                setCurrentView("eleve-detail");
              }}
              onGenerateCard={() => {
                showToast("Génération de la carte...", "info");
              }}
            />
          </div>

          <h2 className="text-lg font-bold text-white mt-8 mb-4 font-heading border-b border-[#94C5FF]/15 pb-2">
            Raccourcis Rapides
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => {
                setSelectedEleveId(eleve.id);
                setCurrentView("bulletin");
              }}
              className="bg-[#12305A]/45 backdrop-blur-md hover:bg-[#94C5FF]/10 border border-[#94C5FF]/15 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition group shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-100 group-hover:text-white transition-colors">
                Notes & Bulletins
              </span>
            </button>
            <button
              onClick={() => {
                setSelectedEleveId(eleve.id);
                setCurrentView("finance");
              }}
              className="bg-[#12305A]/45 backdrop-blur-md hover:bg-[#94C5FF]/10 border border-[#94C5FF]/15 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition group shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-100 group-hover:text-white transition-colors text-center">
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
              <span className="text-xs font-bold text-blue-100 group-hover:text-white transition-colors text-center">
                Présence & Horaires
              </span>
            </button>
          </div>
      </div>
    </div>
  );
}
