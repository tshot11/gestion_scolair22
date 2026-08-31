const fs = require('fs');

let code = fs.readFileSync('./src/components/ui/AnimatedStudentCard.jsx', 'utf8');

code = code.replace(/text-slate-700/g, 'text-blue-200');

fs.writeFileSync('./src/components/ui/AnimatedStudentCard.jsx', code, 'utf8');
