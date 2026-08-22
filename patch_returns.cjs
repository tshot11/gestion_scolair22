const fs = require('fs');
const file = 'src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace landing page return
content = content.replace(
  /<LandingPageView \/>\n      <\/div>\n    \);/g,
  '<LandingPageView />\n        <Chatbot />\n      </div>\n    );'
);

// Replace login page return
content = content.replace(
  /<LoginView \/>\n      <\/div>\n    \);/g,
  '<LoginView />\n        <Chatbot />\n      </div>\n    );'
);

fs.writeFileSync(file, content);
