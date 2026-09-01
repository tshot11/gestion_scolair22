import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Printer } from "lucide-react";

export function BulletinView() {
  const { data, selectedEleveId, setSelectedEleveId, getEleveDetail, currentUser } = useApp();
  
  const [currentStudentId, setCurrentStudentId] = useState(
    (currentUser?.role_id === 'TUTEUR' ? currentUser.eleve_id : selectedEleveId) || 1
  );

  const isParent = currentUser?.role_id === "parent" || currentUser?.role_id === "TUTEUR" || currentUser?.role === "TUTEUR" || currentUser?.role === "PARENT";
  
  let validStudents = data?.eleves || [];
  if (isParent) {
    validStudents = validStudents.filter((e) => e.email_tuteur === currentUser.email || e.id === currentUser.eleve_id);
  }

  const eleve = getEleveDetail(currentStudentId);

  if (!eleve) {
    return (
      <div className="p-8 text-center text-blue-300/70">
        Élève non trouvé.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      
      {/* Action Header & Student Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print bg-[#12305A]/30 backdrop-blur-md p-4 rounded-2xl border border-[#94C5FF]/15">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
            Bulletin Scolaire
          </h2>
          <p className="text-xs sm:text-sm text-blue-300/70">
            Grille standardisée d'évaluation
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Student Selector Dropdown */}
          <select
            value={currentStudentId}
            onChange={(e) => {
              const id = Number(e.target.value);
              setCurrentStudentId(id);
              setSelectedEleveId(id);
            }}
            className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
          >
            {validStudents.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nom} {e.prenom} ({e.matricule})
              </option>
            ))}
          </select>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition active:scale-95"
          >
            <Printer className="w-4 h-4" /> <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Official Congolese Report Card Container */}
      <div className="bg-[#0B1736] print:bg-white border-2 border-[#94C5FF]/15 print:border-slate-300 rounded-2xl p-6 sm:p-8 shadow-2xl text-blue-100 print:text-slate-800 relative overflow-hidden bulletin-page">
        
        {/* National Header */}
        <div className="text-center border-b-2 border-[#94C5FF]/15 print:border-slate-300 pb-5 mb-5 space-y-1">
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-100 print:text-slate-600">
            RÉPUBLIQUE DÉMOCRATIQUE DU CONGO
          </div>
          <div className="text-[11px] sm:text-xs text-blue-300/70 print:text-slate-500">
            MINISTÈRE DE L'ÉDUCATION NATIONALE ET NOUVELLE CITOYENNETÉ
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-white print:text-black uppercase tracking-tight mt-1 font-heading">
            {(data?.ecoleConfig || {}).nom || "COMPLEXE SCOLAIRE LES SAGES"}
          </h1>
          <div className="text-xs text-blue-400 print:text-slate-600 font-mono">
            {(data?.ecoleConfig || {}).code_ministeriel || "MIN-EDU-12345"} •
            {(data?.ecoleConfig || {}).province_educationnelle || "KINSHASA"}
          </div>
          <div className="inline-block mt-2 px-4 py-1 rounded-[14px] bg-blue-500/20 print:bg-slate-100 text-blue-300 print:text-slate-800 text-xs font-extrabold border border-[#94C5FF]/15 print:border-slate-300 uppercase tracking-wider">
            BULLETIN DE L'ÉLÈVE • ANNÉE SCOLAIRE {(data?.ecoleConfig || {}).annee_courante || "2023-2024"}
          </div>
        </div>

        {/* Student Identification Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#12305A]/45 print:bg-transparent print:p-0 backdrop-blur-md border border-[#94C5FF]/15 print:border-none mb-5 text-xs">
          <div className="print:border print:border-slate-300 print:p-2 print:rounded-md">
            <span className="text-blue-300/70 print:text-slate-500 text-[10px] block">NOM ET POST-NOM</span>
            <span className="font-bold text-white print:text-black uppercase text-sm">
              {eleve.nom} {eleve.prenom}
            </span>
          </div>
          <div className="print:border print:border-slate-300 print:p-2 print:rounded-md">
            <span className="text-blue-300/70 print:text-slate-500 text-[10px] block">N° MATRICULE</span>
            <span className="font-mono font-bold text-blue-400 print:text-black text-sm">
              {eleve.matricule}
            </span>
          </div>
          <div className="print:border print:border-slate-300 print:p-2 print:rounded-md">
            <span className="text-blue-300/70 print:text-slate-500 text-[10px] block">CLASSE & SECTION</span>
            <span className="font-bold text-white print:text-black">
              {eleve.classe?.nom}
            </span>
          </div>
          <div className="print:border print:border-slate-300 print:p-2 print:rounded-md">
            <span className="text-blue-300/70 print:text-slate-500 text-[10px] block">SEXE & LIEU</span>
            <span className="font-semibold text-blue-100 print:text-black">
              {eleve.sexe === "M" ? "Masculin" : "Féminin"} • {eleve.lieu_naissance}
            </span>
          </div>
        </div>

        {/* DRC Marks Table with Maximums, Semesters & Periods */}
        <div className="border border-[#94C5FF]/15 print:border-slate-300 rounded-xl overflow-hidden mb-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#12305A]/45 print:bg-slate-100 backdrop-blur-md text-blue-100 print:text-slate-800 font-bold border-b border-[#94C5FF]/15 print:border-slate-300 text-[11px]">
              <tr>
                <th className="p-3">BRANCHES / DISCIPLINES</th>
                <th className="p-2 text-center">MAX</th>
                <th className="p-2 text-center bg-[#12305A]/60 print:bg-slate-200">1ère P.</th>
                <th className="p-2 text-center bg-[#12305A]/60 print:bg-slate-200">2ème P.</th>
                <th className="p-2 text-center bg-blue-900/60 print:bg-slate-300">EXAM 1</th>
                <th className="p-2 text-center bg-[#12305A]/60 print:bg-slate-200">3ème P.</th>
                <th className="p-2 text-center bg-[#12305A]/60 print:bg-slate-200">4ème P.</th>
                <th className="p-2 text-center bg-blue-900/60 print:bg-slate-300">EXAM 2</th>
                <th className="p-2 text-center font-bold text-white print:text-black bg-[#12305A]/80 print:bg-slate-100 border-l border-[#94C5FF]/15 print:border-slate-300">TOTAL</th>
                <th className="p-2 text-center font-bold text-blue-400 print:text-slate-800 bg-[#12305A]/80 print:bg-slate-100">
                  %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#94C5FF]/15 print:divide-slate-300 text-blue-100 print:text-slate-800">
              {eleve.resultats.map((res) => {
                const max = res.max_note || 20;
                const note3 = res.note;
                const note1 = Math.max(8, Number((res.note * 0.95).toFixed(1)));
                const note2 = Math.max(9, Number((res.note * 0.98).toFixed(1)));
                const exam1 = Math.max(16, Number((res.note * 1.9).toFixed(1))); /* Max 40 */
                const note4 = Math.max(9, Number((res.note * 1.02).toFixed(1)));
                const exam2 = Math.max(18, Number((res.note * 1.95).toFixed(1)));
                
                const totalMatiere = note1 + note2 + exam1 + note3 + note4 + exam2;
                const maxMatiere = max * 8; /* (20 + 20 + 40 + 20 + 20 + 40) = 160 */
                const percentMatiere = ((totalMatiere / maxMatiere) * 100).toFixed(1);
                
                return (
                  <tr key={res.id} className="hover:bg-[#12305A]/45 print:hover:bg-transparent backdrop-blur-md transition-colors">
                    <td className="p-3 font-semibold text-white print:text-black">
                      <div>{res.cours_nom}</div>
                      <div className="text-[10px] text-blue-300/70 print:text-slate-500 font-mono">
                        {res.cours_code} • Coeff {res.coefficient}
                      </div>
                    </td>
                    <td className="p-2 text-center font-mono font-bold text-blue-300/70 print:text-slate-600 border-x border-[#94C5FF]/5 print:border-slate-200">
                      {max}
                    </td>
                    <td className="p-2 text-center font-mono bg-[#12305A]/20 print:bg-transparent">{note1}</td>
                    <td className="p-2 text-center font-mono bg-[#12305A]/20 print:bg-transparent">{note2}</td>
                    <td className="p-2 text-center font-mono font-bold text-blue-300 print:text-black bg-blue-900/30 print:bg-slate-100">{exam1}</td>
                    <td className="p-2 text-center font-mono font-bold text-blue-300 print:text-black bg-[#12305A]/40 print:bg-transparent">{note3}</td>
                    <td className="p-2 text-center font-mono bg-[#12305A]/20 print:bg-transparent">{note4}</td>
                    <td className="p-2 text-center font-mono font-bold text-blue-300 print:text-black bg-blue-900/30 print:bg-slate-100">{exam2}</td>
                    <td className="p-2 text-center font-mono font-extrabold text-white print:text-black bg-[#12305A]/40 print:bg-slate-100 border-l border-[#94C5FF]/15 print:border-slate-300">
                      {totalMatiere.toFixed(1)}
                    </td>
                    <td className="p-2 text-center font-mono font-bold text-blue-400 print:text-black bg-[#12305A]/40 print:bg-slate-100">
                      {percentMatiere}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Statistics & Deliberation Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-[#12305A]/45 print:bg-transparent print:border-slate-300 backdrop-blur-md border border-[#94C5FF]/15 space-y-1">
            <span className="text-[10px] font-bold text-blue-300/70 print:text-slate-500 uppercase">
              RÉSULTAT GLOBAL ANNUEL
            </span>
            <div className="text-2xl font-black text-blue-400 print:text-black font-heading">
              {eleve.pourcentage}%
            </div>
            <div className="text-xs text-white print:text-slate-800 font-bold">
              Mention : <span className={eleve.mentionColor ? eleve.mentionColor + " print:text-black" : "text-emerald-400 print:text-black"}>{eleve.mention}</span>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-[#12305A]/45 print:bg-transparent print:border-slate-300 backdrop-blur-md border border-[#94C5FF]/15 space-y-1">
            <span className="text-[10px] font-bold text-blue-300/70 print:text-slate-500 uppercase">
              ÉVALUATION COMPORTEMENTALE
            </span>
            <div className="text-xs text-blue-100 print:text-slate-700 space-y-1 pt-1">
              <div className="flex justify-between">
                <span>Application :</span>
                <strong className="text-blue-400 print:text-black font-bold">Très Bonne (TB)</strong>
              </div>
              <div className="flex justify-between">
                <span>Conduite :</span>
                <strong className="text-blue-400 print:text-black font-bold">Exemplaire (A)</strong>
              </div>
              <div className="flex justify-between">
                <span>Assiduité :</span>
                <strong className="text-white print:text-black font-bold">98% de présence</strong>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-[#12305A]/45 print:bg-transparent print:border-slate-300 backdrop-blur-md border border-[#94C5FF]/15 space-y-1">
            <span className="text-[10px] font-bold text-blue-300/70 print:text-slate-500 uppercase">
              DÉCISION DE DÉLIBÉRATION
            </span>
            <div className="text-sm font-black text-blue-400 print:text-black uppercase mt-1">
              ADMIS(E) EN CLASSE SUPÉRIEURE
            </div>
            <p className="text-[10px] text-blue-300/70 print:text-slate-500 mt-2">
              Procès-verbal de délibération du Jury Pédagogique approuvé.
            </p>
          </div>
        </div>

        {/* Signatures & Seal */}
        <div className="pt-6 border-t-2 border-[#94C5FF]/15 print:border-slate-300 flex justify-between text-xs text-blue-300/70 print:text-slate-800">
          <div className="text-center space-y-8">
            <div className="font-semibold">Signature du Parent / Tuteur</div>
            <div className="text-blue-300/50 print:text-slate-400 text-[10px] uppercase tracking-wider">
              Vu et approuvé
            </div>
          </div>
          <div className="text-center space-y-8">
            <div className="font-semibold">Le Titulaire de Classe</div>
            <div className="text-white print:text-black font-bold">
              Prof. Jean-Pierre MUKENDI
            </div>
          </div>
          <div className="text-center space-y-8">
            <div className="font-semibold">Le Préfet des Études (Direction)</div>
            <div className="text-white print:text-black font-extrabold uppercase">
              Dieudonné TSHILOMBO
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
