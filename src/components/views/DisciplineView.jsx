import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  X, 
  Search,
  UserX
} from 'lucide-react';

export function DisciplineView() {
  const { data, addIncident, closeIncident, setCurrentView, setSelectedEleveId } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    eleve_id: data.eleves[0]?.id || 1,
    type: 'avertissement',
    description: '',
    sanction: '',
    rapporte_par: 'Préfet des Études'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description) return;
    addIncident(form);
    setIsModalOpen(false);
    setForm({
      eleve_id: data.eleves[0]?.id || 1,
      type: 'avertissement',
      description: '',
      sanction: '',
      rapporte_par: 'Préfet des Études'
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
            Discipline & Registre des Sanctions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Suivi des conduites scolaires, avertissements et décisions du conseil
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Consigner un Incident
        </button>
      </div>

      {/* Incidents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.incidents.map((inc) => {
          const eleve = data.eleves.find(e => e.id === inc.eleve_id);
          const classe = eleve ? data.classes.find(c => c.id === eleve.classe_id) : null;
          const isClosed = !!inc.date_cloture;

          return (
            <div
              key={inc.id}
              className="bg-slate-800/50 rounded-3xl border border-slate-700/60 p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-heading">
                        {eleve ? `${eleve.nom} ${eleve.prenom}` : 'Élève'}
                      </h3>
                      <div className="text-[11px] text-slate-400">
                        {classe?.nom} • {inc.date}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isClosed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {isClosed ? 'Régularisé' : inc.type}
                  </span>
                </div>

                <p className="text-xs text-slate-200 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                  {inc.description}
                </p>

                <div className="text-xs text-amber-300 bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
                  <strong className="block text-[10px] uppercase text-amber-400 mb-0.5">Sanction / Mesure :</strong>
                  {inc.sanction}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 text-xs text-slate-400">
                <span>Rapporté par : <strong>{inc.rapporte_par}</strong></span>
                {!isClosed ? (
                  <button
                    onClick={() => closeIncident(inc.id)}
                    className="px-3 py-1 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white font-semibold transition border border-emerald-500/30"
                  >
                    Clôturer dossier
                  </button>
                ) : (
                  <span className="text-emerald-400 font-mono text-[10px]">Clôturé le {inc.date_cloture}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: New Incident */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-heading">Consigner un Incident Disciplinaire</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Élève concerné *</label>
                <select
                  value={form.eleve_id}
                  onChange={(e) => setForm({ ...form, eleve_id: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {data.eleves.map(e => (
                    <option key={e.id} value={e.id}>{e.nom} {e.prenom} ({e.matricule})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Type de sanction</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="avertissement">Avertissement verbal / écrit</option>
                  <option value="blâme">Blâme officiel</option>
                  <option value="retenue">Retenue / Consigne</option>
                  <option value="exclusion_temporaire">Exclusion temporaire (1-3 jours)</option>
                  <option value="exclusion_definitive">Exclusion définitive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description des faits *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Circonstances, lieu, comportement..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sanction / Mesure réparatrice *</label>
                <input
                  type="text"
                  required
                  value={form.sanction}
                  onChange={(e) => setForm({ ...form, sanction: e.target.value })}
                  placeholder="Ex: Travail d'intérêt général et convocation des parents"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition"
                >
                  Enregistrer l'Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
