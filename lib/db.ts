import { collection, doc, setDoc, getDocs, getDoc, deleteDoc, query, orderBy, limit, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

// --- ACTIVITY LOGGING ---

export interface Activity {
  id: string;
  action: string;
  type: 'event' | 'blog' | 'team' | 'media' | 'volunteer' | 'system';
  time: string;
}

export const logActivity = async (action: string, type: Activity['type']) => {
  if (typeof window === 'undefined') return;
  try {
    const newActivity: Activity = {
      id: Date.now().toString(),
      action,
      type,
      time: new Date().toISOString(),
    };
    await setDoc(doc(db, 'gdgoc_activity', newActivity.id), newActivity);
  } catch (e) {
    console.error('Failed to log activity to Firebase', e);
  }
};

export const getActivities = async (): Promise<Activity[]> => {
  if (typeof window === 'undefined') return [];
  try {
    const q = query(collection(db, 'gdgoc_activity'), orderBy('time', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Activity);
  } catch (e) {
    console.error('Failed to get activities from Firebase', e);
    return [];
  }
};

// --- DATA ACCESS METHODS ---

export const getCollection = async (collectionName: string): Promise<any[]> => {
  if (typeof window === 'undefined') return [];
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (e) {
    console.error(`Failed to get ${collectionName} from Firebase`, e);
    return [];
  }
};

export const saveCollection = async (collectionName: string, data: any[]) => {
  if (typeof window === 'undefined') return;
  try {
    const batch = writeBatch(db);
    data.forEach(item => {
      const docRef = doc(db, collectionName, item.id || crypto.randomUUID());
      batch.set(docRef, item);
    });
    await batch.commit();
  } catch (e) {
    console.error(`Failed to save ${collectionName} to Firebase`, e);
  }
};

export const saveDocument = async (collectionName: string, id: string, data: any) => {
  if (typeof window === 'undefined') return;
  try {
    await setDoc(doc(db, collectionName, id), data);
  } catch (e) {
    console.error(`Failed to save document in ${collectionName}`, e);
  }
};

export const deleteDocument = async (collectionName: string, id: string) => {
  if (typeof window === 'undefined') return;
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (e) {
    console.error(`Failed to delete document in ${collectionName}`, e);
  }
};
