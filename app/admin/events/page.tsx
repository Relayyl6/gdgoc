'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  LayoutDashboard,
  FileText,
  Users,
  HandHeart,
  LogOut,
  MapPin,
  Users2,
  ExternalLink,
} from 'lucide-react';
import { getCollection, saveCollection, saveDocument, deleteDocument } from '@/lib/db';
import { EVENTS, type Event } from '@/lib/data';

// ─── Seed Data & Fallbacks ───────────────────────────────────────────────────

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

const TYPE_COLORS: Record<string, string> = {
  Conference: 'bg-blue-100 text-blue-700',
  Workshop: 'bg-green-100 text-green-700',
  'Info Session': 'bg-yellow-100 text-yellow-700',
  Hackathon: 'bg-orange-100 text-orange-700',
  Meetup: 'bg-purple-100 text-purple-700',
  Webinar: 'bg-cyan-100 text-cyan-700',
  'Speaker Event': 'bg-indigo-100 text-indigo-700',
  'Study Jam': 'bg-amber-100 text-amber-700',
  'Build Project': 'bg-rose-100 text-rose-700',
  Showcase: 'bg-teal-100 text-teal-700',
};


// ─── Registration bar ─────────────────────────────────────────────────────────

function RegistrationBar({
  count,
  max,
}: {
  count: number;
  max: number;
}) {
  const pct = Math.min((count / max) * 100, 100);
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-green-500';
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 shrink-0">
        {count}/{max}
      </span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isVerifying, setIsVerifying] = useState(true);

  // Auth check and load
  useEffect(() => {
    fetch('/api/admin/verify')
      .then((r) => {
        if (!r.ok) router.push('/admin/login');
        else {
          setIsVerifying(false);
          getCollection('gdgoc_events').then((parsed: any) => {
            if (parsed && parsed.length > 0) {
              setEvents(parsed);
            } else {
              setEvents([]);
            }
          }).catch(() => {
            setEvents([]);
          });
        }
      })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  function saveEvents(newEventsOrFn: Event[] | ((prev: Event[]) => Event[])) {
    setEvents((prev) => {
      const updated = typeof newEventsOrFn === 'function' ? newEventsOrFn(prev) : newEventsOrFn;
      saveCollection('gdgoc_events', updated);
      return updated;
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this event? This action cannot be undone.')) return;
    saveEvents((prev) => prev.filter((e) => e.id !== id));
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-sm animate-pulse">Verifying access…</div>
      </div>
    );
  }

  return (
    <AdminLayout activePage="events">
      <div className="max-w-5xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Events</h1>
              <p className="text-gray-400 text-sm mt-1">{events.length} events scheduled</p>
            </div>
            <Link
              href="/admin/events/create"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow"
            >
              <Plus className="w-4 h-4" />
              Create Event
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>

          {/* Events list */}
          <div className="space-y-4">
            {events.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No events yet.</p>
              </div>
            )}

            {events.map((ev, index) => {
              const typeColor = TYPE_COLORS[ev.type] ?? 'bg-gray-100 text-gray-700';

              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
                >
                  {/* Event row */}
                  <div className="p-5 flex items-start gap-4">
                    {/* Date block */}
                    <div className="shrink-0 w-14 bg-blue-600/20 rounded-xl flex flex-col items-center justify-center py-2 px-1 text-center">
                      <span className="text-blue-400 text-xs font-semibold uppercase">
                        {new Date(ev.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-white text-2xl font-extrabold leading-none">
                        {new Date(ev.date).getDate()}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(ev.date).getFullYear()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${typeColor}`}
                        >
                          {ev.type}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white text-base leading-snug mb-1">
                        {ev.title}
                      </h3>
                      <p className="text-gray-400 text-xs line-clamp-2 mb-2">{ev.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {ev.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users2 className="w-3 h-3" />
                          {ev.registeredCount} registered
                        </span>
                      </div>
                      <RegistrationBar count={ev.registeredCount} max={ev.maxAttendees} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/admin/events/${ev.id}/registrations`}
                        className="p-2 rounded-lg text-blue-400 hover:text-white hover:bg-blue-600/20 transition-colors"
                        title="View Registrations"
                      >
                        <Users2 size={18} />
                      </Link>
                      <Link
                        href={`/admin/events/${ev.id}/edit`}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Edit event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
    </AdminLayout>
  );
}
