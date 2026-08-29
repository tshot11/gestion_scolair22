const fs = require('fs');
let content = fs.readFileSync('src/components/Chatbot.jsx', 'utf8');

content = content.replace(/hover:bg-emerald-400/g, 'hover:bg-blue-500');
content = content.replace(/shadow-emerald-500\/30/g, 'shadow-blue-500/30');
content = content.replace(/text-emerald-600/g, 'text-blue-500');

fs.writeFileSync('src/components/Chatbot.jsx', content);
