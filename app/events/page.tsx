'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Clock,
  Users,
  Wifi,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { EVENTS, type Event } from '@/lib/data';
import { getCollection } from '@/lib/db';

// ─── Helpers ────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  Workshop: 'bg-blue-100 text-blue-700',
  Hackathon: 'bg-red-100 text-red-700',
  'Speaker Event': 'bg-green-100 text-green-700',
  'Study Jam': 'bg-yellow-100 text-yellow-700',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function SeatsBar({ registered, max }: { registered: number; max: number }) {
  const pct = Math.min((registered / max) * 100, 100);
  const remaining = max - registered;
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-white/80 mb-1">
        <span>{registered} registered</span>
        <span>{remaining} seats left</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-1.5">
        <div
          className="bg-white rounded-full h-1.5 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Slider Card ─────────────────────────────────────────────────────────────

function SliderCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`} className="block flex-shrink-0 w-80">
      <div
        className={`bg-gradient-to-br ${event.coverGradient} rounded-2xl p-5 h-64 flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-transform duration-200 shadow-lg`}
      >
        <div>
          <span className="text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full">
            {event.type}
          </span>
          <h3 className="mt-3 text-white font-bold text-lg leading-tight line-clamp-2">
            {event.title}
          </h3>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-white/80 text-xs mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/80 text-xs mb-2">
            {event.isOnline ? (
              <Wifi className="w-3.5 h-3.5" />
            ) : (
              <MapPin className="w-3.5 h-3.5" />
            )}
            <span className="truncate">{event.location}</span>
          </div>
          <SeatsBar registered={event.registeredCount} max={event.maxAttendees} />
          <div className="mt-3 flex items-center gap-1 text-white font-semibold text-sm">
            View Details <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── List Card (Upcoming/Past) ────────────────────────────────────────────────

function ListCard({ event, horizontal }: { event: Event; horizontal?: boolean }) {
  return (
    <Link href={`/events/${event.id}`}>
      <motion.div
        whileHover={{ y: -3 }}
        className={`bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow ${horizontal ? 'w-72 flex-shrink-0' : ''}`}
      >
        {/* Gradient banner */}
        <div className={`bg-gradient-to-r ${event.coverGradient} h-2`} />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-gray-800 text-base leading-snug line-clamp-2">
              {event.title}
            </h3>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${TYPE_COLORS[event.type] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {event.type}
            </span>
          </div>

          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
            {event.description}
          </p>

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>
                {event.startTime} – {event.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              {event.isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
              )}
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              <span>
                {event.registeredCount}/{event.maxAttendees} registered
              </span>
            </div>
          </div>

          {/* Seats bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`bg-gradient-to-r ${event.coverGradient} rounded-full h-1.5`}
                style={{
                  width: `${Math.min((event.registeredCount / event.maxAttendees) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-blue-600 font-semibold text-sm">
            View Details <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const ALL_TYPES = ['All', 'Workshop', 'Hackathon', 'Speaker Event', 'Study Jam'];

export default function EventsPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [typeFilter, setTypeFilter] = useState('All');
  const [events, setEvents] = useState<Event[]>(EVENTS);

  useEffect(() => {
    getCollection('gdgoc_events').then((stored) => {
      if (stored && stored.length > 0) {
        setEvents(stored); // localStorage completely replaces seed
      }
      // else keep the default EVENTS from lib/data (set in useState)
    }).catch(() => {});
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  };

  const upcoming = events.filter((e) => !e.isPast && e.status !== 'draft');
  const past = events.filter((e) => e.isPast && e.status !== 'draft');

  const filtered = (tab === 'upcoming' ? upcoming : past).filter(
    (e) => typeFilter === 'All' || e.type === typeFilter
  );

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Events<span className="text-blue-600">.</span>
          </h1>
          <p className="mt-4 text-gray-500 text-lg max-w-xl">
            Workshops, hackathons, study jams &amp; more — all crafted to level
            up your developer journey.
          </p>
        </motion.div>

        {/* ── Featured Slider ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Featured Events</h2>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-full bg-white/70 border border-white/50 shadow hover:bg-white transition"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-full bg-white/70 border border-white/50 shadow hover:bg-white transition"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-3 scroll-smooth scrollbar-hide"
          >
            {events.filter(e => e.featured).slice(0, 4).map((event) => (
              <SliderCard key={event.id} event={event} />
            ))}
          </div>
        </motion.section>

        {/* ── Content + Sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main column */}
          <div className="flex-1 min-w-0">

            {/* Tab toggle */}
            <div className="flex gap-2 mb-6 bg-white/50 backdrop-blur border border-white/40 rounded-xl p-1 w-fit">
              {(['upcoming', 'past'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    tab === t
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t === 'upcoming' ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
                </button>
              ))}
            </div>

            {/* Upcoming list */}
            {tab === 'upcoming' && (
              <motion.div
                key="upcoming"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {filtered.length === 0 ? (
                  <p className="text-gray-400 py-10 text-center">
                    No upcoming events match the selected filter.
                  </p>
                ) : (
                  filtered.map((event) => (
                    <ListCard key={event.id} event={event} />
                  ))
                )}
              </motion.div>
            )}

            {/* Past events — horizontal scrollable */}
            {tab === 'past' && (
              <motion.div
                key="past"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filtered.length === 0 ? (
                  <p className="text-gray-400 py-10 text-center">
                    No past events match the selected filter.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((event) => (
                      <ListCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full lg:w-64 flex-shrink-0 space-y-6"
          >
            {/* Filter */}
            <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow">
              <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">
                Filter by Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {ALL_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      typeFilter === type
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Create Event (admin) */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 shadow text-white">
              <h3 className="font-bold text-base mb-1">Organising an Event?</h3>
              <p className="text-blue-100 text-xs mb-4">
                Admins can create and manage events on the dashboard.
              </p>
              <Link
                href="/admin/events/create"
                className="flex items-center gap-2 bg-white text-blue-600 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-blue-50 transition w-full justify-center"
              >
                <Plus className="w-4 h-4" />
                Create Event
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
