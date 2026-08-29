import React from "react";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, ChevronRight, UserX, Building, School } from "lucide-react";

export function ClassAlertsBanner({ alerts = [], onSelectClass, onSelectRoom }) {
  if (!alerts || alerts.length === 0) return null;

  const dangerAlerts = alerts.filter((a) => a.type === "danger");
  const warningAlerts = alerts.filter((a) => a.type === "warning");
  const infoAlerts = alerts.filter((a) => a.type === "info");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          Alertes Pédagogiques & Capacités ({alerts.length})
        </h4>
        <div className="flex items-center gap-2 text-[11px]">
          {dangerAlerts.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
              {dangerAlerts.length} critique(s)
            </span>
          )}
          {warningAlerts.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
              {warningAlerts.length} attention
            </span>
          )}
          {infoAlerts.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
              {infoAlerts.length} information(s)
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {alerts.slice(0, 6).map((alert) => {
          const isDanger = alert.type === "danger";
          const isWarning = alert.type === "warning";

          return (
            <div
              key={alert.id}
              className={`p-3 rounded-xl border backdrop-blur-md flex items-start justify-between gap-2.5 transition ${
                isDanger
                  ? "bg-rose-950/40 border-rose-500/40 text-rose-200"
                  : isWarning
                  ? "bg-amber-950/40 border-amber-500/40 text-amber-200"
                  : "bg-blue-950/40 border-blue-500/40 text-blue-200"
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    isDanger
                      ? "bg-rose-500/20 text-rose-400"
                      : isWarning
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {isDanger ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : isWarning ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                      {alert.category}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-white truncate mt-0.5">
                    {alert.title}
                  </h5>
                  <p className="text-[11px] opacity-80 line-clamp-2 mt-0.5 leading-relaxed">
                    {alert.message}
                  </p>
                </div>
              </div>

              {(alert.classId || alert.roomId) && (
                <button
                  type="button"
                  onClick={() => {
                    if (alert.classId && onSelectClass) onSelectClass(alert.classId);
                    if (alert.roomId && onSelectRoom) onSelectRoom(alert.roomId);
                  }}
                  className="shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white transition self-center"
                  title="Voir les détails"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
