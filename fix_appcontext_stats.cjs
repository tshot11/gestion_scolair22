const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

// Replace all data.xxx.filter to (data.xxx || []).filter in AppContext.jsx
const fieldsToFix = ['eleves', 'pointages', 'incidents', 'notifications', 'messages', 'paiements', 'resultats', 'enseignants'];

fieldsToFix.forEach(field => {
  const regex = new RegExp(`data\\.${field}\\.filter`, 'g');
  content = content.replace(regex, `(data.${field} || []).filter`);
  
  const reduceRegex = new RegExp(`data\\.${field}\\.reduce`, 'g');
  content = content.replace(reduceRegex, `(data.${field} || []).reduce`);
});

fs.writeFileSync('src/context/AppContext.jsx', content);
