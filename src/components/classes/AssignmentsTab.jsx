import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  ArrowRightLeft,
  Building,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Filter,
  Layers,
  GraduationCap,
} from "lucide-react";

export function AssignmentsTab({ onOpenAssignmentModal, onOpenClassDetail, onOpenRoomDetail }) {
  const { data } = useApp();

  const [filterMode, setFilterMode] = useState("all"); // all | assigned | unassigned_classes | unassigned_rooms | conflicts
  const [searchTerm, setSearchTerm] = useState("");

  const classes = data?.classes || [];
  const salles = data?.salles || [];
  const eleves = data?.eleves || [];
  const enseignants = data?.enseignants || [];

  // Filter classes & rooms
  const activeClasses = classes.filter((c) => c.statut === "active");

  const assignmentsList = activeClasses.map((cls) => {
    const assignedRoom = salles.find((s) => s.id === cls.salle_id);
    const teacher = enseignants.find((t) => t.id === cls.prof_id);
    const studentCount = eleves.filter((e) => e.classe_id === cls.id && e.statut !== "inactif").length;
    const isConflict = assignedRoom && (assignedRoom.capacite_max < studentCount || assignedRoom.etat === "maintenance" || assignedRoom.etat === "hors_service");
    
    // check if room is shared
    const isSharedRoom = assignedRoom ? activeClasses.filter((c) => c.salle_id === assignedRoom.id).length > 1 : false;

    return {
      class: cls,
      room: assignedRoom,
      teacher,
      studentCount,
      isConflict,
      isSharedRoom,
      hasRoom: !!assignedRoom,
    };
  });

  const unassignedRooms = salles.filter((s) => !activeClasses.some((c) => c.salle_id === s.id));

  const filteredAssignments = assignmentsList.filter((item) => {
    const matchSearch =
      item.class.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.class.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.room && item.room.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.room && item.room.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.teacher && item.teacher.nom.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchSearch) return false;

    if (filterMode === "assigned") return item.hasRoom;
    if (filterMode === "unassigned_classes") return !item.hasRoom;
    if (filterMode === "conflicts") return item.isConflict || item.isSharedRoom;
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-white font-heading">
            Matrice des Affectations Classes & Salles
          </h3>
          <p className="text-xs text-blue-300/70">
            Supervision des espaces physiques et contrôle de charge par local
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenAssignmentModal(null, null)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Nouvelle affectation
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 bg-[#12305A]/30 p-1.5 rounded-2xl border border-[#94C5FF]/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterMode === "all" ? "bg-blue-600 text-white" : "text-blue-300/70 hover:text-white"
            }`}
          >
            Toutes ({assignmentsList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("assigned")}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterMode === "assigned" ? "bg-blue-600 text-white" : "text-blue-300/70 hover:text-white"
            }`}
          >
            Affectées ({assignmentsList.filter((a) => a.hasRoom).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("unassigned_classes")}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterMode === "unassigned_classes" ? "bg-blue-600 text-white" : "text-blue-300/70 hover:text-white"
            }`}
          >
            Classes sans salle ({assignmentsList.filter((a) => !a.hasRoom).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("conflicts")}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterMode === "conflicts" ? "bg-amber-600 text-white" : "text-amber-300/70 hover:text-amber-200"
            }`}
          >
            Conflits / Alertes ({assignmentsList.filter((a) => a.isConflict || a.isSharedRoom).length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-blue-300/60 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 bg-[#12305A]/45 border border-[#94C5FF]/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-blue-300/40 focus:outline-none focus:border-blue-400"
            placeholder="Rechercher classe, salle, titulaire..."
          />
        </div>
      </div>

      {/* Grid of Class-Room Pairs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredAssignments.map(({ class: cls, room, teacher, studentCount, isConflict, isSharedRoom }) => {
          const capPercent = room ? Math.round((studentCount / (room.capacite_max || 1)) * 100) : 0;

          return (
            <div
              key={cls.id}
              className={`p-4 rounded-2xl border backdrop-blur-md space-y-3.5 transition flex flex-col justify-between ${
                isConflict
                  ? "bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50"
                  : isSharedRoom
                  ? "bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50"
                  : "bg-[#12305A]/35 border-[#94C5FF]/15 hover:border-blue-400/30"
              }`}
            >
              <div className="space-y-3">
                
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 uppercase">
                        {cls.code}
                      </span>
                      <span className="text-[11px] text-blue-300/60 font-medium">
                        {cls.cycle}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenClassDetail(cls.id)}
                      className="text-sm font-bold text-white hover:text-blue-300 transition text-left mt-0.5 truncate block"
                    >
                      {cls.nom}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenAssignmentModal(cls, room)}
                    className="shrink-0 p-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white transition"
                    title="Changer l'affectation"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Connection Box */}
                <div className="p-3 rounded-xl bg-black/25 border border-white/5 grid grid-cols-2 gap-3 text-xs">
                  {/* Left: Class */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-300 uppercase flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-400" />
                      Effectif Actuel
                    </span>
                    <span className="font-bold text-white text-sm block">
                      {studentCount} élèves
                    </span>
                    <span className="text-[10px] text-blue-300/60 truncate block">
                      Titulaire : {teacher ? `${teacher.nom}` : "Non assigné"}
                    </span>
                  </div>

                  {/* Right: Room */}
                  <div className="space-y-1 border-l border-white/10 pl-3">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase flex items-center gap-1">
                      <Building className="w-3 h-3 text-emerald-400" />
                      Salle Physique
                    </span>
                    {room ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => onOpenRoomDetail(room.id)}
                          className="font-bold text-white hover:text-blue-300 transition truncate block text-left"
                        >
                          {room.nom} ({room.code})
                        </button>
                        <span className="text-[10px] text-blue-300/60 block">
                          Capacité : {room.capacite_max} places • {room.batiment}
                        </span>
                      </div>
                    ) : (
                      <span className="text-amber-300/80 text-[11px] font-medium block">
                        Aucune salle affectée
                      </span>
                    )}
                  </div>
                </div>

                {/* Capacity Comparison Gauge if room assigned */}
                {room && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-blue-300/70 font-semibold">
                      <span>Taux d'occupation de la salle</span>
                      <span className={capPercent > 100 ? "text-rose-300" : "text-emerald-300"}>
                        {capPercent}% ({studentCount}/{room.capacite_max} places)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          capPercent > 100 ? "bg-rose-500" : capPercent > 85 ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                        style={{ width: `${Math.min(100, capPercent)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Warning if any */}
              {isConflict ? (
                <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Sureffectif ou salle en maintenance. Réaffectation recommandée.</span>
                </div>
              ) : isSharedRoom ? (
                <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Salle partagée avec une autre classe active.</span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Unassigned Rooms Section */}
      {unassignedRooms.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#12305A]/30 border border-[#94C5FF]/10 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              Salles Physiques Disponibles Sans Classe Affectée ({unassignedRooms.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {unassignedRooms.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <span className="font-bold text-white block truncate">{s.nom} ({s.code})</span>
                  <span className="text-[10px] text-blue-300/60 block">
                    {s.batiment} • {s.capacite_max} places • {s.surface || "--"} m²
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenAssignmentModal(null, s)}
                  className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-[10px] transition shrink-0"
                >
                  Attribuer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
