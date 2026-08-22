const fs = require('fs');
const file = 'src/components/views/TeachersView.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/if \\(window\\.confirm\\(.*?\\)\\) \\{/g, 'if (true) {');
content = content.replace(/if\\(confirm\\(.*?\\)\\) \\{/g, 'if (true) {');

fs.writeFileSync(file, content);
