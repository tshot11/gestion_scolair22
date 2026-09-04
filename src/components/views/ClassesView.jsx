import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  BookOpen,
  Building,
  Plus,
  Search,
  Filter,
  Layers,
  GraduationCap,
  MapPin,
  Users,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  BarChart3,
  Edit,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  LayoutGrid,
  List,
  ArrowRight,
  Maximize2,
  Wrench,
  Printer,
  Archive,
  RotateCcw,
} from "lucide-react";

import { ClassAlertsBanner } from "../classes/ClassAlertsBanner";
import { ClassModal } from "../classes/ClassModal";
import { ClassDetailModal } from "../classes/ClassDetailModal";
import { RoomModal } from "../classes/RoomModal";
import { RoomDetailModal } from "../classes/RoomDetailModal";
import { AssignmentManagerModal } from "../classes/AssignmentManagerModal";
import { PedagogicalSettingsTab } from "../classes/PedagogicalSettingsTab";
import { CapacityStatsTab } from "../classes/CapacityStatsTab";

export function ClassesView() {
  const {
    data,
    currentUser,
    getClassStats,
    getRoomStats,
    getPedagogieAlerts,
    deleteClass,
    archiveClass,
    restoreClass,
    deleteRoom,
    setCurrentView,
    setSelectedClasseId,
    showToast,
  } = useApp();

  // Navigation tabs: 'classes' | 'salles' | 'statistiques' | 'parametres'
  const [mainTab, setMainTab] = useState("classes");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  // Search and filter states for Classes
  const [classSearch, setClassSearch] = useState("");
  const [selectedCycleFilter, setSelectedCycleFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

  // Search and filter states for Rooms
  const [roomSearch, setRoomSearch] = useState("");
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("all");
  const [selectedEtatFilter, setSelectedEtatFilter] = useState("all");

  // Modal Control States
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const [isClassDetailOpen, setIsClassDetailOpen] = useState(false);
  const [detailClassId, setDetailClassId] = useState(null);

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [isRoomDetailOpen, setIsRoomDetailOpen] = useState(false);
  const [detailRoomId, setDetailRoomId] = useState(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTargetClass, setAssignTargetClass] = useState(null);
  const [assignTargetRoom, setAssignTargetRoom] = useState(null);
  const [assignType, setAssignType] = useState("room"); // 'room' | 'titulaire' | 'both'

  const classes = data?.classes || [];
  const salles = data?.salles || [];
  const cycles = data?.cycles || [];
  const typesSalles = data?.typesSalles || [];
  const alerts = getPedagogieAlerts ? getPedagogieAlerts() : [];

  // Filter classes according to teacher profile if logged in as ENSEIGNANT
  let filteredClasses = classes;
  if (currentUser?.role === "ENSEIGNANT") {
    const teacherRecord = (data?.enseignants || []).find((t) => t.email === currentUser.email);
    if (teacherRecord) {
      filteredClasses = classes.filter(
        (c) =>
          c.prof_id === teacherRecord.id ||
          (data?.cours || []).some(
            (cours) =>
              cours.enseignant_id === teacherRecord.id &&
              (cours.classe_id === c.id || !cours.classe_id)
          )
      );
    }
  }

  // Apply search & cycle & status filters to classes
  filteredClasses = filteredClasses.filter((cls) => {
    const matchSearch =
      (cls.nom || "").toLowerCase().includes(classSearch.toLowerCase()) ||
      (cls.code || "").toLowerCase().includes(classSearch.toLowerCase()) ||
      (cls.cycle || "").toLowerCase().includes(classSearch.toLowerCase());

    const matchCycle =
      selectedCycleFilter === "all" ||
      Number(cls.cycle_id) === Number(selectedCycleFilter) ||
      cls.cycle === selectedCycleFilter;

    const matchStatus =
      selectedStatusFilter === "all" ||
      (selectedStatusFilter === "active" && cls.statut === "active") ||
      (selectedStatusFilter === "archivee" && cls.statut === "archivee");

    return matchSearch && matchCycle && matchStatus;
  });

  // Filter rooms
  const filteredRooms = salles.filter((room) => {
    const matchSearch =
      (room.nom || "").toLowerCase().includes(roomSearch.toLowerCase()) ||
      (room.code || "").toLowerCase().includes(roomSearch.toLowerCase()) ||
      (room.batiment || "").toLowerCase().includes(roomSearch.toLowerCase());

    const matchBuilding =
      selectedBuildingFilter === "all" || room.batiment === selectedBuildingFilter;

    const matchType =
      selectedTypeFilter === "all" ||
      Number(room.type_id) === Number(selectedTypeFilter) ||
      room.type === selectedTypeFilter;

    const matchEtat =
      selectedEtatFilter === "all" || room.etat === selectedEtatFilter;

    return matchSearch && matchBuilding && matchType && matchEtat;
  });

  // Handlers for quick triggers
  const handleOpenNewClass = () => {
    setEditingClass(null);
    setIsClassModalOpen(true);
  };

  const handleOpenEditClass = (cls) => {
    setEditingClass(cls);
    setIsClassModalOpen(true);
  };

  const handleOpenClassDetail = (classId) => {
    setDetailClassId(classId);
    setIsClassDetailOpen(true);
  };

  const handleOpenNewRoom = () => {
    setEditingRoom(null);
    setIsRoomModalOpen(true);
  };

  const handleOpenEditRoom = (room) => {
    setEditingRoom(room);
    setIsRoomModalOpen(true);
  };

  const handleOpenRoomDetail = (roomId) => {
    setDetailRoomId(roomId);
    setIsRoomDetailOpen(true);
  };

  const handleOpenAssignRoom = (cls) => {
    setAssignTargetClass(cls);
    setAssignTargetRoom(null);
    setAssignType("room");
    setIsAssignModalOpen(true);
  };

  const handleOpenAssignTitulaire = (cls) => {
    setAssignTargetClass(cls);
    setAssignTargetRoom(null);
    setAssignType("titulaire");
    setIsAssignModalOpen(true);
  };

  const handleOpenAssignClassToRoom = (room) => {
    setAssignTargetClass(null);
    setAssignTargetRoom(room);
    setAssignType("room");
    setIsAssignModalOpen(true);
  };

  const handleDeleteClass = (cls) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer définitivement la classe "${cls.nom}" ? Cette action est irréversible.`
      )
    ) {
      deleteClass(cls.id);
    }
  };

  const handleDeleteRoom = (room) => {
    const res = deleteRoom(room.id);
    if (res && !res.success) {
      if (
        window.confirm(
          `${res.error}\n\nVoulez-vous forcer la suppression et détacher automatiquement ces classes ?`
        )
      ) {
        deleteRoom(room.id, true);
      }
    }
  };

  // Distinct Buildings list for room filter
  const buildingsList = Array.from(new Set(salles.map((s) => s.batiment).filter(Boolean)));

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      {/* Top Banner & Main Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#12305A]/80 via-[#10224D] to-[#12305A]/80 p-5 rounded-2xl border border-blue-400/20 backdrop-blur-md shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-400 bg-blue-500/15 px-2.5 py-0.5 rounded-full border border-blue-400/25">
              Module Pédagogique & Locaux RDC
            </span>
            <span className="text-xs text-blue-300/60 font-semibold">• Année 2025-2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
            Gestion des Classes & Salles Pédagogiques
          </h1>
          <p className="text-xs sm:text-sm text-blue-200/70">
            Structure des promotions, affectation physique des locaux, titulaires et régulation des effectifs
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setAssignTargetClass(null);
              setAssignTargetRoom(null);
              setAssignType("both");
              setIsAssignModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-400/30 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Affectation Rapide</span>
          </button>

          <button
            onClick={handleOpenNewRoom}
            className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-400/30 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Building className="w-4 h-4 text-blue-400" />
            <span>Nouvelle Salle</span>
          </button>

          {currentUser?.role === 'ADMIN' && (
          <button
            onClick={handleOpenNewClass}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une Classe</span>
          </button>
  )}
        </div>
      </div>

      {/* Real-time Alerts Banner */}
      <ClassAlertsBanner
        alerts={alerts}
        onSelectClass={handleOpenClassDetail}
        onSelectRoom={handleOpenRoomDetail}
      />

      {/* Main Tabs Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-400/20 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setMainTab("classes")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition ${
              mainTab === "classes"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-[#10224D]/60 text-blue-200/80 hover:text-white hover:bg-[#10224D] border border-blue-400/15"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Classes Pédagogiques</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px]">
              {classes.length}
            </span>
          </button>

          <button
            onClick={() => setMainTab("salles")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition ${
              mainTab === "salles"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-[#10224D]/60 text-blue-200/80 hover:text-white hover:bg-[#10224D] border border-blue-400/15"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Salles Physiques & Espaces</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px]">
              {salles.length}
            </span>
          </button>

          <button
            onClick={() => setMainTab("statistiques")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition ${
              mainTab === "statistiques"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-[#10224D]/60 text-blue-200/80 hover:text-white hover:bg-[#10224D] border border-blue-400/15"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Tableau de Bord & Capacités</span>
          </button>

          <button
            onClick={() => setMainTab("parametres")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition ${
              mainTab === "parametres"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-[#10224D]/60 text-blue-200/80 hover:text-white hover:bg-[#10224D] border border-blue-400/15"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Configuration Pédagogique</span>
          </button>
        </div>

        {/* View mode toggle (only for classes & rooms tab) */}
        {(mainTab === "classes" || mainTab === "salles") && (
          <div className="flex items-center gap-1 bg-[#10224D]/60 p-1 rounded-xl border border-blue-400/15">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "grid" ? "bg-blue-600 text-white" : "text-blue-300/60 hover:text-white"
              }`}
              title="Affichage en Grille"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "list" ? "bg-blue-600 text-white" : "text-blue-300/60 hover:text-white"
              }`}
              title="Affichage en Liste"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          TAB 1: CLASSES PÉDAGOGIQUES
          ========================================================================= */}
      {mainTab === "classes" && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#10224D]/60 p-3.5 rounded-2xl border border-blue-400/15 backdrop-blur-md">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-blue-300/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par nom de classe, code ou cycle..."
                value={classSearch}
                onChange={(e) => setClassSearch(e.target.value)}
                className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-blue-300/40 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-300/70 font-semibold">Cycle :</span>
                <select
                  value={selectedCycleFilter}
                  onChange={(e) => setSelectedCycleFilter(e.target.value)}
                  className="bg-[#0B1736] border border-blue-400/20 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="all">Tous les cycles</option>
                  {cycles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-blue-300/70 font-semibold">Statut :</span>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-[#0B1736] border border-blue-400/20 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="all">Tous statuts</option>
                  <option value="active">Actives uniquement</option>
                  <option value="archivee">Archivées</option>
                </select>
              </div>
            </div>
          </div>

          {/* Classes Display */}
          {filteredClasses.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-blue-400/20 bg-[#10224D]/30 space-y-3">
              <BookOpen className="w-12 h-12 text-blue-400/40 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Aucune classe trouvée</h4>
                <p className="text-xs text-blue-300/60 max-w-sm mx-auto">
                  {classSearch || selectedCycleFilter !== "all"
                    ? "Aucun résultat ne correspond à vos filtres de recherche."
                    : "Aucune classe pédagogique n'a encore été créée."}
                </p>
              </div>
              <button
                onClick={handleOpenNewClass}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition"
              >
                Créer une première classe
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.map((classe) => {
                const stats = getClassStats(classe.id);
                const students = (data?.eleves || []).filter((e) => e.classe_id === classe.id);
                const titulaire = (data?.enseignants || []).find((t) => t.id === classe.prof_id);
                const salle = (data?.salles || []).find((s) => s.id === classe.salle_id);

                return (
                  <div
                    key={classe.id}
                    className="bg-[#12305A]/45 hover:bg-[#12305A]/70 backdrop-blur-md border border-[#94C5FF]/15 hover:border-blue-400/35 rounded-2xl p-5 transition flex flex-col justify-between space-y-4 shadow-lg group"
                  >
                    {/* Card Top */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                              {classe.cycle || "Cycle"}
                            </span>
                            {classe.division && (
                              <span className="text-[10px] text-blue-300/60 font-semibold">
                                • Div. {classe.division}
                              </span>
                            )}
                            {classe.statut === "archivee" && (
                              <span className="text-[9px] bg-slate-500/20 text-slate-300 px-1.5 py-0.5 rounded font-bold">
                                Archivée
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-white font-heading mt-0.5 truncate group-hover:text-blue-300 transition">
                            {classe.nom}
                          </h3>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/25 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
                          <BookOpen className="w-5 h-5 text-blue-400" />
                        </div>
                      </div>

                      {/* Capacity & Gauge */}
                      <div className="space-y-1.5 bg-[#0B1736]/70 p-3 rounded-xl border border-blue-400/15 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-300/70">Effectif inscrit :</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-white">
                              {students.length} / {stats?.capacite_max}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                stats?.alert_status === "surcharge"
                                  ? "bg-rose-500/20 text-rose-300"
                                  : stats?.alert_status === "alerte"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-emerald-500/20 text-emerald-300"
                              }`}
                            >
                              {stats?.taux_occupation}%
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-2 bg-blue-950/80 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              stats?.alert_status === "surcharge"
                                ? "bg-rose-500 shadow-sm shadow-rose-500/50"
                                : stats?.alert_status === "alerte"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, stats?.taux_occupation || 0)}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-blue-300/50 pt-0.5">
                          <span>♂ {stats?.garcons} Garçons</span>
                          <span>♀ {stats?.filles} Filles</span>
                        </div>
                      </div>

                      {/* Titulaire & Salle info */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#0B1736]/40 border border-blue-400/10">
                          <div className="flex items-center gap-2 min-w-0">
                            <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span className="text-blue-200/80 truncate">
                              Titulaire :{" "}
                              <strong className="text-white font-semibold">
                                {titulaire ? `${titulaire.nom} ${titulaire.prenom}` : "Non assigné"}
                              </strong>
                            </span>
                          </div>
                          <button
                            onClick={() => handleOpenAssignTitulaire(classe)}
                            className="text-[10px] text-purple-300 hover:underline shrink-0 ml-1"
                          >
                            Changer
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#0B1736]/40 border border-blue-400/10">
                          <div className="flex items-center gap-2 min-w-0">
                            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span className="text-blue-200/80 truncate">
                              Salle :{" "}
                              <strong className="text-white font-semibold">
                                {salle ? `${salle.nom} (${salle.code})` : "Aucune salle"}
                              </strong>
                            </span>
                          </div>
                          <button
                            onClick={() => handleOpenAssignRoom(classe)}
                            className="text-[10px] text-blue-300 hover:underline shrink-0 ml-1"
                          >
                            Changer
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-2 border-t border-blue-400/15 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenClassDetail(classe.id)}
                        className="flex-1 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold border border-blue-400/25 transition flex items-center justify-center gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Détails & {students.length} Élèves</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditClass(classe)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-blue-300 hover:text-white border border-blue-400/15 transition"
                        title="Modifier les paramètres de la classe"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteClass(classe)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/20 transition"
                        title="Supprimer la classe"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="overflow-x-auto rounded-2xl border border-blue-400/20 bg-[#10224D]/60 shadow-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B1736] text-blue-200 font-bold border-b border-blue-400/20 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Classe & Cycle</th>
                    <th className="py-3 px-4">Titulaire Actuel</th>
                    <th className="py-3 px-4">Salle Physique</th>
                    <th className="py-3 px-4">Effectif / Capacité</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-400/15 bg-[#12305A]/20">
                  {filteredClasses.map((classe) => {
                    const stats = getClassStats(classe.id);
                    const students = (data?.eleves || []).filter((e) => e.classe_id === classe.id);
                    const titulaire = (data?.enseignants || []).find((t) => t.id === classe.prof_id);
                    const salle = (data?.salles || []).find((s) => s.id === classe.salle_id);

                    return (
                      <tr key={classe.id} className="hover:bg-blue-500/10 transition">
                        <td className="py-3 px-4 font-mono font-bold text-blue-300">
                          {classe.code || `CLS-${classe.id}`}
                        </td>
                        <td className="py-3 px-4">
                          <strong className="text-white text-sm block font-bold">{classe.nom}</strong>
                          <span className="text-[10px] text-blue-300/60">
                            {classe.cycle} {classe.division ? `• Div. ${classe.division}` : ""}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {titulaire ? (
                            <span className="text-purple-300 font-semibold">
                              {titulaire.nom} {titulaire.prenom}
                            </span>
                          ) : (
                            <span className="text-blue-300/40 italic">Non assigné</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {salle ? (
                            <span className="text-blue-300 font-semibold">
                              {salle.nom} ({salle.code})
                            </span>
                          ) : (
                            <span className="text-blue-300/40 italic">Aucune salle</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">
                              {students.length} / {stats?.capacite_max}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                stats?.alert_status === "surcharge"
                                  ? "bg-rose-500/20 text-rose-300"
                                  : stats?.alert_status === "alerte"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-emerald-500/20 text-emerald-300"
                              }`}
                            >
                              {stats?.taux_occupation}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              classe.statut === "active"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-slate-500/20 text-slate-400"
                            }`}
                          >
                            {classe.statut || "active"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenClassDetail(classe.id)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white transition font-semibold text-[11px]"
                          >
                            Détails
                          </button>
                          <button
                            onClick={() => handleOpenEditClass(classe)}
                            className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-blue-300 hover:text-white transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClass(classe)}
                            className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: SALLES PHYSIQUES & ESPACES
          ========================================================================= */}
      {mainTab === "salles" && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#10224D]/60 p-3.5 rounded-2xl border border-blue-400/15 backdrop-blur-md">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-blue-300/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par nom de salle, code ou bâtiment..."
                value={roomSearch}
                onChange={(e) => setRoomSearch(e.target.value)}
                className="w-full bg-[#0B1736] border border-blue-400/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-blue-300/40 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-300/70 font-semibold">Bâtiment :</span>
                <select
                  value={selectedBuildingFilter}
                  onChange={(e) => setSelectedBuildingFilter(e.target.value)}
                  className="bg-[#0B1736] border border-blue-400/20 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="all">Tous les bâtiments</option>
                  {buildingsList.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-blue-300/70 font-semibold">État :</span>
                <select
                  value={selectedEtatFilter}
                  onChange={(e) => setSelectedEtatFilter(e.target.value)}
                  className="bg-[#0B1736] border border-blue-400/20 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="all">Tous les états</option>
                  <option value="bon_etat">Bon État</option>
                  <option value="a_surveiller">À Surveiller</option>
                  <option value="maintenance">En Maintenance</option>
                  <option value="a_renover">À Rénover</option>
                  <option value="hors_service">Hors Service</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rooms Display */}
          {filteredRooms.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-blue-400/20 bg-[#10224D]/30 space-y-3">
              <Building className="w-12 h-12 text-blue-400/40 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Aucune salle physique trouvée</h4>
                <p className="text-xs text-blue-300/60 max-w-sm mx-auto">
                  {roomSearch || selectedBuildingFilter !== "all"
                    ? "Aucun local ne correspond à vos filtres."
                    : "Aucune salle n'a encore été enregistrée dans l'inventaire."}
                </p>
              </div>
              <button
                onClick={handleOpenNewRoom}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition"
              >
                Ajouter une première salle
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map((room) => {
                const roomStats = getRoomStats(room.id);
                const assignedClasses = (data?.classes || []).filter(
                  (c) => c.salle_id === room.id && c.statut === "active"
                );

                return (
                  <div
                    key={room.id}
                    className="bg-[#12305A]/45 hover:bg-[#12305A]/70 backdrop-blur-md border border-[#94C5FF]/15 hover:border-blue-400/35 rounded-2xl p-5 transition flex flex-col justify-between space-y-4 shadow-lg group"
                  >
                    <div className="space-y-3">
                      {/* Top info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-400/20">
                              {room.code}
                            </span>
                            <span className="text-[10px] text-blue-300/70 font-semibold truncate">
                              {room.type}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white font-heading mt-1 truncate group-hover:text-blue-300 transition">
                            {room.nom}
                          </h3>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                            room.etat === "bon_etat"
                              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                              : room.etat === "maintenance" || room.etat === "hors_service"
                              ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                              : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {room.etat === "bon_etat"
                            ? "Opérationnelle"
                            : room.etat === "maintenance"
                            ? "Maintenance"
                            : room.etat === "hors_service"
                            ? "Hors Service"
                            : "À Surveiller"}
                        </span>
                      </div>

                      {/* Technical Specs & Surface */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#0B1736]/70 border border-blue-400/15 text-xs">
                        <div>
                          <span className="text-[10px] text-blue-300/60 block">Surface & Dim.</span>
                          <strong className="text-white font-extrabold">{room.surface} m²</strong>
                          <span className="text-[10px] text-blue-300/50 block">
                            {room.longueur}m × {room.largeur}m
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-blue-300/60 block">Capacité Max</span>
                          <strong className="text-emerald-400 font-extrabold">{room.capacite_max} places</strong>
                          <span className="text-[10px] text-blue-300/50 block">
                            Ratio : {roomStats?.surface_par_eleve} m²/él.
                          </span>
                        </div>
                      </div>

                      {/* Location & Equipments */}
                      <div className="space-y-1.5 text-xs text-blue-200/80">
                        <p className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="truncate">
                            {room.batiment} • {room.etage}
                          </span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span>
                            {roomStats?.equipementsCount} équipements ({roomStats?.equipementsEnBonEtat} en bon état)
                          </span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="font-semibold text-white">
                            {assignedClasses.length > 0
                              ? `Affectée à : ${assignedClasses.map((c) => c.nom).join(", ")}`
                              : "Aucune classe rattachée"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-blue-400/15 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenRoomDetail(room.id)}
                        className="flex-1 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold border border-blue-400/25 transition flex items-center justify-center gap-1.5"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Inventaire & Fiche</span>
                      </button>

                      <button
                        onClick={() => handleOpenAssignClassToRoom(room)}
                        className="p-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-400/20 transition"
                        title="Affecter une classe à cette salle"
                      >
                        <Layers className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEditRoom(room)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-blue-300 hover:text-white border border-blue-400/15 transition"
                        title="Modifier la salle"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteRoom(room)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/20 transition"
                        title="Supprimer la salle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="overflow-x-auto rounded-2xl border border-blue-400/20 bg-[#10224D]/60 shadow-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B1736] text-blue-200 font-bold border-b border-blue-400/20 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Nom de Salle & Type</th>
                    <th className="py-3 px-4">Bâtiment / Étage</th>
                    <th className="py-3 px-4">Surface (m²)</th>
                    <th className="py-3 px-4">Capacité Places</th>
                    <th className="py-3 px-4">Classes Affectées</th>
                    <th className="py-3 px-4">État</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-400/15 bg-[#12305A]/20">
                  {filteredRooms.map((room) => {
                    const assignedClasses = (data?.classes || []).filter(
                      (c) => c.salle_id === room.id && c.statut === "active"
                    );

                    return (
                      <tr key={room.id} className="hover:bg-blue-500/10 transition">
                        <td className="py-3 px-4 font-mono font-bold text-blue-300">
                          {room.code}
                        </td>
                        <td className="py-3 px-4">
                          <strong className="text-white text-sm block font-bold">{room.nom}</strong>
                          <span className="text-[10px] text-blue-300/60">{room.type}</span>
                        </td>
                        <td className="py-3 px-4 text-blue-200/80">
                          {room.batiment} • {room.etage}
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          {room.surface} m²
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400">
                          {room.capacite_max} places
                        </td>
                        <td className="py-3 px-4">
                          {assignedClasses.length > 0 ? (
                            <span className="text-blue-300 font-semibold">
                              {assignedClasses.map((c) => c.nom).join(", ")}
                            </span>
                          ) : (
                            <span className="text-blue-300/40 italic">Libre</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              room.etat === "bon_etat"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : room.etat === "maintenance"
                                ? "bg-rose-500/20 text-rose-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {room.etat === "bon_etat" ? "Bon État" : room.etat}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenRoomDetail(room.id)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white transition font-semibold text-[11px]"
                          >
                            Inventaire
                          </button>
                          <button
                            onClick={() => handleOpenEditRoom(room)}
                            className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-blue-300 hover:text-white transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room)}
                            className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: TABLEAU DE BORD & STATISTIQUES CAPACITÉS
          ========================================================================= */}
      {mainTab === "statistiques" && (
        <CapacityStatsTab
          onSelectClass={handleOpenClassDetail}
          onSelectRoom={handleOpenRoomDetail}
        />
      )}

      {/* =========================================================================
          TAB 4: CONFIGURATION PÉDAGOGIQUE (CYCLES, NIVEAUX, OPTIONS, NORMES)
          ========================================================================= */}
      {mainTab === "parametres" && <PedagogicalSettingsTab />}

      {/* =========================================================================
          MODALS INTEGRATION
          ========================================================================= */}
      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        editingClass={editingClass}
      />

      <ClassDetailModal
        isOpen={isClassDetailOpen}
        onClose={() => setIsClassDetailOpen(false)}
        classId={detailClassId}
        onEditClass={(cls) => {
          setIsClassDetailOpen(false);
          handleOpenEditClass(cls);
        }}
        onAssignRoom={(cls) => {
          setIsClassDetailOpen(false);
          handleOpenAssignRoom(cls);
        }}
        onAssignTitulaire={(cls) => {
          setIsClassDetailOpen(false);
          handleOpenAssignTitulaire(cls);
        }}
      />

      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        editingRoom={editingRoom}
      />

      <RoomDetailModal
        isOpen={isRoomDetailOpen}
        onClose={() => setIsRoomDetailOpen(false)}
        roomId={detailRoomId}
        onEditRoom={(room) => {
          setIsRoomDetailOpen(false);
          handleOpenEditRoom(room);
        }}
        onAssignClass={(room) => {
          setIsRoomDetailOpen(false);
          handleOpenAssignClassToRoom(room);
        }}
      />

      <AssignmentManagerModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        targetClass={assignTargetClass}
        targetRoom={assignTargetRoom}
        type={assignType}
      />
    </div>
  );
}
