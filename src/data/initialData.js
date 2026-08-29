export const initialData = {
  anneeScolaires: [
    { id: 1, nom: '2025-2026', date_debut: '2025-09-01', date_fin: '2026-07-02', active: true }
  ],
  cycles: [
    { id: 1, nom: "Maternelle / Préscolaire", code: "MAT", ordre: 1, description: "Petite, Moyenne et Grande section (1ère à 3ème Maternelle)" },
    { id: 2, nom: "Enseignement Primaire", code: "PRI", ordre: 2, description: "1ère à 6ème Année Primaire (Sanctionné par l'ENAFEP / TENAFEP)" },
    { id: 3, nom: "Cycle Terminal de l'Éducation de Base (CTEB)", code: "EB", ordre: 3, description: "7ème et 8ème Année Éducation de Base (Sanctionné par le TENASOSP)" },
    { id: 4, nom: "Humanités / Enseignement Secondaire", code: "HUM", ordre: 4, description: "1ère à 4ème Année des Humanités (Sanctionné par l'Examen d'État - EXETAT)" }
  ],
  niveaux: [
    { id: 1, nom: '1ère Maternelle (Petite Section)', cycle_id: 1, cycle_nom: 'Maternelle', annee_etude: '1ère Maternelle', categorie: 'maternelle', ordre: 1 },
    { id: 2, nom: '2ème Maternelle (Moyenne Section)', cycle_id: 1, cycle_nom: 'Maternelle', annee_etude: '2ème Maternelle', categorie: 'maternelle', ordre: 2 },
    { id: 3, nom: '3ème Maternelle (Grande Section)', cycle_id: 1, cycle_nom: 'Maternelle', annee_etude: '3ème Maternelle', categorie: 'maternelle', ordre: 3 },
    { id: 4, nom: '1ère Primaire', cycle_id: 2, cycle_nom: 'Primaire', annee_etude: '1ère Primaire', categorie: 'primaire', ordre: 4 },
    { id: 5, nom: '2ème Primaire', cycle_id: 2, cycle_nom: 'Primaire', annee_etude: '2ème Primaire', categorie: 'primaire', ordre: 5 },
    { id: 6, nom: '3ème Primaire', cycle_id: 2, cycle_nom: 'Primaire', annee_etude: '3ème Primaire', categorie: 'primaire', ordre: 6 },
    { id: 7, nom: '4ème Primaire', cycle_id: 2, cycle_nom: 'Primaire', annee_etude: '4ème Primaire', categorie: 'primaire', ordre: 7 },
    { id: 8, nom: '5ème Primaire', cycle_id: 2, cycle_nom: 'Primaire', annee_etude: '5ème Primaire', categorie: 'primaire', ordre: 8 },
    { id: 9, nom: '6ème Primaire (ENAFEP)', cycle_id: 2, cycle_nom: 'Primaire', annee_etude: '6ème Primaire', categorie: 'primaire', ordre: 9 },
    { id: 10, nom: '7ème Année de Base (7e EB)', cycle_id: 3, cycle_nom: 'Éducation de Base', annee_etude: '7ème EB', categorie: 'secondaire_general', ordre: 10 },
    { id: 11, nom: '8ème Année de Base (8e EB - TENASOSP)', cycle_id: 3, cycle_nom: 'Éducation de Base', annee_etude: '8ème EB', categorie: 'secondaire_general', ordre: 11 },
    { id: 12, nom: '1ère Humanités (3ème Secondaire)', cycle_id: 4, cycle_nom: 'Humanités', annee_etude: '1ère Humanités', categorie: 'humanites', ordre: 12 },
    { id: 13, nom: '2ème Humanités (4ème Secondaire)', cycle_id: 4, cycle_nom: 'Humanités', annee_etude: '2ème Humanités', categorie: 'humanites', ordre: 13 },
    { id: 14, nom: '3ème Humanités (5ème Secondaire)', cycle_id: 4, cycle_nom: 'Humanités', annee_etude: '3ème Humanités', categorie: 'humanites', ordre: 14 },
    { id: 15, nom: '4ème Humanités (6ème Secondaire - EXETAT)', cycle_id: 4, cycle_nom: 'Humanités', annee_etude: '4ème Humanités', categorie: 'humanites', ordre: 15 }
  ],
  options: [
    { id: 1, nom: 'Sciences / Biologie-Chimie', code: 'BIO', section: 'Scientifique', filiere: 'Sciences Naturelles', actif: true },
    { id: 2, nom: 'Mathématiques-Physique', code: 'MP', section: 'Scientifique', filiere: 'Sciences Exactes', actif: true },
    { id: 3, nom: 'Commerciale et Gestion', code: 'CG', section: 'Commerciale & Économique', filiere: 'Gestion Financière', actif: true },
    { id: 4, nom: 'Littéraire / Latin-Philosophie', code: 'LP', section: 'Littéraire & Sciences Humaines', filiere: 'Lettres & Langues', actif: true },
    { id: 5, nom: 'Pédagogie Générale', code: 'PED', section: 'Pédagogique', filiere: 'Sciences de l\'Éducation', actif: true },
    { id: 6, nom: 'Coupe et Couture', code: 'CC', section: 'Technique & Professionnelle', filiere: 'Arts & Métiers', actif: true },
    { id: 7, nom: 'Électricité & Électronique', code: 'ELEC', section: 'Technique Industrielle', filiere: 'Génie Électrique', actif: true },
    { id: 8, nom: 'Mécanique Générale', code: 'MEC', section: 'Technique Industrielle', filiere: 'Génie Mécanique', actif: true },
    { id: 9, nom: 'Secrétariat-Bureautique', code: 'SB', section: 'Commerciale & Économique', filiere: 'Administration', actif: true },
    { id: 10, nom: 'Informatique & Réseaux', code: 'INFO', section: 'Technique & Numérique', filiere: 'Technologies Numériques', actif: true }
  ],
  typesSalles: [
    { id: 1, nom: "Salle de classe ordinaire", code: "CLS", icon: "School", description: "Salle standard pour cours magistraux et exercices dirigés" },
    { id: 2, nom: "Salle pédagogique spécialisée", code: "PED", icon: "BookOpen", description: "Salle équipée de matériel didactique par matière" },
    { id: 3, nom: "Laboratoire Informatique", code: "LAB-INF", icon: "Laptop", description: "Postes connectés, serveurs et équipements multimédias" },
    { id: 4, nom: "Laboratoire de Sciences & SVT", code: "LAB-SC", icon: "FlaskConical", description: "Microscopes, maquettes anatomiques et verrerie" },
    { id: 5, nom: "Laboratoire de Chimie & Physique", code: "LAB-CH", icon: "Atom", description: "Hottes aspirantes, réactifs chimiques et bancs d'optique" },
    { id: 6, nom: "Bibliothèque & Centre de documentation", code: "BIBLIO", icon: "Library", description: "Ouvrages, manuels scolaires officiels et espaces de lecture" },
    { id: 7, nom: "Salle des professeurs & Réunions", code: "CONF", icon: "Users", description: "Espace de travail enseignant, délibérations et jurys" },
    { id: 8, nom: "Atelier Technique & Coupe-Couture", code: "ATELIER", icon: "Wrench", description: "Machines à coudre, établis et outillage technique" },
    { id: 9, nom: "Salle Polyvalente & Conférence", code: "POLY", icon: "Building", description: "Rassemblements solennels, colloques et examens nationaux" }
  ],
  normesPedagogiques: {
    capacite_recommandee_defaut: 35,
    seuil_alerte_defaut: 40,
    capacite_max_defaut: 45,
    surface_min_par_eleve: 1.3,
    surface_recommandee_par_eleve: 1.8
  },
  periodes: [
    { id: 1, nom: '1ère Période', annee_id: 1, active: false, ordre: 1 },
    { id: 2, nom: '2ème Période', annee_id: 1, active: false, ordre: 2 },
    { id: 3, nom: 'Examen 1er Semestre', annee_id: 1, active: false, ordre: 3 },
    { id: 4, nom: '3ème Période', annee_id: 1, active: true, ordre: 4 },
    { id: 5, nom: '4ème Période', annee_id: 1, active: false, ordre: 5 },
    { id: 6, nom: 'Examen 2ème Semestre', annee_id: 1, active: false, ordre: 6 },
    { id: 7, nom: 'Proclamation Finale', annee_id: 1, active: false, ordre: 7 }
  ],
  salles: [
    {
      id: 1,
      code: 'A-101',
      nom: 'Salle Patrice Emery Lumumba',
      type: 'Salle de classe ordinaire',
      type_id: 1,
      batiment: 'Bâtiment Principal A',
      etage: 'Rez-de-chaussée',
      porte: 'Porte 01',
      localisation: 'Aile Ouest - Près du Secrétariat',
      longueur: 9.0,
      largeur: 6.5,
      hauteur: 3.2,
      surface: 58.5,
      places_assises: 45,
      capacite: 45,
      capacite_max: 45,
      etat: 'bon_etat', // bon_etat | a_surveiller | a_renover | maintenance | hors_service
      disponible: true,
      description: 'Salle principale spacieuse équipée de double tableau et ventilation naturelle.',
      equipements: [
        { id: 1, nom: 'Bancs-pupitres biplaces', quantite: 23, etat: 'Bon', date_ajout: '2025-08-15', observation: 'En bon état de conservation' },
        { id: 2, nom: 'Bureau enseignant avec tiroir', quantite: 1, etat: 'Bon', date_ajout: '2025-08-15', observation: 'Bois massif' },
        { id: 3, nom: 'Chaise confort enseignant', quantite: 1, etat: 'Bon', date_ajout: '2025-08-15', observation: 'Rembourrée' },
        { id: 4, nom: 'Tableau blanc magnétique', quantite: 1, etat: 'Bon', date_ajout: '2025-09-01', observation: '200x120cm' },
        { id: 5, nom: 'Ventilateurs de plafond', quantite: 3, etat: 'Bon', date_ajout: '2025-09-01', observation: 'Parfait fonctionnement' },
        { id: 6, nom: 'Extincteur à poudre ABC', quantite: 1, etat: 'Bon', date_ajout: '2025-08-20', observation: 'Vérifié le 15/08/2026' }
      ],
      historique: [
        { id: 1, classe_nom: '1ère Année Primaire A', date_debut: '2025-09-01', date_fin: null, motif: 'Affectation annuelle', modifie_par: 'Préfet des Études' }
      ]
    },
    {
      id: 2,
      code: 'A-102',
      nom: 'Salle Joseph Kasa-Vubu',
      type: 'Salle de classe ordinaire',
      type_id: 1,
      batiment: 'Bâtiment Principal A',
      etage: 'Rez-de-chaussée',
      porte: 'Porte 02',
      localisation: 'Aile Ouest - Face au jardin',
      longueur: 8.5,
      largeur: 6.0,
      hauteur: 3.0,
      surface: 51.0,
      places_assises: 40,
      capacite: 40,
      capacite_max: 40,
      etat: 'bon_etat',
      disponible: true,
      description: 'Salle aérée pour les classes terminales primaires.',
      equipements: [
        { id: 1, nom: 'Bancs-pupitres individuels', quantite: 40, etat: 'Bon', date_ajout: '2025-08-15', observation: 'Structure métallique' },
        { id: 2, nom: 'Tableau noir triptyque', quantite: 1, etat: 'Bon', date_ajout: '2025-08-15', observation: 'Craie blanche/couleur' },
        { id: 3, nom: 'Bureau et chaise de maître', quantite: 1, etat: 'Bon', date_ajout: '2025-08-15', observation: 'Bon état' },
        { id: 4, nom: 'Horloge murale à quartz', quantite: 1, etat: 'Bon', date_ajout: '2025-08-15', observation: 'Pile neuve' }
      ],
      historique: [
        { id: 1, classe_nom: '6ème Année Primaire (TENAFEP)', date_debut: '2025-09-01', date_fin: null, motif: 'Affectation principale', modifie_par: 'Direction' }
      ]
    },
    {
      id: 3,
      code: 'B-201',
      nom: 'Salle Simon Kimbangu',
      type: 'Salle pédagogique spécialisée',
      type_id: 2,
      batiment: 'Bâtiment B - Éducation de Base',
      etage: '1er Étage',
      porte: 'Porte 11',
      localisation: 'Aile Est - Près du Laboratoire',
      longueur: 9.2,
      largeur: 6.8,
      hauteur: 3.2,
      surface: 62.5,
      places_assises: 45,
      capacite: 45,
      capacite_max: 45,
      etat: 'bon_etat',
      disponible: true,
      description: 'Grande salle dédiée aux classes d\'Éducation de Base (7e et 8e EB).',
      equipements: [
        { id: 1, nom: 'Tables d\'élèves 2 places', quantite: 23, etat: 'Bon', date_ajout: '2025-08-25', observation: 'Bois verni' },
        { id: 2, nom: 'Chaises individuelles robustes', quantite: 46, etat: 'Bon', date_ajout: '2025-08-25', observation: 'Plastique renforcé' },
        { id: 3, nom: 'Vidéoprojecteur mural HDMI', quantite: 1, etat: 'Bon', date_ajout: '2025-10-01', observation: 'Full HD Epson' },
        { id: 4, nom: 'Écran de projection rétractable', quantite: 1, etat: 'Bon', date_ajout: '2025-10-01', observation: 'Manuel 180x180' }
      ],
      historique: [
        { id: 1, classe_nom: '7ème Année EB (Éducation de Base)', date_debut: '2025-09-01', date_fin: null, motif: 'Affectation rentrée', modifie_par: 'Préfet des Études' }
      ]
    },
    {
      id: 4,
      code: 'LAB-SC-01',
      nom: 'Laboratoire de Sciences & Bio-Chimie',
      type: 'Laboratoire de Sciences & SVT',
      type_id: 4,
      batiment: 'Bâtiment C - Sciences & Technologies',
      etage: '1er Étage',
      porte: 'Porte 21',
      localisation: 'Aile Nord - Accès sécurisé',
      longueur: 10.0,
      largeur: 7.0,
      hauteur: 3.5,
      surface: 70.0,
      places_assises: 36,
      capacite: 36,
      capacite_max: 36,
      etat: 'bon_etat',
      disponible: true,
      description: 'Laboratoire équipé de paillasses carrelées, robinets d\'eau, gaz et armoire de sécurité.',
      equipements: [
        { id: 1, nom: 'Paillasses de laboratoire avec éviers', quantite: 6, etat: 'Bon', date_ajout: '2025-08-10', observation: 'Revêtement anti-acide' },
        { id: 2, nom: 'Tabourets de laboratoire réglables', quantite: 36, etat: 'Bon', date_ajout: '2025-08-10', observation: 'Hauteur ajustable' },
        { id: 3, nom: 'Microscopes optiques monoculaires', quantite: 12, etat: 'Bon', date_ajout: '2025-09-15', observation: 'Grossissement 40x-1000x' },
        { id: 4, nom: 'Verrerie scientifique (Béchers, Éprouvettes)', quantite: 45, etat: 'Bon', date_ajout: '2025-09-15', observation: 'Pyrex certifié' },
        { id: 5, nom: 'Armoire sécurisée pour réactifs', quantite: 1, etat: 'Bon', date_ajout: '2025-08-10', observation: 'Fermée à clé' },
        { id: 6, nom: 'Douche de sécurité et rince-œil', quantite: 1, etat: 'Bon', date_ajout: '2025-08-10', observation: 'Conforme aux normes' }
      ],
      historique: [
        { id: 1, classe_nom: '1ère Humanité Scientifique (Bio-Chimie)', date_debut: '2025-09-01', date_fin: null, motif: 'Affectation section scientifique', modifie_par: 'Préfet' }
      ]
    },
    {
      id: 5,
      code: 'LAB-INF-01',
      nom: 'Laboratoire Informatique & Multimédia',
      type: 'Laboratoire Informatique',
      type_id: 3,
      batiment: 'Bâtiment C - Sciences & Technologies',
      etage: '2ème Étage',
      porte: 'Porte 31',
      localisation: 'Aile Sud - Salle climatisée',
      longueur: 8.5,
      largeur: 6.5,
      hauteur: 3.0,
      surface: 55.25,
      places_assises: 32,
      capacite: 32,
      capacite_max: 32,
      etat: 'bon_etat',
      disponible: true,
      description: 'Salle informatique avec réseau local câblé RJ45, connexion Internet Starlink et onduleurs de protection.',
      equipements: [
        { id: 1, nom: 'Ordinateurs de bureau Core i5 / 16GB / SSD', quantite: 25, etat: 'Bon', date_ajout: '2025-08-20', observation: 'Écrans 24 pouces LED' },
        { id: 2, nom: 'Onduleurs de protection électrique APC', quantite: 6, etat: 'Bon', date_ajout: '2025-08-20', observation: 'Autonomie 30 min' },
        { id: 3, nom: 'Routeur Wi-Fi 6 & Switch 24 ports Cisco', quantite: 2, etat: 'Bon', date_ajout: '2025-08-20', observation: 'Bande passante haut débit' },
        { id: 4, nom: 'Climatiseurs split 18000 BTU', quantite: 2, etat: 'Bon', date_ajout: '2025-08-20', observation: 'Refroidissement optimal' },
        { id: 5, nom: 'Tableau interactif tactile', quantite: 1, etat: 'Bon', date_ajout: '2025-10-15', observation: 'Connexion USB & Wi-Fi' }
      ],
      historique: [
        { id: 1, classe_nom: '1ère Humanité Commerciale & Gestion', date_debut: '2025-09-01', date_fin: null, motif: 'Cours de gestion & info', modifie_par: 'Direction' }
      ]
    },
    {
      id: 6,
      code: 'BIBLIO-01',
      nom: 'Bibliothèque Centrale & Espace Numérique',
      type: 'Bibliothèque & Centre de documentation',
      type_id: 6,
      batiment: 'Bâtiment Administratif',
      etage: '1er Étage',
      porte: 'Porte 08',
      localisation: 'Centre du campus',
      longueur: 12.0,
      largeur: 8.0,
      hauteur: 3.6,
      surface: 96.0,
      places_assises: 60,
      capacite: 60,
      capacite_max: 60,
      etat: 'bon_etat',
      disponible: true,
      description: 'Fonds documentaire de plus de 4500 ouvrages, romans, syllabus et annales EXETAT.',
      equipements: [
        { id: 1, nom: 'Rayonnages métalliques à livres', quantite: 14, etat: 'Bon', date_ajout: '2025-07-10', observation: 'Traitement anti-termites' },
        { id: 2, nom: 'Tables de lecture 6 places', quantite: 8, etat: 'Bon', date_ajout: '2025-07-10', observation: 'Bois massif' },
        { id: 3, nom: 'Chaises capitonnées', quantite: 48, etat: 'Bon', date_ajout: '2025-07-10', observation: 'Grand confort' },
        { id: 4, nom: 'Postes de consultation numérique', quantite: 6, etat: 'Bon', date_ajout: '2025-09-01', observation: 'Accès intranet bibliothèque' }
      ],
      historique: []
    },
    {
      id: 7,
      code: 'B-202',
      nom: 'Salle Mzee Laurent-Désiré Kabila',
      type: 'Salle de classe ordinaire',
      type_id: 1,
      batiment: 'Bâtiment B - Éducation de Base',
      etage: '1er Étage',
      porte: 'Porte 12',
      localisation: 'Aile Est',
      longueur: 8.5,
      largeur: 6.0,
      hauteur: 3.0,
      surface: 51.0,
      places_assises: 38,
      capacite: 38,
      capacite_max: 38,
      etat: 'a_surveiller', // a_surveiller
      disponible: true,
      description: 'Salle en cours d\'aménagement complémentaire de l\'éclairage LED.',
      equipements: [
        { id: 1, nom: 'Bancs-pupitres biplaces', quantite: 19, etat: 'Bon', date_ajout: '2025-08-20', observation: 'Bon état' },
        { id: 2, nom: 'Tableau noir grand format', quantite: 1, etat: 'À surveiller', date_ajout: '2025-08-20', observation: 'Repeinte à prévoir' }
      ],
      historique: []
    },
    {
      id: 8,
      code: 'C-302',
      nom: 'Salle d\'Atelier Technique & Électricité',
      type: 'Atelier Technique & Coupe-Couture',
      type_id: 8,
      batiment: 'Bâtiment C - Sciences & Technologies',
      etage: 'Rez-de-chaussée',
      porte: 'Porte 05',
      localisation: 'Zone ateliers',
      longueur: 11.0,
      largeur: 7.0,
      hauteur: 3.8,
      surface: 77.0,
      places_assises: 30,
      capacite: 30,
      capacite_max: 30,
      etat: 'maintenance', // maintenance
      disponible: false,
      description: 'Atelier en maintenance de réfection des tableaux électriques et câblage triphasé.',
      equipements: [
        { id: 1, nom: 'Établis de travail avec étaux', quantite: 6, etat: 'Bon', date_ajout: '2025-06-01', observation: 'Acier trempé' },
        { id: 2, nom: 'Tableaux de simulation électrique', quantite: 8, etat: 'À surveiller', date_ajout: '2025-06-01', observation: 'En cours de calibration' }
      ],
      historique: []
    }
  ],
  enseignants: [
    { id: 1, nom: "KABAMBA", prenom: "Jean-Pierre", email: "prof@ecole.cd", telephone: "+243 812 345 678", specialite: "Mathématiques & Physique", matricule: "ENS-2025-01", fonction: "Professeur Titulaire", statut: "Actif", is_active: true },
    { id: 2, nom: "MUKENDI", prenom: "Solange", email: "solange.mukendi@ecole.cd", telephone: "+243 823 456 789", specialite: "Biologie & Chimie", matricule: "ENS-2025-02", fonction: "Professeur Titulaire", statut: "Actif", is_active: true },
    { id: 3, nom: "ILUNGA", prenom: "Christian", email: "christian.ilunga@ecole.cd", telephone: "+243 894 567 890", specialite: "Français & Philosophie", matricule: "ENS-2025-03", fonction: "Professeur Titulaire", statut: "Actif", is_active: true },
    { id: 4, nom: "TSHOT", prenom: "John", email: "balezeleader11@gmail.com", telephone: "+243 990 123 456", specialite: "Informatique & Gestion", matricule: "ENS-2025-04", fonction: "Chef de Département Pédagogique", statut: "Actif", is_active: true },
    { id: 5, nom: "KAPINGA", prenom: "Rachel", email: "rachel.kapinga@ecole.cd", telephone: "+243 811 222 333", specialite: "Pédagogie & Psychologie", matricule: "ENS-2025-05", fonction: "Enseignante Titulaire", statut: "Actif", is_active: true },
    { id: 6, nom: "MWAMBA", prenom: "Alain", email: "alain.mwamba@ecole.cd", telephone: "+243 977 444 555", specialite: "Histoire & Géographie", matricule: "ENS-2025-06", fonction: "Enseignant", statut: "Actif", is_active: true }
  ],
  classes: [
    {
      id: 1,
      code: 'PRI-1-A',
      nom: '1ère Année Primaire A',
      division: 'A',
      cycle: 'Enseignement Primaire',
      cycle_id: 2,
      niveau_id: 4,
      annee_etude: '1ère Primaire',
      section: 'Générale',
      filiere: 'Enseignement Fondamental',
      option_id: null,
      capacite_recommandee: 35,
      seuil_alerte: 40,
      capacite: 42,
      capacite_max: 42,
      prof_id: 1,
      salle_id: 1,
      annee_scolaire: '2025-2026',
      statut: 'active', // active | inactive | archivee | fermee
      description: 'Classe de base primaire - Apprentissage lecture, écriture et calcul.',
      titulaire_historique: [
        { prof_id: 1, prof_nom: 'KABAMBA Jean-Pierre', fonction: 'Titulaire principal', date_debut: '2025-09-01', date_fin: null, motif: 'Affectation annuelle', statut: 'Actif' }
      ],
      salle_historique: [
        { salle_id: 1, salle_nom: 'Salle Patrice Emery Lumumba (A-101)', date_debut: '2025-09-01', date_fin: null, motif: 'Attribution principale', modifie_par: 'Préfet des Études' }
      ],
      modification_historique: [
        { date: '2025-09-01', auteur: 'Administrateur', action: 'Création de la classe', details: 'Configuration initiale de la classe et capacité 42 places' }
      ]
    },
    {
      id: 2,
      code: 'PRI-6-A',
      nom: '6ème Année Primaire (ENAFEP)',
      division: 'A',
      cycle: 'Enseignement Primaire',
      cycle_id: 2,
      niveau_id: 9,
      annee_etude: '6ème Primaire',
      section: 'Générale',
      filiere: 'Enseignement Fondamental',
      option_id: null,
      capacite_recommandee: 35,
      seuil_alerte: 38,
      capacite: 40,
      capacite_max: 40,
      prof_id: 2,
      salle_id: 2,
      annee_scolaire: '2025-2026',
      statut: 'active',
      description: 'Classe de préparation au Test National de Fin d\'Études Primaires (ENAFEP).',
      titulaire_historique: [
        { prof_id: 2, prof_nom: 'MUKENDI Solange', fonction: 'Titulaire principale', date_debut: '2025-09-01', date_fin: null, motif: 'Affectation annuelle', statut: 'Actif' }
      ],
      salle_historique: [
        { salle_id: 2, salle_nom: 'Salle Joseph Kasa-Vubu (A-102)', date_debut: '2025-09-01', date_fin: null, motif: 'Attribution principale', modifie_par: 'Direction' }
      ],
      modification_historique: [
        { date: '2025-09-01', auteur: 'Administrateur', action: 'Création de la classe', details: 'Configuration initiale' }
      ]
    },
    {
      id: 3,
      code: 'EB-7-A',
      nom: '7ème Année EB (Éducation de Base)',
      division: 'A',
      cycle: 'Cycle Terminal de l\'Éducation de Base (CTEB)',
      cycle_id: 3,
      niveau_id: 10,
      annee_etude: '7ème EB',
      section: 'Éducation de Base',
      filiere: 'Tronc Commun',
      option_id: null,
      capacite_recommandee: 38,
      seuil_alerte: 42,
      capacite: 45,
      capacite_max: 45,
      prof_id: 3,
      salle_id: 3,
      annee_scolaire: '2025-2026',
      statut: 'active',
      description: 'Première année du cycle terminal de l\'éducation de base selon la réforme nationale RDC.',
      titulaire_historique: [
        { prof_id: 3, prof_nom: 'ILUNGA Christian', fonction: 'Titulaire principal', date_debut: '2025-09-01', date_fin: null, motif: 'Affectation annuelle', statut: 'Actif' }
      ],
      salle_historique: [
        { salle_id: 3, salle_nom: 'Salle Simon Kimbangu (B-201)', date_debut: '2025-09-01', date_fin: null, motif: 'Attribution principale', modifie_par: 'Direction' }
      ],
      modification_historique: [
        { date: '2025-09-01', auteur: 'Administrateur', action: 'Création de la classe', details: 'Création de la classe 7e EB' }
      ]
    },
    {
      id: 4,
      code: 'EB-8-A',
      nom: '8ème Année EB (TENASOSP)',
      division: 'A',
      cycle: 'Cycle Terminal de l\'Éducation de Base (CTEB)',
      cycle_id: 3,
      niveau_id: 11,
      annee_etude: '8ème EB',
      section: 'Éducation de Base',
      filiere: 'Tronc Commun',
      option_id: null,
      capacite_recommandee: 38,
      seuil_alerte: 42,
      capacite: 45,
      capacite_max: 45,
      prof_id: 1,
      salle_id: 1,
      annee_scolaire: '2025-2026',
      statut: 'active',
      description: 'Deuxième année EB - Préparation intensive au Test National de Sélection et d\'Orientation Scolaire (TENASOSP).',
      titulaire_historique: [
        { prof_id: 1, prof_nom: 'KABAMBA Jean-Pierre', fonction: 'Titulaire principal', date_debut: '2025-09-01', date_fin: null, motif: 'Affectation annuelle', statut: 'Actif' }
      ],
      salle_historique: [
        { salle_id: 1, salle_nom: 'Salle Patrice Emery Lumumba (A-101)', date_debut: '2025-09-01', date_fin: null, motif: 'Partage horaire', modifie_par: 'Préfet' }
      ],
      modification_historique: []
    },
    {
      id: 5,
      code: 'HUM-1-BIO',
      nom: '1ère Humanités Scientifique (Bio-Chimie)',
      division: 'A',
      cycle: 'Humanités / Enseignement Secondaire',
      cycle_id: 4,
      niveau_id: 12,
      annee_etude: '1ère Humanités',
      section: 'Scientifique',
      filiere: 'Sciences Naturelles',
      option_id: 1,
      capacite_recommandee: 30,
      seuil_alerte: 35,
      capacite: 36,
      capacite_max: 36,
      prof_id: 2,
      salle_id: 4,
      annee_scolaire: '2025-2026',
      statut: 'active',
      description: 'Classe préparatoire scientifique avec orientation renforcée en Biologie et Chimie expérimentale.',
      titulaire_historique: [
        { prof_id: 2, prof_nom: 'MUKENDI Solange', fonction: 'Titulaire principale', date_debut: '2025-09-01', date_fin: null, motif: 'Professeur de Biologie/Chimie', statut: 'Actif' }
      ],
      salle_historique: [
        { salle_id: 4, salle_nom: 'Laboratoire de Sciences & Bio-Chimie (LAB-SC-01)', date_debut: '2025-09-01', date_fin: null, motif: 'Besoin équipement de labo', modifie_par: 'Préfet' }
      ],
      modification_historique: []
    },
    {
      id: 6,
      code: 'HUM-1-CG',
      nom: '1ère Humanités Commerciale & Gestion',
      division: 'A',
      cycle: 'Humanités / Enseignement Secondaire',
      cycle_id: 4,
      niveau_id: 12,
      annee_etude: '1ère Humanités',
      section: 'Commerciale & Économique',
      filiere: 'Gestion Financière',
      option_id: 3,
      capacite_recommandee: 30,
      seuil_alerte: 35,
      capacite: 35,
      capacite_max: 35,
      prof_id: 4,
      salle_id: 5,
      annee_scolaire: '2025-2026',
      statut: 'active',
      description: 'Formation en comptabilité OHADA, droit commercial, gestion d\'entreprise et informatique appliquée.',
      titulaire_historique: [
        { prof_id: 4, prof_nom: 'TSHOT John', fonction: 'Titulaire principal', date_debut: '2025-09-01', date_fin: null, motif: 'Enseignant en Informatique & Gestion', statut: 'Actif' }
      ],
      salle_historique: [
        { salle_id: 5, salle_nom: 'Laboratoire Informatique & Multimédia (LAB-INF-01)', date_debut: '2025-09-01', date_fin: null, motif: 'Accès logiciels comptables', modifie_par: 'Direction' }
      ],
      modification_historique: []
    },
    {
      id: 7,
      code: 'HUM-2-MP',
      nom: '2ème Humanités Scientifique (Math-Physique)',
      division: 'A',
      cycle: 'Humanités / Enseignement Secondaire',
      cycle_id: 4,
      niveau_id: 13,
      annee_etude: '2ème Humanités',
      section: 'Scientifique',
      filiere: 'Sciences Exactes',
      option_id: 2,
      capacite_recommandee: 30,
      seuil_alerte: 35,
      capacite: 38,
      capacite_max: 38,
      prof_id: 1,
      salle_id: 4,
      annee_scolaire: '2025-2026',
      statut: 'active',
      description: 'Approfondissement en Analyse Mathématique, Trigonométrie, Mécanique rationnelle et Électromagnétisme.',
      titulaire_historique: [
        { prof_id: 1, prof_nom: 'KABAMBA Jean-Pierre', fonction: 'Titulaire principal', date_debut: '2025-09-01', date_fin: null, motif: 'Professeur de Math & Physique', statut: 'Actif' }
      ],
      salle_historique: [
        { salle_id: 4, salle_nom: 'Laboratoire de Sciences & Bio-Chimie (LAB-SC-01)', date_debut: '2025-09-01', date_fin: null, motif: 'Affectation labo', modifie_par: 'Préfet' }
      ],
      modification_historique: []
    },
    {
      id: 8,
      code: 'HUM-3-BIO',
      nom: '3ème Humanités Scientifique (Bio-Chimie)',
      division: 'A',
      cycle: 'Humanités / Enseignement Secondaire',
      cycle_id: 4,
      niveau_id: 14,
      annee_etude: '3ème Humanités',
      section: 'Scientifique',
      filiere: 'Sciences Naturelles',
      option_id: 1,
      capacite_recommandee: 30,
      seuil_alerte: 33,
      capacite: 35,
      capacite_max: 35,
      prof_id: 2,
      salle_id: 4,
      annee_scolaire: '2025-2026',
      statut: 'active',
      description: 'Génétique mendélienne, chimie organique descriptive et géologie générale.',
      titulaire_historique: [
        { prof_id: 2, prof_nom: 'MUKENDI Solange', fonction: 'Titulaire', date_debut: '2025-09-01', date_fin: null, motif: 'Titulaire', statut: 'Actif' }
      ],
      salle_historique: [
        { salle_id: 4, salle_nom: 'Laboratoire de Sciences (LAB-SC-01)', date_debut: '2025-09-01', date_fin: null, motif: 'Affectation', modifie_par: 'Préfet' }
      ],
      modification_historique: []
    },
    {
      id: 9,
      code: 'HUM-3-LP',
      nom: '3ème Humanités Littéraire (Latin-Philo)',
      division: 'A',
      cycle: 'Humanités / Enseignement Secondaire',
      cycle_id: 4,
      niveau_id: 14,
      annee_etude: '3ème Humanités',
      section: 'Littéraire & Sciences Humaines',
      filiere: 'Lettres & Langues',
      option_id: 4,
      capacite_recommandee: 30,
      seuil_alerte: 33,
      capacite: 35,
      capacite_max: 35,
      prof_id: 3,
      salle_id: 2,
      annee_scolaire: '2025-2026',
      statut: 'active',
      description: 'Grammaire latine, textes classiques, dissertation philosophique et littérature africaine & francophone.',
      titulaire_historique: [
        { prof_id: 3, prof_nom: 'ILUNGA Christian', fonction: 'Titulaire principal', date_debut: '2025-09-01', date_fin: null, motif: 'Professeur de Français & Latin', statut: 'Actif' }
      ],
      salle_historique: [
        { salle_id: 2, salle_nom: 'Salle Joseph Kasa-Vubu (A-102)', date_debut: '2025-09-01', date_fin: null, motif: 'Affectation', modifie_par: 'Direction' }
      ],
      modification_historique: []
    },
    {
      id: 10,
      code: 'HUM-4-BIO',
      nom: '4ème Humanités Scientifique (EXETAT)',
      division: 'A',
      cycle: 'Humanités / Enseignement Secondaire',
      cycle_id: 4,
      niveau_id: 15,
      annee_etude: '4ème Humanités',
      section: 'Scientifique',
      filiere: 'Sciences Naturelles',
      option_id: 1,
      capacite_recommandee: 30,
      seuil_alerte: 33,
      capacite: 35,
      capacite_max: 35,
      prof_id: 2,
      salle_id: 4,
      annee_scolaire: '2025-2026',
      statut: 'active',
      description: 'Classe terminale scientifique - Préparation intensive à l\'Examen d\'État (EXETAT) et épreuves hors-session.',
      titulaire_historique: [
        { prof_id: 2, prof_nom: 'MUKENDI Solange', fonction: 'Titulaire', date_debut: '2025-09-01', date_fin: null, motif: 'Préparation Exetat', statut: 'Actif' }
      ],
      salle_historique: [
        { salle_id: 4, salle_nom: 'Laboratoire de Sciences (LAB-SC-01)', date_debut: '2025-09-01', date_fin: null, motif: 'Affectation', modifie_par: 'Préfet' }
      ],
      modification_historique: []
    },
    {
      id: 11,
      code: 'HUM-4-CG',
      nom: '4ème Humanités Commerciale (EXETAT)',
      division: 'A',
      cycle: 'Humanités / Enseignement Secondaire',
      cycle_id: 4,
      niveau_id: 15,
      annee_etude: '4ème Humanités',
      section: 'Commerciale & Économique',
      filiere: 'Gestion Financière',
      option_id: 3,
      capacite_recommandee: 30,
      seuil_alerte: 33,
      capacite: 35,
      capacite_max: 35,
      prof_id: 4,
      salle_id: 5,
      annee_scolaire: '2025-2026',
      statut: 'active',
      description: 'Classe terminale commerciale - Préparation aux épreuves du jury national EXETAT en comptabilité et fiscalité.',
      titulaire_historique: [
        { prof_id: 4, prof_nom: 'TSHOT John', fonction: 'Titulaire principal', date_debut: '2025-09-01', date_fin: null, motif: 'Suivi des finalistes', statut: 'Actif' }
      ],
      salle_historique: [
        { salle_id: 5, salle_nom: 'Laboratoire Informatique & Multimédia (LAB-INF-01)', date_debut: '2025-09-01', date_fin: null, motif: 'Affectation', modifie_par: 'Direction' }
      ],
      modification_historique: []
    }
  ],
  eleves: [
    {
      id: 1,
      matricule: "2025-0001",
      nom: "KASONGO",
      postnom: "TSHILOMBO",
      prenom: "Samuel",
      sexe: "M",
      date_naissance: "2008-04-12",
      lieu_naissance: "Kinshasa",
      nationalite: "Congolaise",
      adresse: "Av. de la Paix N° 45, Q/Matonge, C/Kalamu, Kinshasa",
      telephone: "+243 819 888 777",
      classe_id: 5,
      option_id: 1,
      nom_tuteur: "KASONGO MWAMBA Jean",
      lien_tuteur: "Père",
      telephone_tuteur: "+243 815 123 456",
      email_tuteur: "papajean@gmail.com",
      email_eleve: "samuel.kasongo@ecole.cd",
      mot_de_passe_eleve: "eleve123",
      statut: "actif",
      date_inscription: "2025-09-02",
      est_boursier: false
    },
    {
      id: 2,
      matricule: "2025-0002",
      nom: "MUTOMBO",
      postnom: "KAPINGA",
      prenom: "Grace",
      sexe: "F",
      date_naissance: "2007-11-20",
      lieu_naissance: "Lubumbashi",
      nationalite: "Congolaise",
      adresse: "Av. des Cliniques N° 12, C/Gombe, Kinshasa",
      telephone: "+243 825 444 333",
      classe_id: 6,
      option_id: 3,
      nom_tuteur: "MUTOMBO KANKU Pierre",
      lien_tuteur: "Père",
      telephone_tuteur: "+243 898 765 432",
      email_tuteur: "pierre.mutombo@gmail.com",
      email_eleve: "grace.mutombo@ecole.cd",
      mot_de_passe_eleve: "grace2025",
      statut: "actif",
      date_inscription: "2025-09-03",
      est_boursier: true
    }
  ],
  cours: [
    { id: 1, nom: "Mathématiques Générales", code: "MATH-01", classe_id: 5, enseignant_id: 1, ponderation: 4, volume_horaire: 6 },
    { id: 2, nom: "Chimie Organique", code: "CHIM-01", classe_id: 5, enseignant_id: 2, ponderation: 3, volume_horaire: 4 },
    { id: 3, nom: "Biologie & Génétique", code: "BIO-01", classe_id: 5, enseignant_id: 2, ponderation: 3, volume_horaire: 4 },
    { id: 4, nom: "Comptabilité Générale", code: "COMPTA-01", classe_id: 6, enseignant_id: 4, ponderation: 5, volume_horaire: 6 },
    { id: 5, nom: "Informatique Appliquée", code: "INFO-01", classe_id: 6, enseignant_id: 4, ponderation: 3, volume_horaire: 3 }
  ],
  presences: [],
  resultats: [
    { id: 1, eleve_id: 1, cours_id: 1, periode_id: 4, note: 16.5, note_max: 20 },
    { id: 2, eleve_id: 1, cours_id: 2, periode_id: 4, note: 15, note_max: 20 },
    { id: 3, eleve_id: 1, cours_id: 3, periode_id: 4, note: 17, note_max: 20 },
    { id: 4, eleve_id: 2, cours_id: 4, periode_id: 4, note: 18, note_max: 20 },
    { id: 5, eleve_id: 2, cours_id: 5, periode_id: 4, note: 16, note_max: 20 }
  ],
  paiements: [
    { id: 1, eleve_id: 1, montant: 150, devise: "USD", date_paiement: "2025-10-05", motif: "Frais de scolarité T1", mode: "ESPECES", reference: "REC-2025-001" },
    { id: 2, eleve_id: 2, montant: 150, devise: "USD", date_paiement: "2025-10-06", motif: "Frais de scolarité T1", mode: "MOBILE_MONEY", reference: "REC-2025-002" }
  ],
  utilisateurs: [
    { id: 1, nom: "Administrateur Principal", email: "johntshottshot12@gmail.com", role: "ADMIN", is_active: true },
    { id: 2, nom: "Préfet des Études", email: "prefet@complexe-tshot.com", role: "PREFET", is_active: true },
    { id: 3, nom: "Jean-Pierre KABAMBA", email: "prof@ecole.cd", role: "ENSEIGNANT", is_active: true },
    { id: 4, nom: "Papa Jean", email: "papajean@gmail.com", role: "TUTEUR", eleve_id: 1, is_active: true },
    { id: 5, nom: "Samuel KASONGO", email: "samuel.kasongo@ecole.cd", role: "ELEVE", eleve_id: 1, password: "eleve123", is_active: true },
    { id: 6, nom: "Grace MUTOMBO", email: "grace.mutombo@ecole.cd", role: "ELEVE", eleve_id: 2, password: "grace2025", is_active: true }
  ],
  discipline: [
    { id: 1, eleve_id: 1, motif: "Retard non justifié au rassemblement", date_incident: "2026-08-15", gravite: "Légère", sanction: "Avertissement verbal", status: "clos" }
  ],
  frais: [
    { id: 1, libelle: "Frais d'inscription", montant: 30, devise: "USD", echeance: "2025-09-15", obligatoire: true },
    { id: 2, libelle: "Frais de scolarité - 1ère Tranche", montant: 150, devise: "USD", echeance: "2025-10-15", obligatoire: true },
    { id: 3, libelle: "Frais de scolarité - 2ème Tranche", montant: 150, devise: "USD", echeance: "2026-01-15", obligatoire: true },
    { id: 4, libelle: "Frais de scolarité - 3ème Tranche", montant: 120, devise: "USD", echeance: "2026-04-15", obligatoire: true }
  ],
  incidents: [
    { id: 1, eleve_id: 1, motif: "Retard au cours de Mathématiques", date_incident: "2026-08-15", gravite: "Faible", sanction: "Avertissement", date_cloture: null }
  ],
  horaires: [],
  messages: [],
  pointages: [
    { id: 1, eleve_id: 1, date: "2026-08-20", statut: "present", motif: "", heure_arrivee: "07:25", heure_depart: "13:30" },
    { id: 2, eleve_id: 2, date: "2026-08-20", statut: "present", motif: "", heure_arrivee: "07:20", heure_depart: "13:30" }
  ],
  depenses: [],
  notifications: [],
  ecoleConfig: {
    nom: "Complexe Scolaire TSHOT",
    code_ministeriel: "CS-101/KIN-EST",
    province_educationnelle: "Kinshasa / Mont-Amba",
    annee_courante: "2025-2026",
    periode_active: "3ème Période",
    taux_change_usd: 2800,
    devise_principale: "USD",
    adresse: "Av. de l'Université N° 210, Kinshasa - RDC",
    telephone: "+243 81 000 0000",
    email: "contact@complexe-tshot.com"
  }
};

