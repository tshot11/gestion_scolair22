const fs = require('fs');
const file = 'src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
if (!content.includes('import { Chatbot } from')) {
  content = content.replace("import { CheckCircle2, Smartphone, Monitor } from 'lucide-react';", 
    "import { CheckCircle2, Smartphone, Monitor } from 'lucide-react';\nimport { Chatbot } from './components/Chatbot';");
}

// Add to the standard responsive app, and also inside mobile wrapper if needed? 
// Actually, it's better to just add it right before the final closing </div> of the return block of App

// find the last </div> in the file
// A safer way is to replace `    </div>\n  );\n}` with `      <Chatbot />\n    </div>\n  );\n}`
content = content.replace("    </div>\n  );\n}", "      <Chatbot />\n    </div>\n  );\n}");

fs.writeFileSync(file, content);
