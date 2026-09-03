const fs = require('fs');
let content = fs.readFileSync('src/components/views/VideoConferenceView.jsx', 'utf8');

// replace domain
content = content.replace('https://meet.hostpoint.ch/external_api.js', 'https://framatalk.org/external_api.js');
content = content.replace('const domain = "meet.hostpoint.ch";', 'const domain = "framatalk.org";');
fs.writeFileSync('src/components/views/VideoConferenceView.jsx', content);
