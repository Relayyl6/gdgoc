'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Download, Loader2, ChevronDown } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { getCollection, saveCollection, saveDocument, deleteDocument } from '@/lib/db';
import { EVENTS } from '@/lib/data';

export default function EventRegistrationsPage({ params }: { params: { id: string } }) {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getCollection('gdgoc_events'),
      getCollection('gdgoc_registrations')
    ]).then(([storedEvents, storedRegs]) => {
      const eventDetails = (storedEvents || []).find((e: any) => e.id === params.id) 
                        || EVENTS.find((e) => e.id === params.id);
      setEvent(eventDetails);

      const eventRegs = (storedRegs || []).filter((r: any) => r.eventId === params.id);
      eventRegs.sort((a: any, b: any) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
      
      setRegistrations(eventRegs);
    }).catch((e) => {
      console.error(e);
    }).finally(() => {
      setLoading(false);
    });
  }, [params.id]);

  const downloadCSV = () => {
    if (registrations.length === 0) return;
    
    const csvRows = [];
    csvRows.push(['Type', 'Date', 'First Name', 'Last Name', 'Email', 'Phone', 'Faculty', 'Level', 'Organization', 'Job Title', 'Talk Title', 'Talk Description', 'LinkedIn', 'Experience', 'Hear About', 'Tech Stack', 'Goals', 'Commitment'].join(','));
    
    for (const reg of registrations) {
      const d = reg.data;
      const row = [
        reg.type,
        new Date(reg.registeredAt).toLocaleDateString(),
        `"${d.firstName || ''}"`,
        `"${d.lastName || ''}"`,
        `"${d.email || ''}"`,
        `"${d.phone || ''}"`,
        `"${d.faculty || ''}"`,
        `"${d.level || ''}"`,
        `"${d.organization || ''}"`,
        `"${d.jobTitle || ''}"`,
        `"${(d.talkTitle || '').replace(/"/g, '""')}"`,
        `"${(d.talkDescription || '').replace(/"/g, '""')}"`,
        `"${d.linkedin || ''}"`,
        `"${d.experience || ''}"`,
        `"${d.hearAbout || ''}"`,
        `"${d.techStack || ''}"`,
        `"${(d.goals || '').replace(/"/g, '""')}"`,
        `"${d.commitment || ''}"`
      ];
      csvRows.push(row.join(','));
    }
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${params.id}-registrations.csv`);
    a.click();
  };

  if (loading) {
    return (
      <AdminLayout activePage="events">
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activePage="events">
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Registrations
            </h1>
            <p className="text-gray-400 mt-1">
              {event?.title || params.id}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
              
            <div className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-white font-medium">{registrations.length}</span>
              <span className="text-gray-400 text-sm">Total</span>
            </div>
            
            <button
              onClick={downloadCSV}
              disabled={registrations.length === 0}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white px-4 py-2 rounded-xl font-medium transition"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {registrations.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">No Registrations Yet</h3>
            <p className="text-gray-500">When users register for this event, they will appear here.</p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-gray-950 text-gray-400 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Registered</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {registrations.map((reg) => (
                    <React.Fragment key={reg.id}>
                      <tr 
                        onClick={() => setExpandedId(expandedId === reg.id ? null : reg.id)}
                        className="hover:bg-gray-800/50 transition cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${reg.type === 'speaker' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 
                              reg.type === 'trainee' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                              'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}
                          >
                            {reg.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{reg.data.firstName} {reg.data.lastName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div>{reg.data.email}</div>
                          <div className="text-xs text-gray-500">{reg.data.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          {reg.type === 'speaker' ? (
                            <>
                              <div className="text-gray-300">{reg.data.jobTitle}</div>
                              <div className="text-xs text-gray-500">{reg.data.organization}</div>
                            </>
                          ) : (
                            <>
                              <div className="text-gray-300">{reg.data.faculty}</div>
                              <div className="text-xs text-gray-500">Level {reg.data.level}</div>
                            </>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(reg.registeredAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          <div className="flex items-center gap-2 text-blue-400">
                            <span className="text-xs">View Details</span>
                            <ChevronDown size={16} className={`transition-transform ${expandedId === reg.id ? 'rotate-180' : ''}`} />
                          </div>
                        </td>
                      </tr>
                      {expandedId === reg.id && (
                        <tr className="bg-gray-800/20">
                          <td colSpan={5} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                              {reg.type === 'speaker' ? (
                                <>
                                  <div><strong className="text-gray-300">Talk Title:</strong> {reg.data.talkTitle}</div>
                                  <div className="md:col-span-2"><strong className="text-gray-300">Talk Description:</strong> {reg.data.talkDescription}</div>
                                  {reg.data.linkedin && <div className="md:col-span-2"><strong className="text-gray-300">LinkedIn:</strong> {reg.data.linkedin}</div>}
                                </>
                              ) : reg.type === 'trainee' ? (
                                <>
                                  <div><strong className="text-gray-300">Tech Stack:</strong> {reg.data.techStack}</div>
                                  <div><strong className="text-gray-300">Time Commitment:</strong> {reg.data.commitment}</div>
                                  <div className="md:col-span-2"><strong className="text-gray-300">Learning Goals:</strong> {reg.data.goals}</div>
                                </>
                              ) : (
                                <>
                                  <div><strong className="text-gray-300">Programming Experience:</strong> {reg.data.experience}</div>
                                  <div><strong className="text-gray-300">Heard About Event:</strong> {reg.data.hearAbout}</div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
