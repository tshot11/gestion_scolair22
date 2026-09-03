const fs = require('fs');
let content = fs.readFileSync('src/components/views/FinanceView.jsx', 'utf8');

content = content.replace(/<button className="text-xs font-bold text-blue-300 hover:text-white flex items-center gap-1 transition-colors">/g, 
  `<button onClick={() => { /* setSelectedPaiementId(p.id); */ }} className="text-xs font-bold text-blue-300 hover:text-white flex items-center gap-1 transition-colors">`);

// Wait, I need to get setSelectedPaiementId, setCurrentView from useApp()
const useAppReplace = `  const { data, currentUser, setCurrentView, setSelectedPaiementId } = useApp();`;
content = content.replace(`  const { data, currentUser } = useApp();`, useAppReplace);

content = content.replace(/<button onClick=\{\(\) => \{ \/\* setSelectedPaiementId\(p.id\); \*\/ \}\} className="text-xs/g, 
  `<button onClick={() => { setSelectedPaiementId(p.id); setCurrentView("recu"); }} className="text-xs`);

fs.writeFileSync('src/components/views/FinanceView.jsx', content);
console.log("FinanceView patched 2!");
