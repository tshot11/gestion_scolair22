const fs = require('fs');
let code = fs.readFileSync('./src/components/views/DashboardView.jsx', 'utf8');

const replacement = `<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
        </div>`;

code = code.replace(/<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, replacement + '\n      </div>\n    </div>');

fs.writeFileSync('./src/components/views/DashboardView.jsx', code, 'utf8');
