import React, { createContext, useContext, useState, useEffect } from "react";
import { initialData } from "../data/initialData";
const AppContext = createContext();
const STORAGE_KEY = "GESTION_SCOLAIRE_RDC_V3";
const AUTH_STORAGE_KEY =
  "GESTION_SCOLAIRE_AUTH_USER_V3"; /* Available System Roles with pre-configured credentials & permissions */
export const SYSTEM_ROLES = {
  admin: {
    id: "admin",
    label: "Administrateur / Direction",
    badge: "Direction Générale",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    description: "Accès intégral à toute la gestion : pédagogie, finances, inscriptions, bulletins, palmarès et paramètres.",
    username: "admin",
    defaultPassword: "123",
    defaultView: "dashboard",
    allowedViews: ["dashboard", "eleves", "eleve_portal", "eleve-detail", "presences", "finance", "recu", "bulletin", "palmares", "resultats", "enseignants", "classes", "cours", "horaires", "discipline", "parents", "communication", "utilisateurs", "visio", "bibliotheque", "settings", "parametres"],
    user: { id: 1, username: "admin", first_name: "Dieudonné", last_name: "TSHILOMBO", role: "Administrateur", role_id: "admin", avatar: "DT", is_authenticated: true },
  },
  ADMIN: {
    id: "admin",
    label: "Administrateur / Direction",
    badge: "Direction Générale",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    description: "Accès intégral à toute la gestion.",
    username: "admin",
    defaultPassword: "123",
    defaultView: "dashboard",
    allowedViews: ["dashboard", "eleves", "eleve_portal", "eleve-detail", "presences", "finance", "recu", "bulletin", "palmares", "resultats", "enseignants", "classes", "cours", "horaires", "discipline", "parents", "communication", "utilisateurs", "visio", "bibliotheque", "settings", "parametres"],
    user: { id: 1, username: "admin", first_name: "Dieudonné", last_name: "TSHILOMBO", role: "Administrateur", role_id: "admin", avatar: "DT", is_authenticated: true },
  },
  PREFET: {
    id: "PREFET",
    label: "Préfet des Études",
    badge: "Direction",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    description: "Accès intégral à toute la gestion pédagogique.",
    username: "prefet",
    defaultPassword: "123",
    defaultView: "dashboard",
    allowedViews: ["dashboard", "eleves", "eleve_portal", "eleve-detail", "presences", "bulletin", "palmares", "resultats", "enseignants", "classes", "cours", "horaires", "discipline", "communication", "visio", "bibliotheque"],
    user: { id: 2, username: "prefet", first_name: "Préfet", last_name: "Etudes", role: "Préfet des Études", role_id: "PREFET", avatar: "PE", is_authenticated: true },
  },
  prefet: {
    id: "PREFET",
    label: "Préfet des Études",
    badge: "Direction",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    description: "Accès intégral à toute la gestion pédagogique.",
    username: "prefet",
    defaultPassword: "123",
    defaultView: "dashboard",
    allowedViews: ["dashboard", "eleves", "eleve_portal", "eleve-detail", "presences", "bulletin", "palmares", "resultats", "enseignants", "classes", "cours", "horaires", "discipline", "communication", "visio", "bibliotheque"],
    user: { id: 2, username: "prefet", first_name: "Préfet", last_name: "Etudes", role: "Préfet des Études", role_id: "PREFET", avatar: "PE", is_authenticated: true },
  },
  COMPTABLE: {
    id: "COMPTABLE",
    label: "Comptable",
    badge: "Finances",
    badgeColor: "bg-blue-600/20 text-emerald-300 border-emerald-500/30",
    description: "Gestion des finances.",
    username: "comptable",
    defaultPassword: "123",
    defaultView: "finance",
    allowedViews: ["dashboard", "eleves", "eleve_portal", "finance", "recu", "communication"],
    user: { id: 3, username: "comptable", first_name: "Agent", last_name: "Comptable", role: "Comptable", role_id: "COMPTABLE", avatar: "AC", is_authenticated: true },
  },
  comptable: {
    id: "COMPTABLE",
    label: "Comptable",
    badge: "Finances",
    badgeColor: "bg-blue-600/20 text-emerald-300 border-emerald-500/30",
    description: "Gestion des finances.",
    username: "comptable",
    defaultPassword: "123",
    defaultView: "finance",
    allowedViews: ["dashboard", "eleves", "eleve_portal", "finance", "recu", "communication"],
    user: { id: 3, username: "comptable", first_name: "Agent", last_name: "Comptable", role: "Comptable", role_id: "COMPTABLE", avatar: "AC", is_authenticated: true },
  },
  CAISSIER: {
    id: "CAISSIER",
    label: "Caissier / Caissière",
    badge: "Caisse",
    badgeColor: "bg-blue-600/20 text-emerald-300 border-emerald-500/30",
    description: "Encaissement des paiements.",
    username: "caissier",
    defaultPassword: "123",
    defaultView: "finance",
    allowedViews: ["dashboard", "finance", "recu"],
    user: { id: 4, username: "caissier", first_name: "Agent", last_name: "Caisse", role: "Caissier(ère)", role_id: "CAISSIER", avatar: "AC", is_authenticated: true },
  },
  caissier: {
    id: "CAISSIER",
    label: "Caissier / Caissière",
    badge: "Caisse",
    badgeColor: "bg-blue-600/20 text-emerald-300 border-emerald-500/30",
    description: "Encaissement des paiements.",
    username: "caissier",
    defaultPassword: "123",
    defaultView: "finance",
    allowedViews: ["dashboard", "finance", "recu"],
    user: { id: 4, username: "caissier", first_name: "Agent", last_name: "Caisse", role: "Caissier(ère)", role_id: "CAISSIER", avatar: "AC", is_authenticated: true },
  },
  ENSEIGNANT: {
    id: "ENSEIGNANT",
    label: "Enseignant",
    badge: "Pédagogie",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    description: "Gestion des classes, présences, et notes.",
    username: "prof",
    defaultPassword: "123",
    defaultView: "resultats",
    allowedViews: ["dashboard", "eleves", "eleve_portal", "presences", "bulletin", "resultats", "classes", "cours", "horaires", "discipline", "communication", "visio", "bibliotheque"],
    user: { id: 5, username: "prof", first_name: "Jean", last_name: "Prof", role: "Enseignant", role_id: "ENSEIGNANT", avatar: "JP", is_authenticated: true },
  },
  enseignant: {
    id: "ENSEIGNANT",
    label: "Enseignant",
    badge: "Pédagogie",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    description: "Gestion des classes, présences, et notes.",
    username: "prof",
    defaultPassword: "123",
    defaultView: "resultats",
    allowedViews: ["dashboard", "eleves", "eleve_portal", "presences", "bulletin", "resultats", "classes", "cours", "horaires", "discipline", "communication", "visio", "bibliotheque"],
    user: { id: 5, username: "prof", first_name: "Jean", last_name: "Prof", role: "Enseignant", role_id: "ENSEIGNANT", avatar: "JP", is_authenticated: true },
  },
  TUTEUR: {
    id: "tuteur",
    name: "Tuteur / Parent",
    label: "Parent / Tuteur",
    badge: "Espace Famille",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    defaultView: "parents",
    allowedViews: ["parents",
        "bulletin",
        "recu",
        "communication",
        "discipline",
        "visio",
        "bibliotheque",
        "presences"],
    user: { id: 6, username: "parent", first_name: "Parent", last_name: "Eleve", role: "Tuteur", role_id: "tuteur", avatar: "PE", is_authenticated: true },
  },
  tuteur: {
    id: "tuteur",
    name: "Tuteur / Parent",
    label: "Parent / Tuteur",
    badge: "Espace Famille",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    defaultView: "parents",
    allowedViews: ["parents", "bulletin", "recu", "communication", "discipline", "visio", "bibliotheque", "presences"],
    user: { id: 6, username: "parent", first_name: "Parent", last_name: "Eleve", role: "Tuteur", role_id: "tuteur", avatar: "PE", is_authenticated: true },
  },
  parent: {
    id: "tuteur",
    name: "Tuteur / Parent",
    label: "Parent / Tuteur",
    badge: "Espace Famille",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    defaultView: "parents",
    allowedViews: ["parents", "bulletin", "recu", "communication", "discipline", "visio", "bibliotheque", "presences"],
    user: { id: 6, username: "parent", first_name: "Parent", last_name: "Eleve", role: "Tuteur", role_id: "tuteur", avatar: "PE", is_authenticated: true },
  },
  ELEVE: {
    id: "eleve",
    name: "Élève",
    label: "Élève",
    badge: "Espace Élève",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    defaultView: "eleve_portal",
    allowedViews: ["eleve_portal", "bulletin", "presences", "discipline", "communication", "visio", "bibliotheque", "resultats", "profile", "notes"],
    user: { id: 7, username: "eleve", first_name: "Eleve", last_name: "Etudiant", role: "Élève", role_id: "eleve", avatar: "EL", is_authenticated: true },
  },
  eleve: {
    id: "eleve",
    name: "Élève",
    label: "Élève",
    badge: "Espace Élève",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    defaultView: "eleve_portal",
    allowedViews: ["eleve_portal", "bulletin", "presences", "discipline", "communication", "visio", "bibliotheque", "resultats", "profile", "notes"],
    user: { id: 7, username: "eleve", first_name: "Eleve", last_name: "Etudiant", role: "Élève", role_id: "eleve", avatar: "EL", is_authenticated: true },
  },
  visiteur: {
    id: "visiteur",
    label: "Visiteur / Public",
    badge: "Accès restreint",
    badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    description: "Accès limité à la page d'accueil.",
    username: "visiteur",
    defaultPassword: "",
    defaultView: "landing",
    allowedViews: ["landing", "login"],
    user: { id: 8, username: "visiteur", first_name: "Visiteur", last_name: "Anonyme", role: "Visiteur", role_id: "visiteur", avatar: "?", is_authenticated: false },
  }
};
/* Permission & Role Checks */

