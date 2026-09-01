export const initialData = {
  "anneeScolaires": [
    {
      "id": 1,
      "nom": "2025-2026",
      "date_debut": "2025-09-01",
      "date_fin": "2026-07-02",
      "active": true
    }
  ],
  "cycles": [
    {
      "id": 1,
      "nom": "Maternelle / Préscolaire",
      "code": "MAT",
      "ordre": 1,
      "description": "Petite, Moyenne et Grande section (1ère à 3ème Maternelle)"
    },
    {
      "id": 2,
      "nom": "Enseignement Primaire",
      "code": "PRI",
      "ordre": 2,
      "description": "1ère à 6ème Année Primaire (Sanctionné par l'ENAFEP / TENAFEP)"
    },
    {
      "id": 3,
      "nom": "Cycle Terminal de l'Éducation de Base (CTEB)",
      "code": "EB",
      "ordre": 3,
      "description": "7ème et 8ème Année Éducation de Base (Sanctionné par le TENASOSP)"
    },
    {
      "id": 4,
      "nom": "Humanités / Enseignement Secondaire",
      "code": "HUM",
      "ordre": 4,
      "description": "1ère à 4ème Année des Humanités (Sanctionné par l'Examen d'État - EXETAT)"
    }
  ],
  "niveaux": [
    {
      "id": 1,
      "nom": "1ère Maternelle (Petite Section)",
      "cycle_id": 1,
      "cycle_nom": "Maternelle",
      "annee_etude": "1ère Maternelle",
      "categorie": "maternelle",
      "ordre": 1
    },
    {
      "id": 2,
      "nom": "2ème Maternelle (Moyenne Section)",
      "cycle_id": 1,
      "cycle_nom": "Maternelle",
      "annee_etude": "2ème Maternelle",
      "categorie": "maternelle",
      "ordre": 2
    },
    {
      "id": 3,
      "nom": "3ème Maternelle (Grande Section)",
      "cycle_id": 1,
      "cycle_nom": "Maternelle",
      "annee_etude": "3ème Maternelle",
      "categorie": "maternelle",
      "ordre": 3
    },
    {
      "id": 4,
      "nom": "1ère Primaire",
      "cycle_id": 2,
      "cycle_nom": "Primaire",
      "annee_etude": "1ère Primaire",
      "categorie": "primaire",
      "ordre": 4
    },
    {
      "id": 5,
      "nom": "2ème Primaire",
      "cycle_id": 2,
      "cycle_nom": "Primaire",
      "annee_etude": "2ème Primaire",
      "categorie": "primaire",
      "ordre": 5
    },
    {
      "id": 6,
      "nom": "3ème Primaire",
      "cycle_id": 2,
      "cycle_nom": "Primaire",
      "annee_etude": "3ème Primaire",
      "categorie": "primaire",
      "ordre": 6
    },
    {
      "id": 7,
      "nom": "4ème Primaire",
      "cycle_id": 2,
      "cycle_nom": "Primaire",
      "annee_etude": "4ème Primaire",
      "categorie": "primaire",
      "ordre": 7
    },
    {
      "id": 8,
      "nom": "5ème Primaire",
      "cycle_id": 2,
      "cycle_nom": "Primaire",
      "annee_etude": "5ème Primaire",
      "categorie": "primaire",
      "ordre": 8
    },
    {
      "id": 9,
      "nom": "6ème Primaire (ENAFEP)",
      "cycle_id": 2,
      "cycle_nom": "Primaire",
      "annee_etude": "6ème Primaire",
      "categorie": "primaire",
      "ordre": 9
    },
    {
      "id": 10,
      "nom": "7ème Année de Base (7e EB)",
      "cycle_id": 3,
      "cycle_nom": "Éducation de Base",
      "annee_etude": "7ème EB",
      "categorie": "secondaire_general",
      "ordre": 10
    },
    {
      "id": 11,
      "nom": "8ème Année de Base (8e EB - TENASOSP)",
      "cycle_id": 3,
      "cycle_nom": "Éducation de Base",
      "annee_etude": "8ème EB",
      "categorie": "secondaire_general",
      "ordre": 11
    },
    {
      "id": 12,
      "nom": "1ère Humanités (3ème Secondaire)",
      "cycle_id": 4,
      "cycle_nom": "Humanités",
      "annee_etude": "1ère Humanités",
      "categorie": "humanites",
      "ordre": 12
    },
    {
      "id": 13,
      "nom": "2ème Humanités (4ème Secondaire)",
      "cycle_id": 4,
      "cycle_nom": "Humanités",
      "annee_etude": "2ème Humanités",
      "categorie": "humanites",
      "ordre": 13
    },
    {
      "id": 14,
      "nom": "3ème Humanités (5ème Secondaire)",
      "cycle_id": 4,
      "cycle_nom": "Humanités",
      "annee_etude": "3ème Humanités",
      "categorie": "humanites",
      "ordre": 14
    },
    {
      "id": 15,
      "nom": "4ème Humanités (6ème Secondaire - EXETAT)",
      "cycle_id": 4,
      "cycle_nom": "Humanités",
      "annee_etude": "4ème Humanités",
      "categorie": "humanites",
      "ordre": 15
    }
  ],
  "options": [
    {
      "id": 1,
      "nom": "Sciences / Biologie-Chimie",
      "code": "BIO",
      "section": "Scientifique",
      "filiere": "Sciences Naturelles",
      "actif": true
    },
    {
      "id": 2,
      "nom": "Mathématiques-Physique",
      "code": "MP",
      "section": "Scientifique",
      "filiere": "Sciences Exactes",
      "actif": true
    },
    {
      "id": 3,
      "nom": "Commerciale et Gestion",
      "code": "CG",
      "section": "Commerciale & Économique",
      "filiere": "Gestion Financière",
      "actif": true
    },
    {
      "id": 4,
      "nom": "Littéraire / Latin-Philosophie",
      "code": "LP",
      "section": "Littéraire & Sciences Humaines",
      "filiere": "Lettres & Langues",
      "actif": true
    },
    {
      "id": 5,
      "nom": "Pédagogie Générale",
      "code": "PED",
      "section": "Pédagogique",
      "filiere": "Sciences de l'Éducation",
      "actif": true
    },
    {
      "id": 6,
      "nom": "Coupe et Couture",
      "code": "CC",
      "section": "Technique & Professionnelle",
      "filiere": "Arts & Métiers",
      "actif": true
    },
    {
      "id": 7,
      "nom": "Électricité & Électronique",
      "code": "ELEC",
      "section": "Technique Industrielle",
      "filiere": "Génie Électrique",
      "actif": true
    },
    {
      "id": 8,
      "nom": "Mécanique Générale",
      "code": "MEC",
      "section": "Technique Industrielle",
      "filiere": "Génie Mécanique",
      "actif": true
    },
    {
      "id": 9,
      "nom": "Secrétariat-Bureautique",
      "code": "SB",
      "section": "Commerciale & Économique",
      "filiere": "Administration",
      "actif": true
    },
    {
      "id": 10,
      "nom": "Informatique & Réseaux",
      "code": "INFO",
      "section": "Technique & Numérique",
      "filiere": "Technologies Numériques",
      "actif": true
    }
  ],
  "typesSalles": [
    {
      "id": 1,
      "nom": "Salle de classe ordinaire",
      "code": "CLS",
      "icon": "School",
      "description": "Salle standard pour cours magistraux et exercices dirigés"
    },
    {
      "id": 2,
      "nom": "Salle pédagogique spécialisée",
      "code": "PED",
      "icon": "BookOpen",
      "description": "Salle équipée de matériel didactique par matière"
    },
    {
      "id": 3,
      "nom": "Laboratoire Informatique",
      "code": "LAB-INF",
      "icon": "Laptop",
      "description": "Postes connectés, serveurs et équipements multimédias"
    },
    {
      "id": 4,
      "nom": "Laboratoire de Sciences & SVT",
      "code": "LAB-SC",
      "icon": "FlaskConical",
      "description": "Microscopes, maquettes anatomiques et verrerie"
    },
    {
      "id": 5,
      "nom": "Laboratoire de Chimie & Physique",
      "code": "LAB-CH",
      "icon": "Atom",
      "description": "Hottes aspirantes, réactifs chimiques et bancs d'optique"
    },
    {
      "id": 6,
      "nom": "Bibliothèque & Centre de documentation",
      "code": "BIBLIO",
      "icon": "Library",
      "description": "Ouvrages, manuels scolaires officiels et espaces de lecture"
    },
    {
      "id": 7,
      "nom": "Salle des professeurs & Réunions",
      "code": "CONF",
      "icon": "Users",
      "description": "Espace de travail enseignant, délibérations et jurys"
    },
    {
      "id": 8,
      "nom": "Atelier Technique & Coupe-Couture",
      "code": "ATELIER",
      "icon": "Wrench",
      "description": "Machines à coudre, établis et outillage technique"
    },
    {
      "id": 9,
      "nom": "Salle Polyvalente & Conférence",
      "code": "POLY",
      "icon": "Building",
      "description": "Rassemblements solennels, colloques et examens nationaux"
    }
  ],
  "normesPedagogiques": {
    "capacite_recommandee_defaut": 35,
    "seuil_alerte_defaut": 40,
    "capacite_max_defaut": 45,
    "surface_min_par_eleve": 1.3,
    "surface_recommandee_par_eleve": 1.8
  },
  "periodes": [
    {
      "id": 1,
      "nom": "1ère Période",
      "annee_id": 1,
      "active": false,
      "ordre": 1
    },
    {
      "id": 2,
      "nom": "2ème Période",
      "annee_id": 1,
      "active": false,
      "ordre": 2
    },
    {
      "id": 3,
      "nom": "Examen 1er Semestre",
      "annee_id": 1,
      "active": false,
      "ordre": 3
    },
    {
      "id": 4,
      "nom": "3ème Période",
      "annee_id": 1,
      "active": true,
      "ordre": 4
    },
    {
      "id": 5,
      "nom": "4ème Période",
      "annee_id": 1,
      "active": false,
      "ordre": 5
    },
    {
      "id": 6,
      "nom": "Examen 2ème Semestre",
      "annee_id": 1,
      "active": false,
      "ordre": 6
    },
    {
      "id": 7,
      "nom": "Proclamation Finale",
      "annee_id": 1,
      "active": false,
      "ordre": 7
    }
  ],
  "salles": [],
  "enseignants": [],
  "classes": [],
  "eleves": [],
  "cours": [],
  "presences": [],
  "resultats": [],
  "paiements": [],
  "utilisateurs": [
    {
      "id": 1,
      "nom": "Administrateur Principal",
      "email": "johntshottshot12@gmail.com",
      "role": "ADMIN",
      "is_active": true
    },
    {
      "id": 2,
      "nom": "Préfet des Études",
      "email": "prefet@complexe-tshot.com",
      "role": "PREFET",
      "is_active": true
    },
    {
      "id": 3,
      "nom": "Jean-Pierre KABAMBA",
      "email": "prof@ecole.cd",
      "role": "ENSEIGNANT",
      "is_active": true
    },
    {
      "id": 4,
      "nom": "Papa Jean",
      "email": "papajean@gmail.com",
      "role": "TUTEUR",
      "eleve_id": 1,
      "is_active": true
    },
    {
      "id": 5,
      "nom": "Samuel KASONGO",
      "email": "samuel.kasongo@ecole.cd",
      "role": "ELEVE",
      "eleve_id": 1,
      "password": "eleve123",
      "is_active": true
    },
    {
      "id": 6,
      "nom": "Grace MUTOMBO",
      "email": "grace.mutombo@ecole.cd",
      "role": "ELEVE",
      "eleve_id": 2,
      "password": "grace2025",
      "is_active": true
    }
  ],
  "discipline": [],
  "frais": [
    {
      "id": 1,
      "libelle": "Frais d'inscription",
      "montant": 30,
      "devise": "USD",
      "echeance": "2025-09-15",
      "obligatoire": true
    },
    {
      "id": 2,
      "libelle": "Frais de scolarité - 1ère Tranche",
      "montant": 150,
      "devise": "USD",
      "echeance": "2025-10-15",
      "obligatoire": true
    },
    {
      "id": 3,
      "libelle": "Frais de scolarité - 2ème Tranche",
      "montant": 150,
      "devise": "USD",
      "echeance": "2026-01-15",
      "obligatoire": true
    },
    {
      "id": 4,
      "libelle": "Frais de scolarité - 3ème Tranche",
      "montant": 120,
      "devise": "USD",
      "echeance": "2026-04-15",
      "obligatoire": true
    }
  ],
  "incidents": [],
  "horaires": [],
  "messages": [],
  "pointages": [],
  "depenses": [],
  "notifications": [],
  "ecoleConfig": {
    "nom": "Complexe Scolaire TSHOT",
    "code_ministeriel": "CS-101/KIN-EST",
    "province_educationnelle": "Kinshasa / Mont-Amba",
    "annee_courante": "2025-2026",
    "periode_active": "3ème Période",
    "taux_change_usd": 2800,
    "devise_principale": "USD",
    "adresse": "Av. de l'Université N° 210, Kinshasa - RDC",
    "telephone": "+243 81 000 0000",
    "email": "contact@complexe-tshot.com"
  }
};
