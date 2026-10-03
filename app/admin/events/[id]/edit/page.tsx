'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users2,
  Mic,
  ListOrdered,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Globe,
  Building2,
  LayoutDashboard,
  FileText,
  Users,
  HandHeart,
  LogOut,
  Palette,
  Sparkles,
} from 'lucide-react';
import { EVENTS, type Event } from '@/lib/data';
import { getCollection, saveCollection, saveDocument, deleteDocument } from '@/lib/db';
import AdminLayout from '@/components/AdminLayout';

// ─── Constants ────────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  'Conference',
  'Workshop',
  'Speaker Event',
  'Hackathon',
  'Study Jam',
  'Build Project',
  'Showcase',
  'Info Session',
  'Meetup',
  'Webinar',
];

const AGENDA_TYPES = [
  { value: 'talk', label: 'Talk / Keynote', color: 'border-purple-400 bg-purple-500/10 text-purple-300' },
  { value: 'workshop', label: 'Hands-on Workshop', color: 'border-orange-400 bg-orange-500/10 text-orange-300' },
  { value: 'info', label: 'Info / Welcome / Setup', color: 'border-blue-400 bg-blue-500/10 text-blue-300' },
  { value: 'qa', label: 'Q&A / Panel / Demos', color: 'border-green-400 bg-green-500/10 text-green-300' },
];

const GRADIENT_PRESETS = [
  { name: 'Google Blue', value: 'from-blue-600 to-blue-400' },
  { name: 'Google Red/Orange', value: 'from-red-600 to-orange-400' },
  { name: 'Google Green', value: 'from-green-600 to-emerald-400' },
  { name: 'Google Amber', value: 'from-yellow-500 to-amber-400' },
  { name: 'Purple Sunset', value: 'from-purple-600 to-pink-500' },
  { name: 'Indigo Cyan', value: 'from-indigo-600 to-cyan-500' },
];

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Events', href: '/admin/events', icon: Calendar },
  { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { label: 'Team', href: '/admin/team', icon: Users },
  { label: 'Volunteers', href: '/admin/volunteers', icon: HandHeart },
];

// Fallback seed events (in case an event created in old admin mock is accessed)
const FALLBACK_SEED: Event[] = [
  ...EVENTS,
  {
    id: 'devfest-2026',
    title: 'DevFest UNIBEN 2026',
    type: 'Conference',
    date: '2026-11-05',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    location: 'UNIBEN Main Auditorium',
    isOnline: false,
    description:
      'Our biggest annual developer festival. 600+ attendees expected, 15+ speakers, workshops, and a massive hackathon.',
    whatToExpect: ['Keynote sessions', 'Interactive labs', 'Networking opportunities'],
    speakers: [],
    agenda: [],
    registeredCount: 312,
    maxAttendees: 600,
    coverGradient: 'from-blue-600 to-blue-400',
    isPast: false,
  },
  {
    id: 'ai-study-jam-2',
    title: 'Advanced AI Study Jam',
    type: 'Workshop',
    date: '2026-10-18',
    startTime: '10:00 AM',
    endTime: '1:00 PM',
    location: 'Faculty of Engineering, Room 204',
    isOnline: false,
    description:
      'A 3-week deep dive into advanced AI/ML topics including fine-tuning LLMs, computer vision, and responsible AI.',
    whatToExpect: ['LLM prompt engineering', 'Hands-on model fine-tuning'],
    speakers: [],
    agenda: [],
    registeredCount: 45,
    maxAttendees: 60,
    coverGradient: 'from-green-600 to-emerald-400',
    isPast: false,
  },
  {
    id: 'solution-challenge-kickoff',
    title: 'Solution Challenge 2027 Kickoff',
    type: 'Info Session',
    date: '2026-12-01',
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    location: 'Google Meet (Virtual)',
    isOnline: true,
    description:
      "Learn about Google's Solution Challenge 2027, form teams, and get guidance from our past finalists.",
    whatToExpect: ['Competition breakdown', 'Ideation workshop', 'Team matchmaking'],
    speakers: [],
    agenda: [],
    registeredCount: 88,
    maxAttendees: 200,
    coverGradient: 'from-yellow-500 to-amber-400',
    isPast: false,
  },
  {
    id: 'cloud-study-jam',
    title: 'Google Cloud Study Jam',
    type: 'Workshop',
    date: '2026-10-28',
    startTime: '11:00 AM',
    endTime: '2:00 PM',
    location: 'ICT Centre, Lab 3',
    isOnline: false,
    description:
      'Hands-on labs on Google Cloud fundamentals — compute, storage, networking, and Cloud Run deployments.',
    whatToExpect: ['Google Cloud console setup', 'Cloud Run deployment', 'Qwiklabs quests'],
    speakers: [],
    agenda: [],
    registeredCount: 33,
    maxAttendees: 40,
    coverGradient: 'from-blue-600 to-cyan-400',
    isPast: false,
  },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-gray-950 flex flex-col z-30 border-r border-white/10">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
            G
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">GDGOC</p>
            <p className="text-gray-500 text-xs mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = href === '/admin/events';
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}

