'use client';
import { isFirebaseInitialized } from '@/lib/firebase';

export function EnvWarning() {
  if (isFirebaseInitialized) return null;
  
  return (
    <div className="bg-red-600 text-white p-3 text-center text-sm font-medium z-50 relative">
      Warning: Firebase Environment Variables are missing! The app will not be able to fetch data. Please add your NEXT_PUBLIC_FIREBASE_* variables to Vercel and redeploy.
    </div>
  );
}
