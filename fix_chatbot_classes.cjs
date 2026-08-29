const fs = require('fs');
let content = fs.readFileSync('src/components/Chatbot.jsx', 'utf8');

content = content.replace(/bg-\[#12305A\]\/45 B1736\]\/90 backdrop-blur-md/g, 'bg-[#12305A]/95 backdrop-blur-xl');
content = content.replace(/bg-slate-50 A\]\/45 bg-\[#12305A\]\/45 backdrop-blur-md\/40/g, 'bg-[#12305A]/45 backdrop-blur-md');
content = content.replace(/bg-white A\]\/45 bg-\[#12305A\]\/45 backdrop-blur-md\/60 backdrop-blur-md/g, 'bg-[#12305A]/45 backdrop-blur-md');
content = content.replace(/bg-white B1736\]/g, 'bg-[#12305A]/45');

fs.writeFileSync('src/components/Chatbot.jsx', content);
