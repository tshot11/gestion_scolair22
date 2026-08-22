const fs = require('fs');
const file = 'src/components/views/UserManagementView.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/if\s*\(!confirm\([^)]+\)\)\s*\{[\s\S]*?return;[\s\S]*?\}/, '// confirm removed');

fs.writeFileSync(file, content);
