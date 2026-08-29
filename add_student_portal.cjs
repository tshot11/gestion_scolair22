const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

if (!content.includes('StudentPortalView')) {
  content = content.replace(/import \{ ParentsPortalView \} from "\.\/components\/views\/ParentsPortalView";/, 'import { ParentsPortalView } from "./components/views/ParentsPortalView";\nimport { StudentPortalView } from "./components/views/StudentPortalView";');
  
  content = content.replace(/case "parents":\s*return <ParentsPortalView \/>;/, 'case "parents":\n        return <ParentsPortalView />;\n      case "eleve_portal":\n        return <StudentPortalView />;');
  
  fs.writeFileSync('src/App.jsx', content);
}
