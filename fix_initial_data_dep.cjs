const fs = require('fs');

let content = fs.readFileSync('src/data/initialData.js', 'utf8');

if (!content.includes('depenses:')) {
  content = content.replace(/pointages: \[\],/, 'pointages: [],\n  depenses: [],');
}

fs.writeFileSync('src/data/initialData.js', content);
