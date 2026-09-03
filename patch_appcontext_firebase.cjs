const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

const importAdd = `import React, { createContext, useContext, useState, useEffect } from "react";
import { initialData } from "../data/initialData";
import { db, doc, onSnapshot, setDoc } from "../firebase";
`;
content = content.replace(`import React, { createContext, useContext, useState, useEffect } from "react";\nimport { initialData } from "../data/initialData";\n`, importAdd);

// Find the main useEffect for restoring data, we'll add our firebase listener inside the AppProvider
// The component is export function AppProvider({ children }) {
const providerMatch = `export function AppProvider({ children }) {`;
const providerAdd = `export function AppProvider({ children }) {
  // Sync Active Meetings globally
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "meetings", "active"), (docSnap) => {
      if (docSnap.exists()) {
         const list = docSnap.data().list || [];
         setData(prev => ({ ...prev, activeMeetings: list }));
      }
    });
    return () => unsub();
  }, []);
`;
content = content.replace(providerMatch, providerAdd);

fs.writeFileSync('src/context/AppContext.jsx', content);
console.log("AppContext patched for firebase sync!");
