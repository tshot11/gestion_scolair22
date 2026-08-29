const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

const properties = [
  'eleves', 'classes', 'cours', 'horaires', 'messages', 'incidents', 
  'paiements', 'pointages', 'notifications', 'enseignants', 'resultats',
  'utilisateurs', 'salles', 'periodes', 'options', 'niveaux', 'frais', 'depenses', 'presences'
];

for (const prop of properties) {
  content = content.replace(new RegExp("data\\\\." + prop + "\\\\.length", 'g'), "(data?." + prop + " || []).length");
  content = content.replace(new RegExp("data\\\\." + prop + "\\\\.map", 'g'), "(data?." + prop + " || []).map");
  content = content.replace(new RegExp("data\\\\." + prop + "\\\\.reduce", 'g'), "(data?." + prop + " || []).reduce");
  content = content.replace(new RegExp("data\\\\." + prop + "\\\\.filter", 'g'), "(data?." + prop + " || []).filter");
  content = content.replace(new RegExp("data\\\\." + prop + "\\\\.find", 'g'), "(data?." + prop + " || []).find");
  content = content.replace(new RegExp("= data\\\\." + prop + "(?=[\\\\s\\\\n;])", 'g'), "= (data?." + prop + " || [])");
}

content = content.replace(/data\.ecoleConfig\./g, '(data?.ecoleConfig || {}).');

fs.writeFileSync('src/context/AppContext.jsx', content);
