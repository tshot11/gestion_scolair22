import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Users,
  GraduationCap,
  Fingerprint,
  Wallet,
  ChevronRight,
  UserCheck,
  FileSpreadsheet,
  Award,
  AlertTriangle,
  Building2,
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { StatCard } from "../ui";
export function DashboardView() {
  const { stats, setCurrentView, setSelectedEleveId, data, currentUser } =
    useApp();
  const recentEleves = data.eleves.slice(0, 5);
  const recentPayments = data.paiements.slice(0, 5);
  const incidentsActifs = data.incidents
    .filter((i) => !i.date_cloture)
    .slice(0, 3); /* Financial collection rate calculation */
  const totalFraisTheoriqueGlobal =
    data.eleves.length *
    data.frais.reduce((sum, f) => sum + Number(f.montant || 0), 0);
  const collectionRate =
    totalFraisTheoriqueGlobal > 0
      ? Math.min(
          100,
          Math.round(
            (stats.total_recouvrement / totalFraisTheoriqueGlobal) * 100,
          ),
        )
      : 0;
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-12 text-[#F5F9FF]">
      {" "}
      {/* 1. EXECUTIVE WELCOME BANNER - Clean, High-Contrast & Sleek */}{" "}
      <div className="relative overflow-hidden rounded-2xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 shadow-sm p-5 sm:p-7">
        {" "}
        {/* Subtle decorative glow */}{" "}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-[14px] blur-3xl pointer-events-none -mr-20 -mt-20" />{" "}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {" "}
          <div className="space-y-2">
            {" "}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#12305A]/45 backdrop-blur-md/90 border border-[#94C5FF]/15/70 text-[11px] font-medium text-slate-700">
              {" "}
              <span className="w-1.5 h-1.5 rounded-[14px] bg-blue-400"></span>{" "}
              <span>Année Scolaire {data.ecoleConfig.annee_courante}</span>{" "}
              <span className="text-[#B8C7DF]">•</span>{" "}
              <span className="text-blue-400 font-medium">
                Session Active
              </span>{" "}
            </div>{" "}
            <div>
              {" "}
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-blue-100 tracking-tight">
                {" "}
                Bonjour, {currentUser?.first_name || "Préfet"}{" "}
                {currentUser?.last_name || "TSHILOMBO"}{" "}
              </h1>{" "}
              <p className="text-xs sm:text-sm text-[#mt-1 max-w-xl leading-relaxed">
                {" "}
                Pilotage central de l'établissement{" "}
                <strong className="text-[#F5F9FF] font-semibold">
                  {data.ecoleConfig.nom}
                </strong>
                .{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          {/* Direct CTA Buttons */}{" "}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            {" "}
            <button
              type="button"
              onClick={() => setCurrentView("eleves")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-blue-100 font-semibold text-xs transition shadow-sm active:scale-95 min-h-[42px]"
            >
              {" "}
              <Users className="w-4 h-4 shrink-0" />{" "}
              <span>Inscrire un Élève</span>{" "}
            </button>{" "}
            <button
              type="button"
              onClick={() => setCurrentView("finance")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#12305A]/45 backdrop-blur-md hover:bg-blue-500/20 text-[#F5F9FF] hover:text-blue-100 font-semibold text-xs border border-[#94C5FF]/15/80 transition active:scale-95 min-h-[42px]"
            >
              {" "}
              <Wallet className="w-4 h-4 text-blue-400 shrink-0" />{" "}
              <span>Percevoir Minerval</span>{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* 2. STAT CARDS - Clear 4-column metric cards */}{" "}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {" "}
        <StatCard
          title="Élèves Inscrits"
          value={stats.total_eleves}
          subtitle={`${stats.total_garcons}G • ${stats.total_filles}F`}
          trend={`${stats.filles_percentage}% filles`}
          trendPositive={true}
          icon={Users}
          iconColor="blue"
          onClick={() => setCurrentView("eleves")}
        />{" "}
        <StatCard
          title="Assiduité du Jour"
          value={`${stats.presenceRate}%`}
          subtitle={`${stats.presentCount} Présents`}
          trend={
            stats.absentCount > 0 ? `${stats.absentCount} absents` : "100%"
          }
          trendPositive={stats.absentCount === 0}
          icon={Fingerprint}
          iconColor="blue"
          onClick={() => setCurrentView("presences")}
        />{" "}
        <StatCard
          title="Trésorerie Caisse"
          value={`${stats.solde_caisse.toLocaleString("fr-FR")} CDF`}
          subtitle={`≈ $${Math.round(stats.solde_caisse / (data.ecoleConfig.taux_change_usd || 2800))} USD`}
          trend={`${collectionRate}% recouvrés`}
          trendPositive={true}
          icon={Wallet}
          iconColor="purple"
          onClick={() => setCurrentView("finance")}
        />{" "}
        <StatCard
          title="Classes & Profs"
          value={`${stats.total_classes} Classes`}
          subtitle={`${stats.total_enseignants} Professeurs`}
          trend={`${stats.total_cours} cours`}
          trendPositive={true}
          icon={GraduationCap}
          iconColor="blue"
          onClick={() => setCurrentView("classes")}
        />{" "}
      </div>{" "}
      {/* 3. QUICK ACTIONS - Clean 4-column shortcut panel */}{" "}
      <div className="space-y-3">
        {" "}
        <div className="flex items-center justify-between">
          {" "}
          <h2 className="text-xs font-bold text-[#uppercase tracking-wider">
            {" "}
            Raccourcis & Opérations Rapides{" "}
          </h2>{" "}
          <span className="text-[11px] text-[#B8C7DF] ">
            Accès direct
          </span>{" "}
        </div>{" "}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {" "}
          <button
            type="button"
            onClick={() => setCurrentView("presences")}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md hover:bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/80 backdrop-blur-md border border-[#94C5FF]/15 hover:border-[#94C5FF]/15 text-left transition group"
          >
            {" "}
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {" "}
              <UserCheck className="w-4 h-4" />{" "}
            </div>{" "}
            <div className="min-w-0 flex-1">
              {" "}
              <div className="text-xs font-semibold text-blue-100 group-hover:text-blue-400 transition-colors truncate">
                {" "}
                Faire l'Appel{" "}
              </div>{" "}
              <div className="text-[11px] text-[#truncate">
                Pointage du jour
              </div>{" "}
            </div>{" "}
          </button>{" "}
          <button
            type="button"
            onClick={() => setCurrentView("resultats")}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md hover:bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/80 backdrop-blur-md border border-[#94C5FF]/15 hover:border-[#94C5FF]/15 text-left transition group"
          >
            {" "}
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-[#94C5FF]/15 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {" "}
              <FileSpreadsheet className="w-4 h-4" />{" "}
            </div>{" "}
            <div className="min-w-0 flex-1">
              {" "}
              <div className="text-xs font-semibold text-blue-100 group-hover:text-blue-400 transition-colors truncate">
                {" "}
                Saisie Cotes{" "}
              </div>{" "}
              <div className="text-[11px] text-[#truncate">
                Notes & Palmarès
              </div>{" "}
            </div>{" "}
          </button>{" "}
          <button
            type="button"
            onClick={() => setCurrentView("bulletin")}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md hover:bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/80 backdrop-blur-md border border-[#94C5FF]/15 hover:border-[#94C5FF]/15 text-left transition group"
          >
            {" "}
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {" "}
              <Award className="w-4 h-4" />{" "}
            </div>{" "}
            <div className="min-w-0 flex-1">
              {" "}
              <div className="text-xs font-semibold text-blue-100 group-hover:text-purple-400 transition-colors truncate">
                {" "}
                Bulletins EPST{" "}
              </div>{" "}
              <div className="text-[11px] text-[#truncate">
                Format officiel RDC
              </div>{" "}
            </div>{" "}
          </button>{" "}
          <button
            type="button"
            onClick={() => setCurrentView("parents")}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md hover:bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/80 backdrop-blur-md border border-[#94C5FF]/15 hover:border-[#94C5FF]/15 text-left transition group"
          >
            {" "}
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {" "}
              <Users className="w-4 h-4" />{" "}
            </div>{" "}
            <div className="min-w-0 flex-1">
              {" "}
              <div className="text-xs font-semibold text-blue-100 group-hover:text-blue-400 transition-colors truncate">
                {" "}
                Espace Parents{" "}
              </div>{" "}
              <div className="text-[11px] text-[#truncate">
                Suivi des familles
              </div>{" "}
            </div>{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* 4. TWO-COLUMN DATA OVERVIEW: Recent Enrollments & Recent Finance Receipts */}{" "}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {" "}
        {/* Recent Enrollments */}{" "}
        <div className="p-5 rounded-2xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 shadow-sm space-y-4">
          {" "}
          <div className="flex items-center justify-between pb-3 border-b border-[#94C5FF]/15">
            {" "}
            <div>
              {" "}
              <h3 className="text-sm font-bold text-blue-100 font-heading">
                Dernières Inscriptions
              </h3>{" "}
              <p className="text-xs text-[#F5F9FF]0">
                Élèves enregistrés récemment
              </p>{" "}
            </div>{" "}
            <button
              type="button"
              onClick={() => setCurrentView("eleves")}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition"
            >
              {" "}
              <span>Annuaire complet</span>{" "}
              <ChevronRight className="w-3.5 h-3.5" />{" "}
            </button>{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            {recentEleves.map((eleve) => {
              const classe = data.classes.find((c) => c.id === eleve.classe_id);
              return (
                <div
                  key={eleve.id}
                  onClick={() => {
                    setSelectedEleveId(eleve.id);
                    setCurrentView("eleve-detail");
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/40 hover:bg-[#12305A]/45 A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/40 backdrop-blur-md border border-[#94C5FF]/15/20 C5FF]/15 shadow-lg/60 hover:border-[#94C5FF]/15 transition cursor-pointer group"
                >
                  {" "}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {" "}
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 flex items-center justify-center text-blue-100 font-bold text-xs shrink-0">
                      {" "}
                      {eleve.photo ? (
                        <img
                          src={eleve.photo}
                          alt={eleve.nom}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-slate-700">
                          {eleve.prenom?.[0] || ""}
                          {eleve.nom?.[0] || ""}
                        </span>
                      )}{" "}
                    </div>{" "}
                    <div className="min-w-0 flex-1">
                      {" "}
                      <div className="text-xs font-semibold text-blue-100 group-hover:text-blue-400 transition-colors truncate">
                        {" "}
                        {eleve.nom} {eleve.prenom}{" "}
                      </div>{" "}
                      <div className="text-[11px] text-[#truncate">
                        {" "}
                        <span className="font-mono">
                          {eleve.matricule}
                        </span> •{" "}
                        <span className="text-slate-700">
                          {classe ? classe.nom : "Classe"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {" "}
                    {eleve.est_boursier && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/15 border border-blue-500/30 text-blue-300">
                        {" "}
                        Boursier{" "}
                      </span>
                    )}{" "}
                    <span className="text-[11px] text-[#font-mono px-1.5 py-0.5 rounded bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15/60">
                      {" "}
                      {eleve.sexe === "M" ? "G" : "F"}{" "}
                    </span>{" "}
                  </div>{" "}
                </div>
              );
            })}{" "}
          </div>{" "}
        </div>{" "}
        {/* Recent Financial Receipts */}{" "}
        <div className="p-5 rounded-2xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 shadow-sm space-y-4">
          {" "}
          <div className="flex items-center justify-between pb-3 border-b border-[#94C5FF]/15">
            {" "}
            <div>
              {" "}
              <h3 className="text-sm font-bold text-blue-100 font-heading">
                Encaissements de Caisse
              </h3>{" "}
              <p className="text-xs text-[#F5F9FF]0">
                Paiements de minervals récents
              </p>{" "}
            </div>{" "}
            <button
              type="button"
              onClick={() => setCurrentView("finance")}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition"
            >
              {" "}
              <span>Journal caisse</span>{" "}
              <ChevronRight className="w-3.5 h-3.5" />{" "}
            </button>{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            {recentPayments.map((pay) => {
              const eleve = data.eleves.find((e) => e.id === pay.eleve_id);
              return (
                <div
                  key={pay.id}
                  onClick={() => setCurrentView("finance")}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/40 hover:bg-[#12305A]/45 A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/40 backdrop-blur-md border border-[#94C5FF]/15/20 C5FF]/15 shadow-lg/60 hover:border-[#94C5FF]/15 transition cursor-pointer group"
                >
                  {" "}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {" "}
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      {" "}
                      <Wallet className="w-4 h-4" />{" "}
                    </div>{" "}
                    <div className="min-w-0 flex-1">
                      {" "}
                      <div className="text-xs font-semibold text-blue-100 group-hover:text-blue-400 transition-colors truncate">
                        {" "}
                        {eleve ? `${eleve.nom} ${eleve.prenom}` : "Élève"}{" "}
                      </div>{" "}
                      <div className="text-[11px] text-[#font-mono truncate">
                        {" "}
                        {pay.reference} • {pay.mode}{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="text-right shrink-0 ml-2">
                    {" "}
                    <div className="text-xs font-bold text-blue-400 font-mono">
                      {" "}
                      +{Number(pay.montant_paye).toLocaleString("fr-FR")}{" "}
                      CDF{" "}
                    </div>{" "}
                    <div className="text-[10px] text-[#F5F9FF]0">
                      {" "}
                      {pay.date_paiement}{" "}
                    </div>{" "}
                  </div>{" "}
                </div>
              );
            })}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* 5. DISCIPLINE ALERTS IF ANY */}{" "}
      {incidentsActifs.length > 0 && (
        <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-3">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0" />{" "}
              <div>
                {" "}
                <h3 className="text-xs sm:text-sm font-bold text-blue-200">
                  Alertes Disciplinaires ({incidentsActifs.length})
                </h3>{" "}
                <p className="text-[11px] text-blue-300/70">
                  Dossiers en cours de traitement
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <button
              type="button"
              onClick={() => setCurrentView("discipline")}
              className="text-xs text-blue-300 hover:text-blue-100 font-semibold transition"
            >
              {" "}
              Gérer la discipline{" "}
            </button>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {" "}
            {incidentsActifs.map((inc) => {
              const eleve = data.eleves.find((e) => e.id === inc.eleve_id);
              return (
                <div
                  key={inc.id}
                  className="p-3 rounded-lg bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md/90 border border-[#94C5FF]/15 space-y-1"
                >
                  {" "}
                  <div className="flex items-center justify-between gap-2">
                    {" "}
                    <span className="text-xs font-semibold text-blue-100 truncate">
                      {eleve ? `${eleve.nom} ${eleve.prenom}` : "Élève"}
                    </span>{" "}
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                      {inc.gravite || "Majeur"}
                    </span>{" "}
                  </div>{" "}
                  <p className="text-[11px] text-[#line-clamp-1">
                    {inc.motif}
                  </p>{" "}
                </div>
              );
            })}{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
}
