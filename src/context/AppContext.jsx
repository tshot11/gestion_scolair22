import React, { createContext, useContext, useState, useEffect } from "react";
import { initialData } from "../data/initialData";
const AppContext = createContext();
const STORAGE_KEY = "GESTION_SCOLAIRE_RDC_V3";
const AUTH_STORAGE_KEY =
  "GESTION_SCOLAIRE_AUTH_USER_V3"; /* Available System Roles with pre-configured credentials & permissions */
export const SYSTEM_ROLES = {
  admin: {
    id: "admin",
    label: "Administrateur / Préfet des Études",
    badge: "Direction Générale",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    description: "Accès intégral à toute la gestion : pédagogie, finances, inscriptions, bulletins, palmarès et paramètres.",
    username: "admin",
    defaultPassword: "123",
    defaultView: "dashboard",
    allowedViews: ["dashboard", "eleves", "eleve-detail", "presences", "finance", "recu", "bulletin", "palmares", "resultats", "enseignants", "classes", "cours", "horaires", "discipline", "parents", "communication", "utilisateurs", "visio", "bibliotheque", "settings", "parametres"],
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
    allowedViews: ["dashboard", "eleves", "eleve-detail", "presences", "bulletin", "palmares", "resultats", "enseignants", "classes", "cours", "horaires", "discipline", "communication", "visio", "bibliotheque"],
    user: { id: 2, username: "prefet", first_name: "Préfet", last_name: "Etudes", role: "Préfet des Études", role_id: "PREFET", avatar: "PE", is_authenticated: true },
  },
  COMPTABLE: {
    id: "COMPTABLE",
    label: "Comptable",
    badge: "Finances",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    description: "Gestion des finances.",
    username: "comptable",
    defaultPassword: "123",
    defaultView: "finance",
    allowedViews: ["dashboard", "eleves", "finance", "recu", "communication"],
    user: { id: 3, username: "comptable", first_name: "Agent", last_name: "Comptable", role: "Comptable", role_id: "COMPTABLE", avatar: "AC", is_authenticated: true },
  },
  CAISSIER: {
    id: "CAISSIER",
    label: "Caissier / Caissière",
    badge: "Caisse",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
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
    allowedViews: ["dashboard", "eleves", "presences", "bulletin", "resultats", "classes", "cours", "horaires", "discipline", "communication", "visio", "bibliotheque"],
    user: { id: 5, username: "prof", first_name: "Jean", last_name: "Prof", role: "Enseignant", role_id: "ENSEIGNANT", avatar: "JP", is_authenticated: true },
  },
  TUTEUR: {
    id: "TUTEUR",
    label: "Tuteur (Parent)",
    badge: "Famille",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    description: "Suivi du bulletin et paiements de l'enfant assigné.",
    username: "parent",
    defaultPassword: "123",
    defaultView: "bulletin",
    allowedViews: ["bulletin", "finance", "recu", "communication"],
    user: { id: 6, username: "parent", first_name: "Parent", last_name: "Eleve", role: "Tuteur", role_id: "TUTEUR", avatar: "PE", is_authenticated: true },
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
    user: { id: 7, username: "visiteur", first_name: "Visiteur", last_name: "Anonyme", role: "Visiteur", role_id: "visiteur", avatar: "?", is_authenticated: false },
  }
};
/* Permission & Role Checks */

