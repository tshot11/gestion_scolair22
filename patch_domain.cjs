const fs = require('fs');
let content = fs.readFileSync('src/components/views/VideoConferenceView.jsx', 'utf8');

// replace domain
content = content.replace('https://meet.ffmuc.net/external_api.js', 'https://meet.hostpoint.ch/external_api.js');
content = content.replace('const domain = "meet.ffmuc.net";', 'const domain = "meet.hostpoint.ch";');
fs.writeFileSync('src/components/views/VideoConferenceView.jsx', content);
