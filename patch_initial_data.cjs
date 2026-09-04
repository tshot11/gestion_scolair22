const fs = require('fs');
let content = fs.readFileSync('src/data/initialData.js', 'utf8');

// We want to replace arrays with [] for: options, periodes, utilisateurs, frais
content = content.replace(/"options": \[([\s\S]*?)\],/g, '"options": [],');
content = content.replace(/"periodes": \[([\s\S]*?)\],/g, '"periodes": [],');
content = content.replace(/"utilisateurs": \[([\s\S]*?)\],/g, '"utilisateurs": [],');
content = content.replace(/"frais": \[([\s\S]*?)\],/g, '"frais": [],');
content = content.replace(/"typesSalles": \[([\s\S]*?)\],/g, '"typesSalles": [],');

fs.writeFileSync('src/data/initialData.js', content);
console.log("Cleared mock data from initialData.js");
