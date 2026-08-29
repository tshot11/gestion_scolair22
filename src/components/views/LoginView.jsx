import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, User, ArrowLeft, School, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

export function LoginView() {
  const { login, setCurrentView, data } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res && !res.success) {
        setError(res.error || 'Identifiants ou mot de passe incorrects.');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1736] text-white flex flex-col justify-center items-center px-4 py-8 relative overflow-y-auto">
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-400/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Header / Navigation with generous breathing room */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 px-1">
        <button 
          type="button"
          onClick={() => setCurrentView('landing')} 
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#12305A]/70 hover:bg-[#12305A] border border-[#94C5FF]/20 text-blue-200 hover:text-white text-xs font-semibold backdrop-blur-md transition-all shadow-md active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>Retour à l'accueil</span>
        </button>

        <div className="text-[11px] text-blue-300/60 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12305A]/40 border border-[#94C5FF]/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Connexion sécurisée</span>
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#12305A]/55 backdrop-blur-xl border border-[#94C5FF]/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <div className="flex flex-col items-center mb-6">
          {data?.ecoleConfig?.logo ? (
            <div className="w-20 h-20 mb-3 flex items-center justify-center">
              <img src={data.ecoleConfig.logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3 border border-blue-400/30">
              <School className="w-8 h-8 text-white" />
            </div>
          )}
          <h2 className="text-2xl font-black text-center tracking-tight text-white">Espace de Connexion</h2>
          <p className="text-xs text-blue-200/70 mt-1 text-center">
            Accédez à votre portail élève, enseignant ou administratif.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-blue-300 mb-1.5">
              Email ou Matricule scolaire
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/60" />
              <input 
                type="text" 
                value={email} 
                onChange={e => { setEmail(e.target.value); setError(''); }} 
                required 
                autoFocus
                className="w-full bg-[#0B1736]/70 border border-[#94C5FF]/20 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-400 placeholder:text-blue-200/30 transition" 
                placeholder="Votre email ou numéro matricule (ex: 2025-0001)" 
              />
            </div>
            <p className="text-[10px] text-blue-300/50 mt-1">
              Les élèves peuvent se connecter avec leur matricule ou leur email.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-blue-300 mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/60" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => { setPassword(e.target.value); setError(''); }} 
                required 
                className="w-full bg-[#0B1736]/70 border border-[#94C5FF]/20 rounded-xl py-2.5 pl-10 pr-10 text-white text-sm focus:outline-none focus:border-blue-400 placeholder:text-blue-200/30 transition" 
                placeholder="Votre mot de passe" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/60 hover:text-white focus:outline-none p-1 transition"
                title={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Vérification en cours...</span>
              </>
            ) : (
              <span>Se connecter</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#94C5FF]/10 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-blue-300/60">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Portail certifié & conforme aux normes du Ministère de l'EPST</span>
          </div>
        </div>
      </div>
    </div>
  );
}