export function AppProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const localData = localStorage.getItem(STORAGE_KEY);
      return localData ? JSON.parse(localData) : initialData;
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
    const roleConfig =
      SYSTEM_ROLES[currentUser.role_id] || SYSTEM_ROLES.visiteur;
    if (currentUser.role_id === "admin") return true;
    return roleConfig.allowedViews.includes(viewId);
  }; /* Login handler connected to the backend API */
  const login = async (identifier = "", password = "") => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, password }),
      });
      const result = await response.json();
      if (response.ok) {
        /* Associer le rôle backend au rôle frontend existant pour la compatibilité */
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
            defaultView = "bulletin";
            break;
          case "ELEVE":
            frontendRoleId = "eleve";
            defaultView = "dashboard";
            break;
        }
        const userObj = {
          id: result.user.id,
          username: result.user.email.split("@")[0],
          first_name: result.user.nom,
          last_name: "",
          role: result.user.role,
          role_id: frontendRoleId,
          email: result.user.email,
          avatar: result.user.nom[0],
          is_authenticated: true,
          eleve_id: result.user.eleve_id,
        };
        if (result.token) localStorage.setItem("auth_token", result.token);
        setCurrentUser(userObj);
        setData((prev) => ({ ...prev, user: { ...prev.user, ...userObj } }));
        showToast(`Bienvenue, ${userObj.first_name} !`);
        setCurrentView(defaultView);
        return { success: true, user: userObj };
      } else {
        return {
          success: false,
          error: result.error || "Identifiants incorrects",
        };
      }
    } catch (err) {
      console.error("Erreur de connexion API:", err);
      return {
        success: false,
        error: "Erreur réseau. Impossible de contacter le serveur.",
      };
    }
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
  }; /* CRUD for Eleves */
  const addEleve = (newEleve) => {
    const nextId =
      (data.eleves.length > 0 ? Math.max(...data.eleves.map((e) => e.id)) : 0) +
      1;
    const matricule = `2025-${String(nextId).padStart(4, "0")}`;
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
    }; /* Auto-create initial pointage */
    const nextPtId =
      (data.pointages.length > 0
        ? Math.max(...data.pointages.map((p) => p.id))
        : 0) + 1;
    const initialPointage = {
      id: nextPtId,
      eleve_id: nextId,
      date: "2026-08-20",
      statut: "present",
      motif: "",
      heure_arrivee: "07:30",
      heure_depart: "13:00",
    };
    setData((prev) => ({
      ...prev,
      eleves: [eleveWithId, ...prev.eleves],
      pointages: [...prev.pointages, initialPointage],
    }));
    showToast(
      `Élève ${eleveWithId.nom} ${eleveWithId.prenom} inscrit avec succès !`,
    );
    return eleveWithId;
  };
  const updateEleve = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      eleves: prev.eleves.map((e) =>
        e.id === Number(id) ? { ...e, ...updatedFields } : e,
      ),
    }));
    showToast(`Dossier de l'élève mis à jour.`);
  };
  const deleteEleve = (id) => {
    setData((prev) => ({
      ...prev,
      eleves: prev.eleves.filter((e) => e.id !== Number(id)),
      pointages: prev.pointages.filter((p) => p.eleve_id !== Number(id)),
      paiements: prev.paiements.filter((p) => p.eleve_id !== Number(id)),
      resultats: prev.resultats.filter((r) => r.eleve_id !== Number(id)),
    }));
    showToast(`Élève supprimé du registre.`);
    if (selectedEleveId === Number(id)) {
      setCurrentView("eleves");
    }
  }; /* CRUD Teachers & Courses */
  const addTeacher = (teacherData) => {
    const nextId =
      (data.enseignants.length > 0
        ? Math.max(...data.enseignants.map((t) => t.id))
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
  }; /* Payments & Finance CRUD */
  const addPaiement = (paymentData) => {
    const nextId =
      (data.paiements.length > 0
        ? Math.max(...data.paiements.map((p) => p.id))
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
      (data.depenses.length > 0
        ? Math.max(...data.depenses.map((d) => d.id))
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
    const eleve = data.eleves.find((e) => e.id === Number(eleveId));
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
      (data.incidents.length > 0
        ? Math.max(...data.incidents.map((i) => i.id))
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
      (data.messages.length > 0
        ? Math.max(...data.messages.map((m) => m.id))
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
      notifications: prev.notifications.map((n) =>
        n.id === Number(id) ? { ...n, lu: true } : n,
      ),
    }));
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
    const total_eleves = data.eleves.length;
    const total_garcons = data.eleves.filter((e) => e.sexe === "M").length;
    const total_filles = data.eleves.filter((e) => e.sexe === "F").length;
    const garcons_percentage = total_eleves
      ? Math.round((total_garcons / total_eleves) * 100)
      : 0;
    const filles_percentage = total_eleves
      ? Math.round((total_filles / total_eleves) * 100)
      : 0;
    const total_enseignants = data.enseignants.length;
    const total_classes = data.classes.length;
    const total_cours = data.cours.length;
    const today = "2026-08-20";
    const pointagesToday = data.pointages.filter((p) => p.date === today);
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
    const total_recouvrement = data.paiements.reduce(
      (sum, p) => sum + Number(p.montant_paye),
      0,
    );
    const total_depenses = data.depenses.reduce(
      (sum, d) => sum + Number(d.montant),
      0,
    );
    const solde_caisse = total_recouvrement - total_depenses;
    const total_incidents_actifs = data.incidents.filter(
      (i) => !i.date_cloture,
    ).length;
    const unread_notifications = data.notifications.filter((n) => !n.lu).length;
    const unread_messages = data.messages.filter((m) => !m.lu).length;
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
    const eleve = data.eleves.find((e) => e.id === Number(id));
    if (!eleve) return null;
    const classe = data.classes.find((c) => c.id === eleve.classe_id);
    const pointages = data.pointages.filter((p) => p.eleve_id === eleve.id);
    const paiements = data.paiements
      .filter((p) => p.eleve_id === eleve.id)
      .map((p) => {
        const f = data.frais.find((fr) => fr.id === p.frais_id);
        return { ...p, frais_nom: f ? f.nom : "Frais Scolaires" };
      });
    const incidents = data.incidents.filter((i) => i.eleve_id === eleve.id);
    const resultats = data.resultats
      .filter((r) => r.eleve_id === eleve.id)
      .map((r) => {
        const c = data.cours.find((co) => co.id === r.cours_id);
        const ens = data.enseignants.find((en) => en.id === r.enseignant_id);
        const per = data.periodes.find((pe) => pe.id === r.periode_id);
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
    const totalFraisTheoriques = data.frais.reduce(
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
    updateEcoleConfig,
    resetToDefaultData,
    resetToInitialData: resetToDefaultData,
    stats: getStats(),
    getEleveDetail,
    systemRoles: SYSTEM_ROLES,
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
