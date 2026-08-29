import React from "react";
import { useApp } from "../../context/AppContext";
import {
  BarChart3,
  Users,
  Building,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Layers,
  GraduationCap,
  Sparkles,
  Percent,
  PieChart,
  ArrowUpRight,
} from "lucide-react";

export function CapacityStatsTab({ onSelectClass, onSelectRoom }) {
  const { data, getPedagogieAlerts, getClassStats, getRoomStats } = useApp();

  const classes = data?.classes || [];
  const salles = data?.salles || [];
  const eleves = data?.eleves || [];
  const cycles = data?.cycles || [];
  const alerts = getPedagogieAlerts();

  const activeClasses = classes.filter((c) => c.statut === "active");
  const totalStudents = eleves.filter((e) => e.statut !== "inactif").length;
  const averageClassSize = activeClasses.length > 0 ? (totalStudents / activeClasses.length).toFixed(1) : 0;

  const totalSeats = salles.reduce((sum, s) => sum + Number(s.capacite_max || 40), 0);
  const globalFillRate = totalSeats > 0 ? Math.round((totalStudents / totalSeats) * 100) : 0;

  const operationalRooms = salles.filter((s) => s.etat === "bon_etat" || s.etat === "a_surveiller").length;
  const maintenanceRooms = salles.filter((s) => s.etat === "maintenance" || s.etat === "hors_service").length;

  const overloadedClasses = activeClasses.filter((cls) => {
    const stats = getClassStats(cls.id);
    return stats && stats.alert_status === "surcharge";
  });

  const warningClasses = activeClasses.filter((cls) => {
    const stats = getClassStats(cls.id);
    return stats && stats.alert_status === "alerte";
  });

  return (
    <div className="space-y-6">
      {/* 6 Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#10224D]/80 border border-blue-400/20 shadow-lg space-y-1">
          <span className="text-[10px] uppercase font-bold text-blue-300/70 tracking-wider">
            Classes Actives
          </span>
          <div className="text-xl font-extrabold text-white">{activeClasses.length}</div>
          <span className="text-[10px] text-blue-400 font-semibold">{classes.length} totales</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#10224D]/80 border border-blue-400/20 shadow-lg space-y-1">
          <span className="text-[10px] uppercase font-bold text-blue-300/70 tracking-wider">
            Salles Physiques
          </span>
          <div className="text-xl font-extrabold text-white">{salles.length}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">{operationalRooms} opérationnelles</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#10224D]/80 border border-blue-400/20 shadow-lg space-y-1">
          <span className="text-[10px] uppercase font-bold text-blue-300/70 tracking-wider">
            Élèves Inscrits
          </span>
          <div className="text-xl font-extrabold text-sky-400">{totalStudents}</div>
          <span className="text-[10px] text-blue-300/60 font-semibold">Effectif total</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#10224D]/80 border border-blue-400/20 shadow-lg space-y-1">
          <span className="text-[10px] uppercase font-bold text-blue-300/70 tracking-wider">
            Moyenne / Classe
          </span>
          <div className="text-xl font-extrabold text-purple-400">{averageClassSize}</div>
          <span className="text-[10px] text-purple-300/60 font-semibold">élèves / classe</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#10224D]/80 border border-blue-400/20 shadow-lg space-y-1">
          <span className="text-[10px] uppercase font-bold text-blue-300/70 tracking-wider">
            Remplissage Global
          </span>
          <div className="text-xl font-extrabold text-emerald-400">{globalFillRate}%</div>
          <span className="text-[10px] text-blue-300/60 font-semibold">sur {totalSeats} places</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#10224D]/80 border border-rose-400/25 shadow-lg space-y-1">
          <span className="text-[10px] uppercase font-bold text-rose-300/70 tracking-wider">
            Alertes Actives
          </span>
          <div className="text-xl font-extrabold text-rose-400">{alerts.length}</div>
          <span className="text-[10px] text-rose-300/60 font-semibold">{overloadedClasses.length} surcharge(s)</span>
        </div>
      </div>

      {/* Grid: Breakdown by Cycle & Overloaded Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cycle Distribution */}
        <div className="p-5 rounded-2xl bg-[#10224D]/80 border border-blue-400/20 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Répartition des Effectifs par Cycle Scolaire
          </h3>

          <div className="space-y-3">
            {cycles.map((cycle) => {
              const cycleClasses = activeClasses.filter(
                (c) => Number(c.cycle_id) === cycle.id || c.cycle === cycle.nom
              );
              const cycleStudents = cycleClasses.reduce((sum, cls) => {
                return sum + eleves.filter((e) => e.classe_id === cls.id && e.statut !== "inactif").length;
              }, 0);
              const percentOfTotal = totalStudents > 0 ? Math.round((cycleStudents / totalStudents) * 100) : 0;

              return (
                <div key={cycle.id} className="p-3 rounded-xl bg-[#0B1736]/60 border border-blue-400/15 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{cycle.nom}</span>
                    <span className="text-blue-300/70 font-semibold">
                      {cycleClasses.length} classe(s) • <strong className="text-white">{cycleStudents} élèves</strong> ({percentOfTotal}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-blue-900/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                      style={{ width: `${percentOfTotal}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Capacity Health & Overloaded Watchlist */}
        <div className="p-5 rounded-2xl bg-[#10224D]/80 border border-blue-400/20 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Vigilance Capacités & Surcharges Pédagogiques
          </h3>

          {overloadedClasses.length === 0 && warningClasses.length === 0 ? (
            <div className="text-center py-8 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs font-bold">Toutes les classes respectent les plafonds réglementaires.</p>
              <p className="text-[11px] text-emerald-300/70">Aucune surcharge d'effectif détectée.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {overloadedClasses.map((cls) => {
                const stats = getClassStats(cls.id);
                return (
                  <div
                    key={cls.id}
                    className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{cls.nom}</span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                          Surcharge (+{stats.total_eleves - stats.capacite_max})
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-200/80 mt-0.5">
                        Effectif : {stats.total_eleves} / {stats.capacite_max} max ({stats.taux_occupation}%)
                      </p>
                    </div>
                    <button
                      onClick={() => onSelectClass(cls.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <span>Examiner</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              {warningClasses.map((cls) => {
                const stats = getClassStats(cls.id);
                return (
                  <div
                    key={cls.id}
                    className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{cls.nom}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                          Vigilance ({stats.taux_occupation}%)
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-200/80 mt-0.5">
                        Effectif : {stats.total_eleves} / {stats.capacite_max} places
                      </p>
                    </div>
                    <button
                      onClick={() => onSelectClass(cls.id)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <span>Examiner</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
