export const initialData = {
  anneeScolaires: [
    { id: 1, nom: '2025-2026', date_debut: '2025-09-01', date_fin: '2026-07-02', active: true }
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
    { id: 1, nom: '1ère Période', annee_id: 1, active: false, ordre: 1 },
    { id: 2, nom: '2ème Période', annee_id: 1, active: false, ordre: 2 },
    { id: 3, nom: 'Examen 1er Semestre', annee_id: 1, active: false, ordre: 3 },
    { id: 4, nom: '3ème Période', annee_id: 1, active: true, ordre: 4 },
    { id: 5, nom: '4ème Période', annee_id: 1, active: false, ordre: 5 },
    { id: 6, nom: 'Examen 2ème Semestre', annee_id: 1, active: false, ordre: 6 },
    { id: 7, nom: 'Proclamation Finale', annee_id: 1, active: false, ordre: 7 }
  ],
  salles: [
    { id: 1, code: 'S-101', nom: 'Salle Patrice Lumumba', capacite: 35, equipement: 'Projecteur, Tableau blanc', disponible: true },
    { id: 2, code: 'S-102', nom: 'Salle Kasa-Vubu', capacite: 35, equipement: 'Tableau noir, Ventilateurs', disponible: true },
  ],
  enseignants: [],
  classes: [],
  eleves: [],
  cours: [],
  presences: [],
  resultats: [],
  paiements: [],
  utilisateurs: [],
  discipline: []
};
