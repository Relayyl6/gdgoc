'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Code2, Users, CalendarDays, Rocket, ArrowRight, MapPin, Clock, Sparkles } from 'lucide-react';
import { type Event  } from '@/lib/data';
import { getCollection } from '@/lib/db';

/* ─── GDG 4-square logo (reusable) ──────────────────────────────────────── */
function GdgSquares({ size = 14 }: { size?: number }) {
  const colors = ['#4285f4', '#34a853', '#f9ab00', '#ea4335'];
  return (
    <div
      className="grid grid-cols-2 shrink-0"
      style={{ gap: 3, width: size * 2 + 3, height: size * 2 + 3 }}
    >
      {colors.map((c, i) => (
        <div key={i} style={{ width: size, height: size, backgroundColor: c, borderRadius: 2 }} />
      ))}
    </div>
  );
}

function parseEventDate(dateStr: string) {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, monthIndex, day);
      const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      return { month, day: String(day).padStart(2, '0') };
    }
  } catch (e) {
    console.error('Action failed:', e);
  }
  return { month: 'OCT', day: '21' };
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getCollection('gdgoc_events').then((stored: any) => {
      if (stored && stored.length > 0) {
        setEvents(stored);
      }
    }).catch((e) => {
      console.error('Action failed:', e);
    });
  }, []);

  const featuredEvents = events.filter((e) => e.featured && e.status !== 'draft').slice(0, 4);
  const upcomingEvents = events.filter((e) => !e.isPast && e.status !== 'draft').slice(0, 3);

  return (
    <div
      className="relative bg-white text-black overflow-hidden flex flex-col"
      style={{ fontFamily: "'Google Sans', sans-serif" }}
    >

      {/* ════════════════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center">
        {/* Animated blob background */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"
          animate={{ x: [0, 100, 0], y: [0, 50, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-green-500/20 rounded-full blur-[100px] pointer-events-none"
          animate={{ x: [0, -100, 0], y: [0, -50, 50, 0], scale: [1, 1.5, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="z-10 px-4 md:px-16 w-full max-w-7xl mx-auto flex flex-col items-center justify-center" style={{ minHeight: '100svh', paddingTop: '5rem' }}>
          {/* Headline */}
          <div className="relative mb-16 md:mb-20 flex flex-col items-center w-full">
            <div className="relative inline-block w-fit">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="font-black tracking-tighter leading-none"
                style={{ fontSize: 'clamp(5.5rem, 28vw, 18rem)' }}
              >
                GDGOC
              </motion.h1>
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                className="absolute right-0 text-gray-500 font-medium tracking-[0.2em] uppercase"
                style={{
                  fontSize: 'clamp(0.9rem, 4vw, 2.5rem)',
                  bottom: 'clamp(-1.5rem, -4vw, -3rem)',
                }}
              >
                UNIBEN
              </motion.span>
            </div>
          </div>

          {/* Tagline + dual CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-center max-w-2xl w-full px-2"
          >
            <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-8 leading-relaxed">
              Learn, build, and grow with a modern, animated, and tech-forward community platform.
            </p>

            {/* ── Dual CTA buttons ── */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-2">
              <Link
                href="/join"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-center"
              >
                Join the Community
              </Link>
              <Link
                href="/events"
                className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-full font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-md text-center"
              >
                Explore Events
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SOCIAL PROOF BAR
      ════════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-black text-white py-12 md:py-20 relative z-20">
        <div className="max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="flex-1">
            <h3 className="text-4xl md:text-6xl font-bold mb-2">2,500+</h3>
            <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Active Members</p>
          </div>
          <div className="flex-1">
            <h3 className="text-4xl md:text-6xl font-bold mb-2">120+</h3>
            <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Events Hosted</p>
          </div>
          <div className="flex-1">
            <h3 className="text-4xl md:text-6xl font-bold mb-2">50+</h3>
            <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Build Projects</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          EDITORIAL FEATURED SECTION  (museum / art-hall aesthetic)
      ════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-24 md:py-40"
        style={{ backgroundColor: '#0f0f0f' }}
      >
        {/* ── Giant background headline ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <h2
            className="text-[18vw] md:text-[14vw] font-black uppercase leading-none text-center whitespace-nowrap"
            style={{
              color: '#ea4335',
              opacity: 0.08,
              letterSpacing: '-0.04em',
            }}
          >
            BUILDING
          </h2>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16">

          {/* ── Top meta row ── */}
          <div className="flex justify-between items-start mb-12 md:mb-20">
            <div>
              <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.25em] mb-1">Since</p>
              <p className="text-white font-bold text-2xl md:text-4xl">2023</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.25em] mb-1">Chapter</p>
              <p className="text-white font-bold text-2xl md:text-4xl">UNIBEN</p>
            </div>
          </div>

          {/* ── Primary headline ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="text-center mb-16 md:mb-24"
          >
            <h2
              className="text-[10vw] md:text-[7rem] font-black uppercase leading-[0.9] tracking-tight"
              style={{ color: '#ea4335' }}
            >
              THE COMMUNITY
            </h2>
            <h2 className="text-[10vw] md:text-[7rem] font-black uppercase leading-[0.9] tracking-tight text-white">
              THAT KEEPS
            </h2>
            <h2
              className="text-[10vw] md:text-[7rem] font-black uppercase leading-[0.9] tracking-tight"
              style={{ color: '#ea4335' }}
            >
              BUILDING.
            </h2>
          </motion.div>

          {/* ── Center: GDG logo emblem ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center mb-16 md:mb-24"
          >
            <div className="relative flex items-center justify-center w-36 h-36 md:w-48 md:h-48 rounded-full border border-white/10"
              style={{ background: 'radial-gradient(circle, #1a1a1a 0%, #0f0f0f 100%)' }}
            >
              {/* Oval decorative ring */}
              <div className="absolute inset-0 rounded-full border border-white/5" />
              <div className="absolute inset-3 rounded-full border border-white/5" />

              {/* Diamond-arranged color dots */}
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                {/* Top – blue */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 md:w-7 md:h-7 rounded-md shadow-lg" style={{ backgroundColor: '#4285f4' }} />
                {/* Right – green */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-6 h-6 md:w-7 md:h-7 rounded-md shadow-lg" style={{ backgroundColor: '#34a853' }} />
                {/* Bottom – yellow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 md:w-7 md:h-7 rounded-md shadow-lg" style={{ backgroundColor: '#f9ab00' }} />
                {/* Left – red */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-6 h-6 md:w-7 md:h-7 rounded-md shadow-lg" style={{ backgroundColor: '#ea4335' }} />
              </div>

              {/* Center label */}
              <span className="absolute bottom-3 text-[9px] font-mono uppercase tracking-widest text-gray-500">GDG</span>
            </div>
          </motion.div>

          {/* ── Bottom: dark card ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-sm"
          >
            <div
              className="p-6 md:p-8 rounded-2xl border border-white/10"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <GdgSquares size={10} />
                <span className="text-gray-500 text-xs font-mono uppercase tracking-widest">Current Events</span>
              </div>
              <h3 className="text-white text-xl md:text-2xl font-bold mb-3 leading-snug">
                Google Developer happenings on campus right now.
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Workshops, study jams, and hackathons — all designed to level up every student developer.
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white group"
              >
                <span>See what&apos;s on</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          WHAT WE DO CARDS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-gray-50 relative z-10">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-end gap-8">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-none max-w-2xl">
              What we do.
            </h2>
            <p className="text-gray-500 max-w-sm text-lg">
              Bridging the gap between academic theory and practical industry experience through
              hands-on initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Technical Workshops',
                desc: 'Hands-on training sessions focusing on specific tech stacks and tools.',
                icon: <Code2 className="text-blue-500" size={32} />,
              },
              {
                title: 'Study Jams',
                desc: 'Collaborative learning environments for mastering complex concepts.',
                icon: <Users className="text-green-500" size={32} />,
              },
              {
                title: 'Hackathons',
                desc: 'Intense, time-boxed coding competitions to solve real-world problems.',
                icon: <Rocket className="text-yellow-500" size={32} />,
              },
              {
                title: 'Speaker Events',
                desc: 'Insights and guidance from seasoned industry professionals.',
                icon: <CalendarDays className="text-red-500" size={32} />,
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-white/40 flex flex-col h-full group relative overflow-hidden"
              >
                {/* Glass highlight */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform z-10">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-gray-500 leading-relaxed flex-grow">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          EXPLORE EVENTS CTA SECTION
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

            {/* ── Left: headline ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="flex-1"
            >
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-blue-600 mb-4">
                Featured
              </p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-8">
                Events that inspire.{' '}
                <span className="text-gray-400">Community that delivers.</span>
              </h2>
              <Link
                href="/events"
                className="inline-flex items-center gap-3 px-7 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors shadow-lg group mt-4"
              >
                Explore All Events
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* ── Right: stacked event cards ── */}
            <div className="flex-1 flex flex-col gap-4 w-full">
              {featuredEvents.map((ev, idx) => {
                const { month, day } = parseEventDate(ev.date);
                return (
                  <motion.div
                    key={ev.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: idx * 0.12 }}
                  >
                    <Link
                      href={`/events/${ev.id}`}
                      className="flex items-center gap-5 p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all bg-white group"
                    >
                      {/* Date block */}
                      <div className="shrink-0 w-14 h-14 rounded-xl bg-blue-600 flex flex-col items-center justify-center text-white shadow-md">
                        <span className="text-[10px] font-bold uppercase tracking-wider leading-none opacity-80">
                          {month}
                        </span>
                        <span className="text-xl font-black leading-none mt-0.5">{day}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {ev.title}
                          </h4>
                          {ev.isPast ? (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0">
                              Past
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 shrink-0">
                              Upcoming
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-gray-500 text-sm">
                          <span className="flex items-center gap-1 min-w-0">
                            <MapPin size={12} className="shrink-0" />
                            <span className="truncate min-w-0">{ev.location}</span>
                          </span>
                          <span className="flex items-center gap-1 shrink-0">
                            <Clock size={12} />
                            {ev.startTime}
                          </span>
                        </div>
                      </div>

                      <ArrowRight
                        size={18}
                        className="shrink-0 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          UPCOMING EVENTS GRID  (original section preserved)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Upcoming Events</h2>
            <Link
              href="/events"
              className="hidden md:inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View all events <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((ev, i) => {
              const { month, day } = parseEventDate(ev.date);
              return (
                <Link
                  key={ev.id || i}
                  href={`/events/${ev.id}`}
                  className="group cursor-pointer bg-white/60 backdrop-blur-sm p-4 rounded-[2rem] border border-white/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="w-full aspect-[4/3] rounded-[1.5rem] mb-6 overflow-hidden relative bg-gray-100/80">
                    {ev.image ? (
                      <img
                        src={ev.image}
                        alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${ev.coverGradient || 'from-blue-600 to-indigo-500'} flex items-center justify-center text-white/40 group-hover:scale-105 transition-transform duration-300`}
                      >
                        <CalendarDays size={48} strokeWidth={1.5} className="text-white/70" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                    <div className="absolute top-3 right-3 z-20">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-gray-800 shadow-sm">
                        {ev.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="flex flex-col items-center justify-start text-blue-600 shrink-0">
                      <span className="text-xs font-bold uppercase tracking-wider">{month}</span>
                      <span className="text-2xl font-black leading-none">{day}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-lg font-bold mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {ev.title}
                      </h4>
                      <p className="text-gray-500 text-xs truncate">
                        {ev.location} • {ev.startTime}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link href="/events" className="inline-flex items-center gap-2 font-semibold text-blue-600">
              View all events <span>→</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
