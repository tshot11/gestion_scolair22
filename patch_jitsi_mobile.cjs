const fs = require('fs');
let content = fs.readFileSync('src/components/views/VideoConferenceView.jsx', 'utf8');

const oldConfig = `            configOverwrite: {
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                prejoinPageEnabled: false
            },`;

const newConfig = `            configOverwrite: {
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                prejoinPageEnabled: false,
                disableDeepLinking: true
            },`;

content = content.replace(oldConfig, newConfig);
fs.writeFileSync('src/components/views/VideoConferenceView.jsx', content);
console.log("Jitsi mobile config patched!");
