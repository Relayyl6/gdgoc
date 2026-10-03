import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy, limit, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns true if Firebase db is a real Firestore instance, not the dummy {} fallback */
function isFirebaseReady(): boolean {
  return db && typeof (db as any).type === 'string';
}

// ─── Activity Logging ─────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  action: string;
  type: 'event' | 'blog' | 'team' | 'media' | 'volunteer' | 'system';
  time: string;
}

export const logActivity = async (action: string, type: Activity['type']) => {
  if (typeof window === 'undefined' || !isFirebaseReady()) return;
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
  if (typeof window === 'undefined' || !isFirebaseReady()) return [];
  try {
    const q = query(collection(db, 'gdgoc_activity'), orderBy('time', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as Activity);
  } catch (e) {
    console.error('Failed to get activities from Firebase', e);
    return [];
  }
};

// ─── Data Access Methods ──────────────────────────────────────────────────────

/** Fetch all documents from a Firestore collection. Returns [] if Firebase is not ready. */
export const getCollection = async (collectionName: string): Promise<any[]> => {
  if (typeof window === 'undefined' || !isFirebaseReady()) return [];
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch (e) {
    console.error(`Failed to get ${collectionName} from Firebase`, e);
    return [];
  }
};

/** Write an entire array to a Firestore collection (batch set — upserts each doc by id). */
export const saveCollection = async (collectionName: string, data: any[]) => {
  if (typeof window === 'undefined' || !isFirebaseReady()) return;
  // Firestore batch has a 500-doc limit — chunk if needed
  const CHUNK = 450;
  for (let i = 0; i < data.length; i += CHUNK) {
    const chunk = data.slice(i, i + CHUNK);
    const batch = writeBatch(db);
    chunk.forEach(item => {
      const docRef = doc(db, collectionName, String(item.id || crypto.randomUUID()));
      batch.set(docRef, item);
    });
    await batch.commit();
  }
};

/** Upsert a single document. */
export const saveDocument = async (collectionName: string, id: string, data: any) => {
  if (typeof window === 'undefined' || !isFirebaseReady()) return;
  try {
    await setDoc(doc(db, collectionName, id), data);
  } catch (e) {
    console.error(`Failed to save document ${id} in ${collectionName}`, e);
  }
};

/** Delete a single document by id. */
export const deleteDocument = async (collectionName: string, id: string) => {
  if (typeof window === 'undefined' || !isFirebaseReady()) return;
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (e) {
    console.error(`Failed to delete document ${id} in ${collectionName}`, e);
  }
};
