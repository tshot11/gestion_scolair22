const fs = require('fs');
let content = fs.readFileSync('src/components/views/VideoConferenceView.jsx', 'utf8');

content = content.replace('https://framatalk.org/external_api.js', 'https://meet.element.io/external_api.js');
content = content.replace('const domain = "framatalk.org";', 'const domain = "meet.element.io";');

fs.writeFileSync('src/components/views/VideoConferenceView.jsx', content);
