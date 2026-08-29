const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.jsx');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Fix React hydration whitespace in tables
  content = content.replace(/>\s*\{" "\}\s*</g, '><');

  // Fix green buttons to blue
  content = content.replace(/bg-green-500/g, 'bg-blue-600');
  content = content.replace(/bg-green-600/g, 'bg-blue-700');
  content = content.replace(/hover:bg-green-600/g, 'hover:bg-blue-700');
  content = content.replace(/text-green-500/g, 'text-blue-400');
  content = content.replace(/text-green-400/g, 'text-blue-300');
  content = content.replace(/text-green-600/g, 'text-blue-500');
  content = content.replace(/border-green-500/g, 'border-blue-500');

  content = content.replace(/bg-emerald-500/g, 'bg-blue-600');
  content = content.replace(/bg-emerald-600/g, 'bg-blue-700');
  content = content.replace(/hover:bg-emerald-600/g, 'hover:bg-blue-700');

  // Fix AI assistant border (if it was border-blue-500 and should be the standard border)
  if (file.includes('Chatbot.jsx')) {
     content = content.replace(/border-blue-500/g, 'border-[#94C5FF]/15');
     content = content.replace(/border-blue-400/g, 'border-[#94C5FF]/15');
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
