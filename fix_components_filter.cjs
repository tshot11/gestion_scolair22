const fs = require('fs');

const filesToFix = {
  'src/components/views/CommunicationView.jsx': [
    /data\.messages\.filter/g, '(data?.messages || []).filter'
  ],
  'src/components/views/TimetableView.jsx': [
    /data\.horaires\.filter/g, '(data?.horaires || []).filter'
  ]
};

for (const [file, [regex, replacement]] of Object.entries(filesToFix)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content);
}
