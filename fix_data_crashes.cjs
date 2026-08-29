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
      
      let newContent = content;
      newContent = newContent.replace(/data\.eleves/g, '(data?.eleves || [])');
      newContent = newContent.replace(/data\.classes/g, '(data?.classes || [])');
      newContent = newContent.replace(/data\.paiements/g, '(data?.paiements || [])');
      newContent = newContent.replace(/data\.incidents/g, '(data?.incidents || [])');
      newContent = newContent.replace(/data\.cours/g, '(data?.cours || [])');
      newContent = newContent.replace(/data\.enseignants/g, '(data?.enseignants || [])');
      newContent = newContent.replace(/data\.frais/g, '(data?.frais || [])');
      
      // Fix potential duplicate parenthesization
      newContent = newContent.replace(/\(\(data\?\.eleves \|\| \[\]\)\|\s*\[\]\)/g, '(data?.eleves || [])');
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
      }
    }
  }
}

processDir('src/components/');
