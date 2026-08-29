const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

content = content.replace(/allowedViews: \["parents", "dashboard", "bulletin", "finance", "recu", "communication", "discipline", "visio"\],/g, 'allowedViews: ["parents", "bulletin", "recu", "communication", "discipline", "visio"],');

content = content.replace(/allowedViews: \["eleve_portal", "dashboard", "bulletin", "communication", "discipline", "visio", "bibliotheque"\],/g, 'allowedViews: ["eleve_portal", "bulletin", "communication", "discipline", "visio", "bibliotheque"],');

fs.writeFileSync('src/context/AppContext.jsx', content);
