import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Calendar,
  Smartphone,
  ChevronRight,
  School,
  Wallet,
  FileText,
  Star,
  Compass,
  Laptop,
  FlaskConical,
  Library,
  HeartHandshake
} from 'lucide-react';
import { Button, Badge, Card, StatCard } from '../ui';

export function LandingPageView() {
  const { setCurrentView, login, data } = useApp();

  const cycles = [
    {
      titre: 'Maternelle (1ère à 3ème)',
      desc: 'Éveil sensoriel, motricité, socialisation, développement du langage et initiation pré-scolaire dans un cadre épanouissant et sécurisé.',
      icon: Sparkles,
      badge: 'Cycle Éveil',
      color: 'amber'
    },
    {
      titre: 'Primaire (1ère à 6ème)',
      desc: 'Acquisition méthodique des savoirs fondamentaux (Français, Mathématiques, Éveil aux sciences) et préparation au TENAFEP avec 100% de réussite.',
      icon: BookOpen,
      badge: 'Cycle Fondamental',
      color: 'blue'
    },
    {
      titre: 'Éducation de Base (7ème & 8ème)',
      desc: 'Cycle d’orientation moderne conforme à la réforme de l’EPST avec initiation aux technologies de l’information et sciences appliquées.',
      icon: GraduationCap,
      badge: 'Orientation EPST',
      color: 'emerald'
    },
    {
      titre: 'Humanités Scientifiques',
      desc: 'Sections Math-Physique & Bio-Chimie avec travaux pratiques réguliers en laboratoire moderne et informatique expérimentale.',
      icon: FlaskConical,
      badge: 'Excellence Scientifique',
      color: 'purple'
    },
    {
      titre: 'Commerciale et Gestion',
      desc: 'Formation de pointe en comptabilité informatisée, économie monétaire, fiscalité congolaise et management d’entreprise.',
      icon: Wallet,
      badge: 'Gestion & Économie',
      color: 'rose'
    },
    {
      titre: 'Littéraire (Latin-Philosophie)',
      desc: 'Développement de la rhétorique, pensée critique, maîtrise approfondie des langues et préparation aux filières juridiques et diplomatiques.',
      icon: FileText,
      badge: 'Lettres & Humanités',
      color: 'sky'
    }
  ];

  const valeurs = [
    {
      titre: 'Excellence Académique',
      desc: 'Exigence de rigueur pédagogique, apprentissages stimulants et suivi personnalisé des talents.',
      icon: Award
    },
    {
      titre: 'Citoyenneté & Intégrité',
      desc: 'Formation civique, respect du bien public, discipline exemplaire et responsabilité morale.',
      icon: ShieldCheck
    },
    {
      titre: 'Innovation Numérique',
      desc: 'Plateforme connectée en temps réel pour bulletins, devoirs, présence et lien direct parents-école.',
      icon: Laptop
    },
    {
      titre: 'Épanouissement Humain',
      desc: 'Activités sportives, culturelles, débats d’éloquence et vie associative dynamique.',
      icon: HeartHandshake
    }
  ];

  const temoignages = [
    {
      nom: 'Dr. Joseph MUKUNA',
      role: 'Parent d\'élève (2 enfants en Humanités)',
      texte: 'Le suivi en direct des bulletins et des présences sur le portail numérique nous apporte une totale sérénité. La qualité de l\'enseignement est irréprochable.',
      note: 5
    },
    {
      nom: 'Me Francine TSHILOMBO',
      role: 'Alumni & Juriste',
      texte: 'C\'est ici que j\'ai acquis la discipline de travail et le goût de l\'effort qui m\'ont permis de réussir mon cursus universitaire avec distinction.',
      note: 5
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Official EPST Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800 text-[11px] py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-semibold text-slate-200">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Ministère de l'Éducation Nationale et Nouvelle Citoyenneté</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Agrément National : <strong className="text-slate-300 font-mono">{data.ecoleConfig.code_ministeriel}</strong></span>
            <span className="hidden md:inline font-mono text-blue-400">Session {data.ecoleConfig.annee_courante}</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-700 shadow-md shrink-0 border border-slate-200">
              <School className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-white font-heading leading-tight truncate">
                {data.ecoleConfig.nom}
              </h1>
              <p className="text-xs text-slate-400 truncate">
                {data.ecoleConfig.province_educationnelle} • {data.ecoleConfig.commune}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden sm:block">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('login')}
                icon={Lock}
              >
                Connexion
              </Button>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentView('login')}
              icon={ArrowRight}
              iconPosition="right"
            >
              <span className="hidden sm:inline">Espace Scolaire</span>
              <span className="sm:hidden">Accéder</span>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-8 border-b border-slate-800/80">
        {/* Glow & Grid Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/15 to-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="flex items-center justify-between gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold text-justify w-full sm:w-auto">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Inscriptions Ouvertes pour l'Année 2025-2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white tracking-tight leading-[1.15]">
              L'Excellence Éducative.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0 text-justify">
              Le <strong className="text-white font-semibold">{data.ecoleConfig.nom}</strong> offre un cadre d'apprentissage moderne alliant rigueur académique, éducation aux valeurs citoyennes et technologies de pointe pour révéler le plein potentiel de chaque élève.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setCurrentView('login')}
                icon={Lock}
              >
                Accéder au Portail Connecté
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setCurrentView('login')}
                icon={FileText}
              >
                Inscriptions & Tarifs
              </Button>
            </div>

            {/* Micro assurances */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-left">
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-white font-heading">100%</div>
                <div className="text-[11px] text-slate-400">Réussite Examen d'État</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-white font-heading">25+ Ans</div>
                <div className="text-[11px] text-slate-400">Tradition d'Excellence</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-white font-heading">100%</div>
                <div className="text-[11px] text-slate-400">Suivi Numérique Direct</div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900 group">
              {/* Image banner with overlay */}
              <div className="h-80 sm:h-96 w-full relative bg-blue-950">
                <img 
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop" 
                  alt="Élèves en classe studieuse"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/40" />
              </div>

              {/* Floating Badge on Image */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">Campus Connecté & Sécurisé</span>
                  </span>
                  <Badge variant="emerald" size="sm">Homologué EPST</Badge>
                </div>
                <p className="text-[11px] text-slate-300">
                  Laboratoires de sciences, salle multimédia connectée et bibliothèque ouverte à tous les apprenants.
                </p>
                
                <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-slate-700/50">
                  <img 
                    src="/WhatsApp Image 2026-08-20 at 23.05.34.jpeg" 
                    className="w-10 h-10 rounded-full object-cover aspect-square shrink-0 ring-2 ring-slate-800" 
                    alt="Équipe technique" 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop";
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white leading-tight">Équipe technique</span>
                    <span className="text-[10px] text-slate-400">Support informatique 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-slate-900/40 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <Badge variant="blue" size="md">Indicateurs de Performance</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Une Institution Reconnue pour ses Résultats
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Des chiffres concrets qui témoignent de l'engagement quotidien de notre équipe de direction et de nos enseignants.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Élèves Inscrits"
              value="1 250+"
              subtitle="De la Maternelle aux Humanités"
              icon={Users}
              iconColor="blue"
            />
            <StatCard
              title="Taux de Réussite"
              value="100 %"
              subtitle="TENAFEP & Examen d'État"
              icon={Award}
              iconColor="emerald"
            />
            <StatCard
              title="Corps Enseignant"
              value="48"
              subtitle="Professeurs certifiés et licenciés"
              icon={GraduationCap}
              iconColor="purple"
            />
            <StatCard
              title="Infrastructures"
              value="35 Salles"
              subtitle="Climatisées avec labos & IT"
              icon={School}
              iconColor="amber"
            />
          </div>
        </div>
      </section>

      {/* CYCLES & OPTIONS SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <Badge variant="indigo" size="md">Offre Pédagogique</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                Nos Cycles et Filières d'Enseignement
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Un cursus complet conçu pour accompagner l'enfant du premier âge jusqu'au diplôme d'État et aux études supérieures.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView('login')}
              icon={ArrowRight}
              iconPosition="right"
            >
              Consulter les programmes
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cycles.map((c, idx) => {
              const Icon = c.icon;
              return (
                <Card key={idx} hover padding="normal" className="flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant={c.color} size="sm">{c.badge}</Badge>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                      {c.titre}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold">
                    <span>Programme Officiel RDC</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* VALUES & ENVIRONMENT */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-slate-900/30 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <Badge variant="emerald" size="md">Notre Philosophie</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Pourquoi Choisir Notre Établissement ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Une éducation intégrale qui conjugue savoir, savoir-faire et savoir-être.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {valeurs.map((v, idx) => {
              const Icon = v.icon;
              return (
                <Card key={idx} padding="normal" className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold font-heading text-white">
                    {v.titre}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {v.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <Badge variant="amber" size="md">Témoignages</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              La Confiance de Notre Communauté
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {temoignages.map((t, idx) => (
              <Card key={idx} padding="normal" className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.note)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  « {t.texte} »
                </p>
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="text-xs font-bold text-white">{t.nom}</div>
                  <div className="text-[11px] text-slate-400">{t.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER BANNER */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
            Prêt à Offrir le Meilleur Avenir à Votre Enfant ?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Rejoignez notre communauté éducative. Connectez-vous à notre portail ou prenez contact avec notre secrétariat pour toute demande d'inscription.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setCurrentView('login')}
              icon={Lock}
            >
              Se Connecter à l'Espace Numérique
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setCurrentView('login')}
            >
              Créer un Compte Parent
            </Button>
          </div>
        </div>
      </section>

      {/* MAIN FOOTER */}
      <footer className="bg-slate-950 py-12 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm font-heading">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-700 shrink-0 shadow-sm">
                <School className="w-4 h-4" />
              </div>
              <span>{data.ecoleConfig.nom}</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Établissement scolaire d'excellence agréé par le Ministère de l'EPST en République Démocratique du Congo.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Localisation</div>
            <p className="flex items-start gap-2 text-[11px]">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>{data.ecoleConfig.adresse}, Commune de {data.ecoleConfig.commune}, Kinshasa - RDC</span>
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Contacts Directs</div>
            <p className="flex items-center gap-2 text-[11px]">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{data.ecoleConfig.telephone}</span>
            </p>
            <p className="flex items-center gap-2 text-[11px]">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{data.ecoleConfig.email}</span>
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Accès Rapides</div>
            <ul className="space-y-1 text-[11px]">
              <li><button onClick={() => setCurrentView('login')} className="hover:text-white transition">Portail Direction & Préfet</button></li>
              <li><button onClick={() => setCurrentView('login')} className="hover:text-white transition">Espace Enseignants & Cotes</button></li>
              <li><button onClick={() => setCurrentView('login')} className="hover:text-white transition">Portail Famille & Bulletins</button></li>
              <li><button onClick={() => setCurrentView('login')} className="hover:text-white transition">Caisse & Trésorerie</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © 2026 {data.ecoleConfig.nom}. Tous droits réservés.
          </div>
          <div>
            Conception conforme aux normes du Ministère de l'EPST - RDC.
          </div>
        </div>
      </footer>
    </div>
  );
}
