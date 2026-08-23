const fs = require('fs');
const file = 'src/context/AppContext.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "'utilisateurs'",
  "'utilisateurs', 'bibliotheque'"
);
content = content.replace(
  "'communication', 'landing'\n    ]\n  },\n  comptable:",
  "'communication', 'landing', 'bibliotheque'\n    ]\n  },\n  comptable:"
);
content = content.replace(
  "'communication', 'landing'\n    ]\n  },\n  visiteur:",
  "'communication', 'landing', 'bibliotheque'\n    ]\n  },\n  eleve: {\n    id: 'eleve',\n    label: 'Élève / Étudiant',\n    badge: 'Apprenant',\n    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',\n    description: 'Accès aux cotes, cours en ligne, discipline, assiduité et bibliothèque.',\n    username: 'eleve',\n    defaultPassword: '123',\n    defaultView: 'dashboard',\n    user: {\n      id: 6,\n      username: 'eleve',\n      first_name: 'Élève',\n      last_name: 'Test',\n      role: 'Élève',\n      role_id: 'eleve',\n      email: 'eleve@ecole.cd',\n      avatar: 'EL',\n      is_authenticated: true\n    },\n    allowedViews: [\n      'dashboard', 'bulletin', 'presences', 'discipline', 'communication', 'landing', 'bibliotheque'\n    ]\n  },\n  visiteur:"
);

fs.writeFileSync(file, content);
