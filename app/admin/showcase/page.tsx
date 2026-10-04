'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getCollection, saveCollection, saveDocument, deleteDocument } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  Search,
  ExternalLink,
  Plus,
  AlertCircle,
  Eye,
  Filter,
} from 'lucide-react';
import { EVENTS, type Event } from '@/lib/data';
import Link from 'next/link';

export interface ShowcaseItem {
  id: string;
  eventId: string;
  src: string;
  status: 'pending' | 'approved';
  title?: string;
  caption?: string;
  uploadedBy?: string;
  createdAt?: string;
}

const STORAGE_KEY = 'gdgoc_showcase';

const SEED_DATA: ShowcaseItem[] = [
  {
    id: 'sc-seed-1',
    eventId: 'flutter-forward-extended-2026',
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
    status: 'approved',
    title: 'Flutter Live Build Session',
    caption: 'Cross-platform reactive state engines live demonstration on Android & Desktop.',
    uploadedBy: 'Lead Organizer',
    createdAt: '2026-09-22T14:30:00Z',
  },
  {
    id: 'sc-seed-2',
    eventId: 'cloud-run-serverless-2026',
    src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    status: 'approved',
    title: 'Cloud Run Docker Lab',
    caption: 'Deploying serverless microservices with real-time autoscaling and Cloud SQL integration.',
    uploadedBy: 'Cloud Lead',
    createdAt: '2026-08-19T16:00:00Z',
  },
  {
    id: 'sc-seed-3',
    eventId: 'build-with-ai-2026',
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    status: 'pending',
    title: 'Multimodal Agents Prototype',
    caption: 'Attendees building automated study assistant bots using Gemini 1.5 Pro.',
    uploadedBy: 'Dev Team Member',
    createdAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'sc-seed-4',
    eventId: 'women-techmakers-uniben-2026',
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
    status: 'pending',
    title: 'WTM Mentorship Circle',
    caption: 'Inspiring keynote address and 1-on-1 portfolio review circle with industry leads.',
    uploadedBy: 'WTM Ambassador',
    createdAt: '2026-10-01T13:45:00Z',
  },
];

