const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const properties = [
        'eleves', 'classes', 'cours', 'horaires', 'messages', 'incidents', 
        'paiements', 'pointages', 'notifications', 'enseignants', 'resultats',
        'utilisateurs', 'salles', 'periodes', 'options', 'niveaux', 'frais', 'depenses', 'presences'
      ];
      
      for (const prop of properties) {
        content = content.replace(new RegExp("data\\." + prop + "\\.length", 'g'), "(data?." + prop + " || []).length");
        content = content.replace(new RegExp("data\\." + prop + "\\.map", 'g'), "(data?." + prop + " || []).map");
        content = content.replace(new RegExp("data\\." + prop + "\\.reduce", 'g'), "(data?." + prop + " || []).reduce");
        content = content.replace(new RegExp("data\\." + prop + "\\.filter", 'g'), "(data?." + prop + " || []).filter");
        content = content.replace(new RegExp("data\\." + prop + "\\.find", 'g'), "(data?." + prop + " || []).find");
        content = content.replace(new RegExp("data\\." + prop + "\\[", 'g'), "(data?." + prop + " || [])[");
        content = content.replace(new RegExp("= data\\." + prop + "(?=[\\s\\n;])", 'g'), "= (data?." + prop + " || [])");
      }
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('src/');
