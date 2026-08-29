const fs = require('fs');
const content = fs.readFileSync('./src/components/views/LandingPageView.jsx', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('export function LandingPageView'));
console.log(lines.slice(start, start + 70).join('\n'));
