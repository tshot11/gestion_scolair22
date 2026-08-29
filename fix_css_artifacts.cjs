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
      newContent = newContent.replace(/C5FF\]\/15/g, '');
      newContent = newContent.replace(/B8C7DF\]/g, '');
      newContent = newContent.replace(/border-\[\#94C5FF\]\/15\/20/g, 'border-[#94C5FF]/15');
      newContent = newContent.replace(/border-\[\#94C5FF\]\/15\/80/g, 'border-[#94C5FF]/15');
      newContent = newContent.replace(/border-\[\#94C5FF\]\/15\/70/g, 'border-[#94C5FF]/15');
      newContent = newContent.replace(/border-\[\#94C5FF\]\/15\/60/g, 'border-[#94C5FF]/15');
      newContent = newContent.replace(/border-\[\#94C5FF\]\/15\/40/g, 'border-[#94C5FF]/15');
      newContent = newContent.replace(/border-\[\#94C5FF\]\/15\/90/g, 'border-[#94C5FF]/15');
      
      newContent = newContent.replace(/bg-\[\#12305A\]\/45 bg-\[\#12305A\]\/45/g, 'bg-[#12305A]/45');
      newContent = newContent.replace(/backdrop-blur-md\/60 backdrop-blur-md\/60/g, 'backdrop-blur-md');
      newContent = newContent.replace(/backdrop-blur-md\/60 backdrop-blur-md\/80/g, 'backdrop-blur-md');
      newContent = newContent.replace(/backdrop-blur-md\/60 backdrop-blur-md\/90/g, 'backdrop-blur-md');
      newContent = newContent.replace(/backdrop-blur-md\/60 backdrop-blur-md/g, 'backdrop-blur-md');
      newContent = newContent.replace(/backdrop-blur-md\/90/g, 'backdrop-blur-md');
      newContent = newContent.replace(/backdrop-blur-md\/80/g, 'backdrop-blur-md');
      newContent = newContent.replace(/backdrop-blur-md\/60/g, 'backdrop-blur-md');
      
      newContent = newContent.replace(/bg-\[\#12305A\]\/45\/60/g, 'bg-[#12305A]/45');
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
      }
    }
  }
}

processDir('src/');
