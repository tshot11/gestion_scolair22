// In-memory database with realistic pre-populated data for Congolese School Management
export const db = {
  anneeScolaires: [
    { id: 1, nom: '2024-2025', date_debut: '2024-09-02', date_fin: '2025-07-02', active: false },
    { id: 2, nom: '2025-2026', date_debut: '2025-09-01', date_fin: '2026-07-02', active: true }
  ],
  niveaux: [
    { id: 1, nom: 'Maternelle (1ère à 3ème)', categorie: 'maternelle', ordre: 1 },
    { id: 2, nom: 'Primaire (1ère à 6ème)', categorie: 'primaire', ordre: 2 },
    { id: 3, nom: 'Éducation de Base (7ème & 8ème)', categorie: 'secondaire_general', ordre: 3 },
    { id: 4, nom: 'Humanités (1ère à 4ème)', categorie: 'humanites', ordre: 4 }
  ],
  options: [
    { id: 1, nom: 'Sciences / Bio-Chimie & Math-Physique', code: 'SC' },
    { id: 2, nom: 'Commerciale et Gestion', code: 'CG' },
    { id: 3, nom: 'Littéraire / Latin-Philo', code: 'LP' },
    { id: 4, nom: 'Pédagogie Générale', code: 'PED' },
    { id: 5, nom: 'Technique et Industrielle', code: 'IND' }
  ],
  periodes: [
    { id: 1, nom: '1ère Période', annee_id: 2, active: false, ordre: 1 },
    { id: 2, nom: '2ème Période', annee_id: 2, active: false, ordre: 2 },
    { id: 3, nom: 'Examen 1er Semestre', annee_id: 2, active: false, ordre: 3 },
    { id: 4, nom: '3ème Période', annee_id: 2, active: true, ordre: 4 },
    { id: 5, nom: '4ème Période', annee_id: 2, active: false, ordre: 5 },
    { id: 6, nom: 'Examen 2ème Semestre', annee_id: 2, active: false, ordre: 6 }
  ],
  salles: [
    { id: 1, code: 'S-101', nom: 'Salle Patrice Lumumba', capacite: 35, equipement: 'Projecteur, Tableau blanc', disponible: true },
    { id: 2, code: 'S-102', nom: 'Salle Kasa-Vubu', capacite: 35, equipement: 'Tableau noir, Ventilateurs', disponible: true },
    { id: 3, code: 'S-103', nom: 'Salle Simon Kimbangu', capacite: 40, equipement: 'Projecteur, Sono', disponible: true },
    { id: 4, code: 'LAB-INFO', nom: 'Laboratoire Informatique', capacite: 30, equipement: '25 PC connectés, Climatisation', disponible: true },
    { id: 5, code: 'LAB-SCI', nom: 'Laboratoire de Chimie-Physique', capacite: 30, equipement: 'Microscopes, Verrerie de chimie', disponible: true }
  ],
  enseignants: [
    {
      id: 1,
      matricule: 'ENS-2021-001',
      nom: 'MUKENDI',
      prenom: 'Jean-Pierre',
      sexe: 'M',
      date_naissance: '1982-04-15',
      lieu_naissance: 'Kinshasa',
      telephone: '+243 81 234 5678',
      email: 'jp.mukendi@ecole.cd',
      adresse: 'Av. Kasavubu N° 45, Bandalungwa, Kinshasa',
      date_embauche: '2021-09-01',
      statut: 'titulaire',
      specialite: 'Mathématiques & Physique',
      photo: '/media/photos_enseignants/télécharger_39.jpg'
    },
    {
      id: 2,
      matricule: 'ENS-2022-004',
      nom: 'KAPINGA',
      prenom: 'Marie-Claire',
      sexe: 'F',
      date_naissance: '1987-11-20',
      lieu_naissance: 'Lubumbashi',
      telephone: '+243 99 876 5432',
      email: 'mc.kapinga@ecole.cd',
      adresse: 'Av. Victoire N° 12, Kalamu, Kinshasa',
      date_embauche: '2022-09-01',
      statut: 'titulaire',
      specialite: 'Français & Philosophie',
      photo: null
    },
    {
      id: 3,
      matricule: 'ENS-2020-008',
      nom: 'TSHIBANGU',
      prenom: 'Dieudonné',
      sexe: 'M',
      date_naissance: '1979-06-10',
      lieu_naissance: 'Kananga',
      telephone: '+243 82 555 1234',
      email: 'd.tshibangu@ecole.cd',
      adresse: 'Q. Righini N° 8, Lemba, Kinshasa',
      date_embauche: '2020-08-15',
      statut: 'professeur',
      specialite: 'Biologie & Chimie',
      photo: null
    },
    {
      id: 4,
      matricule: 'ENS-2023-012',
      nom: 'BAHATI',
      prenom: 'Espérance',
      sexe: 'F',
      date_naissance: '1990-02-28',
      lieu_naissance: 'Goma',
      telephone: '+243 97 111 2233',
      email: 'e.bahati@ecole.cd',
      adresse: 'Av. Université N° 89, Limete, Kinshasa',
      date_embauche: '2023-09-01',
      statut: 'professeur',
      specialite: 'Informatique & TIC',
      photo: null
    },
    {
      id: 5,
      matricule: 'ENS-2019-002',
      nom: 'LUMUMBA',
      prenom: 'Alain',
      sexe: 'M',
      date_naissance: '1975-12-05',
      lieu_naissance: 'Kisangani',
      telephone: '+243 85 444 7788',
      email: 'a.lumumba@ecole.cd',
      adresse: 'Av. Tourisme N° 14, Ngaliema, Kinshasa',
      date_embauche: '2019-09-01',
      statut: 'titulaire',
      specialite: 'Histoire & Géographie',
      photo: null
    }
  ],
  classes: [
    { id: 1, nom: '6ème Primaire A', niveau_id: 2, annee_id: 2, option_id: null, capacite: 35, prof_id: 5, salle_id: 1 },
    { id: 2, nom: '7ème Éducation de Base', niveau_id: 3, annee_id: 2, option_id: null, capacite: 35, prof_id: 2, salle_id: 2 },
    { id: 3, nom: '8ème Éducation de Base', niveau_id: 3, annee_id: 2, option_id: null, capacite: 35, prof_id: 1, salle_id: 3 },
    { id: 4, nom: '1ère Humanités Scientifique', niveau_id: 4, annee_id: 2, option_id: 1, capacite: 30, prof_id: 3, salle_id: 4 },
    { id: 5, nom: '2ème Humanités Commerciale & Gestion', niveau_id: 4, annee_id: 2, option_id: 2, capacite: 30, prof_id: 4, salle_id: 5 },
    { id: 6, nom: '4ème Humanités Scientifique', niveau_id: 4, annee_id: 2, option_id: 1, capacite: 30, prof_id: 1, salle_id: 1 }
  ],
  eleves: [
    {
      id: 1,
      matricule: '2025-0001',
      nom: 'KALALA',
      prenom: 'Josué',
      sexe: 'M',
      date_naissance: '2009-05-14',
      lieu_naissance: 'Kinshasa',
      adresse: '12 Av. du Livre, Gombe, Kinshasa',
      telephone: '+243 81 555 0101',
      email_parent: 'kalala.famille@gmail.com',
      classe_id: 6,
      date_inscription: '2025-08-20',
      photo: '/media/photos_eleves/BALEZE.jpeg',
      est_orphelin: false,
      est_boursier: true,
      est_handicape: false,
      est_pris_en_charge: false,
      est_cas_social: false
    },
    {
      id: 2,
      matricule: '2025-0002',
      nom: 'MBOMBO',
      prenom: 'Syntyche',
      sexe: 'F',
      date_naissance: '2010-09-22',
      lieu_naissance: 'Kananga',
      adresse: '45 Av. Luambo Makiadi, Matonge, Kinshasa',
      telephone: '+243 99 444 0202',
      email_parent: 'mbombo.p@yahoo.fr',
      classe_id: 6,
      date_inscription: '2025-08-22',
      photo: '/media/photos_eleves/Gemini_Generated_Image_o91ef2o91ef2o91e.png',
      est_orphelin: false,
      est_boursier: false,
      est_handicape: false,
      est_pris_en_charge: false,
      est_cas_social: false
    },
    {
      id: 3,
      matricule: '2025-0003',
      nom: 'TSHISEKEDI',
      prenom: 'David',
      sexe: 'M',
      date_naissance: '2011-03-10',
      lieu_naissance: 'Kinshasa',
      adresse: '88 Av. Kasa-Vubu, Kintambo, Kinshasa',
      telephone: '+243 82 333 0303',
      email_parent: 'tshisekedi.d@gmail.com',
      classe_id: 4,
      date_inscription: '2025-08-25',
      photo: '/media/photos_eleves/DR_Kongo_.jpg',
      est_orphelin: false,
      est_boursier: false,
      est_handicape: false,
      est_pris_en_charge: false,
      est_cas_social: false
    },
    {
      id: 4,
      matricule: '2025-0004',
      nom: 'KABONGO',
      prenom: 'Naomie',
      sexe: 'F',
      date_naissance: '2012-07-18',
      lieu_naissance: 'Mbuji-Mayi',
      adresse: '14 Q. Salongo, Lemba, Kinshasa',
      telephone: '+243 85 222 0404',
      email_parent: 'kabongo.parent@gmail.com',
      classe_id: 3,
      date_inscription: '2025-08-26',
      photo: '/media/photos_eleves/IMG-20251220-WA0066.jpg',
      est_orphelin: true,
      est_boursier: true,
      est_handicape: false,
      est_pris_en_charge: true,
      est_cas_social: true
    },
    {
      id: 5,
      matricule: '2025-0005',
      nom: 'ILUNGA',
      prenom: 'Samuel',
      sexe: 'M',
      date_naissance: '2013-11-05',
      lieu_naissance: 'Lubumbashi',
      adresse: '27 Av. des Écuries, Ngaliema, Kinshasa',
      telephone: '+243 89 111 0505',
      email_parent: 'ilunga.sam@hotmail.com',
      classe_id: 2,
      date_inscription: '2025-08-28',
      photo: '/media/photos_eleves/WhatsApp_Image_2026-02-20_at_13.20.33.jpeg',
      est_orphelin: false,
      est_boursier: false,
      est_handicape: false,
      est_pris_en_charge: false,
      est_cas_social: false
    },
    {
      id: 6,
      matricule: '2025-0006',
      nom: 'MWAMBA',
      prenom: 'Divine',
      sexe: 'F',
      date_naissance: '2014-04-12',
      lieu_naissance: 'Kinshasa',
      adresse: '03 Rue de la Paix, Lingwala, Kinshasa',
      telephone: '+243 97 777 0606',
      email_parent: 'mwamba.divine@gmail.com',
      classe_id: 1,
      date_inscription: '2025-08-29',
      photo: '/media/photos_eleves/WhatsApp_Image_2026-02-20_at_13.27.24.jpeg',
      est_orphelin: false,
      est_boursier: false,
      est_handicape: false,
      est_pris_en_charge: false,
      est_cas_social: false
    },
    {
      id: 7,
      matricule: '2025-0007',
      nom: 'BALEZE',
      prenom: 'Jonathan',
      sexe: 'M',
      date_naissance: '2008-01-30',
      lieu_naissance: 'Bukavu',
      adresse: '78 Av. Triomphal, Kasa-Vubu, Kinshasa',
      telephone: '+243 81 888 0707',
      email_parent: 'baleze.fam@gmail.com',
      classe_id: 6,
      date_inscription: '2025-08-30',
      photo: '/media/photos_eleves/50.png',
      est_orphelin: false,
      est_boursier: false,
      est_handicape: false,
      est_pris_en_charge: false,
      est_cas_social: false
    },
    {
      id: 8,
      matricule: '2025-0008',
      nom: 'KASANJI',
      prenom: 'Priscille',
      sexe: 'F',
      date_naissance: '2010-12-08',
      lieu_naissance: 'Kinshasa',
      adresse: '90 Blvd Lumumba, Masina, Kinshasa',
      telephone: '+243 82 999 0808',
      email_parent: 'kasanji.priscille@gmail.com',
      classe_id: 5,
      date_inscription: '2025-09-01',
      photo: null,
      est_orphelin: false,
      est_boursier: false,
      est_handicape: false,
      est_pris_en_charge: false,
      est_cas_social: false
    }
  ],
  cours: [
    { id: 1, code: 'MATH-601', nom: 'Mathématiques Générales & Analyse', coefficient: 4, niveau_id: 4, option_id: 1, annee_id: 2, enseignant_id: 1, description: 'Calcul différentiel et intégral, algèbre linéaire' },
    { id: 2, code: 'PHYS-601', nom: 'Physique Mécanique & Optique', coefficient: 3, niveau_id: 4, option_id: 1, annee_id: 2, enseignant_id: 1, description: 'Cinématique, dynamique des solides et optique géométrique' },
    { id: 3, code: 'FRAN-601', nom: 'Langue Française & Littérature', coefficient: 3, niveau_id: 4, option_id: 1, annee_id: 2, enseignant_id: 2, description: 'Dissertation, analyse de textes littéraires africains et français' },
    { id: 4, code: 'CHIM-601', nom: 'Chimie Organique & Minérale', coefficient: 3, niveau_id: 4, option_id: 1, annee_id: 2, enseignant_id: 3, description: 'Hydrocarbures, réactions acido-basiques, cinétique chimique' },
    { id: 5, code: 'BIOL-601', nom: 'Biologie Cellulaire & Génétique', coefficient: 3, niveau_id: 4, option_id: 1, annee_id: 2, enseignant_id: 3, description: 'Génétique mendélienne, métabolisme cellulaire, écologie' },
    { id: 6, code: 'INFO-601', nom: 'Informatique & Algorithmique', coefficient: 2, niveau_id: 4, option_id: 1, annee_id: 2, enseignant_id: 4, description: 'Programmation, bases de données et bureautique avancée' },
    { id: 7, code: 'HIST-601', nom: 'Histoire du Congo & du Monde', coefficient: 2, niveau_id: 4, option_id: 1, annee_id: 2, enseignant_id: 5, description: 'Histoire contemporaine, décolonisation et institutions de la RDC' },
    { id: 8, code: 'COMM-501', nom: 'Comptabilité Générale', coefficient: 4, niveau_id: 4, option_id: 2, annee_id: 2, enseignant_id: 4, description: 'Système comptable OHADA et gestion d’entreprise' },
    { id: 9, code: 'MATH-101', nom: 'Calcul & Arithmétique Primaire', coefficient: 5, niveau_id: 2, option_id: null, annee_id: 2, enseignant_id: 5, description: 'Opérations fondamentales, problèmes et géométrie de base' }
  ],
  horaires: [
    { id: 1, classe_id: 6, cours_id: 1, enseignant_id: 1, salle_id: 1, jour: 'Lundi', heure_debut: '07:30', heure_fin: '09:10' },
    { id: 2, classe_id: 6, cours_id: 2, enseignant_id: 1, salle_id: 1, jour: 'Lundi', heure_debut: '09:30', heure_fin: '11:10' },
    { id: 3, classe_id: 6, cours_id: 3, enseignant_id: 2, salle_id: 1, jour: 'Mardi', heure_debut: '07:30', heure_fin: '09:10' },
    { id: 4, classe_id: 6, cours_id: 4, enseignant_id: 3, salle_id: 5, jour: 'Mardi', heure_debut: '09:30', heure_fin: '11:10' },
    { id: 5, classe_id: 6, cours_id: 5, enseignant_id: 3, salle_id: 5, jour: 'Mercredi', heure_debut: '07:30', heure_fin: '09:10' },
    { id: 6, classe_id: 6, cours_id: 6, enseignant_id: 4, salle_id: 4, jour: 'Mercredi', heure_debut: '09:30', heure_fin: '11:10' },
    { id: 7, classe_id: 6, cours_id: 7, enseignant_id: 5, salle_id: 1, jour: 'Jeudi', heure_debut: '07:30', heure_fin: '09:10' },
    { id: 8, classe_id: 6, cours_id: 1, enseignant_id: 1, salle_id: 1, jour: 'Vendredi', heure_debut: '07:30', heure_fin: '09:10' }
  ],
  pointages: [
    { id: 1, eleve_id: 1, date: '2026-08-20', statut: 'present', motif: '', heure_arrivee: '07:20', heure_depart: '13:00' },
    { id: 2, eleve_id: 2, date: '2026-08-20', statut: 'present', motif: '', heure_arrivee: '07:25', heure_depart: '13:00' },
    { id: 3, eleve_id: 3, date: '2026-08-20', statut: 'retard', motif: 'Embouteillage sur le boulevard', heure_arrivee: '07:50', heure_depart: '13:00' },
    { id: 4, eleve_id: 4, date: '2026-08-20', statut: 'present', motif: '', heure_arrivee: '07:15', heure_depart: '13:00' },
    { id: 5, eleve_id: 5, date: '2026-08-20', statut: 'malade', motif: 'Fièvre paludéenne, certificat médical fourni', heure_arrivee: null, heure_depart: null },
    { id: 6, eleve_id: 6, date: '2026-08-20', statut: 'present', motif: '', heure_arrivee: '07:22', heure_depart: '13:00' },
    { id: 7, eleve_id: 7, date: '2026-08-20', statut: 'absent', motif: 'Absence non justifiée', heure_arrivee: null, heure_depart: null },
    { id: 8, eleve_id: 8, date: '2026-08-20', statut: 'present', motif: '', heure_arrivee: '07:28', heure_depart: '13:00' }
  ],
  incidents: [
    {
      id: 1,
      eleve_id: 7,
      date: '2026-08-15',
      type: 'avertissement',
      description: 'Bavardage persistant et perturbation pendant le cours de Chimie',
      sanction: 'Travail d’intérêt général (nettoyage de la cour) et lettre aux parents',
      duree_exclusion: null,
      date_cloture: '2026-08-18',
      rapporte_par: 'Prof. TSHIBANGU'
    },
    {
      id: 2,
      eleve_id: 3,
      date: '2026-08-19',
      type: 'blâme',
      description: 'Retards répétés et port de tenue scolaire non conforme',
      sanction: 'Blâme officiel consigné au dossier scolaire',
      duree_exclusion: null,
      date_cloture: null,
      rapporte_par: 'Préfet des Études'
    }
  ],
  resultats: [
    { id: 1, eleve_id: 1, cours_id: 1, enseignant_id: 1, periode_id: 4, annee_id: 2, note: 17.5, appreciation: 'Excellent travail, très bonne rigueur mathématique', rang: 1, date_saisie: '2026-08-10' },
    { id: 2, eleve_id: 1, cours_id: 2, enseignant_id: 1, periode_id: 4, annee_id: 2, note: 16.0, appreciation: 'Très bons résultats pratiques et théoriques', rang: 1, date_saisie: '2026-08-10' },
    { id: 3, eleve_id: 1, cours_id: 3, enseignant_id: 2, periode_id: 4, annee_id: 2, note: 15.0, appreciation: 'Bonne expression écrite et orale', rang: 2, date_saisie: '2026-08-10' },
    { id: 4, eleve_id: 1, cours_id: 4, enseignant_id: 3, periode_id: 4, annee_id: 2, note: 18.0, appreciation: 'Remarquable maîtrise des réactions chimiques', rang: 1, date_saisie: '2026-08-10' },
    { id: 5, eleve_id: 1, cours_id: 5, enseignant_id: 3, periode_id: 4, annee_id: 2, note: 16.5, appreciation: 'Très bon esprit d’analyse', rang: 1, date_saisie: '2026-08-10' },
    { id: 6, eleve_id: 1, cours_id: 6, enseignant_id: 4, periode_id: 4, annee_id: 2, note: 19.0, appreciation: 'Major de la classe en programmation', rang: 1, date_saisie: '2026-08-10' },
    { id: 7, eleve_id: 1, cours_id: 7, enseignant_id: 5, periode_id: 4, annee_id: 2, note: 14.5, appreciation: 'Bon travail d’ensemble', rang: 2, date_saisie: '2026-08-10' },

    { id: 8, eleve_id: 2, cours_id: 1, enseignant_id: 1, periode_id: 4, annee_id: 2, note: 14.0, appreciation: 'Bon travail, persévérez', rang: 2, date_saisie: '2026-08-10' },
    { id: 9, eleve_id: 2, cours_id: 2, enseignant_id: 1, periode_id: 4, annee_id: 2, note: 13.5, appreciation: 'Satisfaisant mais peut faire mieux', rang: 2, date_saisie: '2026-08-10' },
    { id: 10, eleve_id: 2, cours_id: 3, enseignant_id: 2, periode_id: 4, annee_id: 2, note: 17.0, appreciation: 'Brillante en littérature et analyse', rang: 1, date_saisie: '2026-08-10' },
    { id: 11, eleve_id: 2, cours_id: 4, enseignant_id: 3, periode_id: 4, annee_id: 2, note: 14.0, appreciation: 'Travail régulier', rang: 2, date_saisie: '2026-08-10' },
    { id: 12, eleve_id: 2, cours_id: 5, enseignant_id: 3, periode_id: 4, annee_id: 2, note: 15.0, appreciation: 'Bonne participation', rang: 2, date_saisie: '2026-08-10' },
    { id: 13, eleve_id: 2, cours_id: 6, enseignant_id: 4, periode_id: 4, annee_id: 2, note: 16.0, appreciation: 'Très assidue', rang: 2, date_saisie: '2026-08-10' },
    { id: 14, eleve_id: 2, cours_id: 7, enseignant_id: 5, periode_id: 4, annee_id: 2, note: 16.5, appreciation: 'Excellente culture générale', rang: 1, date_saisie: '2026-08-10' },

    { id: 15, eleve_id: 7, cours_id: 1, enseignant_id: 1, periode_id: 4, annee_id: 2, note: 11.0, appreciation: 'Effort requis pour consolider les bases', rang: 3, date_saisie: '2026-08-10' },
    { id: 16, eleve_id: 7, cours_id: 2, enseignant_id: 1, periode_id: 4, annee_id: 2, note: 10.5, appreciation: 'Passable, attention aux distractions', rang: 3, date_saisie: '2026-08-10' },
    { id: 17, eleve_id: 7, cours_id: 3, enseignant_id: 2, periode_id: 4, annee_id: 2, note: 12.0, appreciation: 'Assez bien', rang: 3, date_saisie: '2026-08-10' },
    { id: 18, eleve_id: 7, cours_id: 4, enseignant_id: 3, periode_id: 4, annee_id: 2, note: 9.5, appreciation: 'Insuffisant, doit reprendre les TP', rang: 3, date_saisie: '2026-08-10' },
    { id: 19, eleve_id: 7, cours_id: 5, enseignant_id: 3, periode_id: 4, annee_id: 2, note: 11.5, appreciation: 'Moyen, progrès possibles', rang: 3, date_saisie: '2026-08-10' },
    { id: 20, eleve_id: 7, cours_id: 6, enseignant_id: 4, periode_id: 4, annee_id: 2, note: 13.0, appreciation: 'Bon intérêt pour l’informatique', rang: 3, date_saisie: '2026-08-10' },
    { id: 21, eleve_id: 7, cours_id: 7, enseignant_id: 5, periode_id: 4, annee_id: 2, note: 12.5, appreciation: 'Ensemble convenable', rang: 3, date_saisie: '2026-08-10' }
  ],
  categoriesFrais: [
    { id: 1, nom: 'Frais de Minerval / Scolarité' },
    { id: 2, nom: 'Frais d’Examens d’État & Épreuves' },
    { id: 3, nom: 'Frais d’Informatique & Laboratoire' },
    { id: 4, nom: 'Frais de Tenue & Insignes' },
    { id: 5, nom: 'Frais d’Assurance Scolaire' }
  ],
  frais: [
    { id: 1, nom: 'Minerval 1er Trimestre 2025-2026', categorie_id: 1, montant: 150000, echeance: '2025-10-15', periode_id: 1, obligatoire: true, description: 'Frais de scolarité pour le premier trimestre en Francs Congolais' },
    { id: 2, nom: 'Minerval 2ème Trimestre 2025-2026', categorie_id: 1, montant: 150000, echeance: '2026-01-15', periode_id: 2, obligatoire: true, description: 'Frais de scolarité deuxième trimestre' },
    { id: 3, nom: 'Minerval 3ème Trimestre 2025-2026', categorie_id: 1, montant: 150000, echeance: '2026-04-15', periode_id: 4, obligatoire: true, description: 'Frais de scolarité troisième trimestre' },
    { id: 4, nom: 'Frais d’accès au Laboratoire Informatique', categorie_id: 3, montant: 50000, echeance: '2025-09-30', periode_id: 1, obligatoire: true, description: 'Maintenance des postes et connexion Internet fibre optique' },
    { id: 5, nom: 'Frais d’inscription aux Examens', categorie_id: 2, montant: 65000, echeance: '2026-05-15', periode_id: 5, obligatoire: true, description: 'Cahiers d’items et fiches de délibération officielle' }
  ],
  paiements: [
    { id: 1, eleve_id: 1, frais_id: 1, montant_paye: 150000, date_paiement: '2025-09-10 09:30', reference: 'REC-2025-00124', recu_genere: true, mode: 'Espèces (Caisse)' },
    { id: 2, eleve_id: 1, frais_id: 2, montant_paye: 150000, date_paiement: '2026-01-08 11:15', reference: 'REC-2026-00045', recu_genere: true, mode: 'Mobile Money (M-Pesa)' },
    { id: 3, eleve_id: 1, frais_id: 3, montant_paye: 150000, date_paiement: '2026-04-05 14:20', reference: 'REC-2026-00210', recu_genere: true, mode: 'Espèces (Caisse)' },
    { id: 4, eleve_id: 1, frais_id: 4, montant_paye: 50000, date_paiement: '2025-09-10 09:35', reference: 'REC-2025-00125', recu_genere: true, mode: 'Espèces (Caisse)' },
    { id: 5, eleve_id: 2, frais_id: 1, montant_paye: 150000, date_paiement: '2025-09-15 10:00', reference: 'REC-2025-00188', recu_genere: true, mode: 'Airtel Money' },
    { id: 6, eleve_id: 2, frais_id: 2, montant_paye: 150000, date_paiement: '2026-01-12 15:40', reference: 'REC-2026-00078', recu_genere: true, mode: 'Orange Money' },
    { id: 7, eleve_id: 2, frais_id: 3, montant_paye: 100000, date_paiement: '2026-04-10 10:20', reference: 'REC-2026-00245', recu_genere: true, mode: 'Espèces (Caisse)' },
    { id: 8, eleve_id: 3, frais_id: 1, montant_paye: 150000, date_paiement: '2025-09-20 08:45', reference: 'REC-2025-00220', recu_genere: true, mode: 'Virement bancaire (Equity BCDC)' },
    { id: 9, eleve_id: 5, frais_id: 1, montant_paye: 150000, date_paiement: '2025-09-25 12:10', reference: 'REC-2025-00305', recu_genere: true, mode: 'Espèces (Caisse)' },
    { id: 10, eleve_id: 6, frais_id: 1, montant_paye: 150000, date_paiement: '2025-09-28 14:00', reference: 'REC-2025-00340', recu_genere: true, mode: 'M-Pesa' }
  ],
  depenses: [
    { id: 1, description: 'Achat de rames de papier A4 et fournitures de bureau pour la rentrée', montant: 420000, date: '2025-09-05', categorie: 'Fournitures scolaires', justificatif: 'Facture N° 890 - Papeterie Centrale' },
    { id: 2, description: 'Maintenance et recharge des extincteurs de sécurité', montant: 180000, date: '2025-10-12', categorie: 'Sécurité & Bâtiment', justificatif: 'Reçu Securitas RDC' },
    { id: 3, description: 'Abonnement Internet Fibre Optique Laboratoire Informatique (Trimestre)', montant: 350000, date: '2025-11-01', categorie: 'Télécoms & Réseaux', justificatif: 'Facture Vodacom Business' },
    { id: 4, description: 'Achat de réactifs chimiques et matériel pour le labo des sciences', montant: 620000, date: '2026-02-14', categorie: 'Matériel pédagogique', justificatif: 'Facture BioLab Kinshasa' },
    { id: 5, description: 'Carburant et entretien du groupe électrogène de secours', montant: 290000, date: '2026-05-18', categorie: 'Énergie & Maintenance', justificatif: 'Bon de caisse N° 412' }
  ],
  messages: [
    { id: 1, expediteur: 'Préfet des Études (Prof. Alain LUMUMBA)', destinataire: 'Tous les Enseignants', sujet: 'Réunion pédagogique de mi-trimestre', contenu: 'Chers collègues, vous êtes conviés à la réunion pédagogique ce samedi à 10h00 dans la Salle Patrice Lumumba.', date_envoi: '2026-08-18 14:30', lu: true },
    { id: 2, expediteur: 'Comptabilité École', destinataire: 'M. Jean-Pierre MUKENDI', sujet: 'Fiches de pointage des prestations mensuelles', contenu: 'Merci de déposer vos états d’heures supplémentaires au secrétariat avant le 25 du mois.', date_envoi: '2026-08-19 09:15', lu: false },
    { id: 3, expediteur: 'Parent Élève KALALA Josué', destinataire: 'Direction de l’École', sujet: 'Demande d’attestation de fréquentation scolaire', contenu: 'Bonjour Monsieur le Préfet, je sollicite une attestation de fréquentation pour mon fils Josué pour des formalités de bourse.', date_envoi: '2026-08-20 08:00', lu: false }
  ],
  notifications: [
    { id: 1, titre: 'Pointage de présence clôturé', message: 'Le pointage du jour 20/08/2026 a été enregistré avec succès pour toutes les classes.', date_creation: '2026-08-20 08:30', type: 'success', destine_a: 'Direction', lu: false },
    { id: 2, titre: 'Échéance Minerval 3ème Trimestre', message: 'Rappel : 4 élèves de 4ème Scientifique ont un solde de frais à régulariser.', date_creation: '2026-08-19 16:00', type: 'warning', destine_a: 'Finance', lu: false },
    { id: 3, titre: 'Nouveau résultat saisi', message: 'Prof. TSHIBANGU a finalisé la saisie des notes de Chimie pour la 4ème Scientifique.', date_creation: '2026-08-18 11:20', type: 'info', destine_a: 'Tous', lu: true }
  ],
  user: {
    username: 'admin',
    first_name: 'Dieudonné',
    last_name: 'TSHILOMBO',
    email: 'direction@gestion-scolaire.cd',
    is_authenticated: true,
    is_superuser: true,
    role: 'Préfet des Études / Administrateur'
  }
};

