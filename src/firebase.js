import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "peak-eon-449918-k0",
  appId: "1:437029350853:web:ac6022bde0149b5bbb2fac",
  apiKey: "AIzaSyCbiqCA47LFPoLpk134aR2cNG13mK3f4i8",
  authDomain: "peak-eon-449918-k0.firebaseapp.com",
  storageBucket: "peak-eon-449918-k0.firebasestorage.app",
  messagingSenderId: "437029350853"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-gestionscolair22-806171f1-cc6d-4fff-80ec-3e8bd440ef41");

export { db, doc, onSnapshot, setDoc };