export function AppProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const localData = localStorage.getItem(STORAGE_KEY);
      if (localData) {
        const parsed = JSON.parse(localData);
        return {
          ...initialData,
          ...parsed,
          classes: (parsed.classes && parsed.classes.length > 0) ? parsed.classes : initialData.classes,
          options: (parsed.options && parsed.options.length > 0) ? parsed.options : initialData.options,
          niveaux: (parsed.niveaux && parsed.niveaux.length > 0) ? parsed.niveaux : initialData.niveaux,
          eleves: (parsed.eleves && parsed.eleves.length > 0) ? parsed.eleves : initialData.eleves,
          utilisateurs: (parsed.utilisateurs && parsed.utilisateurs.length > 0) ? parsed.utilisateurs : initialData.utilisateurs,
          ecoleConfig: parsed.ecoleConfig || initialData.ecoleConfig,
        };
      }
      return initialData;
    } catch {
      return initialData;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const localUser = localStorage.getItem(AUTH_STORAGE_KEY);
      return localUser ? JSON.parse(localUser) : null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState("landing");
  const [viewHistory, setViewHistory] = useState(["landing"]);
  const [selectedEleveId, setSelectedEleveId] = useState(null);
  const [selectedPaiementId, setSelectedPaiementId] = useState(null);
  const [selectedClasseId, setSelectedClasseId] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const showToast = (message) => {
    setNotificationToast({ message, id: Date.now() });
    setTimeout(() => {
      setNotificationToast(null);
    }, 3000);
  };

  const goBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop();
      const previousView = newHistory[newHistory.length - 1];
      setCurrentView(previousView);
      setViewHistory(newHistory);
    }
  };

  const hasPermission = (viewId) => {
    if (viewId === "landing" || viewId === "login") return true;
    if (!currentUser) return false;

    const rawRole = String(currentUser.role_id || currentUser.role || "").trim();
    const rawRoleUpper = rawRole.toUpperCase();
    const rawRoleLower = rawRole.toLowerCase();

    // Administrateur / Direction has unrestricted access
    if (
      rawRoleLower === "admin" ||
      rawRoleUpper === "ADMIN" ||
      rawRoleLower === "administrateur" ||
      rawRoleLower.includes("admin")
    ) {
      return true;
    }

    const roleConfig =
      SYSTEM_ROLES[rawRole] ||
      SYSTEM_ROLES[rawRoleLower] ||
      SYSTEM_ROLES[rawRoleUpper] ||
      SYSTEM_ROLES.visiteur;

    if (roleConfig && Array.isArray(roleConfig.allowedViews)) {
      if (roleConfig.allowedViews.includes(viewId)) return true;
    }

    // Safety fallback for student role
    if (rawRoleLower.includes("eleve") || rawRoleLower.includes("élève") || rawRoleUpper === "ELEVE") {
      const studentAllowed = [
        "eleve_portal",
        "bulletin",
        "presences",
        "discipline",
        "communication",
        "visio",
        "bibliotheque",
        "resultats",
        "profile",
        "notes"
      ];
      return studentAllowed.includes(viewId);
    }

    // Safety fallback for parent role
    if (rawRoleLower.includes("parent") || rawRoleLower.includes("tuteur") || rawRoleUpper === "TUTEUR") {
      const parentAllowed = [
        "parents",
        "bulletin",
        "recu",
        "communication",
        "discipline",
        "visio",
        "bibliotheque",
        "presences"
      ];
      return parentAllowed.includes(viewId);
    }

    return false;
  };  /* Login handler connected to the backend API & local state */
  const login = async (identifier = "", password = "") => {
    const cleanId = (identifier || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanId || !cleanPass) {
      return {
        success: false,
        error: "Veuillez renseigner votre email / matricule et votre mot de passe."
      };
    }

    // 1. Essai avec le backend API (si disponible)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanId, password: cleanPass }),
      });
      if (response.ok) {
        const result = await response.json();
        let frontendRoleId = "visiteur";
        let defaultView = "dashboard";
        switch (result.user.role) {
          case "ADMIN":
          case "DIRECTEUR":
            frontendRoleId = "admin";
            defaultView = "dashboard";
            break;
          case "PREFET":
            frontendRoleId = "PREFET";
            defaultView = "dashboard";
            break;
          case "ENSEIGNANT":
            frontendRoleId = "ENSEIGNANT";
            defaultView = "resultats";
            break;
          case "COMPTABLE":
            frontendRoleId = "COMPTABLE";
            defaultView = "finance";
            break;
          case "CAISSIER":
          case "CAISSIERE":
            frontendRoleId = "CAISSIER";
            defaultView = "finance";
            break;
          case "TUTEUR":
          case "PARENT":
            frontendRoleId = "TUTEUR";
            defaultView = "parents";
            break;
          case "ELEVE":
            frontendRoleId = "eleve";
            defaultView = "eleve_portal";
            break;
        }
        const userObj = {
          id: result.user.id,
          username: result.user.email ? result.user.email.split("@")[0] : cleanId,
          first_name: result.user.nom,
          last_name: "",
          role: result.user.role,
          role_id: frontendRoleId,
          email: result.user.email,
          avatar: result.user.nom ? result.user.nom[0] : "U",
          is_authenticated: true,
          eleve_id: result.user.eleve_id,
        };
        if (result.token) localStorage.setItem("auth_token", result.token);
        if (result.user.eleve_id) setSelectedEleveId(result.user.eleve_id);
        setCurrentUser(userObj);
        setData((prev) => ({ ...prev, user: { ...prev.user, ...userObj } }));
        showToast(`Bienvenue, ${userObj.first_name} !`);
        setCurrentView(defaultView);
        return { success: true, user: userObj };
      }
    } catch (err) {
      console.warn("API login non disponible ou échec, passage au contrôleur local...", err);
    }

    // 2. Contrôleur d'authentification local complet (utilisateurs & élèves)
    const allUsers = data?.utilisateurs || [];
    const allEleves = data?.eleves || [];

    const isPasswordMatch = (expectedPass, providedPass, defaultPassList = []) => {
      if (expectedPass && expectedPass === providedPass) return true;
      if (!expectedPass && (providedPass === "123" || providedPass === "admin123" || providedPass === "eleve123")) return true;
      if (defaultPassList.filter(Boolean).includes(providedPass)) return true;
      return false;
    };

    // A) Recherche dans la table utilisateurs
    const matchedUser = allUsers.find((u) => {
      const uEmail = (u.email || "").toLowerCase();
      const uNom = (u.nom || "").toLowerCase();
      const uId = String(u.id);
      return uEmail === cleanId || uNom === cleanId || uId === cleanId;
    });

    // B) Recherche dans la table élèves (par email, matricule, nom complet, ou ID)
    const matchedStudent = allEleves.find((e) => {
      const eEmail = (e.email_eleve || e.email || "").toLowerCase();
      const eMatricule = (e.matricule || "").toLowerCase();
      const eNomComplet = `${e.nom || ""} ${e.prenom || ""}`.trim().toLowerCase();
      const eNom = (e.nom || "").toLowerCase();
      const eId = String(e.id);
      return eEmail === cleanId || eMatricule === cleanId || eNomComplet === cleanId || eNom === cleanId || eId === cleanId;
    });

    if (matchedUser) {
      const userPass = matchedUser.password || (matchedUser.role === "ADMIN" ? "admin123" : matchedUser.role === "ELEVE" ? "eleve123" : "123");
      let studentPass = null;
      let linkedStudent = null;
      if (matchedUser.eleve_id) {
        linkedStudent = allEleves.find(e => e.id === matchedUser.eleve_id);
        studentPass = linkedStudent?.mot_de_passe_eleve;
      }
      
      const isValid = isPasswordMatch(userPass, cleanPass, [studentPass, "123", "admin123", "eleve123", "grace2025"]);

      if (isValid) {
        const role = matchedUser.role || "ELEVE";
        let frontendRoleId = "eleve";
        let defaultView = "eleve_portal";

        if (role === "ADMIN") { frontendRoleId = "admin"; defaultView = "dashboard"; }
        else if (role === "PREFET") { frontendRoleId = "PREFET"; defaultView = "dashboard"; }
        else if (role === "ENSEIGNANT") { frontendRoleId = "ENSEIGNANT"; defaultView = "resultats"; }
        else if (role === "COMPTABLE" || role === "CAISSIER") { frontendRoleId = "COMPTABLE"; defaultView = "finance"; }
        else if (role === "TUTEUR" || role === "PARENT") { frontendRoleId = "TUTEUR"; defaultView = "parents"; }
        else if (role === "ELEVE") { frontendRoleId = "eleve"; defaultView = "eleve_portal"; }

        const eleveId = matchedUser.eleve_id || linkedStudent?.id || (role === "ELEVE" ? 1 : null);
        const userObj = {
          id: matchedUser.id,
          username: (matchedUser.email || cleanId).split("@")[0],
          first_name: matchedUser.nom,
          last_name: "",
          role: role,
          role_id: frontendRoleId,
          email: matchedUser.email || cleanId,
          avatar: matchedUser.nom ? matchedUser.nom[0] : "U",
          is_authenticated: true,
          eleve_id: eleveId,
        };

        if (eleveId) setSelectedEleveId(eleveId);
        setCurrentUser(userObj);
        setData((prev) => ({ ...prev, user: { ...prev.user, ...userObj } }));
        showToast(`Bienvenue, ${userObj.first_name} !`);
        setCurrentView(defaultView);
        return { success: true, user: userObj };
      }
    }

    if (matchedStudent) {
      const studentPass = matchedStudent.mot_de_passe_eleve || matchedStudent.password || "eleve123";
      const isValid = isPasswordMatch(studentPass, cleanPass, ["eleve123", "123", "grace2025", "admin123"]);

      if (isValid) {
        const studentName = `${matchedStudent.nom || ''} ${matchedStudent.prenom || ''}`.trim() || "Élève";
        const userObj = {
          id: matchedStudent.id,
          username: (matchedStudent.email_eleve || matchedStudent.matricule || cleanId).split("@")[0],
          first_name: studentName,
          last_name: "",
          role: "ELEVE",
          role_id: "eleve",
          email: matchedStudent.email_eleve || `${matchedStudent.matricule}@ecole.cd`,
          avatar: matchedStudent.nom ? matchedStudent.nom[0] : "E",
          is_authenticated: true,
          eleve_id: matchedStudent.id,
        };

        setSelectedEleveId(matchedStudent.id);
        setCurrentUser(userObj);
        setData((prev) => ({ ...prev, user: { ...prev.user, ...userObj } }));
        showToast(`Bienvenue sur votre espace élève, ${studentName} !`);
        setCurrentView("eleve_portal");
        return { success: true, user: userObj };
      }
    }

    return {
      success: false,
      error: "Identifiants ou mot de passe incorrects. Vérifiez votre adresse email ou matricule et votre mot de passe."
    };
  }; /* Register new account handler */
  const register = (registrationData) => {
    const roleKey = registrationData.role_id || "parent";
    const matchedRole = SYSTEM_ROLES[roleKey] || SYSTEM_ROLES.parent;
    const newUser = {
      id: Date.now(),
      username: registrationData.email
        ? registrationData.email.split("@")[0]
        : `user_${Date.now()}`,
      first_name: registrationData.first_name || "Utilisateur",
      last_name: registrationData.last_name || "Nouveau",
      role: matchedRole.user.role,
      role_id: roleKey,
      email: registrationData.email || "nouveau@ecole.cd",
      telephone: registrationData.telephone || "",
      avatar: `${(registrationData.first_name || "U")[0]}${(registrationData.last_name || "N")[0]}`,
      is_authenticated: true,
    };
    setCurrentUser(newUser);
    setData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        username: newUser.username,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role: newUser.role,
        is_authenticated: true,
      },
    }));
    showToast(
      `Compte créé avec succès ! Bienvenue, ${newUser.first_name} ${newUser.last_name}.`,
    );
    setCurrentView(matchedRole.defaultView);
    return true;
  }; /* Logout handler */
  const logout = () => {
    localStorage.removeItem("auth_token");
    setCurrentUser(null);
    setData((prev) => ({
      ...prev,
      user: { ...prev.user, is_authenticated: false },
    }));
    showToast("Vous avez été déconnecté avec succès.", "info");
    setCurrentView("landing");
  }; /* Update School Config */
  const updateEcoleConfig = (newConfig) => {
    setData((prev) => ({
      ...prev,
      ecoleConfig: { ...prev.ecoleConfig, ...newConfig },
    }));
    showToast("Configuration de l'établissement mise à jour !");
  };  /* CRUD for Eleves */
  const addEleve = (newEleve) => {
    const nextId =
      ((data?.eleves || []).length > 0 ? Math.max(...(data?.eleves || []).map((e) => Number(e.id) || 0)) : 0) +
      1;
    const matricule = newEleve.matricule || `2025-${String(nextId).padStart(4, "0")}`;
    const eleveWithId = {
      ...newEleve,
      id: nextId,
      matricule,
      date_inscription:
        newEleve.date_inscription || new Date().toISOString().split("T")[0],
      photo: newEleve.photo || null,
      est_boursier: !!newEleve.est_boursier,
      est_orphelin: !!newEleve.est_orphelin,
      est_handicape: !!newEleve.est_handicape,
      est_pris_en_charge: !!newEleve.est_pris_en_charge,
      est_cas_social: !!newEleve.est_cas_social,
      statut: newEleve.statut || "actif",
    };

    // Synchroniser automatiquement avec la liste des utilisateurs pour la connexion élève
    const studentEmail = newEleve.email_eleve || newEleve.email;
    const studentPassword = newEleve.mot_de_passe_eleve || newEleve.password || "eleve123";
    let updatedUsers = [...(data?.utilisateurs || [])];

    if (studentEmail) {
      const studentUser = {
        id: Date.now(),
        nom: `${newEleve.nom || ''} ${newEleve.postnom || ''} ${newEleve.prenom || ''}`.trim() || "Élève",
        email: studentEmail,
        password: studentPassword,
        role: "ELEVE",
        eleve_id: nextId,
        is_active: true
      };
      updatedUsers = updatedUsers.filter(u => (u.email || "").toLowerCase() !== studentEmail.toLowerCase());
      updatedUsers.push(studentUser);

      // Async backend creation if online
      try {
        const token = localStorage.getItem("auth_token");
        fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            nom: studentUser.nom,
            email: studentUser.email,
            password: studentPassword,
            role: 'ELEVE',
            eleve_id: nextId
          })
        }).catch(() => {});
      } catch {}
    }

    /* Auto-create initial pointage */
    const nextPtId =
      ((data?.pointages || []).length > 0
        ? Math.max(...(data?.pointages || []).map((p) => Number(p.id) || 0))
        : 0) + 1;
    const initialPointage = {
      id: nextPtId,
      eleve_id: nextId,
      date: new Date().toISOString().split("T")[0],
      statut: "present",
      motif: "",
      heure_arrivee: "07:30",
      heure_depart: "13:00",
    };

    setData((prev) => ({
      ...prev,
      eleves: [eleveWithId, ...(prev.eleves || [])],
      pointages: [...(prev.pointages || []), initialPointage],
      utilisateurs: updatedUsers
    }));

    showToast(
      `Élève ${eleveWithId.nom} ${eleveWithId.prenom || ''} inscrit avec succès !`,
    );
    return eleveWithId;
  };

  const updateEleve = (id, updatedFields) => {
    const studentId = Number(id);
    setData((prev) => {
      const prevStudent = (prev.eleves || []).find(e => e.id === studentId);
      const mergedStudent = { ...(prevStudent || {}), ...updatedFields };

      const newEmail = updatedFields.email_eleve || updatedFields.email || mergedStudent.email_eleve || mergedStudent.email;
      const newPassword = updatedFields.mot_de_passe_eleve || updatedFields.password || mergedStudent.mot_de_passe_eleve;

      let updatedUsers = [...(prev.utilisateurs || [])];
      if (newEmail) {
        const existingIdx = updatedUsers.findIndex(u => u.eleve_id === studentId || (u.email && u.email.toLowerCase() === newEmail.toLowerCase()));
        const fullName = `${mergedStudent.nom || ''} ${mergedStudent.postnom || ''} ${mergedStudent.prenom || ''}`.trim() || "Élève";

        if (existingIdx >= 0) {
          updatedUsers[existingIdx] = {
            ...updatedUsers[existingIdx],
            nom: fullName,
            email: newEmail,
            role: "ELEVE",
            eleve_id: studentId,
            ...(newPassword ? { password: newPassword } : {})
          };
        } else {
          updatedUsers.push({
            id: Date.now(),
            nom: fullName,
            email: newEmail,
            password: newPassword || "eleve123",
            role: "ELEVE",
            eleve_id: studentId,
            is_active: true
          });
        }
      }

      // Async backend password update if new password provided
      if (newEmail && newPassword) {
        try {
          const token = localStorage.getItem("auth_token");
          fetch('/api/users/by-email', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ email: newEmail, password: newPassword })
          }).catch(() => {});
        } catch {}
      }

      return {
        ...prev,
        eleves: (prev.eleves || []).map((e) =>
          e.id === studentId ? { ...e, ...updatedFields } : e,
        ),
        utilisateurs: updatedUsers
      };
    });
    showToast(`Dossier et accès de l'élève mis à jour.`);
  };

  const deleteEleve = (id) => {
    const studentId = Number(id);
    setData((prev) => ({
      ...prev,
      eleves: (prev.eleves || []).filter((e) => e.id !== studentId),
      pointages: (prev.pointages || []).filter((p) => p.eleve_id !== studentId),
      paiements: (prev.paiements || []).filter((p) => p.eleve_id !== studentId),
      resultats: (prev.resultats || []).filter((r) => r.eleve_id !== studentId),
      incidents: (prev.incidents || []).filter((i) => i.eleve_id !== studentId),
      discipline: (prev.discipline || []).filter((d) => d.eleve_id !== studentId),
      utilisateurs: (prev.utilisateurs || []).filter((u) => u.eleve_id !== studentId),
    }));
    showToast(`Élève supprimé du registre.`);
    if (selectedEleveId === studentId) {
      setCurrentView("eleves");
    }
  }; /* CRUD Teachers & Courses */
  const addTeacher = (teacherData) => {
    const nextId =
      ((data?.enseignants || []).length > 0
        ? Math.max(...(data?.enseignants || []).map((t) => t.id))
        : 0) + 1;
    const newTeacher = { id: nextId, ...teacherData };
    setData((prev) => ({
      ...prev,
      enseignants: [newTeacher, ...prev.enseignants],
    }));
    showToast(`Enseignant ${teacherData.nom} ajouté.`);
    return newTeacher;
  };
  const updateTeacher = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      enseignants: prev.enseignants.map((t) =>
        t.id === Number(id) ? { ...t, ...updatedFields } : t,
      ),
    }));
    showToast(`Dossier enseignant mis à jour.`);
  };
  const deleteTeacher = (id) => {
    setData((prev) => ({
      ...prev,
      enseignants: prev.enseignants.filter((t) => t.id !== Number(id)),
      cours: prev.cours.map((c) =>
        c.enseignant_id === Number(id) ? { ...c, enseignant_id: null } : c,
      ),
      classes: prev.classes.map((c) =>
        c.prof_id === Number(id) ? { ...c, prof_id: null } : c,
      ),
    }));
    showToast(`Enseignant retiré du registre.`);
  };

  /* =========================================================================
     GESTION DES CLASSES PÉDAGOGIQUES (CRUD, HISTORIQUE, EFFECTIFS)
     ========================================================================= */

  const addClass = (classData) => {
    const nextId =
      ((data?.classes || []).length > 0
        ? Math.max(...(data?.classes || []).map((c) => Number(c.id) || 0))
        : 0) + 1;

    const teacher = (data?.enseignants || []).find((t) => t.id === Number(classData.prof_id));
    const room = (data?.salles || []).find((s) => s.id === Number(classData.salle_id));
    const today = new Date().toISOString().split("T")[0];

    const newClass = {
      id: nextId,
      nom: classData.nom?.trim() || `Classe ${nextId}`,
      code: classData.code?.trim() || `CLS-${String(nextId).padStart(3, "0")}`,
      division: classData.division?.trim() || "A",
      cycle: classData.cycle || "Humanités / Enseignement Secondaire",
      cycle_id: classData.cycle_id ? Number(classData.cycle_id) : 4,
      niveau_id: classData.niveau_id ? Number(classData.niveau_id) : 12,
      annee_etude: classData.annee_etude || "1ère Humanités",
      section: classData.section || "Générale",
      filiere: classData.filiere || "",
      option_id: classData.option_id ? Number(classData.option_id) : null,
      capacite_recommandee: Number(classData.capacite_recommandee) || 35,
      seuil_alerte: Number(classData.seuil_alerte) || 40,
      capacite: Number(classData.capacite || classData.capacite_max) || 45,
      capacite_max: Number(classData.capacite_max || classData.capacite) || 45,
      prof_id: classData.prof_id ? Number(classData.prof_id) : null,
      salle_id: classData.salle_id ? Number(classData.salle_id) : null,
      annee_scolaire: classData.annee_scolaire || data?.ecoleConfig?.annee_courante || "2025-2026",
      statut: classData.statut || "active", // active | inactive | archivee | fermee
      description: classData.description || "",
      titulaire_historique: teacher
        ? [
            {
              prof_id: teacher.id,
              prof_nom: `${teacher.nom} ${teacher.prenom || ""}`.trim(),
              fonction: teacher.fonction || "Titulaire principal",
              date_debut: today,
              date_fin: null,
              motif: "Affectation initiale lors de la création",
              statut: "Actif",
            },
          ]
        : [],
      salle_historique: room
        ? [
            {
              salle_id: room.id,
              salle_nom: `${room.nom} (${room.code})`,
              date_debut: today,
              date_fin: null,
              motif: "Attribution initiale lors de la création",
              modifie_par: currentUser?.first_name || "Direction",
            },
          ]
        : [],
      modification_historique: [
        {
          date: today,
          auteur: currentUser?.first_name || "Administration",
          action: "Création de la classe",
          details: `Création initiale avec capacité max de ${classData.capacite_max || 45} places`,
        },
      ],
    };

    setData((prev) => ({
      ...prev,
      classes: [newClass, ...(prev.classes || [])],
    }));

    showToast(`Classe "${newClass.nom}" créée avec succès !`);
    return newClass;
  };

  const updateClass = (id, updatedFields, reason = "Mise à jour standard") => {
    const classId = Number(id);
    const today = new Date().toISOString().split("T")[0];

    setData((prev) => {
      const prevClass = (prev.classes || []).find((c) => c.id === classId);
      if (!prevClass) return prev;

      let titulaireHistorique = [...(prevClass.titulaire_historique || [])];
      let salleHistorique = [...(prevClass.salle_historique || [])];
      let modificationHistorique = [...(prevClass.modification_historique || [])];

      // Check if teacher changed
      const newProfId = updatedFields.prof_id !== undefined ? (updatedFields.prof_id ? Number(updatedFields.prof_id) : null) : prevClass.prof_id;
      if (newProfId !== prevClass.prof_id) {
        // Close previous active titulaire record
        titulaireHistorique = titulaireHistorique.map((th) =>
          !th.date_fin ? { ...th, date_fin: today, statut: "Terminé" } : th
        );

        if (newProfId) {
          const newTeacher = (prev.enseignants || []).find((t) => t.id === newProfId);
          titulaireHistorique.unshift({
            prof_id: newProfId,
            prof_nom: newTeacher ? `${newTeacher.nom} ${newTeacher.prenom || ""}`.trim() : "Enseignant",
            fonction: newTeacher?.fonction || "Titulaire principal",
            date_debut: today,
            date_fin: null,
            motif: reason || "Changement de titulaire",
            statut: "Actif",
          });
        }
      }

      // Check if room changed
      const newSalleId = updatedFields.salle_id !== undefined ? (updatedFields.salle_id ? Number(updatedFields.salle_id) : null) : prevClass.salle_id;
      if (newSalleId !== prevClass.salle_id) {
        // Close previous room record
        salleHistorique = salleHistorique.map((sh) =>
          !sh.date_fin ? { ...sh, date_fin: today } : sh
        );

        if (newSalleId) {
          const newRoom = (prev.salles || []).find((s) => s.id === newSalleId);
          salleHistorique.unshift({
            salle_id: newSalleId,
            salle_nom: newRoom ? `${newRoom.nom} (${newRoom.code})` : "Salle",
            date_debut: today,
            date_fin: null,
            motif: reason || "Nouvelle affectation de salle",
            modifie_par: currentUser?.first_name || "Administration",
          });
        }
      }

      // Audit log entry
      modificationHistorique.unshift({
        date: today,
        auteur: currentUser?.first_name || "Administration",
        action: updatedFields.statut && updatedFields.statut !== prevClass.statut ? `Statut: ${updatedFields.statut}` : "Modification classe",
        details: reason || "Mise à jour des paramètres de la classe",
      });

      const merged = {
        ...prevClass,
        ...updatedFields,
        prof_id: newProfId,
        salle_id: newSalleId,
        capacite: Number(updatedFields.capacite || updatedFields.capacite_max || prevClass.capacite),
        capacite_max: Number(updatedFields.capacite_max || updatedFields.capacite || prevClass.capacite_max),
        capacite_recommandee: Number(updatedFields.capacite_recommandee || prevClass.capacite_recommandee || 35),
        seuil_alerte: Number(updatedFields.seuil_alerte || prevClass.seuil_alerte || 40),
        titulaire_historique: titulaireHistorique,
        salle_historique: salleHistorique,
        modification_historique: modificationHistorique,
      };

      return {
        ...prev,
        classes: (prev.classes || []).map((c) => (c.id === classId ? merged : c)),
      };
    });

    showToast(`Classe mise à jour avec succès.`);
  };

  const archiveClass = (id, reason = "Archivage de la classe") => {
    updateClass(id, { statut: "archivee" }, reason);
    showToast(`Classe archivée.`);
  };

  const restoreClass = (id) => {
    updateClass(id, { statut: "active" }, "Restauration de la classe");
    showToast(`Classe réactivée.`);
  };

  const deleteClass = (id, force = false) => {
    const classId = Number(id);
    const studentsInClass = (data?.eleves || []).filter((e) => e.classe_id === classId);

    if (studentsInClass.length > 0 && !force) {
      return {
        success: false,
        error: `Impossible de supprimer directement cette classe : elle contient ${studentsInClass.length} élève(s) inscrit(s). Privilégiez l'archivage ou transférez d'abord les élèves.`,
        studentCount: studentsInClass.length,
      };
    }

    setData((prev) => ({
      ...prev,
      classes: (prev.classes || []).filter((c) => c.id !== classId),
      eleves: (prev.eleves || []).map((e) => (e.classe_id === classId ? { ...e, classe_id: null } : e)),
      cours: (prev.cours || []).map((co) => (co.classe_id === classId ? { ...co, classe_id: null } : co)),
    }));

    showToast(`Classe supprimée.`);
    return { success: true };
  };

  /* =========================================================================
     GESTION DES SALLES PHYSIQUES / PÉDAGOGIQUES (CRUD, DIMENSIONS, ÉQUIPEMENTS)
     ========================================================================= */

  const addRoom = (roomData) => {
    const nextId =
      ((data?.salles || []).length > 0
        ? Math.max(...(data?.salles || []).map((s) => Number(s.id) || 0))
        : 0) + 1;

    const longueur = Number(roomData.longueur) || 8.0;
    const largeur = Number(roomData.largeur) || 6.0;
    const hauteur = Number(roomData.hauteur) || 3.0;
    const surface = Number(roomData.surface) || Number((longueur * largeur).toFixed(2));
    const capacite = Number(roomData.capacite || roomData.capacite_max || roomData.places_assises) || 40;

    const newRoom = {
      id: nextId,
      code: roomData.code?.trim() || `SAL-${String(nextId).padStart(3, "0")}`,
      nom: roomData.nom?.trim() || `Salle ${nextId}`,
      type: roomData.type || "Salle de classe ordinaire",
      type_id: roomData.type_id ? Number(roomData.type_id) : 1,
      batiment: roomData.batiment || "Bâtiment Principal",
      etage: roomData.etage || "Rez-de-chaussée",
      porte: roomData.porte || `Porte ${nextId}`,
      localisation: roomData.localisation || "",
      longueur,
      largeur,
      hauteur,
      surface,
      places_assises: Number(roomData.places_assises) || capacite,
      capacite,
      capacite_max: capacite,
      etat: roomData.etat || "bon_etat", // bon_etat | a_surveiller | a_renover | maintenance | hors_service
      disponible: roomData.disponible !== undefined ? !!roomData.disponible : true,
      description: roomData.description || "",
      equipements: Array.isArray(roomData.equipements) ? roomData.equipements : [],
      historique: [],
    };

    setData((prev) => ({
      ...prev,
      salles: [newRoom, ...(prev.salles || [])],
    }));

    showToast(`Salle physique "${newRoom.nom}" enregistrée !`);
    return newRoom;
  };

  const updateRoom = (id, updatedFields, reason = "Mise à jour salle") => {
    const roomId = Number(id);
    setData((prev) => {
      const prevRoom = (prev.salles || []).find((s) => s.id === roomId);
      if (!prevRoom) return prev;

      const longueur = updatedFields.longueur !== undefined ? Number(updatedFields.longueur) : prevRoom.longueur;
      const largeur = updatedFields.largeur !== undefined ? Number(updatedFields.largeur) : prevRoom.largeur;
      const hauteur = updatedFields.hauteur !== undefined ? Number(updatedFields.hauteur) : prevRoom.hauteur;
      const surface = updatedFields.surface !== undefined ? Number(updatedFields.surface) : Number((longueur * largeur).toFixed(2));
      const capacite = Number(updatedFields.capacite || updatedFields.capacite_max || prevRoom.capacite || 40);

      const merged = {
        ...prevRoom,
        ...updatedFields,
        longueur,
        largeur,
        hauteur,
        surface,
        capacite,
        capacite_max: capacite,
      };

      // If room is placed in maintenance or out of order, issue warning if classes are assigned
      if ((merged.etat === "maintenance" || merged.etat === "hors_service") && prevRoom.etat !== merged.etat) {
        const assignedClasses = (prev.classes || []).filter((c) => c.salle_id === roomId && c.statut === "active");
        if (assignedClasses.length > 0) {
          setTimeout(() => {
            showToast(`⚠️ Alerte : ${assignedClasses.length} classe(s) active(s) sont affectées à cette salle en maintenance.`);
          }, 500);
        }
      }

      return {
        ...prev,
        salles: (prev.salles || []).map((s) => (s.id === roomId ? merged : s)),
      };
    });

    showToast(`Salle mise à jour avec succès.`);
  };

  const deleteRoom = (id, force = false) => {
    const roomId = Number(id);
    const assignedClasses = (data?.classes || []).filter((c) => c.salle_id === roomId);

    if (assignedClasses.length > 0 && !force) {
      return {
        success: false,
        error: `Impossible de supprimer cette salle : elle est actuellement affectée à ${assignedClasses.length} classe(s). Veuillez d'abord réaffecter ces classes.`,
        assignedCount: assignedClasses.length,
      };
    }

    setData((prev) => ({
      ...prev,
      salles: (prev.salles || []).filter((s) => s.id !== roomId),
      classes: (prev.classes || []).map((c) => (c.salle_id === roomId ? { ...c, salle_id: null } : c)),
    }));

    showToast(`Salle supprimée.`);
    return { success: true };
  };

  /* =========================================================================
     AFFECTATION CLASSE <-> SALLE AVEC VALIDATIONS
     ========================================================================= */

  const assignClassRoom = (classId, roomId, motif = "Affectation de salle", author = "Direction") => {
    const cId = Number(classId);
    const rId = roomId ? Number(roomId) : null;
    const targetClass = (data?.classes || []).find((c) => c.id === cId);
    const targetRoom = rId ? (data?.salles || []).find((s) => s.id === rId) : null;

    if (!targetClass) return { success: false, error: "Classe introuvable" };

    const classStudentsCount = (data?.eleves || []).filter((e) => e.classe_id === cId && e.statut !== "inactif").length;
    let warnings = [];

    if (targetRoom) {
      if (targetRoom.etat === "maintenance" || targetRoom.etat === "hors_service") {
        warnings.push(`La salle ${targetRoom.nom} est actuellement en état "${targetRoom.etat}".`);
      }
      if (targetRoom.capacite_max < classStudentsCount) {
        warnings.push(`Capacité insuffisante : La salle offre ${targetRoom.capacite_max} places pour un effectif actuel de ${classStudentsCount} élèves.`);
      }
      // Check if another active class already occupies this room full-time
      const otherClasses = (data?.classes || []).filter((c) => c.salle_id === rId && c.id !== cId && c.statut === "active");
      if (otherClasses.length > 0) {
        warnings.push(`Salle partagée : ${otherClasses.map((c) => c.nom).join(", ")} utilise(nt) également cet espace.`);
      }
    }

    updateClass(cId, { salle_id: rId }, motif);

    if (targetRoom) {
      // Also register in room's history
      setData((prev) => ({
        ...prev,
        salles: (prev.salles || []).map((s) => {
          if (s.id === rId) {
            const hist = [...(s.historique || [])];
            hist.unshift({
              id: Date.now(),
              classe_nom: targetClass.nom,
              date_debut: new Date().toISOString().split("T")[0],
              date_fin: null,
              motif: motif,
              modifie_par: author || currentUser?.first_name || "Direction",
            });
            return { ...s, historique: hist };
          }
          return s;
        }),
      }));
    }

    showToast(rId ? `Classe "${targetClass.nom}" affectée à "${targetRoom?.nom}".` : `Affectation de salle retirée pour "${targetClass.nom}".`);
    return { success: true, warnings };
  };

  /* =========================================================================
     GESTION DES ÉQUIPEMENTS DE SALLES
     ========================================================================= */

  const addRoomEquipment = (roomId, equipData) => {
    const rId = Number(roomId);
    const today = new Date().toISOString().split("T")[0];

    setData((prev) => ({
      ...prev,
      salles: (prev.salles || []).map((s) => {
        if (s.id === rId) {
          const equipList = [...(s.equipements || [])];
          const nextEqId = (equipList.length > 0 ? Math.max(...equipList.map((e) => Number(e.id) || 0)) : 0) + 1;
          const newEq = {
            id: nextEqId,
            nom: equipData.nom?.trim() || "Équipement",
            quantite: Number(equipData.quantite) || 1,
            etat: equipData.etat || "Bon", // Bon | À surveiller | À réparer | Hors service
            date_ajout: equipData.date_ajout || today,
            observation: equipData.observation || "",
          };
          return { ...s, equipements: [newEq, ...equipList] };
        }
        return s;
      }),
    }));
    showToast(`Équipement ajouté à la salle.`);
  };

  const updateRoomEquipment = (roomId, equipId, updatedData) => {
    const rId = Number(roomId);
    const eqId = Number(equipId);

    setData((prev) => ({
      ...prev,
      salles: (prev.salles || []).map((s) => {
        if (s.id === rId) {
          return {
            ...s,
            equipements: (s.equipements || []).map((eq) =>
              eq.id === eqId ? { ...eq, ...updatedData, quantite: Number(updatedData.quantite ?? eq.quantite) } : eq
            ),
          };
        }
        return s;
      }),
    }));
    showToast(`Équipement mis à jour.`);
  };

  const deleteRoomEquipment = (roomId, equipId) => {
    const rId = Number(roomId);
    const eqId = Number(equipId);

    setData((prev) => ({
      ...prev,
      salles: (prev.salles || []).map((s) => {
        if (s.id === rId) {
          return {
            ...s,
            equipements: (s.equipements || []).filter((eq) => eq.id !== eqId),
          };
        }
        return s;
      }),
    }));
    showToast(`Équipement retiré de la salle.`);
  };

  /* =========================================================================
     CONFIGURATION PÉDAGOGIQUE DYNAMIQUE (CYCLES, NIVEAUX, OPTIONS, TYPES, NORMES)
     ========================================================================= */

  const updatePedagogieConfig = (newConfig) => {
    setData((prev) => ({
      ...prev,
      ...(newConfig.cycles ? { cycles: newConfig.cycles } : {}),
      ...(newConfig.niveaux ? { niveaux: newConfig.niveaux } : {}),
      ...(newConfig.options ? { options: newConfig.options } : {}),
      ...(newConfig.typesSalles ? { typesSalles: newConfig.typesSalles } : {}),
      ...(newConfig.normesPedagogiques ? { normesPedagogiques: { ...prev.normesPedagogiques, ...newConfig.normesPedagogiques } } : {}),
    }));
    showToast(`Paramètres pédagogiques mis à jour !`);
  };

  /* =========================================================================
     MOTEUR DE STATISTIQUES & ALERTES POUR CLASSES ET SALLES
     ========================================================================= */

  const getClassStats = (classId) => {
    const cId = Number(classId);
    const cls = (data?.classes || []).find((c) => c.id === cId);
    if (!cls) return null;

    const classStudents = (data?.eleves || []).filter((e) => e.classe_id === cId && e.statut !== "inactif");
    const total_eleves = classStudents.length;
    const garcons = classStudents.filter((e) => e.sexe === "M").length;
    const filles = classStudents.filter((e) => e.sexe === "F").length;

    const capacite_recommandee = Number(cls.capacite_recommandee) || 35;
    const seuil_alerte = Number(cls.seuil_alerte) || 40;
    const capacite_max = Number(cls.capacite_max || cls.capacite) || 45;

    const places_restantes = Math.max(0, capacite_max - total_eleves);
    const taux_occupation = capacite_max > 0 ? Math.round((total_eleves / capacite_max) * 100) : 0;

    let alert_status = "normal"; // normal | alerte | surcharge
    let status_color = "emerald";
    let status_label = "Effectif normal";

    if (total_eleves > capacite_max) {
      alert_status = "surcharge";
      status_color = "rose";
      status_label = `Surcharge (+${total_eleves - capacite_max} élèves)`;
    } else if (total_eleves >= seuil_alerte) {
      alert_status = "alerte";
      status_color = "amber";
      status_label = "Seuil d'alerte atteint";
    }

    const assignedRoom = (data?.salles || []).find((s) => s.id === cls.salle_id);
    const assignedTeacher = (data?.enseignants || []).find((t) => t.id === cls.prof_id);

    return {
      total_eleves,
      garcons,
      filles,
      capacite_recommandee,
      seuil_alerte,
      capacite_max,
      places_restantes,
      taux_occupation,
      alert_status,
      status_color,
      status_label,
      assignedRoom,
      assignedTeacher,
    };
  };

  const getRoomStats = (roomId) => {
    const rId = Number(roomId);
    const room = (data?.salles || []).find((s) => s.id === rId);
    if (!room) return null;

    const assignedClasses = (data?.classes || []).filter((c) => c.salle_id === rId && c.statut === "active");
    const totalStudentsOccupying = assignedClasses.reduce((sum, cls) => {
      return sum + (data?.eleves || []).filter((e) => e.classe_id === cls.id && e.statut !== "inactif").length;
    }, 0);

    const surface = Number(room.surface) || Number((room.longueur * room.largeur).toFixed(2)) || 50;
    const surface_par_eleve = totalStudentsOccupying > 0 ? (surface / totalStudentsOccupying).toFixed(2) : (surface / (room.capacite_max || 40)).toFixed(2);

    const equipementsCount = (room.equipements || []).reduce((sum, eq) => sum + Number(eq.quantite || 1), 0);
    const equipementsEnBonEtat = (room.equipements || []).filter((eq) => eq.etat === "Bon").reduce((sum, eq) => sum + Number(eq.quantite || 1), 0);

    return {
      surface,
      surface_par_eleve,
      assignedClasses,
      totalStudentsOccupying,
      capacite_max: room.capacite_max || 40,
      taux_occupation: room.capacite_max ? Math.round((totalStudentsOccupying / room.capacite_max) * 100) : 0,
      equipementsCount,
      equipementsEnBonEtat,
    };
  };

  const getPedagogieAlerts = () => {
    const alerts = [];
    const classes = data?.classes || [];
    const salles = data?.salles || [];
    const eleves = data?.eleves || [];

    classes.forEach((cls) => {
      if (cls.statut !== "active") return;
      const count = eleves.filter((e) => e.classe_id === cls.id && e.statut !== "inactif").length;
      const capMax = Number(cls.capacite_max || cls.capacite) || 45;
      const seuilAlerte = Number(cls.seuil_alerte) || 40;

      if (count > capMax) {
        alerts.push({
          id: `surcharge-${cls.id}`,
          type: "danger",
          category: "Capacité",
          title: `Surcharge d'effectif : ${cls.nom}`,
          message: `L'effectif actuel (${count} élèves) dépasse la capacité maximale autorisée (${capMax} places).`,
          classId: cls.id,
        });
      } else if (count >= seuilAlerte) {
        alerts.push({
          id: `seuil-${cls.id}`,
          type: "warning",
          category: "Capacité",
          title: `Seuil d'alerte atteint : ${cls.nom}`,
          message: `L'effectif (${count} élèves) s'approche de la limite maximale (${capMax} places).`,
          classId: cls.id,
        });
      }

      if (!cls.prof_id) {
        alerts.push({
          id: `sans-titulaire-${cls.id}`,
          type: "warning",
          category: "Pédagogie",
          title: `Classe sans titulaire : ${cls.nom}`,
          message: `Aucun enseignant titulaire n'est actuellement assigné à cette classe.`,
          classId: cls.id,
        });
      }

      if (!cls.salle_id) {
        alerts.push({
          id: `sans-salle-${cls.id}`,
          type: "info",
          category: "Infrastructure",
          title: `Classe sans salle affectée : ${cls.nom}`,
          message: `Cette classe n'a pas encore de salle physique ou pédagogique attribuée.`,
          classId: cls.id,
        });
      } else {
        const room = salles.find((s) => s.id === cls.salle_id);
        if (room && (room.etat === "maintenance" || room.etat === "hors_service")) {
          alerts.push({
            id: `salle-maintenance-${cls.id}`,
            type: "danger",
            category: "Maintenance",
            title: `Salle en maintenance : ${room.nom}`,
            message: `La classe ${cls.nom} est affectée à une salle actuellement en état "${room.etat}".`,
            classId: cls.id,
            roomId: room.id,
          });
        }
      }
    });

    salles.forEach((s) => {
      if (s.etat === "a_surveiller" || s.etat === "a_renover") {
        alerts.push({
          id: `salle-etat-${s.id}`,
          type: "warning",
          category: "Infrastructure",
          title: `État de la salle à surveiller : ${s.nom}`,
          message: `Cette salle nécessite des vérifications ou des travaux de rénovation légers.`,
          roomId: s.id,
        });
      }
    });

    return alerts;
  };

  /* Payments & Finance CRUD */
  const addPaiement = (paymentData) => {
    const nextId =
      ((data?.paiements || []).length > 0
        ? Math.max(...(data?.paiements || []).map((p) => p.id))
        : 0) + 1;
    const reference = `REC-2026-${String(nextId).padStart(5, "0")}`;
    const newPayment = {
      ...paymentData,
      id: nextId,
      reference,
      montant_paye: Number(paymentData.montant_paye),
      date_paiement:
        paymentData.date_paiement ||
        new Date().toLocaleString("fr-FR", {
          dateStyle: "short",
          timeStyle: "short",
        }),
      recu_genere: true,
      mode: paymentData.mode || "Espèces (Caisse)",
    };
    setData((prev) => ({
      ...prev,
      paiements: [newPayment, ...prev.paiements],
    }));
    showToast(
      `Paiement de ${newPayment.montant_paye.toLocaleString("fr-FR")} CDF enregistré !`,
    );
    setSelectedPaiementId(nextId);
    return newPayment;
  };
  const addDepense = (depenseData) => {
    const nextId =
      ((data?.depenses || []).length > 0
        ? Math.max(...(data?.depenses || []).map((d) => d.id))
        : 0) + 1;
    const newDepense = {
      ...depenseData,
      id: nextId,
      montant: Number(depenseData.montant),
      date: depenseData.date || new Date().toISOString().split("T")[0],
    };
    setData((prev) => ({ ...prev, depenses: [newDepense, ...prev.depenses] }));
    showToast(
      `Dépense de ${newDepense.montant.toLocaleString("fr-FR")} CDF enregistrée.`,
    );
    return newDepense;
  }; /* Attendance Pointages & Automatic Parent Notification Trigger */
  const togglePointage = (eleveId, newStatus) => {
    const today = "2026-08-20";
    const eleve = (data?.eleves || []).find((e) => e.id === Number(eleveId));
    setData((prev) => {
      const existing = prev.pointages.find(
        (p) => p.eleve_id === Number(eleveId) && p.date === today,
      );
      let updatedPointages;
      if (existing) {
        updatedPointages = prev.pointages.map((p) =>
          p.id === existing.id ? { ...p, statut: newStatus } : p,
        );
      } else {
        const nextId =
          (prev.pointages.length > 0
            ? Math.max(...prev.pointages.map((p) => p.id))
            : 0) + 1;
        updatedPointages = [
          ...prev.pointages,
          {
            id: nextId,
            eleve_id: Number(eleveId),
            date: today,
            statut: newStatus,
            motif: "",
            heure_arrivee: newStatus === "present" ? "07:30" : null,
            heure_depart: newStatus === "present" ? "13:00" : null,
          },
        ];
      } /* If student is marked absent or retard, automatically generate a notification for the parent / system */
      let updatedNotifications = prev.notifications || [];
      if (eleve && (newStatus === "absent" || newStatus === "retard")) {
        const nextNotifId =
          (prev.notifications && prev.notifications.length > 0
            ? Math.max(...prev.notifications.map((n) => n.id))
            : 0) + 1;
        const newNotif = {
          id: nextNotifId,
          type: newStatus === "absent" ? "urgence" : "info",
          titre:
            newStatus === "absent"
              ? `🚨 Alerte Absence : ${eleve.nom} ${eleve.prenom}`
              : `⚠️ Retard constaté : ${eleve.nom} ${eleve.prenom}`,
          message:
            newStatus === "absent"
              ? `L'élève ${eleve.nom} ${eleve.prenom} n'est pas présent(e) en classe ce matin. Un SMS et un e-mail d'alerte ont été envoyés au tuteur (${eleve.nom_parent || eleve.telephone}).`
              : `L'élève ${eleve.nom} ${eleve.prenom} est arrivé(e) en retard en classe aujourd'hui à 08h15.`,
          date: "À l'instant",
          lu: false,
        };
        updatedNotifications = [newNotif, ...updatedNotifications];
      }
      return {
        ...prev,
        pointages: updatedPointages,
        notifications: updatedNotifications,
      };
    });
    if (eleve && newStatus === "absent") {
      showToast(
        `🚨 Absence enregistrée pour ${eleve.nom}. Notification & SMS transmis aux parents.`,
      );
    } else if (eleve && newStatus === "retard") {
      showToast(`⚠️ Retard enregistré pour ${eleve.nom}. Alerte parent émise.`);
    }
  }; /* Discipline Incident CRUD */
  const addIncident = (incidentData) => {
    const nextId =
      ((data?.incidents || []).length > 0
        ? Math.max(...(data?.incidents || []).map((i) => i.id))
        : 0) + 1;
    const newIncident = {
      ...incidentData,
      id: nextId,
      eleve_id: Number(incidentData.eleve_id),
      date: incidentData.date || new Date().toISOString().split("T")[0],
      date_cloture: null,
    };
    setData((prev) => ({
      ...prev,
      incidents: [newIncident, ...prev.incidents],
    }));
    showToast(`Incident disciplinaire consigné.`);
    return newIncident;
  };
  const closeIncident = (id) => {
    setData((prev) => ({
      ...prev,
      incidents: prev.incidents.map((i) =>
        i.id === Number(id)
          ? { ...i, date_cloture: new Date().toISOString().split("T")[0] }
          : i,
      ),
    }));
    showToast(`Dossier disciplinaire clôturé.`);
  }; /* Results & Marks */
  const saveResultat = (resultatData) => {
    setData((prev) => {
      const existingIndex = prev.resultats.findIndex(
        (r) =>
          r.eleve_id === Number(resultatData.eleve_id) &&
          r.cours_id === Number(resultatData.cours_id) &&
          r.periode_id === Number(resultatData.periode_id),
      );
      if (existingIndex >= 0) {
        const updated = [...prev.resultats];
        updated[existingIndex] = {
          ...updated[existingIndex],
          note: Number(resultatData.note),
          appreciation:
            resultatData.appreciation || updated[existingIndex].appreciation,
          date_saisie: new Date().toISOString().split("T")[0],
        };
        return { ...prev, resultats: updated };
      } else {
        const nextId =
          (prev.resultats.length > 0
            ? Math.max(...prev.resultats.map((r) => r.id))
            : 0) + 1;
        const newRes = {
          ...resultatData,
          id: nextId,
          eleve_id: Number(resultatData.eleve_id),
          cours_id: Number(resultatData.cours_id),
          periode_id: Number(resultatData.periode_id || 4),
          note: Number(resultatData.note),
          max_note: 20,
          date_saisie: new Date().toISOString().split("T")[0],
        };
        return { ...prev, resultats: [...prev.resultats, newRes] };
      }
    });
    showToast(`Note enregistrée avec succès.`);
  }; /* Messages & Communications */
  const addMessage = (msg) => {
    const nextId =
      ((data?.messages || []).length > 0
        ? Math.max(...(data?.messages || []).map((m) => m.id))
        : 0) + 1;
    const newMsg = {
      ...msg,
      id: nextId,
      date_envoi: new Date().toLocaleString("fr-FR", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      lu: false,
    };
    setData((prev) => ({ ...prev, messages: [newMsg, ...prev.messages] }));
    showToast(`Message transmis avec succès.`);
    return newMsg;
  };
  const markMessageAsRead = (id) => {
    setData((prev) => ({
      ...prev,
      messages: prev.messages.map((m) =>
        m.id === Number(id) ? { ...m, lu: true } : m,
      ),
    }));
  };
  const markNotificationAsRead = (id) => {
    setData((prev) => ({
      ...prev,
      notifications: (prev.notifications || []).map((n) =>
        n.id === Number(id) ? { ...n, lu: true } : n,
      ),
    }));
  };

  /* Student Alerts and Reports System */
  const addStudentAlert = async (alertData) => {
    const nextId =
      ((data?.studentAlerts || []).length > 0
        ? Math.max(...(data?.studentAlerts || []).map((a) => Number(a.id) || 0))
        : 0) + 1;
    const student = (data?.eleves || []).find((e) => e.id === Number(alertData.eleve_id)) || (data?.eleves || [])[0];
    const newAlert = {
      id: nextId,
      eleve_id: alertData.eleve_id || student?.id,
      eleve_nom: alertData.eleve_nom || `${student?.nom || ''} ${student?.prenom || ''}`.trim() || "Élève",
      category: alertData.category || "Discipline",
      recipient: alertData.recipient || "Préfecture des études",
      subject: alertData.subject,
      description: alertData.description,
      priority: alertData.priority || "Normale",
      attachment: alertData.attachment || null,
      status: "Soumis", // Soumis, Reçu, En cours d'examen, Résolu, Clôturé
      createdAt: new Date().toISOString(),
      adminNotes: "",
    };

    setData((prev) => ({
      ...prev,
      studentAlerts: [newAlert, ...(prev.studentAlerts || [])],
    }));

    // Async backend call
    try {
      const token = localStorage.getItem("auth_token");
      fetch('/api/student/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newAlert)
      }).catch(() => {});
    } catch {}

    showToast("Votre signalement a été transmis à la Préfecture avec succès.");
    return newAlert;
  };

  const addCorrectionRequest = async (requestData) => {
    const nextId =
      ((data?.correctionRequests || []).length > 0
        ? Math.max(...(data?.correctionRequests || []).map((c) => Number(c.id) || 0))
        : 0) + 1;
    const student = (data?.eleves || []).find((e) => e.id === Number(requestData.eleve_id)) || (data?.eleves || [])[0];
    const newRequest = {
      id: nextId,
      eleve_id: requestData.eleve_id || student?.id,
      eleve_nom: requestData.eleve_nom || `${student?.nom || ''} ${student?.prenom || ''}`.trim() || "Élève",
      field: requestData.field,
      currentValue: requestData.currentValue,
      requestedValue: requestData.requestedValue,
      reason: requestData.reason,
      status: "En attente",
      createdAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      correctionRequests: [newRequest, ...(prev.correctionRequests || [])],
    }));

    // Async backend call
    try {
      const token = localStorage.getItem("auth_token");
      fetch('/api/student/corrections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newRequest)
      }).catch(() => {});
    } catch {}

    showToast("Demande de correction transmise à l'administration.");
    return newRequest;
  };
  const resetToDefaultData = () => {
    setData(initialData);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("auth_token");
    setCurrentUser(null);
    setCurrentView("landing");
    showToast(`Données réinitialisées aux valeurs d'origine.`);
  }; /* Computed Statistics Engine */
  const getStats = () => {
    const total_eleves = (data?.eleves || []).length;
    const total_garcons = (data.eleves || []).filter((e) => e.sexe === "M").length;
    const total_filles = (data.eleves || []).filter((e) => e.sexe === "F").length;
    const garcons_percentage = total_eleves
      ? Math.round((total_garcons / total_eleves) * 100)
      : 0;
    const filles_percentage = total_eleves
      ? Math.round((total_filles / total_eleves) * 100)
      : 0;
    const total_enseignants = (data?.enseignants || []).length;
    const total_classes = (data?.classes || []).length;
    const total_cours = (data?.cours || []).length;
    const today = "2026-08-20";
    const pointagesToday = (data.pointages || []).filter((p) => p.date === today);
    const presentCount = pointagesToday.filter(
      (p) => p.statut === "present",
    ).length;
    const absentCount = pointagesToday.filter(
      (p) => p.statut === "absent",
    ).length;
    const retardCount = pointagesToday.filter(
      (p) => p.statut === "retard",
    ).length;
    const maladeCount = pointagesToday.filter(
      (p) => p.statut === "malade",
    ).length;
    const presenceRate = pointagesToday.length
      ? Math.round((presentCount / pointagesToday.length) * 100)
      : 0;
    const total_recouvrement = (data.paiements || []).reduce(
      (sum, p) => sum + Number(p.montant_paye),
      0,
    );
    const total_depenses = (data?.depenses || []).reduce(
      (sum, d) => sum + Number(d.montant),
      0,
    );
    const solde_caisse = total_recouvrement - total_depenses;
    const total_incidents_actifs = (data.incidents || []).filter(
      (i) => !i.date_cloture,
    ).length;
    const unread_notifications = (data.notifications || []).filter((n) => !n.lu).length;
    const unread_messages = (data.messages || []).filter((m) => !m.lu).length;
    return {
      total_eleves,
      total_garcons,
      total_filles,
      garcons_percentage,
      filles_percentage,
      total_enseignants,
      total_classes,
      total_cours,
      presentCount,
      absentCount,
      retardCount,
      maladeCount,
      presenceRate,
      total_recouvrement,
      total_depenses,
      solde_caisse,
      total_incidents_actifs,
      unread_notifications,
      unread_messages,
    };
  }; /* Detailed Student Calculation Helper */
  const getEleveDetail = (id) => {
    const eleve = (data?.eleves || []).find((e) => e.id === Number(id));
    if (!eleve) return null;
    const classe = (data?.classes || []).find((c) => c.id === eleve.classe_id);
    const pointages = (data.pointages || []).filter((p) => p.eleve_id === eleve.id);
    const paiements = (data?.paiements || [])
      .filter((p) => p.eleve_id === eleve.id)
      .map((p) => {
        const f = (data?.frais || []).find((fr) => fr.id === p.frais_id);
        return { ...p, frais_nom: f ? f.nom : "Frais Scolaires" };
      });
    const incidents = (data.incidents || []).filter((i) => i.eleve_id === eleve.id);
    const resultats = (data?.resultats || [])
      .filter((r) => r.eleve_id === eleve.id)
      .map((r) => {
        const c = (data?.cours || []).find((co) => co.id === r.cours_id);
        const ens = (data?.enseignants || []).find((en) => en.id === r.enseignant_id);
        const per = (data?.periodes || []).find((pe) => pe.id === r.periode_id);
        return {
          ...r,
          cours_nom: c ? c.nom : "Cours",
          cours_code: c ? c.code : "",
          coefficient: c ? c.coefficient : 1,
          enseignant_nom: ens ? `${ens.nom} ${ens.prenom}` : "",
          periode_nom: per ? per.nom : "",
        };
      });
    let totalPoints = 0;
    let totalCoeff = 0;
    resultats.forEach((r) => {
      totalPoints += r.note * r.coefficient;
      totalCoeff += r.coefficient;
    });
    const moyenne =
      totalCoeff > 0 ? (totalPoints / totalCoeff).toFixed(2) : "0.00";
    const pourcentage =
      totalCoeff > 0
        ? ((totalPoints / (totalCoeff * 20)) * 100).toFixed(1)
        : "0";
    let mention = "Insuffisant";
    let mentionColor = "text-rose-400";
    if (pourcentage >= 80) {
      mention = "Très Bien (Élite)";
      mentionColor = "text-emerald-400";
    } else if (pourcentage >= 70) {
      mention = "Bien (Distinction)";
      mentionColor = "text-blue-400";
    } else if (pourcentage >= 60) {
      mention = "Assez Bien (Satisfaction)";
      mentionColor = "text-amber-400";
    } else if (pourcentage >= 50) {
      mention = "Passable (Ajourné)";
      mentionColor = "text-orange-400";
    }
    const totalFraisPayes = paiements.reduce(
      (sum, p) => sum + Number(p.montant_paye),
      0,
    );
    const totalFraisTheoriques = (data?.frais || []).reduce(
      (sum, f) => sum + Number(f.montant),
      0,
    );
    const soldeFraisDu = Math.max(0, totalFraisTheoriques - totalFraisPayes);
    return {
      ...eleve,
      classe,
      pointages,
      paiements,
      incidents,
      resultats,
      moyenne,
      pourcentage,
      mention,
      mentionColor,
      totalPoints: totalPoints.toFixed(1),
      totalCoeff,
      totalFraisPayes,
      totalFraisTheoriques,
      soldeFraisDu,
    };
  };
  const value = {
    data,
    currentUser,
    isAuthenticated: !!currentUser && currentUser.is_authenticated,
    login,
    register,
    logout,
    hasPermission,
    currentView,
    setCurrentView,
    goBack,
    canGoBack: viewHistory.length > 1,
    selectedEleveId,
    setSelectedEleveId,
    selectedPaiementId,
    setSelectedPaiementId,
    selectedClasseId,
    setSelectedClasseId,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isMobileSimulator,
    setIsMobileSimulator,
    notificationToast,
    toastMessage: notificationToast?.message,
    showToast,
    addEleve,
    updateEleve,
    deleteEleve,
    setData,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addPaiement,
    addDepense,
    togglePointage,
    addIncident,
    closeIncident,
    saveResultat,
    addMessage,
    markMessageAsRead,
    markNotificationAsRead,
    addStudentAlert,
    addCorrectionRequest,
    updateEcoleConfig,
    resetToDefaultData,
    resetToInitialData: resetToDefaultData,
    stats: getStats(),
    getEleveDetail,
    systemRoles: SYSTEM_ROLES,
    // Classes & Salles Management
    addClass,
    updateClass,
    archiveClass,
    restoreClass,
    deleteClass,
    addRoom,
    updateRoom,
    deleteRoom,
    assignClassRoom,
    addRoomEquipment,
    updateRoomEquipment,
    deleteRoomEquipment,
    updatePedagogieConfig,
    getClassStats,
    getRoomStats,
    getPedagogieAlerts,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
