import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, ArrowLeft, School } from 'lucide-react';

export function LoginView() {
  const { login, setCurrentView } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1736] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      <button onClick={() => setCurrentView('landing')} className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 hover:bg-[#12305A]/70 text-sm font-medium transition-all">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <div className="w-full max-w-md bg-[#12305A]/45 backdrop-blur-xl border border-[#94C5FF]/15 rounded-2xl p-8 shadow-2xl relative">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-[14px] bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 mb-4">
            <School className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-center tracking-tight">Portail Sécurisé</h2>
          <p className="text-sm text-blue-200/70 mt-1">Connectez-vous pour accéder à votre espace.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-blue-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="votre@email.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-300 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.99]">
            Se connecter
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#94C5FF]/15 text-center space-y-2">
          <p className="text-xs text-blue-200/50">Comptes de test (mot de passe: "test"):</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-[10px] px-2 py-1 bg-blue-500/10 rounded border border-[#94C5FF]/15 text-blue-300">admin@ecole.cd</span>
            <span className="text-[10px] px-2 py-1 bg-blue-500/10 rounded border border-[#94C5FF]/15 text-blue-300">prof@ecole.cd</span>
            <span className="text-[10px] px-2 py-1 bg-blue-500/10 rounded border border-[#94C5FF]/15 text-blue-300">parent@ecole.cd</span>
          </div>
        </div>
      </div>
    </div>
  );
}
