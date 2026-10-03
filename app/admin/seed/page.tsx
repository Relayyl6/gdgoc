'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Database, UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';

export default function SeedDatabasePage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const log = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleMigration = async () => {
    setLoading(true);
    setLogs([]);
    log('Starting migration prep...');
    
    try {
      const collections = [
        'gdgoc_events',
        'gdgoc_blog_posts',
        'gdgoc_team',
        'gdgoc_volunteers',
        'gdgoc_media_gallery',
        'gdgoc_showcase',
        'gdgoc_registrations',
        'gdgoc_activity'
      ];

      const batch = writeBatch(db); // Uncomment when Firebase is ready

      for (const col of collections) {
        const dataStr = localStorage.getItem(col);
        if (dataStr) {
          const data = JSON.parse(dataStr);
          log(`Found ${data.length} records in ${col}`);
          
          
          data.forEach((item: any) => {
            const docRef = doc(collection(db, col), item.id || crypto.randomUUID());
            batch.set(docRef, item);
          });
          
        } else {
          log(`No records found for ${col}`);
        }
      }

      await batch.commit(); // Uncomment when Firebase is ready
      log('Migration simulated successfully! (Uncomment Firebase code in app/admin/seed/page.tsx to actually write)');
      
    } catch (e: any) {
      log(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout activePage="dashboard">
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Database className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Firebase Migration</h1>
              <p className="text-gray-400 text-sm mt-1">Push your local session data (placeholders) to Firebase Firestore.</p>
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-8 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-orange-400 shrink-0" />
            <div className="text-sm text-orange-200">
              <p className="font-semibold mb-1">Before you run this:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Create a Firebase project at console.firebase.google.com</li>
                <li>Add your config to <code className="bg-orange-950 px-1 py-0.5 rounded text-orange-300">lib/firebase.ts</code></li>
                <li>Uncomment the Firebase code in <code className="bg-orange-950 px-1 py-0.5 rounded text-orange-300">app/admin/seed/page.tsx</code></li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleMigration}
            disabled={loading}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? <span className="animate-pulse">Migrating...</span> : <><UploadCloud className="w-5 h-5" /> Push Local Data to Firebase</>}
          </button>

          {logs.length > 0 && (
            <div className="mt-8 bg-black rounded-xl p-4 border border-gray-800 font-mono text-sm">
              {logs.map((l, i) => (
                <div key={i} className="text-green-400 flex items-start gap-2 py-1">
                  <span className="text-gray-600 mt-0.5">{`>`}</span>
                  <span>{l}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
