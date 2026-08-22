import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  User, 
  Phone, 
  Award, 
  Sparkles
} from 'lucide-react';

/**
 * Interactive Student Card with clean, stable accordion expansion (click-based).
 * Prevents grid row jumping by keeping stable base dimensions and click-controlled toggling.
 */
export function AnimatedStudentCard({ 
  eleve, 
  classe, 
  onViewDetail, 
  onGenerateCard,
  defaultExpanded = false
}) {
  const { data } = useApp();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Check today's pointage status
  const pointage = data.pointages?.find(p => p.eleve_id === eleve.id && p.date === '2026-08-20');
  const presenceStatus = pointage?.statut || 'non_pointe';

  // Calculate quick average if available
  const eleveResults = data.resultats?.filter(r => r.eleve_id === eleve.id) || [];
  const quickAverage = eleveResults.length > 0
    ? (eleveResults.reduce((acc, curr) => acc + curr.note, 0) / eleveResults.length).toFixed(1)
    : null;

  // Extract birth year
  const birthYear = eleve.date_naissance ? eleve.date_naissance.split('-')[0] : '2012';

  return (
    <div
      className={`rounded-2xl border transition-colors duration-200 overflow-hidden flex flex-col justify-between ${
        isExpanded
          ? 'bg-slate-800/90 border-blue-500/50 shadow-lg shadow-blue-950/30'
          : 'bg-slate-800/50 hover:bg-slate-800/80 border-slate-700/60 hover:border-slate-600 shadow-sm'
      }`}
    >
      {/* Top Accent Indicator */}
      <div 
        className={`h-1 w-full transition-colors duration-200 ${
          isExpanded ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400' : 'bg-transparent'
        }`} 
      />

      <div className="p-4">
        {/* Closed/Initial Preview Header: Name, Birthdate, Year, Class */}
        <div className="flex items-start justify-between gap-3">
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer select-none"
          >
            {/* Student Avatar */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-700 flex items-center justify-center text-white font-bold text-xs border border-slate-600/70 shadow-inner">
                {eleve.photo ? (
                  <img src={eleve.photo} alt={eleve.nom} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-heading tracking-wider">{eleve.prenom[0]}{eleve.nom[0]}</span>
                )}
              </div>

              {/* Status Badge Pin */}
              <div 
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                  presenceStatus === 'present' 
                    ? 'bg-emerald-500' 
                    : presenceStatus === 'absent' 
                    ? 'bg-rose-500' 
                    : presenceStatus === 'retard' 
                    ? 'bg-amber-500' 
                    : 'bg-slate-500'
                }`}
                title={`Statut: ${presenceStatus}`}
              />
            </div>

            {/* Main Identification */}
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-bold text-white font-heading truncate">
                {eleve.nom} {eleve.prenom}
              </h3>

              {/* Essential Line: Birthday & Class */}
              <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 mt-0.5 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1 font-mono text-slate-300">
                  <Calendar className="w-3 h-3 text-blue-400 shrink-0" />
                  <span>{eleve.date_naissance}</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-blue-300 font-medium truncate max-w-[120px]">{classe ? classe.nom : 'Classe'}</span>
              </div>
            </div>
          </div>

          {/* Right Tag & Accordion Toggle Icon */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              eleve.sexe === 'M' 
                ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30' 
                : 'bg-pink-500/15 text-pink-300 border border-pink-500/30'
            }`}>
              {eleve.sexe === 'M' ? 'G' : 'F'}
            </span>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition"
              aria-label="Déplier les détails"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-blue-400" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Compact Footer when Closed */}
        {!isExpanded && (
          <div className="mt-2.5 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-mono text-[10px] text-slate-400">Matricule: {eleve.matricule}</span>
            <button
              type="button"
              onClick={() => onViewDetail(eleve.id)}
              className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Dossier</span>
              <Eye className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* UNFOLDED ACCORDION CONTENT */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-700/70 space-y-2">
            {/* Extended Details Grid */}
            <div className="space-y-1.5 text-xs">
              {/* Date and Place of birth */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3 h-3 text-blue-400 shrink-0" />
                  <span>Naissance :</span>
                </span>
                <span className="text-slate-200 font-medium text-[11px] text-right truncate max-w-[150px]">
                  {eleve.date_naissance} ({eleve.lieu_naissance || 'Kinshasa'})
                </span>
              </div>

              {/* Tutor / Parent */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <User className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span>Tuteur :</span>
                </span>
                <span className="text-slate-200 font-medium text-[11px] truncate max-w-[150px] text-right">
                  {eleve.nom_parent || 'Non spécifié'}
                </span>
              </div>

              {/* Parent Contact */}
              {(eleve.telephone || eleve.email_parent) && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Contact :</span>
                  </span>
                  <span className="text-slate-300 font-mono text-[11px] text-right truncate max-w-[150px]">
                    {eleve.telephone || eleve.email_parent}
                  </span>
                </div>
              )}

              {/* Status & Academic Quick Badge */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Award className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Moyenne :</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {quickAverage && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-[10px]">
                      {quickAverage}/20
                    </span>
                  )}
                  <span className="text-[10px] text-slate-300 font-medium">
                    {eleve.est_boursier ? '🎓 Boursier' : eleve.est_orphelin ? '🕊️ Orphelin' : 'Régulier'}
                  </span>
                </div>
              </div>
            </div>

            {/* Unfolded Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onViewDetail(eleve.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Dossier & Cotes</span>
              </button>

              <button
                type="button"
                onClick={() => onGenerateCard(eleve)}
                className="p-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600/70 transition"
                title="Générer Carte d'Élève"
              >
                <CreditCard className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
