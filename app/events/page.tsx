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
import { type Event  } from '@/lib/data';
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
          <div className="flex items-center gap-1.5 text-white/80 text-xs mb-1 min-w-0">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/80 text-xs mb-2">
            {event.isOnline ? (
              <Wifi className="w-3.5 h-3.5" />
            ) : (
              <MapPin className="w-3.5 h-3.5" />
            )}
            <span className="truncate min-w-0">{event.location}</span>
          </div>
          
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
            <div className="flex items-center gap-2 text-gray-600 text-xs min-w-0">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              <span>
                {event.maxAttendees} Spots Available
              </span>
            </div>
          </div>

          {/* Seats bar */}
          
  );
}
