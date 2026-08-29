const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

content = content.replace(/return localData \? JSON\.parse\(localData\) : initialData;/, 'return localData ? { ...initialData, ...JSON.parse(localData), ecoleConfig: JSON.parse(localData).ecoleConfig || initialData.ecoleConfig } : initialData;');

fs.writeFileSync('src/context/AppContext.jsx', content);
