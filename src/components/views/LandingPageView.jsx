import React, { useRef, useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";

import {
  School,
  GraduationCap,
  Users,
  MapPin,
  Phone,
  Mail,
  Star,
  Lock,
  ArrowRight,
  ShieldCheck,
  Trophy,
  HeartHandshake,
  Sun,
  Moon,
  Settings } from "lucide-react";

import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

const COLORS = {
  background: "#0B1736",
  backgroundSecondary: "#0F2142",
  surface: "#12305A",
  surfaceLight: "#16345F",
  blue: "#4EA3FF",
  blueLight: "#6CB6FF",
  blueGlow: "#7DD3FC",
  green: "#22C55E",
  greenLight: "#34D399",
  text: "#F5F9FF",
  textSecondary: "#B8C7DF",
  border: "rgba(148, 197, 255, 0.16)",
};

const FadeInUp = ({ children, delay = 0, duration = 0.5, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerContainer = ({ children, className = "" }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem = ({ children, className = "" }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

function CountUp({ to, duration = 2, suffix = "" }) {
  const count = useMotionValue(0);
  const rounded = useTransform(
    count,
    (latest) => `${Math.round(latest)}${suffix}`,
  );
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, count, to, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const ImageSlider = ({ onAction, data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = data?.ecoleConfig?.landingSlides || [
    {
      title: "Rentrée scolaire",
      desc: "Préparez la rentrée en toute sérénité. Découvrez les dates clés, les modalités d'inscription et les réunions d'information.",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
      badge: "Information",
      action: "Voir le calendrier",
    },
    {
      title: "Inscriptions ouvertes",
      desc: "Les inscriptions sont ouvertes. Retrouvez les documents nécessaires, les tarifs et les informations par section.",
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=1200&auto=format&fit=crop",
      badge: "Admission",
      action: "Dossier d'inscription",
    },
    {
      title: "Excellence académique",
      desc: "Découvrez les résultats et les informations importantes concernant la réussite de nos élèves.",
      image: "https://images.unsplash.com/photo-1522661067900-ab828854a284?q=80&w=1200&auto=format&fit=crop",
      badge: "Palmarès",
      action: "Voir les résultats",
    },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentIndex];

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 mb-8 px-4">
      <div
        className="relative overflow-hidden rounded-[18px] border shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl"
        style={{
          background: "rgba(18, 48, 90, 0.48)",
          borderColor: COLORS.border,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-64 md:h-[340px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={currentSlide.image}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                alt={currentSlide.title}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1736]/80 via-transparent to-transparent" />
            <div className="absolute top-5 left-5">
              <span
                className="inline-flex items-center px-3 py-1.5 rounded-[10px] text-xs font-bold text-white shadow-lg backdrop-blur-md"
                style={{ background: "rgba(37, 99, 235, 0.82)" }}
              >
                {currentSlide.badge}
              </span>
            </div>
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center relative min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <h3
                  className="text-xl md:text-2xl font-bold tracking-tight"
                  style={{ color: COLORS.text }}
                >
                  {currentSlide.title}
                </h3>
                <p
                  className="mt-3 text-sm leading-6"
                  style={{ color: COLORS.textSecondary }}
                >
                  {currentSlide.desc}
                </p>
                <button
                  type="button"
                  onClick={() => onAction && onAction(currentSlide)}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-all hover:translate-x-1"
                  style={{ color: COLORS.blueLight }}
                >
                  {currentSlide.action}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-6 left-6 md:left-8 flex items-center gap-2">
              {slides.map((slide, index) => {
                const active = currentIndex === index;
                return (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Afficher ${slide.title}`}
                    className="h-2 transition-all duration-300"
                    style={{
                      width: active ? 26 : 8,
                      borderRadius: 999,
                      background: active
                        ? COLORS.blueLight
                        : "rgba(108,182,255,0.30)",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function LandingPageView() {
  const { data, setCurrentView, currentUser } = useApp();
  const [isLightMode, setIsLightMode] = useState(false);

  const stats = [
    {
      label: "Élèves inscrits",
      value: 1250,
      suffix: "+",
      icon: Users,
      color: COLORS.blue,
    },
    {
      label: "Taux de réussite",
      value: 98,
      suffix: "%",
      icon: Trophy,
      color: COLORS.blueGlow,
    },
    {
      label: "Enseignants qualifiés",
      value: 85,
      suffix: "",
      icon: GraduationCap,
      color: COLORS.blueLight,
    },
    {
      label: "Années d'expérience",
      value: 25,
      suffix: "",
      icon: ShieldCheck,
      color: COLORS.blueLight,
    },
  ];

  const [cycles, setCycles] = useState([
    {
      titre: "École maternelle",
      badge: "3 à 5 ans",
      desc: "Un environnement sécurisant et stimulant pour les premiers apprentissages, l'éveil social et le développement de la créativité.",
      image:
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=1000&auto=format&fit=crop",
    },
    {
      titre: "École primaire",
      badge: "6 à 11 ans",
      desc: "Acquisition solide des savoirs fondamentaux, apprentissage de la rigueur et développement du sens critique.",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop",
    },
    {
      titre: "Humanités & secondaire",
      badge: "12 à 18 ans",
      desc: "Préparation aux examens d'État avec accompagnement personnalisé et suivi pédagogique.",
      image:
        "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop",
    },
  ]);

  
  const handleActualiteImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newActs = [...actualites];
        newActs[index].image = reader.result;
        setActualites(newActs);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCycleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCycles = [...cycles];
        newCycles[index].image = reader.result;
        setCycles(newCycles);
      };
      reader.readAsDataURL(file);
    }
  };

  const isAdmin = currentUser?.role_id === 'admin';
  const background = isLightMode ? '#12284A' : COLORS.background;
  const headingColor = COLORS.text;
  const glassStyle = {
    background: "rgba(18, 48, 90, 0.48)",
    borderColor: COLORS.border,
    boxShadow: "0 14px 45px rgba(0,0,0,0.18)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden relative font-sans selection:bg-blue-500/30"
      style={{ background, color: COLORS.textSecondary }}
    >
      <div
        className="fixed -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: "rgba(125,211,252,0.12)" }}
      />
      <div
        className="fixed top-[25%] -right-40 w-[420px] h-[420px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: "rgba(78,163,255,0.08)" }}
      />
      <div
        className="fixed bottom-0 left-[20%] w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none"
        style={{ background: "rgba(125,211,252,0.05)" }}
      />

      <nav
        className="fixed top-0 left-0 w-full z-50 px-5 sm:px-10 py-3 flex items-center justify-between border-b backdrop-blur-xl"
        style={{
          background: "rgba(11,23,54,0.78)",
          borderColor: COLORS.border,
        }}
      >
        <div className="flex items-center gap-3">
          {data?.ecoleConfig?.logo ? (
            <img src={data.ecoleConfig.logo} alt="Logo" className="w-9 h-9 object-contain" />
          ) : (
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white"
              style={{
                background: "linear-gradient(135deg,#4EA3FF,#2563EB)",
                boxShadow: "0 8px 25px rgba(78,163,255,0.20)",
              }}
            >
              <School className="w-5 h-5" />
            </div>
          )}
          <span
            className="hidden sm:block text-sm font-bold"
            style={{ color: headingColor }}
          >
            {data?.ecoleConfig?.nom || "Établissement scolaire"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsLightMode(!isLightMode)}
            className="w-9 h-9 rounded-[10px] flex items-center justify-center transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(78,163,255,0.12)",
              color: COLORS.blueLight,
              border: `1px solid ${COLORS.border}`,
            }}
            title="Changer le thème"
          >
            {isLightMode ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setCurrentView("login")}
            className="hidden md:inline-flex items-center text-sm font-semibold transition-colors"
            style={{ color: COLORS.textSecondary }}
          >
            Espace Parent
          </button>
          <button
            type="button"
            onClick={() => setCurrentView("login")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(37, 99, 235, 0.82)",
              boxShadow: "0 10px 25px rgba(37, 99, 235, 0.30)",
            }}
          >
            Se connecter <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      <section className="relative z-10 min-h-[90vh] pt-32 pb-16 px-5 sm:px-10 flex items-center justify-center text-center">
        <div className="max-w-5xl w-full mx-auto">
          <FadeInUp>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[9px] text-xs font-bold uppercase tracking-wide backdrop-blur-md"
              style={{
                color: COLORS.blueLight,
                background: "rgba(78,163,255,0.10)",
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <Star className="w-3.5 h-3.5" /> Excellence éducative
            </div>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h1
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]"
              style={{ color: headingColor }}
            >
              L'avenir se construit
              <span
                className="block mt-2 text-2xl sm:text-3xl font-bold"
                style={{ color: COLORS.blueLight }}
              >
                dès aujourd'hui.
              </span>
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p
              className="mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-7"
              style={{ color: COLORS.textSecondary }}
            >
              Une éducation intégrale, moderne et rigoureuse. Le complexe forme
              les leaders de demain grâce à une pédagogie d'avant-garde.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.3}>
            <ImageSlider data={data} />
          </FadeInUp>
          <FadeInUp delay={0.4}>
            <button
              type="button"
              onClick={() => setCurrentView("login")}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-[10px] text-base font-bold text-white transition-all hover:-translate-y-1"
              style={{
                background: "rgba(37, 99, 235, 0.85)",
                boxShadow: "0 14px 35px rgba(37, 99, 235, 0.30)",
              }}
            >
              Accéder au portail <ArrowRight className="w-5 h-5" />
            </button>
          </FadeInUp>
        </div>
      </section>

      <section className="relative z-10 py-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-10">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <StaggerItem key={stat.label}>
                  <div
                    className="p-5 rounded-[16px] flex flex-col items-center text-center border backdrop-blur-xl"
                    style={glassStyle}
                  >
                    <div
                      className="w-11 h-11 rounded-[11px] flex items-center justify-center mb-3"
                      style={{
                        background: "rgba(78,163,255,0.10)",
                        color: stat.color,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div
                      className="text-2xl sm:text-3xl font-black"
                      style={{ color: COLORS.text }}
                    >
                      <CountUp to={stat.value} suffix={stat.suffix} />
                    </div>
                    <div
                      className="mt-1 text-xs font-semibold"
                      style={{ color: COLORS.textSecondary }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      <section className="relative z-10 py-20 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <FadeInUp className="max-w-3xl mx-auto text-center mb-10">
            <h2
              className="text-3xl sm:text-4xl font-black tracking-tight"
              style={{ color: COLORS.text }}
            >
              L'excellence à chaque étape
            </h2>
            <p
              className="mt-3 text-base leading-7"
              style={{ color: COLORS.textSecondary }}
            >
              De la petite enfance aux portes de l'université, un parcours
              cohérent pour libérer le potentiel de chaque élève.
            </p>
          </FadeInUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cycles.map((cycle, idx) => (
              <StaggerItem key={cycle.titre}>
                <div
                  className="group overflow-hidden rounded-[16px] border h-full flex flex-col backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
                  style={glassStyle}
                >
                  
                  <div className="h-52 relative overflow-hidden group">
                    <img
                      src={cycle.image}
                      alt={cycle.titre}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1736] via-[#0B1736]/20 to-transparent"></div>
                    
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{ color: COLORS.text }}
                    >
                      {cycle.titre}
                    </h3>
                    <p
                      className="text-sm leading-6 flex-1"
                      style={{ color: COLORS.textSecondary }}
                    >
                      {cycle.desc}
                    </p>
                    <button
                      type="button"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold transition-all group-hover:translate-x-1"
                      style={{ color: COLORS.blueLight }}
                    >
                      Découvrir le programme <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <footer
        className="border-t py-12 px-5 sm:px-10 relative z-10 mt-10"
        style={{ background: "rgba(11,23,54,0.6)", borderColor: COLORS.border }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              {data?.ecoleConfig?.logo ? (
                <img src={data.ecoleConfig.logo} alt="Logo" className="w-10 h-10 object-contain" />
              ) : (
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white"
                  style={{
                    background: "linear-gradient(135deg,#4EA3FF,#2563EB)",
                  }}
                >
                  <School className="w-5 h-5" />
                </div>
              )}
              <span
                className="font-black text-xl tracking-tight"
                style={{ color: headingColor }}
              >
                {data?.ecoleConfig?.nom}
              </span>
            </div>
            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: COLORS.textSecondary }}
            >
              Le standard d'excellence éducative en RDC. Formation intégrale et
              innovation pédagogique.
            </p>
          </div>
          <div className="space-y-4">
            <h4
              className="text-xs font-black uppercase tracking-wider"
              style={{ color: headingColor }}
            >
              Contact
            </h4>
            <ul
              className="space-y-3 text-sm"
              style={{ color: COLORS.textSecondary }}
            >
              <li className="flex items-center gap-3">
                <MapPin
                  className="w-4 h-4"
                  style={{ color: COLORS.blueLight }}
                />
                {data?.ecoleConfig?.adresse}
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  className="w-4 h-4"
                  style={{ color: COLORS.blueLight }}
                />
                {data?.ecoleConfig?.telephone}
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