export default function AdminShowcasePage() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewItem, setPreviewItem] = useState<ShowcaseItem | null>(null);

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [itemTitle, setItemTitle] = useState('');
  const [itemCaption, setItemCaption] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load items from database
  useEffect(() => {
    getCollection('gdgoc_events').then(parsed => {
      let allEvents: any[] = [];
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        allEvents = parsed;
      }
      setEventsList(allEvents);
      if (allEvents.length > 0) {
        setSelectedEventId(allEvents[0].id);
      }
    });

    getCollection(STORAGE_KEY).then(parsed => {
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        setItems(parsed);
      } else {
        setItems(SEED_DATA);
        saveCollection(STORAGE_KEY, SEED_DATA);
      }
    });
  }, []);

  const saveToStorage = (updatedItems: ShowcaseItem[]) => {
    setItems(updatedItems);
    saveCollection(STORAGE_KEY, updatedItems).catch(e => {
      console.error('Failed to save to db:', e);
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Action handlers
  const handleApprove = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, status: 'approved' as const } : item
    );
    saveToStorage(updated);
    showToast('Memory approved and added to Showcase Gallery!');
  };

  const handleDiscard = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    saveToStorage(updated);
    showToast('Pending memory discarded.');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this approved memory?')) {
      deleteDocument('gdgoc_showcase', id);
      const updated = items.filter((item) => item.id !== id);
      saveToStorage(updated);
      showToast('Image deleted from showcase.');
    }
  };

  // File handling for direct admin upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    setSelectedFile(file);

    // Read file as base64 data URL so it persists permanently in database
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      // Fallback to object URL
      const objUrl = URL.createObjectURL(file);
      setImagePreview(objUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url.trim().length > 0 ? url : null);
  };

  const resetUploadForm = () => {
    setSelectedFile(null);
    setImageUrl('');
    setImagePreview(null);
    setItemTitle('');
    setItemCaption('');
    setUploadError('');
    setIsUploadOpen(false);
  };

  const handleDirectUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    let finalSrc = '';
    if (uploadMode === 'file') {
      if (!imagePreview) {
        setUploadError('Please select an image file to upload.');
        return;
      }
      finalSrc = imagePreview;
    } else {
      if (!imageUrl.trim()) {
        setUploadError('Please enter an image URL.');
        return;
      }
      finalSrc = imageUrl.trim();
    }

    const matchedEvent = eventsList.find((ev) => ev.id === selectedEventId);
    const newMemory: ShowcaseItem = {
      id: `sc-admin-${Date.now()}`,
      eventId: selectedEventId || (eventsList[0]?.id ?? 'general'),
      src: finalSrc,
      status: 'approved',
      title: itemTitle.trim() || matchedEvent?.title || 'Showcase Memory',
      caption: itemCaption.trim() || `Approved event memory for ${matchedEvent?.title || 'community'}`,
      uploadedBy: 'Admin Direct Upload',
      createdAt: new Date().toISOString(),
    };

    const updated = [newMemory, ...items];
    saveToStorage(updated);
    resetUploadForm();
    setActiveTab('approved');
    showToast('New image directly approved and published to showcase!');
  };

  // Helper to find event title
  const getEventTitle = (eventId: string) => {
    const ev = eventsList.find((e) => e.id === eventId);
    return ev ? ev.title : eventId;
  };

  // Filtered items
  const pendingItems = useMemo(
    () => items.filter((item) => item.status === 'pending'),
    [items]
  );
  const approvedItems = useMemo(
    () => items.filter((item) => item.status === 'approved'),
    [items]
  );

  const currentTabItems = activeTab === 'pending' ? pendingItems : approvedItems;

  const filteredItems = useMemo(() => {
    return currentTabItems.filter((item) => {
      const matchesEvent =
        selectedEventFilter === 'all' || item.eventId === selectedEventFilter;
      const title = item.title || getEventTitle(item.eventId) || '';
      const caption = item.caption || '';
      const matchesSearch =
        searchQuery.trim() === '' ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.eventId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesEvent && matchesSearch;
    });
  }, [currentTabItems, selectedEventFilter, searchQuery, eventsList]);

  return (
    <AdminLayout activePage="showcase">
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Toast alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-500/90 text-white shadow-xl backdrop-blur-md border border-emerald-400/40 text-sm font-medium"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4285F4] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Community & Events Gallery
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Showcase Management
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Review community-submitted memories or publish approved event photos to the public showcase.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/showcase"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-medium transition"
            >
              <ExternalLink className="w-4 h-4" />
              Live Showcase
            </Link>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              Add Showcase Image
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#FBBC05]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white/50 text-xs font-medium">Pending Review</p>
              <p className="text-white text-2xl font-bold mt-0.5">{pendingItems.length}</p>
            </div>
          </div>

          <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#34A853]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white/50 text-xs font-medium">Approved & Visible</p>
              <p className="text-white text-2xl font-bold mt-0.5">{approvedItems.length}</p>
            </div>
          </div>

          <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#4285F4]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white/50 text-xs font-medium">Total Stored</p>
              <p className="text-white text-2xl font-bold mt-0.5">{items.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          {/* Main Two Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-[#141414] border border-white/10 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'pending'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Pending Approvals</span>
              {pendingItems.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/30 text-amber-300">
                  {pendingItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('approved')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'approved'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approved Gallery</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300">
                {approvedItems.length}
              </span>
            </button>
          </div>

          {/* Search and Event Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#141414] border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#4285F4]/60 transition"
              />
            </div>

            <div className="relative">
              <select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="px-3.5 py-2 bg-[#141414] border border-white/10 rounded-xl text-xs text-white/80 focus:outline-none focus:border-[#4285F4]/60 transition cursor-pointer"
              >
                <option value="all">All Events</option>
                {eventsList.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title.length > 32 ? e.title.substring(0, 32) + '...' : e.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid display */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-[#121212] border border-white/10 rounded-3xl p-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-white/40 mb-4">
              {activeTab === 'pending' ? <Clock className="w-7 h-7" /> : <ImageIcon className="w-7 h-7" />}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {activeTab === 'pending'
                ? 'No Pending Approvals'
                : 'No Approved Memories Found'}
            </h3>
            <p className="text-white/50 text-xs max-w-sm mx-auto mb-6">
              {activeTab === 'pending'
                ? 'All submitted memories have been processed. New community submissions will appear here.'
                : 'No approved images match your filter. You can directly upload images using the button above.'}
            </p>
            {activeTab === 'pending' && approvedItems.length > 0 && (
              <button
                onClick={() => setActiveTab('approved')}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition"
              >
                Switch to Approved Gallery
              </button>
            )}
            {activeTab === 'approved' && (
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
              >
                + Upload First Memory
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const eventTitle = getEventTitle(item.eventId);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="group bg-[#141414] border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden flex flex-col shadow-sm transition-all duration-200"
                >
                  {/* Photo frame */}
                  <div className="relative aspect-[4/3] w-full bg-black/40 overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.title || eventTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      {item.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/90 text-black backdrop-blur-md shadow-sm">
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                    </div>

                    {/* Quick Lightbox Preview Button */}
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white transition opacity-0 group-hover:opacity-100"
                      title="Enlarge preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Event Tag overlay */}
                    <div className="absolute bottom-2 left-3 right-3">
                      <span className="inline-block text-[11px] font-medium text-white/90 truncate max-w-full bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                        {eventTitle}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1 mb-1">
                        {item.title || 'Event Memory'}
                      </h4>
                      {item.caption ? (
                        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                          {item.caption}
                        </p>
                      ) : (
                        <p className="text-xs text-white/40 italic">No description provided</p>
                      )}
                    </div>

                    {item.uploadedBy && (
                      <div className="text-[10px] text-white/40 flex items-center justify-between border-t border-white/5 pt-2">
                        <span>By: {item.uploadedBy}</span>
                        {item.createdAt && (
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    )}

                    {/* Actions Toolbar */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                      {activeTab === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleDiscard(item.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition"
                          >
                            <X className="w-3.5 h-3.5" />
                            Discard
                          </button>
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href={`/events/${item.eventId}`}
                            target="_blank"
                            className="text-xs text-white/50 hover:text-white flex items-center gap-1 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Event Page
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition border border-red-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Direct Upload Modal */}
        <AnimatePresence>
          {isUploadOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsUploadOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#141414] border border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full text-white shadow-2xl space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-[#4285F4]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Direct Admin Upload</h3>
                      <p className="text-xs text-white/50">
                        Uploads are automatically marked as approved.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsUploadOpen(false)}
                    className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {uploadError && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <form onSubmit={handleDirectUploadSubmit} className="space-y-4">
                  {/* Mode switcher: File or URL */}
                  <div className="flex rounded-xl bg-white/5 p-1 border border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadMode('file');
                        setImagePreview(selectedFile ? imagePreview : null);
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                        uploadMode === 'file'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadMode('url');
                        setImagePreview(imageUrl.trim() ? imageUrl : null);
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                        uploadMode === 'url'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>

                  {/* Input based on mode */}
                  {uploadMode === 'file' ? (
                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-2">
                        Select Image File
                      </label>
                      <label className="border-2 border-dashed border-white/20 hover:border-blue-500/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-white/5 hover:bg-white/[0.07] transition text-center group">
                        <Upload className="w-8 h-8 text-white/40 group-hover:text-blue-400 mb-2 transition" />
                        <span className="text-xs font-semibold text-white/80">
                          {selectedFile ? selectedFile.name : 'Click to browse image file'}
                        </span>
                        <span className="text-[10px] text-white/40 mt-1">
                          Supports PNG, JPG, WEBP, GIF
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1.5">
                        Image Web Address (URL)
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={imageUrl}
                        onChange={handleUrlChange}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  )}

                  {/* Preview box if loaded */}
                  {imagePreview && (
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/10">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Associated Event Selector */}
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">
                      Associated Event
                    </label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#1f1f1f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition"
                    >
                      {eventsList.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.title} ({e.date})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Optional Title */}
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">
                      Title (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Solution Demo Highlights"
                      value={itemTitle}
                      onChange={(e) => setItemTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  {/* Optional Caption */}
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">
                      Caption (optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief note about this moment..."
                      value={itemCaption}
                      onChange={(e) => setItemCaption(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition resize-none"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={resetUploadForm}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Publish Directly
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lightbox Preview Modal */}
        <AnimatePresence>
          {previewItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
              onClick={() => setPreviewItem(null)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-3xl w-full bg-[#141414] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="relative aspect-video w-full bg-black">
                  <img
                    src={previewItem.src}
                    alt={previewItem.title || 'Preview'}
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white text-xs transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#4285F4] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                      {getEventTitle(previewItem.eventId)}
                    </span>
                    <span className="text-xs text-white/40">
                      Status: <strong className="capitalize text-white/80">{previewItem.status}</strong>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {previewItem.title || 'Event Memory'}
                  </h3>

                  {previewItem.caption && (
                    <p className="text-sm text-white/70 leading-relaxed">
                      {previewItem.caption}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="text-xs text-white/40">
                      ID: <span className="font-mono text-white/60">{previewItem.id}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {previewItem.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => {
                              handleDiscard(previewItem.id);
                              setPreviewItem(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition"
                          >
                            Discard
                          </button>
                          <button
                            onClick={() => {
                              handleApprove(previewItem.id);
                              setPreviewItem(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-semibold transition"
                          >
                            Approve Now
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            handleDelete(previewItem.id);
                            setPreviewItem(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition"
                        >
                          Delete from Showcase
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
