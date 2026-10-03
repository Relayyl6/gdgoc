'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Image as ImageIcon, Loader2, Users } from 'lucide-react';
import { getCollection } from '@/lib/db';
import { uploadImage } from '@/lib/upload';

export default function MassEmailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [recipientsCount, setRecipientsCount] = useState(0);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success'|'error', msg: string } | null>(null);

  useEffect(() => {
    // Fetch event and count registrants
    Promise.all([
      getCollection('gdgoc_events'),
      getCollection('gdgoc_registrations')
    ]).then(([events, registrations]) => {
      const e = (events || []).find((x: any) => x.id === params.id);
      if (e) setEvent(e);
      
      const count = (registrations || []).filter((r: any) => r.eventId === params.id).length;
      setRecipientsCount(count);
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !body) return;
    setLoading(true);
    setStatus(null);

    try {
      let attachmentUrl = undefined;
      if (file) {
        attachmentUrl = await uploadImage(file, 'emails');
      }

      const res = await fetch('/api/email/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: params.id,
          subject,
          bodyHtml: body.replace(/\n/g, '<br/>'),
          attachmentUrl
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', msg: `Successfully sent email to ${data.count} recipients.` });
        setSubject('');
        setBody('');
        setFile(null);
      } else {
        setStatus({ type: 'error', msg: data.error || 'Failed to send broadcast.' });
      }
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 md:px-8 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/admin/events/${params.id}/registrations`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registrations
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
            <h1 className="text-2xl font-bold mb-1">Mass Email Broadcast</h1>
            <p className="text-blue-100 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Sending to {recipientsCount} internal registrants for {event.title}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {status && (
              <div className={`p-4 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {status.msg}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Line</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="Important updates regarding the event..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message Body</label>
              <textarea
                required
                rows={8}
                value={body}
                onChange={e => setBody(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-y"
                placeholder="Write your email content here. Line breaks will be preserved..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Attach Image (Optional)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition">
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-600 font-medium">
                    {file ? file.name : 'Click to select an image'}
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || recipientsCount === 0}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
              ) : (
                <><Send className="w-5 h-5" /> Send to {recipientsCount} Recipients</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
