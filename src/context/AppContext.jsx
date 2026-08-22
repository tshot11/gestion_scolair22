import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../data/initialData';

const AppContext = createContext();

const STORAGE_KEY = 'GESTION_SCOLAIRE_RDC_V3';
const AUTH_STORAGE_KEY = 'GESTION_SCOLAIRE_AUTH_USER_V3';

// Available System Roles with pre-configured credentials & permissions
export const SYSTEM_ROLES = {
  admin: {
    id: 'admin',
    label: 'Administrateur / Préfet des Études',
    badge: 'Direction Générale',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    description: 'Accès intégral à toute la gestion : pédagogie, finances, inscriptions, bulletins, palmarès et paramètres.',
    username: 'admin',
    defaultPassword: '123',
    defaultView: 'dashboard',
    user: {
      id: 1,
      username: 'admin',
      first_name: 'Dieudonné',
      last_name: 'TSHILOMBO',
      role: 'Préfet des Études (Administrateur)',
      role_id: 'admin',
      email: 'direction@gestion-scolaire.cd',
      avatar: 'DT',
      is_authenticated: true
    },
    allowedViews: [
      'dashboard', 'eleves', 'eleve-detail', 'enseignants', 'classes', 
      'cours', 'horaires', 'presences', 'discipline', 'resultats', 
      'bulletin', 'palmares', 'finance', 'recu', 'parents', 
      'communication', 'settings', 'parametres', 'landing', 'utilisateurs'
    ]
  },
  enseignant: {
    id: 'enseignant',
    label: 'Enseignant / Professeur Titulaire',
    badge: 'Corps Pédagogique',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Encodage des cotes, pointage des présences, gestion des cours, emplois du temps et discipline.',
    username: 'professeur',
    defaultPassword: '123',
    defaultView: 'resultats',
    user: {
      id: 2,
      username: 'professeur',
      first_name: 'Jean-Pierre',
      last_name: 'MUKENDI',
      role: 'Professeur Titulaire (Math & Sc)',
      role_id: 'enseignant',
      email: 'jp.mukendi@ecole.cd',
      avatar: 'JM',
      is_authenticated: true
    },
    allowedViews: [
      'resultats', 'palmares', 'presences', 'bulletin', 'classes', 
      'cours', 'horaires', 'discipline', 'communication', 'landing'
    ]
  },
  comptable: {
    id: 'comptable',
    label: 'Comptable / Trésorier Scolaire',
    badge: 'Caisse & Finances',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Gestion de la trésorerie, encaissement des minervals, délivrance des quittances et bons de dépenses.',
    username: 'comptable',
    defaultPassword: '123',
    defaultView: 'finance',
    user: {
      id: 3,
      username: 'comptable',
      first_name: 'Marie-Claire',
      last_name: 'KAPINGA',
      role: 'Responsable Caisse & Recouvrement',
      role_id: 'comptable',
      email: 'mc.kapinga@ecole.cd',
      avatar: 'MK',
      is_authenticated: true
    },
    allowedViews: [
      'finance', 'recu', 'eleves', 'eleve-detail', 'communication', 'landing'
    ]
  },
  parent: {
    id: 'parent',
    label: 'Parent / Tuteur (Utilisateur Simple)',
    badge: 'Espace Famille',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    description: 'Suivi du bulletin en direct, assiduité, historique des paiements, quittances et messagerie avec la direction.',
    username: 'parent',
    defaultPassword: '123',
    defaultView: 'parents',
    user: {
      id: 4,
      username: 'parent',
      first_name: 'Paul',
      last_name: 'KALALA',
      role: 'Parent d’Élève (Tuteur)',
      role_id: 'parent',
      email: 'paul.kalala@gmail.com',
      avatar: 'PK',
      is_authenticated: true,
      eleve_id: 1 // KALALA Josué
    },
    allowedViews: [
      'parents', 'bulletin', 'recu', 'communication', 'landing'
    ]
  },
  visiteur: {
    id: 'visiteur',
    label: 'Visiteur / Simple Utilisateur',
    badge: 'Public',
    badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    description: 'Consultation de la page d’accueil, des sections d’enseignement et informations d’inscription.',
    username: 'invite',
    defaultPassword: '123',
    defaultView: 'landing',
    user: {
      id: 5,
      username: 'invite',
      first_name: 'Visiteur',
      last_name: 'Invité',
      role: 'Simple Utilisateur / Visiteur',
      role_id: 'visiteur',
      email: 'visiteur@ecole.cd',
      avatar: 'VI',
      is_authenticated: false
    },
    allowedViews: [
      'landing'
    ]
  }
};

