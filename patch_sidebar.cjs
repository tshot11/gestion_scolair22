const fs = require('fs');
const file = 'src/components/layout/DesktopSidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

const libBtn = `      {hasPermission('bibliotheque') && (
        <NavButton 
          id="bibliotheque" 
          icon={BookOpen} 
          label="Bibliothèque" 
          active={currentView === 'bibliotheque'} 
          onClick={() => setCurrentView('bibliotheque')} 
        />
      )}`;

content = content.replace(
  "import { \n  LayoutDashboard, \n  Users, \n  GraduationCap,",
  "import { \n  LayoutDashboard, \n  Users, \n  GraduationCap,\n  BookOpen,"
);

content = content.replace(
  "label=\"Parents & Familles\" \n          active={currentView === 'parents'} \n          onClick={() => setCurrentView('parents')} \n        />\n      )}",
  "label=\"Parents & Familles\" \n          active={currentView === 'parents'} \n          onClick={() => setCurrentView('parents')} \n        />\n      )}\n" + libBtn
);

fs.writeFileSync(file, content);
