import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './firebase';

/**
 * Uploads a file to Firebase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadImage(file: File, folder = 'uploads'): Promise<string> {
  try {
    const storage = getStorage(app);
    const filename = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storageRef = ref(storage, filename);
    
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    
    return url;
  } catch (error: any) {
    console.error('Firebase storage upload failed:', error);
    throw new Error(error.message || 'Upload failed');
  }
}
