const fs = require('fs');

let code = fs.readFileSync('./src/context/AppContext.jsx', 'utf8');

code = code.replace(
  /const parentAllowed = \[\s*"parents",\s*"bulletin",\s*"recu",\s*"communication",\s*"discipline",\s*"visio",\s*"bibliotheque"\s*\];/g,
  'const parentAllowed = [\n        "parents",\n        "bulletin",\n        "recu",\n        "communication",\n        "discipline",\n        "visio",\n        "bibliotheque",\n        "presences"\n      ];'
);

fs.writeFileSync('./src/context/AppContext.jsx', code, 'utf8');
