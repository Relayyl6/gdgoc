'use client';

import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getCollection, saveCollection, saveDocument, deleteDocument } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Upload, X, Eye } from 'lucide-react';

const STORAGE_KEY = 'gdgoc_media_gallery';

interface MediaItem {
  id: string;
  url: string;
  author: string;
  caption: string;
  status: 'pending' | 'approved';
  uploadedAt: string;
  eventId?: string;
  eventTitle?: string;
}

const SEED_MEDIA: MediaItem[] = [
  {
    id: 'seed-1',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
    author: 'John Doe',
    caption: 'Build with AI Workshop crowd',
    status: 'pending',
    uploadedAt: '2026-10-01',
    eventId: 'build-with-ai-2026',
    eventTitle: 'Build with AI: Gemini API & Agentic Systems Masterclass'
  },
  {
    id: 'seed-2',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80',
    author: 'Jane Smith',
    caption: 'Study Jam attendees',
    status: 'pending',
    uploadedAt: '2026-10-01',
    eventId: 'devfest-uniben-2026',
    eventTitle: 'DevFest UNIBEN 2026'
  },
  {
    id: 'seed-3',
    url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80',
    author: 'Ada Okonkwo',
    caption: 'DevFest UNIBEN 2025 keynote',
    status: 'pending',
    uploadedAt: '2026-10-01',
    eventId: 'solution-challenge-info-2026',
    eventTitle: 'Solution Challenge 2027'
  },
  {
    id: 'seed-4',
    url: 'https://images.unsplash.com/photo-1523580494112-071d32d431c3?auto=format&fit=crop&q=80',
    author: 'Alex Johnson',
    caption: 'Hackathon team presentations',
    status: 'pending',
    uploadedAt: '2026-10-01',
    eventId: 'devfest-uniben-2026',
    eventTitle: 'DevFest UNIBEN 2026'
  },
];

async function loadMedia(): Promise<MediaItem[]> {
  try {
    const raw = await getCollection(STORAGE_KEY);
    if (raw && raw.length > 0) return raw as MediaItem[];
  } catch {}
  return [];
}

async function saveMedia(items: MediaItem[]) {
  try {
    await saveCollection(STORAGE_KEY, items);
  } catch {}
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploaderName, setUploaderName] = useState('');
  const [uploaderCaption, setUploaderCaption] = useState('');

  useEffect(() => {
    loadMedia().then(setMedia);
  }, []);

  const persist = (next: MediaItem[]) => {
    setMedia(next);
    saveMedia(next);
  };

  const handleApprove = async (id: string) => {
    const itemToApprove = media.find((m) => m.id === id);
    if (!itemToApprove) return;

    // Convert MediaItem into ShowcaseItem
    const newShowcaseItem = {
      id: `sc-approved-${Date.now()}`,
      eventId: itemToApprove.eventId || 'general',
      src: itemToApprove.url,
      status: 'approved',
      title: itemToApprove.eventTitle || 'Community Memory',
      caption: itemToApprove.caption,
      uploadedBy: itemToApprove.author,
      createdAt: itemToApprove.uploadedAt,
    };

    // OPTIMISTIC UPDATE: Remove from UI instantly
    setMedia(prev => {
      const next = prev.filter(m => m.id !== id);
      saveMedia(next);
      return next;
    });

    // Save to gdgoc_showcase
    try {
      const existingShowcase = await getCollection('gdgoc_showcase') || [];
      await saveCollection('gdgoc_showcase', [newShowcaseItem, ...existingShowcase]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this photo?')) return;
    setMedia(prev => {
      const next = prev.filter(m => m.id !== id);
      saveMedia(next);
      return next;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result as string;
      const newItem: MediaItem = {
        id: `upload-${Date.now()}`,
        url: base64Url,
        author: uploaderName || 'Admin Upload',
        caption: uploaderCaption || file.name,
        status: 'approved', // admin uploads are auto-approved
        uploadedAt: new Date().toISOString().slice(0, 10),
      };
      setMedia(prev => {
        const next = [newItem, ...prev];
        saveMedia(next);
        return next;
      });
      setUploaderName('');
      setUploaderCaption('');
      if (fileRef.current) fileRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const filtered = filter === 'all' ? media : media.filter((m) => m.status === filter);
  const approvedCount = media.filter((m) => m.status === 'approved').length;
  const pendingCount = media.filter((m) => m.status === 'pending').length;

  return (
    <AdminLayout activePage="media">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Media Gallery</h1>
            <p className="text-gray-400 text-sm mt-1">
              {approvedCount} approved · {pendingCount} pending review ·{' '}
              <span className="text-green-400 font-medium">
                Approved photos appear on /showcase
              </span>
            </p>
          </div>

          {/* Upload button */}
          <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors shrink-0">
            <Upload className="w-4 h-4" />
            Upload Photo
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Upload metadata inputs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            placeholder="Photographer name (optional)"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={uploaderCaption}
            onChange={(e) => setUploaderCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'approved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-white text-gray-900'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {f} {f === 'pending' ? `(${pendingCount})` : f === 'approved' ? `(${approvedCount})` : `(${media.length})`}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden flex flex-col group"
            >
              <div className="relative h-48 w-full bg-white/5 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={`Upload by ${item.author}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Approved badge */}
                {item.status === 'approved' && (
                  <div className="absolute top-2 left-2 bg-green-500/90 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                    Live on Showcase
                  </div>
                )}
                {item.status === 'pending' && (
                  <div className="absolute top-2 left-2 bg-yellow-500/90 text-black text-xs font-bold px-2 py-0.5 rounded-md">
                    Pending
                  </div>
                )}
                {/* Preview overlay */}
                <button
                  onClick={() => setPreview(item)}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Eye className="w-8 h-8 text-white drop-shadow" />
                </button>
              </div>
              <div className="p-4 flex flex-col gap-2">
                {item.eventTitle && (
                  <span className="text-xs font-semibold text-[#4285F4] bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 w-fit">
                    {item.eventTitle}
                  </span>
                )}
                <p className="text-xs text-gray-400 line-clamp-1">{item.caption}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-400">By:</span>{' '}
                    <span className="text-white font-medium">{item.author}</span>
                  </div>
                  <div className="flex gap-1">
                    {item.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-md transition-colors"
                        title="Approve & publish to Showcase"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-500 bg-[#111111] border border-white/10 rounded-2xl">
              <Upload className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No media items here.</p>
            </div>
          )}
        </div>

        {/* Full-screen preview */}
        <AnimatePresence>
          {preview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-6"
              onClick={() => setPreview(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full bg-[#111] rounded-3xl overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.url} alt={preview.caption} className="w-full max-h-[75vh] object-contain" />
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{preview.caption}</p>
                    <p className="text-gray-400 text-sm">By {preview.author} · {preview.uploadedAt}</p>
                  </div>
                  <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
