const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

content = content.replace(/  \},\n  \},\n  visiteur:/, '  },\n  visiteur:');

fs.writeFileSync('src/context/AppContext.jsx', content);
