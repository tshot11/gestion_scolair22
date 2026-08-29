const fs = require('fs');
let content = fs.readFileSync('src/components/views/FinanceView.jsx', 'utf8');

if(content.includes('<>')) {
  // Find the last '</div>' and insert '</>' after it, then close the return statement
  content = content.replace(/    <\/div>\n  \);\n}/, '    </div>\n    </>\n  );\n}');
  fs.writeFileSync('src/components/views/FinanceView.jsx', content);
}
