const fs = require('fs');
let content = fs.readFileSync('src/components/views/VideoConferenceView.jsx', 'utf8');

content = content.replace('https://meet.jit.si/external_api.js', 'https://meet.ffmuc.net/external_api.js');
content = content.replace('const domain = "meet.jit.si";', 'const domain = "meet.ffmuc.net";');

// Also hide the Jitsi watermark more aggressively and simplify the interface
// We already have SHOW_JITSI_WATERMARK: false, let's add more config overwrites to be safe.
const newInterface = `            interfaceConfigOverwrite: {
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                SHOW_BRAND_WATERMARK: false,
                BRAND_WATERMARK_LINK: '',
                DEFAULT_LOGO_URL: '',
                DEFAULT_WELCOME_PAGE_LOGO_URL: '',
                HIDE_DEEP_LINKING_LOGO: true,
                TOOLBAR_BUTTONS: [`;
content = content.replace(/            interfaceConfigOverwrite: \{\n                SHOW_JITSI_WATERMARK: false,\n                SHOW_WATERMARK_FOR_GUESTS: false,\n                TOOLBAR_BUTTONS: \[/, newInterface);

fs.writeFileSync('src/components/views/VideoConferenceView.jsx', content);
console.log("Jitsi domain patched!");
