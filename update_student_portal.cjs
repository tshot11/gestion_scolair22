const fs = require('fs');

let content = fs.readFileSync('src/components/views/StudentPortalView.jsx', 'utf8');

content = content.replace(/<span>Sexe: \{eleve\?\.sexe === "M" \? "Garçon" : "Fille"\}<\/span>/, '<span>Sexe: {eleve?.sexe === "M" ? "Garçon" : "Fille"}</span>\n            <span>Mot de passe: {currentUser?.password || "••••••••"}</span>');

fs.writeFileSync('src/components/views/StudentPortalView.jsx', content);
