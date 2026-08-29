const fs = require('fs');

let content = fs.readFileSync('src/components/views/DashboardView.jsx', 'utf8');

content = content.replace(/const recentEleves = data\.eleves\.slice\(0, 5\);/, 'const recentEleves = (data?.eleves || []).slice(0, 5);');
content = content.replace(/const recentPayments = data\.paiements\.slice\(0, 5\);/, 'const recentPayments = (data?.paiements || []).slice(0, 5);');
content = content.replace(/const incidentsActifs = data\.incidents\n\s*\.filter\(\(i\) => !i\.date_cloture\)\n\s*\.slice\(0, 3\);/, 'const incidentsActifs = (data?.incidents || [])\\n    .filter((i) => !i.date_cloture)\\n    .slice(0, 3);');

content = content.replace(/data\.eleves\.length \*\n\s*data\.frais\.reduce/, '(data?.eleves || []).length *\\n    (data?.frais || []).reduce');
content = content.replace(/\(stats\.total_recouvrement \/ totalFraisTheoriqueGlobal\)/, '((stats?.total_recouvrement || 0) / totalFraisTheoriqueGlobal)');

// Also fix mapping
content = content.replace(/data\.classes\.find/g, '(data?.classes || []).find');
content = content.replace(/data\.eleves\.find/g, '(data?.eleves || []).find');

fs.writeFileSync('src/components/views/DashboardView.jsx', content);
