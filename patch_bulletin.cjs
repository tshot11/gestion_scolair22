const fs = require('fs');
let content = fs.readFileSync('src/components/views/BulletinView.jsx', 'utf8');

const parentCheck = `  const isParent = currentUser?.role_id === "parent" || currentUser?.role_id === "TUTEUR" || currentUser?.role === "TUTEUR" || currentUser?.role === "PARENT";
  
  let validStudents = data?.eleves || [];
  if (isParent) {
    validStudents = validStudents.filter((e) => e.email_tuteur === currentUser.email || e.id === currentUser.eleve_id);
  }
`;

content = content.replace(`  const eleve = getEleveDetail(currentStudentId);`, parentCheck + '\n  const eleve = getEleveDetail(currentStudentId);');

content = content.replace(`{(data?.eleves || []).map((e) => (`, `{validStudents.map((e) => (`);

fs.writeFileSync('src/components/views/BulletinView.jsx', content);
console.log("BulletinView patched!");
