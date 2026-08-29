import React from "react";
import {
  Users,
  GraduationCap,
  Wallet,
  AlertTriangle,
  UserPlus,
  FileText,
  ChevronRight,
  TrendingUp,
  Clock,
  BookOpen,
} from "lucide-react";

import { useApp } from "../../context/AppContext";

export function DashboardView() {
  const { setCurrentView, setSelectedEleveId, data } = useApp();

  const elevesCount = (data?.eleves || []).length;
  const classesCount = (data?.classes || []).length;
  const recentEleves = (data?.eleves || []).slice(-4).reverse();
  const recentPayments = (data?.paiements || []).slice(-4).reverse();
  const incidentsActifs = (data?.incidents || []).filter((i) => !i.date_cloture);
  const activeAlerts = incidentsActifs.length;

  // 1. Header (more compact)
  // 2. Stats (unified)
  // 3. Alerts (Moved up)
  // 4. Recent Activity (Compact list)
  // 5. Quick Actions (Categorized/Hierarchical)

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#12305A]/30 backdrop-blur-md p-4 rounded-2xl border border-[#94C5FF]/15">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight leading-none mb-1.5">
            Tableau de Bord
          </h1>
          <p className="text-xs text-blue-300/70">
            Aperçu global de l'établissement{" "}
            {data?.ecoleConfig?.nom ? `• ${data.ecoleConfig.nom}` : ""}
          </p>
        </div>
        <div className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
          Année {data?.ecoleConfig?.annee_courante || "2023-2024"}
        </div>
      </div>

      {/* 2. MAIN STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 shadow-sm flex flex-col justify-between group hover:border-[#94C5FF]/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400 opacity-70" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              {elevesCount}
            </div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-blue-300/60 mt-1">
              Élèves inscrits
            </div>
          </div>
        </div>

        {/* Classes */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 shadow-sm flex flex-col justify-between group hover:border-[#94C5FF]/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              {classesCount}
            </div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-blue-300/60 mt-1">
              Classes Actives
            </div>
          </div>
        </div>

        {/* Finance */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 shadow-sm flex flex-col justify-between group hover:border-[#94C5FF]/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Aujourd'hui
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              {recentPayments.length}
            </div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-blue-300/60 mt-1">
              Paiements Récents
            </div>
          </div>
        </div>

        {/* Discipline / Alerts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 shadow-sm flex flex-col justify-between group hover:border-[#94C5FF]/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              {activeAlerts}
            </div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-blue-300/60 mt-1">
              Dossiers Disciplinaires
            </div>
          </div>
        </div>
      </div>

      {/* 3. ALERTS / ATTENTION NEEDED */}
      {incidentsActifs.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 shadow-lg shadow-rose-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-200">
                Action requise : {incidentsActifs.length} alerte(s) disciplinaire(s)
              </h3>
              <p className="text-[11px] text-rose-300/70">
                Certains dossiers nécessitent une attention immédiate de la direction.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView("discipline")}
            className="shrink-0 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold rounded-xl border border-rose-500/30 transition-colors"
          >
            Traiter les dossiers
          </button>
        </div>
      )}

      {/* 4. RECENT ACTIVITY (COMPACT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Enrollments */}
        <div className="bg-[#12305A]/45 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#94C5FF]/15 flex items-center justify-between bg-[#12305A]/30">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-blue-100 font-heading">Dernières Inscriptions</h3>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView("eleves")}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition flex items-center"
            >
              Voir tout <ChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          <div className="p-2 flex-1 flex flex-col gap-1">
            {recentEleves.length > 0 ? (
              recentEleves.map((eleve) => {
                const classe = (data?.classes || []).find((c) => c.id === eleve.classe_id);
                return (
                  <div
                    key={eleve.id}
                    onClick={() => {
                      setSelectedEleveId(eleve.id);
                      setCurrentView("eleve-detail");
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#94C5FF]/10 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-900/50 border border-[#94C5FF]/20 flex items-center justify-center text-blue-200 font-bold text-xs shrink-0">
                        {eleve.photo ? (
                          <img src={eleve.photo} alt={eleve.nom} className="w-full h-full object-cover" />
                        ) : (
                          <span>{eleve.prenom?.[0] || ""}{eleve.nom?.[0] || ""}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-blue-100 group-hover:text-blue-300 transition-colors truncate">
                          {eleve.nom} {eleve.prenom}
                        </div>
                        <div className="text-xs text-blue-300/60 truncate">
                          {eleve.matricule} • <span className="text-blue-200/80">{classe ? classe.nom : "Classe non définie"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 ml-3">
                      <span className="text-[10px] font-mono px-2 py-1 rounded bg-[#0B1736]/60 border border-[#94C5FF]/15 text-blue-300">
                        Nouveau
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-blue-300/50">Aucune inscription récente</div>
            )}
          </div>
        </div>

        {/* Recent Financial Receipts */}
        <div className="bg-[#12305A]/45 backdrop-blur-md rounded-2xl border border-[#94C5FF]/15 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#94C5FF]/15 flex items-center justify-between bg-[#12305A]/30">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-blue-100 font-heading">Derniers Encaissements</h3>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView("finance")}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition flex items-center"
            >
              Historique <ChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          <div className="p-2 flex-1 flex flex-col gap-1">
            {recentPayments.length > 0 ? (
              recentPayments.slice(0, 4).map((pay) => {
                const eleve = (data?.eleves || []).find((e) => e.id === pay.eleve_id);
                return (
                  <div
                    key={pay.id}
                    onClick={() => setCurrentView("finance")}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#94C5FF]/10 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-blue-100 group-hover:text-blue-300 transition-colors truncate">
                          {eleve ? `${eleve.nom} ${eleve.prenom}` : "Élève"}
                        </div>
                        <div className="text-xs text-blue-300/60 truncate">
                          Réf: {pay.reference} • {pay.mode}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className="text-sm font-bold text-emerald-400 font-mono">
                        +{Number(pay.montant_paye).toLocaleString("fr-FR")} CDF
                      </div>
                      <div className="text-[10px] text-blue-300/50">{pay.date_paiement}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-blue-300/50">Aucun paiement récent</div>
            )}
          </div>
        </div>
      </div>

      {/* 5. QUICK OPERATIONS (HIERARCHICAL) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-blue-300/60 uppercase tracking-wider pl-1">Actions Rapides</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Primary Action 1 */}
          <button
            onClick={() => setCurrentView("eleves")}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-center transition group shadow-md lg:col-span-1"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-100 group-hover:text-white">Inscrire Élève</div>
            </div>
          </button>

          {/* Primary Action 2 */}
          <button
            onClick={() => setCurrentView("finance")}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-center transition group shadow-md lg:col-span-1"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-100 group-hover:text-white">Paiement</div>
            </div>
          </button>

          {/* Secondary Actions */}
          <button
            onClick={() => setCurrentView("bulletin")}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#12305A]/30 hover:bg-[#12305A]/50 border border-[#94C5FF]/10 text-center transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-bold text-blue-200">Bulletins</div>
          </button>

          <button
            onClick={() => setCurrentView("discipline")}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#12305A]/30 hover:bg-[#12305A]/50 border border-[#94C5FF]/10 text-center transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-bold text-blue-200">Incident</div>
          </button>

          <button
            onClick={() => setCurrentView("classes")}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#12305A]/30 hover:bg-[#12305A]/50 border border-[#94C5FF]/10 text-center transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-bold text-blue-200">Classes</div>
          </button>

          <button
            onClick={() => setCurrentView("users")}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#12305A]/30 hover:bg-[#12305A]/50 border border-[#94C5FF]/10 text-center transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-bold text-blue-200">Parents/Profs</div>
          </button>
        </div>
      </div>
    </div>
  );
}
