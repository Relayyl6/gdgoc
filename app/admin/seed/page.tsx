'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Database, UploadCloud, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, doc, writeBatch, getDocs, deleteDoc } from 'firebase/firestore';
import { EVENTS, BLOG_POSTS, TEAM_MEMBERS } from '@/lib/data';

// ─── Types ────────────────────────────────────────────────────────────────────

type LogEntry = { msg: string; ok: boolean };

// ─── Helper: write array to Firestore in 450-doc batches ─────────────────────

async function seedCollection(colName: string, items: any[]): Promise<void> {
  const CHUNK = 450;
  for (let i = 0; i < items.length; i += CHUNK) {
    const batch = writeBatch(db);
    items.slice(i, i + CHUNK).forEach(item => {
      const ref = doc(db, colName, String(item.id));
      batch.set(ref, item);
    });
    await batch.commit();
  }
}

// ─── Helper: delete all docs in a collection ─────────────────────────────────

async function clearCollection(colName: string): Promise<number> {
  const snap = await getDocs(collection(db, colName));
  const CHUNK = 450;
  const docs = snap.docs;
  for (let i = 0; i < docs.length; i += CHUNK) {
    const batch = writeBatch(db);
    docs.slice(i, i + CHUNK).forEach(d => batch.delete(d.ref));
    await batch.commit();
  }
  return docs.length;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SeedDatabasePage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const addLog = (msg: string, ok = true) =>
    setLogs(prev => [...prev, { msg, ok }]);

  // ── Seed canonical data from lib/data.ts ─────────────────────────────────

  const handleSeed = async () => {
    setLoading(true);
    setDone(false);
    setLogs([]);

    // Check Firebase is alive
    if (!db || typeof (db as any).type !== 'string') {
      addLog('❌ Firebase is not initialised. Check your environment variables.', false);
      setLoading(false);
      return;
    }

    addLog('🔥 Firebase connected — starting seed…');

    try {
      // ── Events ──────────────────────────────────────────────────────────────
      addLog(`📅 Seeding ${EVENTS.length} events into gdgoc_events…`);
      await seedCollection('gdgoc_events', EVENTS.map(e => ({ ...e, status: e.status || 'published' })));
      addLog(`✅ gdgoc_events — ${EVENTS.length} docs written`);

      // ── Blog Posts ──────────────────────────────────────────────────────────
      addLog(`📝 Seeding ${BLOG_POSTS.length} blog posts into gdgoc_blog_posts…`);
      await seedCollection('gdgoc_blog_posts', BLOG_POSTS.map(p => ({ ...p, status: 'published' })));
      addLog(`✅ gdgoc_blog_posts — ${BLOG_POSTS.length} docs written`);

      // ── Team Members ─────────────────────────────────────────────────────────
      addLog(`👥 Seeding ${TEAM_MEMBERS.length} team members into gdgoc_team…`);
      await seedCollection('gdgoc_team', TEAM_MEMBERS);
      addLog(`✅ gdgoc_team — ${TEAM_MEMBERS.length} docs written`);

      addLog('🎉 Seed complete! All canonical data is now live in Firebase.');
      setDone(true);
    } catch (err: any) {
      addLog(`❌ Seed failed: ${err?.message ?? String(err)}`, false);
    }

    setLoading(false);
  };

  // ── Wipe a specific collection ───────────────────────────────────────────

  const handleClear = async (colName: string, label: string) => {
    if (!confirm(`Are you sure you want to DELETE ALL documents in "${colName}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const count = await clearCollection(colName);
      addLog(`🗑️ Cleared ${count} docs from ${label} (${colName})`);
    } catch (err: any) {
      addLog(`❌ Failed to clear ${colName}: ${err?.message}`, false);
    }
    setLoading(false);
  };

  return (
    <AdminLayout activePage="seed">
      <div className="py-10 px-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Database Seed</h1>
              <p className="text-gray-400 text-sm">Populate Firebase from canonical lib/data.ts</p>
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 text-yellow-300 text-sm">
            <strong>⚠️ Note:</strong> Seeding writes the static seed data defined in{' '}
            <code className="font-mono text-yellow-200">lib/data.ts</code> to Firebase. Existing documents with matching
            IDs will be overwritten. Documents with different IDs are left untouched.
          </div>
        </div>

        {/* Seed Action */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-base font-bold text-white mb-1">Seed Canonical Data</h2>
          <p className="text-gray-400 text-sm mb-4">
            Writes <strong className="text-white">{EVENTS.length} events</strong>,{' '}
            <strong className="text-white">{BLOG_POSTS.length} blog posts</strong>, and{' '}
            <strong className="text-white">{TEAM_MEMBERS.length} team members</strong> to Firebase.
          </p>
          <button
            onClick={handleSeed}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold transition shadow"
          >
            <UploadCloud className="w-4 h-4" />
            {loading ? 'Working…' : 'Seed Firebase Now'}
          </button>
          {done && (
            <div className="mt-4 flex items-center gap-2 text-green-400 text-sm font-semibold">
              <CheckCircle className="w-4 h-4" /> Seed successful — Firebase is live!
            </div>
          )}
        </div>

        {/* Danger Zone — Clear Collections */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h2 className="text-base font-bold text-red-300">Danger Zone — Clear Collections</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Permanently delete all documents in a collection. Use this before re-seeding if you want a clean slate.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { col: 'gdgoc_events', label: 'Events' },
              { col: 'gdgoc_blog_posts', label: 'Blog Posts' },
              { col: 'gdgoc_team', label: 'Team Members' },
              { col: 'gdgoc_volunteers', label: 'Volunteers' },
              { col: 'gdgoc_showcase', label: 'Showcase' },
              { col: 'gdgoc_activity', label: 'Activity Log' },
            ].map(({ col, label }) => (
              <button
                key={col}
                onClick={() => handleClear(col, label)}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Log output */}
        {logs.length > 0 && (
          <div className="bg-gray-950 border border-white/10 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Operation Log</h3>
            <div className="space-y-1 font-mono text-xs">
              {logs.map((entry, i) => (
                <div key={i} className={entry.ok ? 'text-gray-300' : 'text-red-400'}>
                  {entry.msg}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
