import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Settings,
  School,
  Smartphone,
  Database,
  RefreshCw,
  Download,
  CheckCircle2,
  DollarSign,
  Sparkles,
} from "lucide-react";
export function SettingsView() {
  const {
    data,
    updateEcoleConfig,
    resetToInitialData,
    isMobileSimulator,
    setIsMobileSimulator,
    showToast,
  } = useApp();
  const [configForm, setConfigForm] = useState({
    nom: data.ecoleConfig.nom,
    code_ministeriel: data.ecoleConfig.code_ministeriel,
    province_educationnelle: data.ecoleConfig.province_educationnelle,
    annee_courante: data.ecoleConfig.annee_courante,
    periode_active: data.ecoleConfig.periode_active,
    taux_change_usd: data.ecoleConfig.taux_change_usd,
  });
  const handleSaveConfig = (e) => {
    e.preventDefault();
    updateEcoleConfig({
      ...configForm,
      taux_change_usd: Number(configForm.taux_change_usd),
    });
  };
  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `ecole_rdc_backup_${new Date().toISOString().slice(0, 10)}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Base de données exportée en JSON avec succès !");
  };
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto pb-24 sm:pb-8">
      {" "}
      {/* Header */}{" "}
      <div>
        {" "}
        <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
          {" "}
          Paramètres & Configuration de l'Établissement{" "}
        </h2>{" "}
        <p className="text-xs sm:text-sm text-[#F5F9FF]0">
          {" "}
          Personnalisation des informations légales RDC, taux de change et
          sauvegarde{" "}
        </p>{" "}
      </div>{" "}
      {/* School Legal Config Card */}{" "}
      <div className="bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/40 rounded-2xl border border-[#94C5FF]/15/60 p-6 space-y-4">
        {" "}
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#94C5FF]/15/60">
          {" "}
          <School className="w-5 h-5 text-blue-400" />{" "}
          <h3 className="text-sm font-bold text-white font-heading">
            {" "}
            Informations Officielles du Complexe Scolaire{" "}
          </h3>{" "}
        </div>{" "}
        <form onSubmit={handleSaveConfig} className="space-y-4">
          {" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nom de l'Établissement
              </label>{" "}
              <input
                type="text"
                required
                value={configForm.nom}
                onChange={(e) =>
                  setConfigForm({ ...configForm, nom: e.target.value })
                }
                className="w-full bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Code Ministériel (SECOPE / EPST)
              </label>{" "}
              <input
                type="text"
                required
                value={configForm.code_ministeriel}
                onChange={(e) =>
                  setConfigForm({
                    ...configForm,
                    code_ministeriel: e.target.value,
                  })
                }
                className="w-full bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Province Éducationnelle
              </label>{" "}
              <input
                type="text"
                required
                value={configForm.province_educationnelle}
                onChange={(e) =>
                  setConfigForm({
                    ...configForm,
                    province_educationnelle: e.target.value,
                  })
                }
                className="w-full bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Année Scolaire en cours
              </label>{" "}
              <input
                type="text"
                required
                value={configForm.annee_courante}
                onChange={(e) =>
                  setConfigForm({
                    ...configForm,
                    annee_courante: e.target.value,
                  })
                }
                className="w-full bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Période Active
              </label>{" "}
              <input
                type="text"
                required
                value={configForm.periode_active}
                onChange={(e) =>
                  setConfigForm({
                    ...configForm,
                    periode_active: e.target.value,
                  })
                }
                className="w-full bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Taux de Change (1 USD en Francs Congolais)
              </label>{" "}
              <input
                type="number"
                required
                value={configForm.taux_change_usd}
                onChange={(e) =>
                  setConfigForm({
                    ...configForm,
                    taux_change_usd: e.target.value,
                  })
                }
                className="w-full bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-blue-400 font-mono font-bold focus:outline-none focus:border-blue-500"
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex justify-end pt-2">
            {" "}
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition active:scale-95"
            >
              {" "}
              Enregistrer les Modifications{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
      {/* Simulator Mode & Mobile View */}{" "}
      <div className="bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/40 rounded-2xl border border-[#94C5FF]/15/60 p-6 space-y-4">
        {" "}
        <div className="flex items-center justify-between">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              {" "}
              <Smartphone className="w-5 h-5" />{" "}
            </div>{" "}
            <div>
              {" "}
              <h3 className="text-sm font-bold text-white font-heading">
                Simulateur Mobile / Mode Écran Réduit
              </h3>{" "}
              <p className="text-xs text-[#F5F9FF]0">
                Tester l'ergonomie tactile mobile et les menus déroulants
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <button
            onClick={() => setIsMobileSimulator(!isMobileSimulator)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${isMobileSimulator ? "bg-blue-600 text-white" : "bg-[#12305A]/45 backdrop-blur-md text-slate-700 hover:bg-blue-500/20"}`}
          >
            {" "}
            {isMobileSimulator
              ? "Mode Mobile Activé"
              : "Mode Mobile Désactivé"}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Database Backup & Reset */}{" "}
      <div className="bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/40 rounded-2xl border border-[#94C5FF]/15/60 p-6 space-y-4">
        {" "}
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#94C5FF]/15/60">
          {" "}
          <Database className="w-5 h-5 text-purple-400" />{" "}
          <h3 className="text-sm font-bold text-white font-heading">
            {" "}
            Gestion des Données & Sauvegarde{" "}
          </h3>{" "}
        </div>{" "}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {" "}
          <div className="text-xs text-slate-700">
            {" "}
            Exportez l'intégralité des données (élèves, cotes, paiements,
            présences) au format JSON ou restaurez les données d'origine.{" "}
          </div>{" "}
          <div className="flex items-center gap-3 shrink-0">
            {" "}
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12305A]/45 backdrop-blur-md hover:bg-blue-500/20 text-[#F5F9FF] font-bold text-xs border border-[#94C5FF]/15 transition"
            >
              {" "}
              <Download className="w-4 h-4" /> Exporter JSON{" "}
            </button>{" "}
            <button
              onClick={() => {
                if (true) {
                  resetToInitialData();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-xs border border-blue-500/30 transition"
            >
              {" "}
              <RefreshCw className="w-4 h-4" /> Réinitialiser{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
