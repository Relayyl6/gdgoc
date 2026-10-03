'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { getCollection } from '@/lib/db';

export default function TestPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const newLogs: string[] = [];
    newLogs.push(`NEXT_PUBLIC_FIREBASE_API_KEY present: ${!!process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`);
    newLogs.push(`NEXT_PUBLIC_FIREBASE_PROJECT_ID present: ${!!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
    
    newLogs.push(`db exists: ${!!db}`);
    if (db) {
      newLogs.push(`db.type: ${db.type}`);
    }

    getCollection('gdgoc_events').then(res => {
      newLogs.push(`getCollection('gdgoc_events') length: ${res.length}`);
      setEvents(res);
      setLogs(newLogs);
    }).catch(err => {
      newLogs.push(`getCollection error: ${err.message}`);
      setLogs(newLogs);
    });
  }, []);

  return (
    <div className="p-10 pt-32 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Firebase Debug</h1>
      <pre className="bg-gray-100 p-4 rounded mb-4">
        {logs.join('\n')}
      </pre>
      <h2 className="text-xl font-bold mb-2">Events ({events.length})</h2>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(events.slice(0, 2), null, 2)}
      </pre>
    </div>
  );
}
