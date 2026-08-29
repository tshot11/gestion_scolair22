const fs = require('fs');
let b = fs.readFileSync('./src/components/views/BulletinView.jsx', 'utf8');
if (b.includes('School')) console.log('School found in BulletinView');