// Helper methods for calculations & lookups
export function getStats() {
  const total_eleves = db.eleves.length;
  const total_garcons = db.eleves.filter(e => e.sexe === 'M').length;
  const total_filles = db.eleves.filter(e => e.sexe === 'F').length;
  const garcons_percentage = total_eleves ? Math.round((total_garcons / total_eleves) * 100) : 0;
  const filles_percentage = total_eleves ? Math.round((total_filles / total_eleves) * 100) : 0;

  const total_enseignants = db.enseignants.length;
  const total_classes = db.classes.length;
  const total_cours = db.cours.length;

  const today = '2026-08-20';
  const pointagesToday = db.pointages.filter(p => p.date === today);
  const presentCount = pointagesToday.filter(p => p.statut === 'present').length;
  const absentCount = pointagesToday.filter(p => p.statut === 'absent').length;
  const retardCount = pointagesToday.filter(p => p.statut === 'retard').length;
  const maladeCount = pointagesToday.filter(p => p.statut === 'malade').length;
  const presenceRate = pointagesToday.length ? Math.round((presentCount / pointagesToday.length) * 100) : 0;

  const total_recouvrement = db.paiements.reduce((sum, p) => sum + Number(p.montant_paye), 0);
  const total_depenses = db.depenses.reduce((sum, d) => sum + Number(d.montant), 0);
  const solde_caisse = total_recouvrement - total_depenses;

  const total_incidents_actifs = db.incidents.filter(i => !i.date_cloture).length;
  const unread_notifications = db.notifications.filter(n => !n.lu).length;
  const unread_messages = db.messages.filter(m => !m.lu).length;

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
}

