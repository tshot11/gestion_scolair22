const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

// The fetch state effect
const originalFetch = `      .then(result => {
        if (result.success && result.data) {
          setData(JSON.parse(result.data));
        } else {
          setData(initialData);
        }
      })`;

const newFetch = `      .then(result => {
        if (result.success && result.data) {
          setData(prev => ({...JSON.parse(result.data), activeMeetings: prev?.activeMeetings || []}));
        } else {
          setData(prev => ({...initialData, activeMeetings: prev?.activeMeetings || []}));
        }
      })`;

content = content.replace(originalFetch, newFetch);

// Also the onSnapshot effect should be careful with null prev
const originalSnapshot = `setData(prev => ({ ...prev, activeMeetings: list }));`;
const newSnapshot = `setData(prev => prev ? { ...prev, activeMeetings: list } : { activeMeetings: list });`;
content = content.replace(originalSnapshot, newSnapshot);

// Also check resetToDefaultData
const originalReset = `setData(initialData);`;
const newReset = `setData(prev => ({...initialData, activeMeetings: prev?.activeMeetings || []}));`;
// Note: originalReset might appear multiple times. Let's just do a regex replace for the reset function
content = content.replace(/setData\(initialData\);/g, newReset);

fs.writeFileSync('src/context/AppContext.jsx', content);
console.log("AppContext fixed!");
