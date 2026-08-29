const fs = require('fs');

let content = fs.readFileSync('src/components/views/FinanceView.jsx', 'utf8');

content = content.replace(/p\.motif\.toLowerCase\(\)\.includes\(search\.toLowerCase\(\)\) \|\|/g, 
  '(p.motif || "").toLowerCase().includes(search.toLowerCase()) ||');

content = content.replace(/p\.eleve_nom\?\.toLowerCase\(\)\.includes\(search\.toLowerCase\(\)\)/g, 
  '(p.eleve_nom || "").toLowerCase().includes(search.toLowerCase())');

fs.writeFileSync('src/components/views/FinanceView.jsx', content);