export function getEleveDetail(id) {
  const eleve = db.eleves.find(e => e.id === Number(id));
  if (!eleve) return null;
  const classe = db.classes.find(c => c.id === eleve.classe_id);
  const pointages = db.pointages.filter(p => p.eleve_id === eleve.id);
  const paiements = db.paiements.filter(p => p.eleve_id === eleve.id).map(p => {
    const f = db.frais.find(fr => fr.id === p.frais_id);
    return { ...p, frais_nom: f ? f.nom : 'Frais' };
  });
  const incidents = db.incidents.filter(i => i.eleve_id === eleve.id);
  const resultats = db.resultats.filter(r => r.eleve_id === eleve.id).map(r => {
    const c = db.cours.find(co => co.id === r.cours_id);
    const ens = db.enseignants.find(en => en.id === r.enseignant_id);
    const per = db.periodes.find(pe => pe.id === r.periode_id);
    return {
      ...r,
      cours_nom: c ? c.nom : 'Cours',
      cours_code: c ? c.code : '',
      coefficient: c ? c.coefficient : 1,
      enseignant_nom: ens ? `${ens.nom} ${ens.prenom}` : '',
      periode_nom: per ? per.nom : ''
    };
  });

  // Calculate Bulletin summary
  let totalPoints = 0;
  let totalCoeff = 0;
  resultats.forEach(r => {
    totalPoints += r.note * r.coefficient;
    totalCoeff += r.coefficient;
  });
  const moyenne = totalCoeff > 0 ? (totalPoints / totalCoeff).toFixed(2) : '0.00';
  const pourcentage = totalCoeff > 0 ? ((totalPoints / (totalCoeff * 20)) * 100).toFixed(1) : '0';

  let mention = 'Insuffisant';
  if (pourcentage >= 80) mention = 'Très Bien (Élite)';
  else if (pourcentage >= 70) mention = 'Bien (Distinction)';
  else if (pourcentage >= 60) mention = 'Assez Bien (Satisfaction)';
  else if (pourcentage >= 50) mention = 'Passable (Ajourné)';

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
    totalPoints: totalPoints.toFixed(1),
    totalCoeff
  };
}
