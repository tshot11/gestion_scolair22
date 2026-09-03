const fs = require('fs');
let content = fs.readFileSync('src/components/views/ReceiptView.jsx', 'utf8');

const parentCheck = `  const isParentOrStudent = currentUser?.role_id === "parent" || currentUser?.role_id === "TUTEUR" || currentUser?.role === "TUTEUR" || currentUser?.role === "PARENT" || currentUser?.role_id === "eleve" || currentUser?.role === "ELEVE" || currentUser?.role === "Élève";
`;
content = content.replace(`  const { selectedPaiementId, setCurrentView, data } = useApp();`, `  const { selectedPaiementId, setCurrentView, data, currentUser } = useApp();\n` + parentCheck);

content = content.replace(/Retour aux finances/g, "Retour");
content = content.replace(/setCurrentView\("finance"\)/g, `setCurrentView(isParentOrStudent ? "parents" : "finance")`);

fs.writeFileSync('src/components/views/ReceiptView.jsx', content);
console.log("ReceiptView patched!");
