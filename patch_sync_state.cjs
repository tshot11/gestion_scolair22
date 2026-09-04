const fs = require('fs');
let content = fs.readFileSync('server/routes.js', 'utf8');

const oldSyncState = `router.post('/sync/state', async (req, res) => {
  try {
    
    const docRef = doc(db, 'System', 'AppState');
    // Save as a stringified chunk to avoid Firestore deep nesting limits or key errors
    await setDoc(docRef, { state: JSON.stringify(req.body) });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`;

const newSyncState = `router.post('/sync/state', authenticate, async (req, res) => {
  try {
    const docRef = doc(db, 'System', 'AppState');
    const snap = await getDoc(docRef);
    let oldState = snap.exists() ? JSON.parse(snap.data().state) : {};
    let newState = req.body;
    
    // ENFORCE ROLES ON SYNC
    if (req.user.role !== 'ADMIN') {
        // Teacher or Student cannot modify academic structure.
        // Revert their attempts to modify these arrays:
        newState.cours = oldState.cours || [];
        newState.classes = oldState.classes || [];
        newState.options = oldState.options || [];
        newState.salles = oldState.salles || [];
        newState.enseignants = oldState.enseignants || [];
        newState.utilisateurs = oldState.utilisateurs || [];
        newState.frais = oldState.frais || [];
        
        if (req.user.role === 'ELEVE') {
            // Students can't modify results, payments, presence, discipline, etc.
            newState.resultats = oldState.resultats || [];
            newState.presences = oldState.presences || [];
            newState.incidents = oldState.incidents || [];
            newState.paiements = oldState.paiements || [];
        }
    }

    await setDoc(docRef, { state: JSON.stringify(newState) });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`;

content = content.replace(oldSyncState, newSyncState);
fs.writeFileSync('server/routes.js', content);
console.log("Sync state patched with strict role enforcement");
