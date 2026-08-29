const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let newContent = content;
      // Revert the corruption
      newContent = newContent.replace(/border-\[\#94 /g, 'border-[#94C5FF]/15 ');
      newContent = newContent.replace(/hover:border-\[\#94 /g, 'hover:border-[#94C5FF]/15 ');
      newContent = newContent.replace(/border-\[\#94\/20/g, 'border-[#94C5FF]/15');
      newContent = newContent.replace(/border-\[\#94\"/g, 'border-[#94C5FF]/15"');
      newContent = newContent.replace(/border-\[\#94\}/g, 'border-[#94C5FF]/15}');
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
      }
    }
  }
}

processDir('src/');
