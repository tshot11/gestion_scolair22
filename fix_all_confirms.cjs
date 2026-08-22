const fs = require('fs');
const glob = require('glob'); // Note: we can just manually list files

const files = [
  'src/components/views/UserManagementView.jsx',
  'src/components/views/StudentDetailView.jsx',
  'src/components/layout/DesktopNavbar.jsx',
  'src/components/views/SettingsView.jsx',
  'src/components/views/TeachersView.jsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/if\s*\(\s*(?:window\.)?confirm\([^)]+\)\s*\)\s*\{/g, 'if (true) {');
    fs.writeFileSync(file, content);
  }
}
