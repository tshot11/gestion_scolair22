const fs = require('fs');
const file = 'src/components/views/StudentsView.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("selectedClasseId,\n    setSelectedClasseId", "selectedClasseId,\n    setSelectedClasseId,\n    currentUser");

fs.writeFileSync(file, content);
