const fs = require('fs');
const file = 'src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { UserManagementView } from './components/views/UserManagementView';",
  "import { UserManagementView } from './components/views/UserManagementView';\nimport { LibraryView } from './components/views/LibraryView';"
);

content = content.replace(
  "      case 'settings':",
  "      case 'bibliotheque':\n        return <LibraryView />;\n      case 'settings':"
);

fs.writeFileSync(file, content);
