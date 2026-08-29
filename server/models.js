import { db } from './firebase.js';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, getCountFromServer, limit } from 'firebase/firestore';

class MockModel {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collection = collection(db, collectionName);
  }

  async count() {
    const snapshot = await getCountFromServer(this.collection);
    return snapshot.data().count;
  }

  async findOne({ where: conditions }) {
    let q = this.collection;
    for (const [key, value] of Object.entries(conditions)) {
      q = query(q, where(key, '==', value));
    }
    q = query(q, limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return this._wrapDoc(snapshot.docs[0]);
  }

  async findByPk(id, options = {}) {
    const docRef = doc(db, this.collectionName, String(id));
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return this._wrapDoc(docSnap);
  }

  async findAll(options = {}) {
    const snapshot = await getDocs(this.collection);
    return snapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
  }

  async create(data) {
    const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
    let docRef;
    if (cleanData.id) {
      docRef = doc(db, this.collectionName, String(cleanData.id));
    } else {
      docRef = doc(this.collection); // Auto-generate ID
      cleanData.id = docRef.id;
    }
    
    const now = new Date().toISOString();
    const docData = { ...cleanData, createdAt: now, updatedAt: now };
    
    if (this.collectionName === 'Users' && !('is_active' in docData)) {
      docData.is_active = true;
    }
    
    await setDoc(docRef, docData);
    const savedDoc = await getDoc(docRef);
    return this._wrapDoc(savedDoc);
  }

  _wrapDoc(docSnap) {
    const data = docSnap.data();
    const wrapped = {
      ...data,
      id: docSnap.id,
      update: async (updates) => {
        const cleanUpdates = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
        cleanUpdates.updatedAt = new Date().toISOString();
        await updateDoc(docSnap.ref, cleanUpdates);
        Object.assign(wrapped, cleanUpdates);
        return wrapped;
      },
      destroy: async () => {
        await deleteDoc(docSnap.ref);
      },
      toJSON: () => data
    };
    return wrapped;
  }
}

export const sequelize = {
  authenticate: async () => console.log("Firebase connecté via client SDK"),
  sync: async () => console.log("Firebase sync ignoré"),
};

export const User = new MockModel('Users');
export const Student = new MockModel('Students');
export const AuditLog = new MockModel('AuditLogs');
export const Payment = new MockModel('Payments');
export const ParentStudent = new MockModel('ParentStudents');
export const Alert = new MockModel('Alerts');
export const CorrectionRequest = new MockModel('CorrectionRequests');
