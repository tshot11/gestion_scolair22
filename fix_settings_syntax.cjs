const fs = require('fs');
let content = fs.readFileSync('./src/components/views/SettingsView.jsx', 'utf8');
// Let's print out the last 20 lines of SettingsView.jsx to see where the error is.
console.log(content.split('\\n').slice(-20).join('\\n'));
