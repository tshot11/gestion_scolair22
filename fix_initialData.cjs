const fs = require('fs');

let content = fs.readFileSync('src/data/initialData.js', 'utf8');

// Insert missing fields if not present
if (!content.includes('pointages:')) {
  content = content.replace(/messages: \[\],/, 'messages: [],\\n  pointages: [],\\n  notifications: [],');
}

fs.writeFileSync('src/data/initialData.js', content);
