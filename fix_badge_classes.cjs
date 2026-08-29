const fs = require('fs');
let content = fs.readFileSync('src/components/ui/Badge.jsx', 'utf8');

content = content.replace(/bg-\[#12305A\]\/45 bg-\[#12305A\]\/45 backdrop-blur-md\/60 backdrop-blur-md\/80/g, 'bg-[#12305A]/45 backdrop-blur-md');
content = content.replace(/hover:bg-\[#12305A\]\/45 backdrop-blur-md\/90/g, 'hover:bg-[#12305A]/60');
content = content.replace(/text-blue-300\/70 B8C7DF\]/g, 'text-blue-300/70');

fs.writeFileSync('src/components/ui/Badge.jsx', content);
