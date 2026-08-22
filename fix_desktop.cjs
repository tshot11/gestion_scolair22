const fs = require('fs');
const file = 'src/components/layout/DesktopNavbar.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('    resetToDefaultData\n  } = useApp();', '    resetToDefaultData,\n    goBack,\n    canGoBack\n  } = useApp();');

fs.writeFileSync(file, content);