// ─── Edit Event Page Component ────────────────────────────────────────────────

export default function EditEventPage({ params }: { params?: { id: string } }) {
  const router = useRouter();
  const routeParams = useParams();
  const eventId = params?.id || (routeParams?.id as string);

  const [isVerifying, setIsVerifying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '',
    type: 'Workshop',
    date: '',
    startTime: '10:00 AM',
    endTime: '1:00 PM',
    location: '',
    isOnline: false,
    description: '',
    whatToExpect: ['Hands-on project work', 'Direct mentorship from leads'],
    maxAttendees: 100,
    registeredCount: 0,
    coverGradient: 'from-blue-600 to-blue-400',
    isPast: false,
    featured: false,
    speakers: [] as { name: string; title: string; bio: string }[],
    agenda: [] as { time: string; title: string; type: string }[],
  });

  // Verify Admin & Load Event
  useEffect(() => {
    fetch('/api/admin/verify')
      .then((r) => {
        if (!r.ok) {
          router.push('/admin/login');
          return;
        }
        setIsVerifying(false);

        getCollection('gdgoc_events').then((parsed: any) => {
          let foundEvent: Event | undefined;
          if (parsed && parsed.length > 0) {
            foundEvent = parsed.find((e: any) => e.id === eventId);
          }
          if (!foundEvent) {
            foundEvent = EVENTS.find((e) => e.id === eventId);
          }
          if (!foundEvent) {
            foundEvent = FALLBACK_SEED.find((e) => e.id === eventId);
          }

          if (foundEvent) {
            setForm({
              title: foundEvent.title || '',
              type: foundEvent.type || 'Workshop',
              date: foundEvent.date || '',
              startTime: foundEvent.startTime || '10:00 AM',
              endTime: foundEvent.endTime || '1:00 PM',
              location: foundEvent.location || '',
              isOnline: Boolean(foundEvent.isOnline),
              description: foundEvent.description || '',
              whatToExpect:
                foundEvent.whatToExpect && foundEvent.whatToExpect.length > 0
                  ? foundEvent.whatToExpect
                  : [],
              maxAttendees: foundEvent.maxAttendees || 100,
              registeredCount: foundEvent.registeredCount || 0,
              coverGradient: foundEvent.coverGradient || 'from-blue-600 to-blue-400',
              isPast: Boolean(foundEvent.isPast),
              featured: Boolean(foundEvent.featured),
              speakers: foundEvent.speakers ? [...foundEvent.speakers] : [],
              agenda: foundEvent.agenda ? [...foundEvent.agenda] : [],
            });
          } else {
            setNotFound(true);
          }
          setIsLoading(false);
        }).catch(() => {
          setNotFound(true);
          setIsLoading(false);
        });
      })
      .catch(() => router.push('/admin/login'));
  }, [eventId, router]);

  // ── Form Handlers ───────────────────────────────────────────────────────────

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'maxAttendees' || name === 'registeredCount' ? Number(value) : value,
    }));
  };

  // ── Speaker Handlers ────────────────────────────────────────────────────────

  const addSpeaker = () => {
    setForm((prev) => ({
      ...prev,
      speakers: [...prev.speakers, { name: '', title: '', bio: '' }],
    }));
  };

  const updateSpeaker = (
    index: number,
    field: 'name' | 'title' | 'bio',
    value: string,
  ) => {
    setForm((prev) => {
      const updated = [...prev.speakers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, speakers: updated };
    });
  };

  const removeSpeaker = (index: number) => {
    setForm((prev) => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index),
    }));
  };

  // ── Agenda Handlers ─────────────────────────────────────────────────────────

  const addAgendaItem = () => {
    setForm((prev) => ({
      ...prev,
      agenda: [...prev.agenda, { time: '', title: '', type: 'talk' }],
    }));
  };

  const updateAgendaItem = (
    index: number,
    field: 'time' | 'title' | 'type',
    value: string,
  ) => {
    setForm((prev) => {
      const updated = [...prev.agenda];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, agenda: updated };
    });
  };

  const removeAgendaItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index),
    }));
  };

  // ── What To Expect Handlers ─────────────────────────────────────────────────

  const addExpectation = () => {
    setForm((prev) => ({
      ...prev,
      whatToExpect: [...prev.whatToExpect, ''],
    }));
  };

  const updateExpectation = (index: number, value: string) => {
    setForm((prev) => {
      const updated = [...prev.whatToExpect];
      updated[index] = value;
      return { ...prev, whatToExpect: updated };
    });
  };

  const removeExpectation = (index: number) => {
    setForm((prev) => ({
      ...prev,
      whatToExpect: prev.whatToExpect.filter((_, i) => i !== index),
    }));
  };

  // ── Submit / Save ───────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedEvent: Event = {
      id: eventId,
      title: form.title.trim(),
      type: form.type,
      date: form.date,
      startTime: form.startTime.trim() || '10:00 AM',
      endTime: form.endTime.trim() || '1:00 PM',
      location: form.location.trim(),
      isOnline: form.isOnline,
      description: form.description.trim(),
      whatToExpect: form.whatToExpect.map((s) => s.trim()).filter(Boolean),
      speakers: form.speakers
        .map((s) => ({
          name: s.name.trim(),
          title: s.title.trim(),
          bio: s.bio.trim(),
        }))
        .filter((s) => s.name || s.title),
      agenda: form.agenda
        .map((a) => ({
          time: a.time.trim(),
          title: a.title.trim(),
          type: a.type,
        }))
        .filter((a) => a.title || a.time),
      maxAttendees: Number(form.maxAttendees) || 100,
      registeredCount: Number(form.registeredCount) || 0,
      coverGradient: form.coverGradient || 'from-blue-600 to-blue-400',
      isPast: form.isPast,
      featured: form.featured,
    };

    // Load existing events from DB
    let storageEvents = (await getCollection('gdgoc_events')) as any[];
    if (!storageEvents) storageEvents = [];

    const existingIndex = storageEvents.findIndex((ev) => ev.id === eventId);
    let updatedList: any[];

    if (existingIndex !== -1) {
      updatedList = storageEvents.map((ev) => (ev.id === eventId ? updatedEvent : ev));
    } else {
      // Event was loaded from EVENTS or seed; merge and update
      const storageIds = new Set(storageEvents.map((ev) => ev.id));
      const merged = [...storageEvents, ...FALLBACK_SEED.filter((ev) => !storageIds.has(ev.id))];
      const mergedIndex = merged.findIndex((ev) => ev.id === eventId);
      if (mergedIndex !== -1) {
        updatedList = merged.map((ev) => (ev.id === eventId ? updatedEvent : ev));
      } else {
        updatedList = [updatedEvent, ...storageEvents];
      }
    }

    // Persist to DB and redirect
    await saveCollection('gdgoc_events', updatedList);
    router.push('/admin/events');
  };

  // ── Render States ───────────────────────────────────────────────────────────

  if (isVerifying || isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-gray-400 text-sm animate-pulse">Loading event editor…</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex">
        <Sidebar />
        <div className="pl-64 flex-1 flex flex-col items-center justify-center p-8">
          <div className="max-w-md w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Event Not Found</h2>
            <p className="text-gray-400 text-sm mb-6">
              Could not find an event with ID: <span className="text-white font-mono">{eventId}</span>
            </p>
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activePage="events">
      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Events
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Edit Event
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/10 text-gray-300 font-normal">
                ID: {eventId}
              </span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Update schedule, speakers, registration limits, and event details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/events/${eventId}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              View Live Page
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </Link>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── Section 1: Basic Information ── */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Basic Information
            </h2>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Build with AI — Gemini API Masterclass"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Type + Date */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Event Type *
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleInputChange}
                      className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-gray-900 text-white">
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Times */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    <Clock className="inline w-3.5 h-3.5 mr-1 text-gray-400" />
                    Start Time
                  </label>
                  <input
                    type="text"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleInputChange}
                    placeholder="e.g. 10:00 AM"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    <Clock className="inline w-3.5 h-3.5 mr-1 text-gray-400" />
                    End Time
                  </label>
                  <input
                    type="text"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleInputChange}
                    placeholder="e.g. 1:00 PM"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  <MapPin className="inline w-3.5 h-3.5 mr-1 text-gray-400" />
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Faculty of Physical Sciences, UNIBEN or Google Meet"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Toggles: Online & Past */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Online / Virtual</p>
                      <p className="text-xs text-gray-400">Streamed or hosted on Google Meet</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, isOnline: !p.isOnline }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      form.isOnline ? 'bg-blue-600' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        form.isOnline ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Featured Event</p>
                      <p className="text-xs text-gray-400">Shows on the homepage</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, featured: !p.featured }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      form.featured ? 'bg-purple-600' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        form.featured ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Mark as Past Event</p>
                      <p className="text-xs text-gray-400">Shows under past archive</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, isPast: !p.isPast }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      form.isPast ? 'bg-amber-600' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        form.isPast ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Event Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Provide a comprehensive summary of the event purpose, goals, and who should attend..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
                />
              </div>
            </div>
          </div>

          {/* ── Section 2: Capacity & Registration ── */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Users2 className="w-4 h-4 text-green-400" />
              Capacity &amp; Attendance
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Max Capacity (Attendees) *
                </label>
                <input
                  type="number"
                  name="maxAttendees"
                  value={form.maxAttendees}
                  onChange={handleInputChange}
                  min={1}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Registered Count
                </label>
                <input
                  type="number"
                  name="registeredCount"
                  value={form.registeredCount}
                  onChange={handleInputChange}
                  min={0}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Live Fill bar */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>
                  Current fill: {form.registeredCount} / {form.maxAttendees} seats
                </span>
                <span>
                  {Math.round(
                    Math.min(
                      (form.registeredCount / Math.max(form.maxAttendees, 1)) * 100,
                      100,
                    ),
                  )}
                  % filled
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      (form.registeredCount / Math.max(form.maxAttendees, 1)) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── Section 3: Visual Theme & Gradient ── */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              Cover Banner &amp; Theme Gradient
            </h2>

            <p className="text-xs text-gray-400 mb-4">
              Select a visual gradient theme for the event header and cards.
            </p>

            {/* Gradient chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {GRADIENT_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, coverGradient: preset.value }))}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition text-left ${
                    form.coverGradient === preset.value
                      ? 'border-blue-500 bg-white/10 ring-1 ring-blue-500'
                      : 'border-white/10 bg-white/[0.02] hover:bg-white/5'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg bg-gradient-to-r ${preset.value} shrink-0`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{preset.name}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Tailwind Gradient Classes
              </label>
              <input
                type="text"
                name="coverGradient"
                value={form.coverGradient}
                onChange={handleInputChange}
                placeholder="e.g. from-blue-600 to-blue-400"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Live Preview Card */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-gray-400 mb-2 font-medium">Banner Preview:</p>
              <div
                className={`bg-gradient-to-br ${form.coverGradient} rounded-2xl p-6 shadow-lg text-white`}
              >
                <span className="inline-block bg-white/20 text-xs font-bold px-2.5 py-0.5 rounded-full mb-2">
                  {form.type}
                </span>
                <h3 className="text-xl font-bold mb-1">
                  {form.title || 'Event Title Preview'}
                </h3>
                <p className="text-xs text-white/80">
                  {form.date || 'YYYY-MM-DD'} &bull; {form.startTime} &ndash; {form.endTime} &bull; {form.location || 'Location'}
                </p>
              </div>
            </div>
          </div>

          {/* ── Section 4: What to Expect / Key Highlights ── */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  What to Expect (Highlights)
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Bulleted takeaways shown on the public event page.
                </p>
              </div>
              <button
                type="button"
                onClick={addExpectation}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Highlight
              </button>
            </div>

            <div className="space-y-3">
              {form.whatToExpect.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-mono w-5 shrink-0 text-right">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateExpectation(index, e.target.value)}
                    placeholder="e.g. Set up a Gemini API project from scratch"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => removeExpectation(index)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Remove highlight"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {form.whatToExpect.length === 0 && (
                <div className="text-center py-6 border border-dashed border-white/10 rounded-xl text-gray-500 text-xs">
                  No highlights added yet. Click &quot;Add Highlight&quot; to add bullet points.
                </div>
              )}
            </div>
          </div>

          {/* ── Section 5: Speakers (Dynamic Form Section) ── */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-blue-400" />
                  Speakers &amp; Facilitators
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                    {form.speakers.length}
                  </span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Feature speakers, facilitators, mentors, or panelists.
                </p>
              </div>
              <button
                type="button"
                onClick={addSpeaker}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Speaker
              </button>
            </div>

            {/* Speakers List */}
            <div className="space-y-4">
              <AnimatePresence>
                {form.speakers.map((speaker, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 relative group"
                  >
                    {/* Speaker header */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-blue-400" />
                        Speaker #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSpeaker(index)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-500/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>

                    {/* Name & Title */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={speaker.name}
                          onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                          placeholder="e.g. Chukwuemeka Obi"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Title / Organization *
                        </label>
                        <input
                          type="text"
                          value={speaker.title}
                          onChange={(e) => updateSpeaker(index, 'title', e.target.value)}
                          placeholder="e.g. Software Engineer, Google"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Short Biography
                      </label>
                      <textarea
                        value={speaker.bio}
                        onChange={(e) => updateSpeaker(index, 'bio', e.target.value)}
                        rows={2}
                        placeholder="e.g. GDE for Web Technologies with 8 years of experience building scalable applications..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {form.speakers.length === 0 && (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl text-gray-500 text-xs">
                  <Mic className="w-8 h-8 mx-auto mb-2 opacity-30 text-blue-400" />
                  <p className="font-medium text-gray-400">No speakers added yet</p>
                  <p className="text-gray-500 mt-1">
                    Click the &quot;Add Speaker&quot; button above to list keynote speakers or workshop facilitators.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Section 6: Agenda (Dynamic Form Section) ── */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-purple-400" />
                  Event Agenda &amp; Schedule
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                    {form.agenda.length}
                  </span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Define the session schedule with start times, topics, and formats.
                </p>
              </div>
              <button
                type="button"
                onClick={addAgendaItem}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Agenda Item
              </button>
            </div>

            {/* Agenda List */}
            <div className="space-y-4">
              <AnimatePresence>
                {form.agenda.map((item, index) => {
                  const agendaTypeCfg =
                    AGENDA_TYPES.find((t) => t.value === item.type) || AGENDA_TYPES[0];

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 relative group"
                    >
                      {/* Agenda header */}
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                          <ListOrdered className="w-3.5 h-3.5 text-purple-400" />
                          Session #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAgendaItem(index)}
                          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-500/10 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>

                      {/* Fields */}
                      <div className="grid sm:grid-cols-12 gap-3 items-end">
                        {/* Time */}
                        <div className="sm:col-span-3">
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Time / Slot *
                          </label>
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) => updateAgendaItem(index, 'time', e.target.value)}
                            placeholder="e.g. 10:00 AM"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          />
                        </div>

                        {/* Title */}
                        <div className="sm:col-span-6">
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Session Title *
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateAgendaItem(index, 'title', e.target.value)}
                            placeholder="e.g. Welcome & Keynote Session"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          />
                        </div>

                        {/* Type */}
                        <div className="sm:col-span-3">
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Type
                          </label>
                          <div className="relative">
                            <select
                              value={item.type}
                              onChange={(e) => updateAgendaItem(index, 'type', e.target.value)}
                              className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-8"
                            >
                              {AGENDA_TYPES.map((t) => (
                                <option key={t.value} value={t.value} className="bg-gray-900 text-white">
                                  {t.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* Preview tag */}
                      <div className="pt-1 flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 uppercase">Tag preview:</span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full border ${agendaTypeCfg.color}`}
                        >
                          {agendaTypeCfg.label}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {form.agenda.length === 0 && (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl text-gray-500 text-xs">
                  <ListOrdered className="w-8 h-8 mx-auto mb-2 opacity-30 text-purple-400" />
                  <p className="font-medium text-gray-400">No agenda items added yet</p>
                  <p className="text-gray-500 mt-1">
                    Click the &quot;Add Agenda Item&quot; button above to build the schedule.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Sticky Bottom Bar ── */}
          <div className="sticky bottom-6 z-20 p-4 rounded-2xl bg-gray-900/90 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span>Ready to update event details</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/events"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
