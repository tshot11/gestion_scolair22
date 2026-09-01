import fs from 'fs';
import { initialData } from './src/data/initialData.js';

const keysToClear = [
  'salles',
  'enseignants',
  'classes',
  'eleves',
  'cours',
  'presences',
  'resultats',
  'paiements',
  'discipline',
  'incidents',
  'horaires',
  'messages',
  'pointages',
  'depenses',
  'notifications',
  'alertes',
  'corrections'
];

const cleanData = { ...initialData };

keysToClear.forEach(key => {
  if (cleanData[key] !== undefined) {
    cleanData[key] = [];
  }
});

const fileContent = `export const initialData = ${JSON.stringify(cleanData, null, 2)};\n`;
fs.writeFileSync('./src/data/initialData.js', fileContent);
console.log("File initialData.js updated.");

// Now update the backend state if server is running
fetch('http://localhost:3000/api/sync/state', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(cleanData)
})
.then(res => res.json())
.then(data => console.log("State synced:", data))
.catch(err => console.error("Error syncing state:", err));
