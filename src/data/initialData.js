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
  "options": [],
  "typesSalles": [],
  "normesPedagogiques": {
    "capacite_recommandee_defaut": 35,
    "seuil_alerte_defaut": 40,
    "capacite_max_defaut": 45,
    "surface_min_par_eleve": 1.3,
    "surface_recommandee_par_eleve": 1.8
  },
  "periodes": [],
  "salles": [],
  "enseignants": [],
  "classes": [],
  "eleves": [],
  "cours": [],
  "presences": [],
  "resultats": [],
  "paiements": [],
  "utilisateurs": [],
  "discipline": [],
  "frais": [],
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
