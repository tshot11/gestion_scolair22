const fs = require('fs');
let content = fs.readFileSync('src/components/views/VideoConferenceView.jsx', 'utf8');

content = content.replace('https://meet.element.io/external_api.js', 'https://framatalk.org/external_api.js');
content = content.replace('const domain = "meet.element.io";', 'const domain = "framatalk.org";');

fs.writeFileSync('src/components/views/VideoConferenceView.jsx', content);
