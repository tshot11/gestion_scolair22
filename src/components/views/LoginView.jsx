import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle,
  School,
  ArrowLeft,
  Mail,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Modal, Button } from '../ui';

export function LoginView() {
  const { login, setCurrentView, data, showToast } = useApp();

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot Password Modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // SSO Info Modal
  const [ssoProvider, setSsoProvider] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Veuillez saisir votre adresse e-mail ou votre nom d\'utilisateur.');
      return;
    }

    if (!password) {
      setErrorMessage('Veuillez saisir votre mot de passe.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(identifier.trim(), password);
      setIsLoading(false);

      if (result && result.success) {
        setErrorMessage('');
      } else {
        setErrorMessage(
          result?.error || 'Identifiants incorrects. Veuillez vérifier votre identifiant et votre mot de passe.'
        );
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('Erreur lors de la connexion au serveur.');
    }
  };

  const handleOAuthClick = (providerName) => {
    setSsoProvider(providerName);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSuccess(true);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotSuccess(false);
        setForgotEmail('');
        showToast('Un e-mail de réinitialisation vous a été envoyé.', 'success');
      }, 1500);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Deep Blue Ambient Atmospheric Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Top Bar / Navigation Return */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between py-2 z-10">
        <button
          type="button"
          onClick={() => setCurrentView('landing')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 text-xs font-medium text-slate-400 hover:text-slate-200 transition-all duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Accueil de l'école</span>
        </button>

        <span className="text-[11px] font-mono text-slate-400">
          Session {data?.ecoleConfig?.annee_courante || '2025-2026'}
        </span>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-[440px] mx-auto w-full my-auto py-6 z-10">
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 backdrop-blur-xl transition-all duration-300">
          {/* 1. Logo */}
          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-blue-700 shadow-xl ring-4 ring-white/10 shrink-0">
                <School className="w-10 h-10" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            {/* 2. Nom de l'établissement */}
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight leading-snug">
                {data?.ecoleConfig?.nom || "Complexe Scolaire John Tshot"}
              </h1>
              
              {/* 3. Slogan */}
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                « Construire aujourd’hui les talents de demain. »
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Formulaire de Connexion */}
          <form onSubmit={handleSubmit} className="space-y-4.5">
            {/* Champ Identifiant / E-mail */}
            <div className="space-y-1.5">
              <label 
                htmlFor="user-identifier" 
                className="block text-xs font-semibold text-slate-300 tracking-wide"
              >
                Adresse e-mail ou nom d'utilisateur
              </label>
              
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                
                <input
                  id="user-identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Adresse e-mail ou nom d'utilisateur"
                  className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm bg-slate-950/70 border border-slate-700/80 hover:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 rounded-xl text-slate-100 placeholder-slate-500 transition-all duration-150 focus:outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-1.5">
              <label 
                htmlFor="user-password" 
                className="block text-xs font-semibold text-slate-300 tracking-wide"
              >
                Mot de passe
              </label>
              
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                
                <input
                  id="user-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm bg-slate-950/70 border border-slate-700/80 hover:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 rounded-xl text-slate-100 placeholder-slate-500 transition-all duration-150 focus:outline-none"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 transition-transform duration-150" />
                  ) : (
                    <Eye className="w-4 h-4 transition-transform duration-150" />
                  )}
                </button>
              </div>

              {/* Mot de passe oublié ? */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </div>

            {/* Bouton Principal de Connexion */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-600/30 border border-blue-500/40 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <span>Se connecter</span>
                )}
              </button>
            </div>
          </form>

          {/* Séparateur OU CONTINUER AVEC */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-900/90 px-3 text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                OU CONTINUER AVEC
              </span>
            </div>
          </div>

          {/* Boutons Google & Apple */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleOAuthClick('Google')}
              className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all duration-150 active:scale-[0.98] shadow-sm group"
            >
              <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.56 0 2.96.54 4.07 1.6l3.05-3.05C17.27 1.77 14.82 1 12 1 7.37 1 3.42 3.63 1.5 7.45l3.66 2.84C6.04 7.45 8.78 5 12 5z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.71-4.93 3.71-8.7z"/>
                <path fill="#FBBC05" d="M5.16 14.71c-.23-.68-.36-1.41-.36-2.16s.13-1.48.36-2.16L1.5 7.45C.55 9.34 0 11.45 0 13.75s.55 4.41 1.5 6.3l3.66-2.84z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.08.73-2.46 1.16-4.22 1.16-3.22 0-5.96-2.45-6.84-5.29L1.5 15.92C3.42 19.74 7.37 23 12 23z"/>
              </svg>
              <span>Google</span>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={() => handleOAuthClick('Apple')}
              className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all duration-150 active:scale-[0.98] shadow-sm group"
            >
              <svg className="w-4 h-4 fill-current shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.84.94-2.92-1 .04-2.13.67-2.77 1.43-.56.66-.99 1.76-.86 2.82 1.11.08 2.16-.56 2.69-1.33z"/>
              </svg>
              <span>Apple</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer minimaliste */}
      <footer className="max-w-md mx-auto w-full text-center text-[11px] text-slate-500 py-3 z-10">
        <p>© {new Date().getFullYear()} {data?.ecoleConfig?.nom || "Complexe Scolaire John Tshot"} • Tous droits réservés</p>
      </footer>

      {/* Modal Mot de passe oublié */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => {
          setIsForgotModalOpen(false);
          setForgotSuccess(false);
        }}
        title="Récupération du mot de passe"
        description="Indiquez l'adresse e-mail associée à votre compte scolaire."
        size="sm"
      >
        {forgotSuccess ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Consignes transmises !</h4>
            <p className="text-xs text-slate-400">
              Un lien sécurisé de réinitialisation a été envoyé à <strong className="text-slate-200">{forgotEmail}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="forgot-email" className="block text-xs font-semibold text-slate-300">
                Adresse e-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="nom.prenom@ecole.cd"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsForgotModalOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={forgotLoading}
              >
                Envoyer le lien
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal d'information SSO OAuth */}
      <Modal
        isOpen={!!ssoProvider}
        onClose={() => setSsoProvider(null)}
        title={`Connexion ${ssoProvider}`}
        description="Authentification Unique (SSO)"
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-300">
              <Info className="w-4 h-4" />
              <span>Configuration Requise</span>
            </div>
            <p className="leading-relaxed">
              Pour activer la connexion directe avec un compte <strong>{ssoProvider}</strong>, les identifiants OAuth (Client ID & Secret) doivent être renseignés dans la configuration de l'établissement par l'administrateur système.
            </p>
          </div>

          <p className="text-xs text-slate-400">
            Veuillez utiliser vos identifiants scolaires attribués (adresse e-mail ou nom d'utilisateur) pour accéder directement à votre espace.
          </p>

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setSsoProvider(null)}
            >
              Compris
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
