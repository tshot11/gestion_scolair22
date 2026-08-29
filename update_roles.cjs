const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

content = content.replace(/TUTEUR: \{[^}]*allowedViews: \["bulletin", "finance", "recu", "communication"\],[^}]*\}/, `TUTEUR: {
    id: "tuteur",
    name: "Tuteur / Parent",
    defaultView: "parents",
    allowedViews: ["parents", "dashboard", "bulletin", "finance", "recu", "communication", "discipline", "visio"],
    user: { id: 6, username: "parent", first_name: "Parent", last_name: "Eleve", role: "Tuteur", role_id: "TUTEUR", avatar: "PE", is_authenticated: true },
  },
  ELEVE: {
    id: "eleve",
    name: "Élève",
    defaultView: "eleve_portal",
    allowedViews: ["eleve_portal", "dashboard", "bulletin", "communication", "discipline", "visio", "bibliotheque"],
    user: { id: 7, username: "eleve", first_name: "Eleve", last_name: "Etudiant", role: "Élève", role_id: "ELEVE", avatar: "EL", is_authenticated: true },
  }`);

// Make sure eleve_portal is added to default allowed views if checking anywhere else
// add eleve_portal to ADMIN just in case
content = content.replace(/allowedViews: \["dashboard", "eleves",/g, 'allowedViews: ["dashboard", "eleves", "eleve_portal",');

fs.writeFileSync('src/context/AppContext.jsx', content);
