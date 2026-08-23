const fs = require('fs');
const file = 'src/components/views/ResultsView.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "<th className=\"p-3 text-center w-24\">Note (/20)</th>",
  "<th className=\"p-3 text-center w-24\">Total Période</th>"
);

fs.writeFileSync(file, content);
