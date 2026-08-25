import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Award,
  Printer,
  ChevronLeft,
  ChevronRight,
  Users,
  Download,
  CheckCircle2,
  Sparkles,
  School,
} from "lucide-react";
export function BulletinView() {
  const { data, selectedEleveId, setSelectedEleveId, getEleveDetail, currentUser } = useApp();
  const [currentStudentId, setCurrentStudentId] = useState(
    (currentUser?.role_id === 'TUTEUR' ? currentUser.eleve_id : selectedEleveId) || 1
  );
  const eleve = getEleveDetail(currentStudentId);
  if (!eleve) {
    return (
      <div className="p-8 text-center text-[#F5F9FF]0">
        Élève non trouvé.
      </div>
    );
  }
  const coursList = data.cours.filter((c) => {
    return (
      c.niveau_id === eleve.classe?.niveau_id ||
      c.option_id === eleve.classe?.option_id ||
      !c.option_id
    );
  });
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto pb-24 sm:pb-8">
      {" "}
      {/* Action Header & Student Switcher */}{" "}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        {" "}
        <div>
          {" "}
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
            {" "}
            Bulletin Scolaire Officiel RDC{" "}
          </h2>{" "}
          <p className="text-xs sm:text-sm text-[#F5F9FF]0">
            {" "}
            Grille standardisée d'évaluation conforme aux normes du Ministère de
            l'EPST / RDC{" "}
          </p>{" "}
        </div>{" "}
        <div className="flex items-center gap-3">
          {" "}
          {/* Student Selector Dropdown */}{" "}
          <select
            value={currentStudentId}
            onChange={(e) => {
              const id = Number(e.target.value);
              setCurrentStudentId(id);
              setSelectedEleveId(id);
            }}
            className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {" "}
            {data.eleves.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nom} {e.prenom} ({e.matricule})
              </option>
            ))}{" "}
          </select>{" "}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition active:scale-95"
          >
            {" "}
            <Printer className="w-4 h-4" /> <span>Imprimer Bulletin</span>{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Official Congolese Report Card Container */}{" "}
      <div className="bg-slate-50 B1736] border-2 border-[#94C5FF]/15 rounded-2xl p-6 sm:p-8 shadow-2xl text-[#F5F9FF] relative overflow-hidden bulletin-page">
        {" "}
        {/* National Header */}{" "}
        <div className="text-center border-b-2 border-[#94C5FF]/15 pb-5 mb-5 space-y-1">
          {" "}
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-700">
            {" "}
            RÉPUBLIQUE DÉMOCRATIQUE DU CONGO{" "}
          </div>{" "}
          <div className="text-[11px] sm:text-xs text-[#F5F9FF]0">
            {" "}
            MINISTÈRE DE L'ÉDUCATION NATIONALE ET NOUVELLE CITOYENNETÉ{" "}
          </div>{" "}
          <h1 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight mt-1 font-heading">
            {" "}
            {data.ecoleConfig.nom}{" "}
          </h1>{" "}
          <div className="text-xs text-blue-400 font-mono">
            {" "}
            {data.ecoleConfig.code_ministeriel} •{" "}
            {data.ecoleConfig.province_educationnelle}{" "}
          </div>{" "}
          <div className="inline-block mt-2 px-4 py-1 rounded-[14px] bg-blue-500/20 text-blue-300 text-xs font-extrabold border border-[#94C5FF]/15 uppercase tracking-wider">
            {" "}
            BULLETIN DE L'ÉLÈVE • ANNÉE SCOLAIRE{" "}
            {data.ecoleConfig.annee_courante}{" "}
          </div>{" "}
        </div>{" "}
        {/* Student Identification Grid */}{" "}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md/80 border border-[#94C5FF]/15 mb-5 text-xs">
          {" "}
          <div>
            {" "}
            <span className="text-[#text-[10px] block">
              NOM ET POST-NOM
            </span>{" "}
            <span className="font-bold text-white uppercase text-sm">
              {eleve.nom} {eleve.prenom}
            </span>{" "}
          </div>{" "}
          <div>
            {" "}
            <span className="text-[#text-[10px] block">
              N° MATRICULE
            </span>{" "}
            <span className="font-mono font-bold text-blue-400 text-sm">
              {eleve.matricule}
            </span>{" "}
          </div>{" "}
          <div>
            {" "}
            <span className="text-[#text-[10px] block">
              CLASSE & SECTION
            </span>{" "}
            <span className="font-bold text-white">
              {eleve.classe?.nom}
            </span>{" "}
          </div>{" "}
          <div>
            {" "}
            <span className="text-[#text-[10px] block">
              SEXE & LIEU DE NAISSANCE
            </span>{" "}
            <span className="font-semibold text-[#F5F9FF]">
              {eleve.sexe === "M" ? "Masculin" : "Féminin"} •{" "}
              {eleve.lieu_naissance}
            </span>{" "}
          </div>{" "}
        </div>{" "}
        {/* DRC Marks Table with Maximums, Semesters & Periods */}{" "}
        <div className="border border-[#94C5FF]/15 rounded-2xl overflow-hidden mb-6">
          {" "}
          <table className="w-full text-left text-xs">
            {" "}
            <thead className="bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md text-slate-700 font-bold border-b border-[#94C5FF]/15 text-[11px]">
              {" "}
              <tr>
                {" "}
                <th className="p-3">BRANCHES / DISCIPLINES</th>{" "}
                <th className="p-2 text-center">MAX</th>{" "}
                <th className="p-2 text-center bg-blue-950/40">1ère P.</th>{" "}
                <th className="p-2 text-center bg-blue-950/40">2ème P.</th>{" "}
                <th className="p-2 text-center bg-indigo-950/40">EXAM 1</th>{" "}
                <th className="p-2 text-center bg-blue-950/40">3ème P.</th>{" "}
                <th className="p-2 text-center bg-blue-950/40">4ème P.</th>{" "}
                <th className="p-2 text-center bg-indigo-950/40">EXAM 2</th>{" "}
                <th className="p-2 text-center font-bold text-white">TOTAL</th>{" "}
                <th className="p-2 text-center font-bold text-blue-400">
                  %
                </th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody className="divide-y divide-blue-500/20 text-slate-700">
              {" "}
              {eleve.resultats.map((res) => {
                const max = res.max_note || 20;
                const note3 = res.note;
                const note1 = Math.max(8, Number((res.note * 0.95).toFixed(1)));
                const note2 = Math.max(9, Number((res.note * 0.98).toFixed(1)));
                const exam1 = Math.max(
                  16,
                  Number((res.note * 1.9).toFixed(1)),
                ); /* Max 40 for Exam */
                const note4 = Math.max(9, Number((res.note * 1.02).toFixed(1)));
                const exam2 = Math.max(
                  18,
                  Number((res.note * 1.95).toFixed(1)),
                );
                const totalMatiere =
                  note1 + note2 + exam1 + note3 + note4 + exam2;
                const maxMatiere =
                  max * 8; /* (20 + 20 + 40 + 20 + 20 + 40) = 160 */
                const percentMatiere = (
                  (totalMatiere / maxMatiere) *
                  100
                ).toFixed(1);
                return (
                  <tr
                    key={res.id}
                    className="hover:bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md/60"
                  >
                    {" "}
                    <td className="p-3 font-semibold text-white">
                      {" "}
                      <div>{res.cours_nom}</div>{" "}
                      <div className="text-[10px] text-[#font-mono">
                        {res.cours_code} • Coeff {res.coefficient}
                      </div>{" "}
                    </td>{" "}
                    <td className="p-2 text-center font-mono font-bold text-[#F5F9FF]0">
                      {max}
                    </td>{" "}
                    <td className="p-2 text-center font-mono bg-blue-950/20">
                      {note1}
                    </td>{" "}
                    <td className="p-2 text-center font-mono bg-blue-950/20">
                      {note2}
                    </td>{" "}
                    <td className="p-2 text-center font-mono font-bold text-blue-300 bg-indigo-950/20">
                      {exam1}
                    </td>{" "}
                    <td className="p-2 text-center font-mono font-bold text-blue-300 bg-blue-950/30">
                      {note3}
                    </td>{" "}
                    <td className="p-2 text-center font-mono bg-blue-950/20">
                      {note4}
                    </td>{" "}
                    <td className="p-2 text-center font-mono font-bold text-blue-300 bg-indigo-950/20">
                      {exam2}
                    </td>{" "}
                    <td className="p-2 text-center font-mono font-extrabold text-white">
                      {totalMatiere.toFixed(1)}
                    </td>{" "}
                    <td className="p-2 text-center font-mono font-bold text-blue-400">
                      {percentMatiere}%
                    </td>{" "}
                  </tr>
                );
              })}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
        {/* Summary Statistics & Deliberation Section */}{" "}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {" "}
          <div className="p-4 rounded-2xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 space-y-1">
            {" "}
            <span className="text-[10px] font-bold text-[#uppercase">
              RÉSULTAT GLOBAL ANNUEL
            </span>{" "}
            <div className="text-2xl font-black text-blue-400 font-heading">
              {" "}
              {eleve.pourcentage}%{" "}
            </div>{" "}
            <div className="text-xs text-white font-bold">
              {" "}
              Mention :{" "}
              <span className={eleve.mentionColor}>{eleve.mention}</span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-4 rounded-2xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 space-y-1">
            {" "}
            <span className="text-[10px] font-bold text-[#uppercase">
              ÉVALUATION COMPORTEMENTALE
            </span>{" "}
            <div className="text-xs text-slate-700 space-y-1 pt-1">
              {" "}
              <div>
                Application :{" "}
                <strong className="text-blue-400 font-bold">
                  Très Bonne (TB)
                </strong>
              </div>{" "}
              <div>
                Conduite :{" "}
                <strong className="text-blue-400 font-bold">
                  Exemplaire (A)
                </strong>
              </div>{" "}
              <div>
                Assiduité :{" "}
                <strong className="text-white">98% de présence</strong>
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-4 rounded-2xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 space-y-1">
            {" "}
            <span className="text-[10px] font-bold text-[#uppercase">
              DÉCISION DE DÉLIBÉRATION
            </span>{" "}
            <div className="text-sm font-black text-blue-400 uppercase mt-1">
              {" "}
              ADMIS(E) EN CLASSE SUPÉRIEURE{" "}
            </div>{" "}
            <p className="text-[10px] text-[#F5F9FF]0">
              {" "}
              Procès-verbal de délibération du Jury Pédagogique approuvé.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* Signatures & Seal */}{" "}
        <div className="pt-6 border-t-2 border-[#94C5FF]/15 flex justify-between text-xs text-[#F5F9FF]0">
          {" "}
          <div className="text-center space-y-8">
            {" "}
            <div>Signature du Parent / Tuteur</div>{" "}
            <div className="text-[#text-[10px]">
              Vu et approuvé
            </div>{" "}
          </div>{" "}
          <div className="text-center space-y-8">
            {" "}
            <div>Le Titulaire de Classe</div>{" "}
            <div className="text-white font-bold">
              Prof. Jean-Pierre MUKENDI
            </div>{" "}
          </div>{" "}
          <div className="text-center space-y-8">
            {" "}
            <div>Le Préfet des Études (Direction)</div>{" "}
            <div className="text-white font-extrabold uppercase">
              Dieudonné TSHILOMBO
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