export function AppProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.ecoleConfig && (parsed.ecoleConfig.nom === "Complexe Scolaire d'Excellence RDC" || !parsed.ecoleConfig.nom)) {
          parsed.ecoleConfig.nom = "Complexe Scolaire John Tshot";
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return initialData;
  });

  // Current authenticated user (default to null or unauthenticated to start at landing/login)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth) {
        return JSON.parse(savedAuth);
      }
    } catch (e) {
      console.warn('Could not read user auth', e);
    }
    return null; // Not logged in initially -> opens Landing or Login
  });

  // Current View: starts on 'login' as explicitly required
  const [currentView, setCurrentView] = useState(() => {
    return 'login'; // Starts directly on Login/Auth page
  });

  const [selectedEleveId, setSelectedEleveId] = useState(1);
  const [selectedPaiementId, setSelectedPaiementId] = useState(1);
  const [selectedClasseId, setSelectedClasseId] = useState(6);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [data]);

  // Save authenticated user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Could not save auth user', e);
    }
  }, [currentUser]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setNotificationToast({ message, type, id: Date.now() });
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // Permission & Role Checks
  const hasPermission = (viewId) => {
    if (viewId === 'landing' || viewId === 'login') return true;
    if (!currentUser) return false;
    const roleConfig = SYSTEM_ROLES[currentUser.role_id] || SYSTEM_ROLES.visiteur;
    if (currentUser.role_id === 'admin') return true;
    return roleConfig.allowedViews.includes(viewId);
  };

  // Login handler connected to the backend API
  const login = async (identifier = '', password = '') => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password })
      });
      const result = await response.json();
      
      if (response.ok) {
        // Associer le rôle backend au rôle frontend existant pour la compatibilité
        let frontendRoleId = 'visiteur';
        let defaultView = 'dashboard';
        switch(result.user.role) {
          case 'ADMIN': 
          case 'DIRECTEUR': 
          case 'PREFET': 
            frontendRoleId = 'admin'; 
            defaultView = 'dashboard';
            break;
          case 'ENSEIGNANT': 
            frontendRoleId = 'enseignant'; 
            defaultView = 'cours';
            break;
          case 'CAISSIER': 
            frontendRoleId = 'comptable'; 
            defaultView = 'finance';
            break;
          case 'PARENT': 
            frontendRoleId = 'parent'; 
            defaultView = 'parents';
            break;
          case 'ELEVE': 
            frontendRoleId = 'eleve'; 
            defaultView = 'dashboard';
            break;
        }
        
        const userObj = {
          id: result.user.id,
          username: result.user.email.split('@')[0],
          first_name: result.user.nom,
          last_name: '',
          role: result.user.role,
          role_id: frontendRoleId,
          email: result.user.email,
          avatar: result.user.nom[0],
          is_authenticated: true
        };

        if (result.token) localStorage.setItem("auth_token", result.token);
        setCurrentUser(userObj);

        setData(prev => ({
          ...prev,
          user: {
            ...prev.user,
            ...userObj
          }
        }));

        showToast(`Bienvenue, ${userObj.first_name} !`);
        setCurrentView(defaultView);
        return { success: true, user: userObj };
      } else {
        return { success: false, error: result.error || 'Identifiants incorrects' };
      }
    } catch (err) {
      console.error("Erreur de connexion API:", err);
      return { success: false, error: 'Erreur réseau. Impossible de contacter le serveur.' };
    }
  };

  // Register new account handler
  const register = (registrationData) => {
    const roleKey = registrationData.role_id || 'parent';
    const matchedRole = SYSTEM_ROLES[roleKey] || SYSTEM_ROLES.parent;
    
    const newUser = {
      id: Date.now(),
      username: registrationData.email ? registrationData.email.split('@')[0] : `user_${Date.now()}`,
      first_name: registrationData.first_name || 'Utilisateur',
      last_name: registrationData.last_name || 'Nouveau',
      role: matchedRole.user.role,
      role_id: roleKey,
      email: registrationData.email || 'nouveau@ecole.cd',
      telephone: registrationData.telephone || '',
      avatar: `${(registrationData.first_name || 'U')[0]}${(registrationData.last_name || 'N')[0]}`,
      is_authenticated: true
    };

    setCurrentUser(newUser);
    setData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        username: newUser.username,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role: newUser.role,
        is_authenticated: true
      }
    }));

    showToast(`Compte créé avec succès ! Bienvenue, ${newUser.first_name} ${newUser.last_name}.`);
    setCurrentView(matchedRole.defaultView);
    return true;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("auth_token");
    setCurrentUser(null);
    setData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        is_authenticated: false
      }
    }));
    showToast('Vous avez été déconnecté avec succès.', 'info');
    setCurrentView('landing');
  };

  // Update School Config
  const updateEcoleConfig = (newConfig) => {
    setData(prev => ({
      ...prev,
      ecoleConfig: {
        ...prev.ecoleConfig,
        ...newConfig
      }
    }));
    showToast("Configuration de l'établissement mise à jour !");
  };

  // CRUD for Eleves
  const addEleve = (newEleve) => {
    const nextId = (data.eleves.length > 0 ? Math.max(...data.eleves.map(e => e.id)) : 0) + 1;
    const matricule = `2025-${String(nextId).padStart(4, '0')}`;
    const eleveWithId = {
      ...newEleve,
      id: nextId,
      matricule,
      date_inscription: newEleve.date_inscription || new Date().toISOString().split('T')[0],
      photo: newEleve.photo || null,
      est_boursier: !!newEleve.est_boursier,
      est_orphelin: !!newEleve.est_orphelin,
      est_handicape: !!newEleve.est_handicape,
      est_pris_en_charge: !!newEleve.est_pris_en_charge,
      est_cas_social: !!newEleve.est_cas_social
    };
    
    // Auto-create initial pointage
    const nextPtId = (data.pointages.length > 0 ? Math.max(...data.pointages.map(p => p.id)) : 0) + 1;
    const initialPointage = {
      id: nextPtId,
      eleve_id: nextId,
      date: '2026-08-20',
      statut: 'present',
      motif: '',
      heure_arrivee: '07:30',
      heure_depart: '13:00'
    };

    setData(prev => ({
      ...prev,
      eleves: [eleveWithId, ...prev.eleves],
      pointages: [...prev.pointages, initialPointage]
    }));
    showToast(`Élève ${eleveWithId.nom} ${eleveWithId.prenom} inscrit avec succès !`);
    return eleveWithId;
  };

  const updateEleve = (id, updatedFields) => {
    setData(prev => ({
      ...prev,
      eleves: prev.eleves.map(e => e.id === Number(id) ? { ...e, ...updatedFields } : e)
    }));
    showToast(`Dossier de l'élève mis à jour.`);
  };

  const deleteEleve = (id) => {
    setData(prev => ({
      ...prev,
      eleves: prev.eleves.filter(e => e.id !== Number(id)),
      pointages: prev.pointages.filter(p => p.eleve_id !== Number(id)),
      paiements: prev.paiements.filter(p => p.eleve_id !== Number(id)),
      resultats: prev.resultats.filter(r => r.eleve_id !== Number(id))
    }));
    showToast(`Élève supprimé du registre.`);
    if (selectedEleveId === Number(id)) {
      setCurrentView('eleves');
    }
  };

  // Payments & Finance CRUD
  const addPaiement = (paymentData) => {
    const nextId = (data.paiements.length > 0 ? Math.max(...data.paiements.map(p => p.id)) : 0) + 1;
    const reference = `REC-2026-${String(nextId).padStart(5, '0')}`;
    const newPayment = {
      ...paymentData,
      id: nextId,
      reference,
      montant_paye: Number(paymentData.montant_paye),
      date_paiement: paymentData.date_paiement || new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      recu_genere: true,
      mode: paymentData.mode || 'Espèces (Caisse)'
    };
    setData(prev => ({
      ...prev,
      paiements: [newPayment, ...prev.paiements]
    }));
    showToast(`Paiement de ${newPayment.montant_paye.toLocaleString('fr-FR')} CDF enregistré !`);
    setSelectedPaiementId(nextId);
    return newPayment;
  };

  const addDepense = (depenseData) => {
    const nextId = (data.depenses.length > 0 ? Math.max(...data.depenses.map(d => d.id)) : 0) + 1;
    const newDepense = {
      ...depenseData,
      id: nextId,
      montant: Number(depenseData.montant),
      date: depenseData.date || new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      depenses: [newDepense, ...prev.depenses]
    }));
    showToast(`Dépense de ${newDepense.montant.toLocaleString('fr-FR')} CDF enregistrée.`);
    return newDepense;
  };

  // Attendance Pointages & Automatic Parent Notification Trigger
  const togglePointage = (eleveId, newStatus) => {
    const today = '2026-08-20';
    const eleve = data.eleves.find(e => e.id === Number(eleveId));

    setData(prev => {
      const existing = prev.pointages.find(p => p.eleve_id === Number(eleveId) && p.date === today);
      let updatedPointages;

      if (existing) {
        updatedPointages = prev.pointages.map(p => p.id === existing.id ? { ...p, statut: newStatus } : p);
      } else {
        const nextId = (prev.pointages.length > 0 ? Math.max(...prev.pointages.map(p => p.id)) : 0) + 1;
        updatedPointages = [
          ...prev.pointages,
          {
            id: nextId,
            eleve_id: Number(eleveId),
            date: today,
            statut: newStatus,
            motif: '',
            heure_arrivee: newStatus === 'present' ? '07:30' : null,
            heure_depart: newStatus === 'present' ? '13:00' : null
          }
        ];
      }

      // If student is marked absent or retard, automatically generate a notification for the parent / system
      let updatedNotifications = prev.notifications || [];
      if (eleve && (newStatus === 'absent' || newStatus === 'retard')) {
        const nextNotifId = (prev.notifications && prev.notifications.length > 0 ? Math.max(...prev.notifications.map(n => n.id)) : 0) + 1;
        const newNotif = {
          id: nextNotifId,
          type: newStatus === 'absent' ? 'urgence' : 'info',
          titre: newStatus === 'absent' 
            ? `🚨 Alerte Absence : ${eleve.nom} ${eleve.prenom}` 
            : `⚠️ Retard constaté : ${eleve.nom} ${eleve.prenom}`,
          message: newStatus === 'absent'
            ? `L'élève ${eleve.nom} ${eleve.prenom} n'est pas présent(e) en classe ce matin. Un SMS et un e-mail d'alerte ont été envoyés au tuteur (${eleve.nom_parent || eleve.telephone}).`
            : `L'élève ${eleve.nom} ${eleve.prenom} est arrivé(e) en retard en classe aujourd'hui à 08h15.`,
          date: 'À l\'instant',
          lu: false
        };
        updatedNotifications = [newNotif, ...updatedNotifications];
      }

      return {
        ...prev,
        pointages: updatedPointages,
        notifications: updatedNotifications
      };
    });

    if (eleve && newStatus === 'absent') {
      showToast(`🚨 Absence enregistrée pour ${eleve.nom}. Notification & SMS transmis aux parents.`);
    } else if (eleve && newStatus === 'retard') {
      showToast(`⚠️ Retard enregistré pour ${eleve.nom}. Alerte parent émise.`);
    }
  };

  // Discipline Incident CRUD
  const addIncident = (incidentData) => {
    const nextId = (data.incidents.length > 0 ? Math.max(...data.incidents.map(i => i.id)) : 0) + 1;
    const newIncident = {
      ...incidentData,
      id: nextId,
      eleve_id: Number(incidentData.eleve_id),
      date: incidentData.date || new Date().toISOString().split('T')[0],
      date_cloture: null
    };
    setData(prev => ({
      ...prev,
      incidents: [newIncident, ...prev.incidents]
    }));
    showToast(`Incident disciplinaire consigné.`);
    return newIncident;
  };

  const closeIncident = (id) => {
    setData(prev => ({
      ...prev,
      incidents: prev.incidents.map(i => i.id === Number(id) ? { ...i, date_cloture: new Date().toISOString().split('T')[0] } : i)
    }));
    showToast(`Dossier disciplinaire clôturé.`);
  };

  // Results & Marks
  const saveResultat = (resultatData) => {
    setData(prev => {
      const existingIndex = prev.resultats.findIndex(r => 
        r.eleve_id === Number(resultatData.eleve_id) && 
        r.cours_id === Number(resultatData.cours_id) && 
        r.periode_id === Number(resultatData.periode_id)
      );

      if (existingIndex >= 0) {
        const updated = [...prev.resultats];
        updated[existingIndex] = {
          ...updated[existingIndex],
          note: Number(resultatData.note),
          appreciation: resultatData.appreciation || updated[existingIndex].appreciation,
          date_saisie: new Date().toISOString().split('T')[0]
        };
        return { ...prev, resultats: updated };
      } else {
        const nextId = (prev.resultats.length > 0 ? Math.max(...prev.resultats.map(r => r.id)) : 0) + 1;
        const newRes = {
          ...resultatData,
          id: nextId,
          eleve_id: Number(resultatData.eleve_id),
          cours_id: Number(resultatData.cours_id),
          periode_id: Number(resultatData.periode_id || 4),
          note: Number(resultatData.note),
          max_note: 20,
          date_saisie: new Date().toISOString().split('T')[0]
        };
        return { ...prev, resultats: [...prev.resultats, newRes] };
      }
    });
    showToast(`Note enregistrée avec succès.`);
  };

  // Messages & Communications
  const addMessage = (msg) => {
    const nextId = (data.messages.length > 0 ? Math.max(...data.messages.map(m => m.id)) : 0) + 1;
    const newMsg = {
      ...msg,
      id: nextId,
      date_envoi: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      lu: false
    };
    setData(prev => ({
      ...prev,
      messages: [newMsg, ...prev.messages]
    }));
    showToast(`Message transmis avec succès.`);
    return newMsg;
  };

  const markMessageAsRead = (id) => {
    setData(prev => ({
      ...prev,
      messages: prev.messages.map(m => m.id === Number(id) ? { ...m, lu: true } : m)
    }));
  };

  const markNotificationAsRead = (id) => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === Number(id) ? { ...n, lu: true } : n)
    }));
  };

  const resetToDefaultData = () => {
    setData(initialData);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("auth_token");
    setCurrentUser(null);
    setCurrentView('landing');
    showToast(`Données réinitialisées aux valeurs d'origine.`);
  };

  // Computed Statistics Engine
  const getStats = () => {
    const total_eleves = data.eleves.length;
    const total_garcons = data.eleves.filter(e => e.sexe === 'M').length;
    const total_filles = data.eleves.filter(e => e.sexe === 'F').length;
    const garcons_percentage = total_eleves ? Math.round((total_garcons / total_eleves) * 100) : 0;
    const filles_percentage = total_eleves ? Math.round((total_filles / total_eleves) * 100) : 0;

    const total_enseignants = data.enseignants.length;
    const total_classes = data.classes.length;
    const total_cours = data.cours.length;

    const today = '2026-08-20';
    const pointagesToday = data.pointages.filter(p => p.date === today);
    const presentCount = pointagesToday.filter(p => p.statut === 'present').length;
    const absentCount = pointagesToday.filter(p => p.statut === 'absent').length;
    const retardCount = pointagesToday.filter(p => p.statut === 'retard').length;
    const maladeCount = pointagesToday.filter(p => p.statut === 'malade').length;
    const presenceRate = pointagesToday.length ? Math.round((presentCount / pointagesToday.length) * 100) : 0;

    const total_recouvrement = data.paiements.reduce((sum, p) => sum + Number(p.montant_paye), 0);
    const total_depenses = data.depenses.reduce((sum, d) => sum + Number(d.montant), 0);
    const solde_caisse = total_recouvrement - total_depenses;

    const total_incidents_actifs = data.incidents.filter(i => !i.date_cloture).length;
    const unread_notifications = data.notifications.filter(n => !n.lu).length;
    const unread_messages = data.messages.filter(m => !m.lu).length;

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
      unread_messages
    };
  };

  // Detailed Student Calculation Helper
  const getEleveDetail = (id) => {
    const eleve = data.eleves.find(e => e.id === Number(id));
    if (!eleve) return null;
    const classe = data.classes.find(c => c.id === eleve.classe_id);
    const pointages = data.pointages.filter(p => p.eleve_id === eleve.id);
    const paiements = data.paiements.filter(p => p.eleve_id === eleve.id).map(p => {
      const f = data.frais.find(fr => fr.id === p.frais_id);
      return { ...p, frais_nom: f ? f.nom : 'Frais Scolaires' };
    });
    const incidents = data.incidents.filter(i => i.eleve_id === eleve.id);
    const resultats = data.resultats.filter(r => r.eleve_id === eleve.id).map(r => {
      const c = data.cours.find(co => co.id === r.cours_id);
      const ens = data.enseignants.find(en => en.id === r.enseignant_id);
      const per = data.periodes.find(pe => pe.id === r.periode_id);
      return {
        ...r,
        cours_nom: c ? c.nom : 'Cours',
        cours_code: c ? c.code : '',
        coefficient: c ? c.coefficient : 1,
        enseignant_nom: ens ? `${ens.nom} ${ens.prenom}` : '',
        periode_nom: per ? per.nom : ''
      };
    });

    let totalPoints = 0;
    let totalCoeff = 0;
    resultats.forEach(r => {
      totalPoints += r.note * r.coefficient;
      totalCoeff += r.coefficient;
    });

    const moyenne = totalCoeff > 0 ? (totalPoints / totalCoeff).toFixed(2) : '0.00';
    const pourcentage = totalCoeff > 0 ? ((totalPoints / (totalCoeff * 20)) * 100).toFixed(1) : '0';

    let mention = 'Insuffisant';
    let mentionColor = 'text-rose-400';
    if (pourcentage >= 80) {
      mention = 'Très Bien (Élite)';
      mentionColor = 'text-emerald-400';
    } else if (pourcentage >= 70) {
      mention = 'Bien (Distinction)';
      mentionColor = 'text-blue-400';
    } else if (pourcentage >= 60) {
      mention = 'Assez Bien (Satisfaction)';
      mentionColor = 'text-amber-400';
    } else if (pourcentage >= 50) {
      mention = 'Passable (Ajourné)';
      mentionColor = 'text-orange-400';
    }

    const totalFraisPayes = paiements.reduce((sum, p) => sum + Number(p.montant_paye), 0);
    const totalFraisTheoriques = data.frais.reduce((sum, f) => sum + Number(f.montant), 0);
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
      soldeFraisDu
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
    systemRoles: SYSTEM_ROLES
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

