import { db } from './server/firebase.js';
import { doc, setDoc } from 'firebase/firestore';

async function fix() {
    await setDoc(doc(db, "meetings", "active"), { list: [] });
    console.log("Cleared active meetings!");
    process.exit(0);
}
fix();
