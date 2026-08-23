const fs = require('fs');
const file = 'src/context/AppContext.jsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure resultats exists on load
content = content.replace(
  "        return parsed;\n      }",
  "        if (!parsed.resultats) parsed.resultats = [];\n        if (!parsed.notes) parsed.notes = [];\n        return parsed;\n      }"
);

fs.writeFileSync(file, content);
