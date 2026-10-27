'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Code2, Users, CalendarDays, Rocket, ArrowRight, MapPin, Clock } from 'lucide-react';
import { type Event } from '@/lib/data';
import { getCollection } from '@/lib/db';

/* ─── GDG 4-square logo (reusable) ──────────────────────────────────────── */
function GdgSquares({ size = 12 }: { size?: number }) {
  const colors = ['#4285f4', '#34a853', '#f9ab00', '#ea4335'];
  return (
    <div
      className="grid grid-cols-2 shrink-0"
      style={{ gap: 2.5, width: size * 2 + 2.5, height: size * 2 + 2.5 }}
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
      <section className="relative min-h-[85vh] sm:min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Animated blob background */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-[16rem] h-[16rem] sm:w-[24rem] sm:h-[24rem] md:w-[30rem] md:h-[30rem] bg-blue-500/20 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none"
          animate={{ x: [0, 60, 0], y: [0, 40, -40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[16rem] h-[16rem] sm:w-[24rem] sm:h-[24rem] md:w-[30rem] md:h-[30rem] bg-green-500/20 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none"
          animate={{ x: [0, -60, 0], y: [0, -40, 40, 0], scale: [1, 1.25, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="z-10 px-4 sm:px-6 md:px-12 w-full max-w-7xl mx-auto flex flex-col items-center justify-center pt-20 pb-12 sm:pt-28 sm:pb-20">
          {/* Headline */}
          <div className="relative mb-8 sm:mb-14 md:mb-16 flex flex-col items-center w-full">
            <div className="relative inline-block w-fit">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="font-black tracking-tighter leading-none"
                style={{ fontSize: 'clamp(3.5rem, 18vw, 15rem)' }}
              >
                GDGOC
              </motion.h1>
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                className="absolute right-0 text-gray-500 font-medium tracking-[0.2em] uppercase"
                style={{
                  fontSize: 'clamp(0.75rem, 3.2vw, 2.2rem)',
                  bottom: 'clamp(-0.9rem, -2.8vw, -2.5rem)',
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
            transition={{ duration: 1, delay: 0.8 }}
            className="text-center max-w-xl w-full px-2"
          >
            <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-6 sm:mb-8 leading-relaxed">
              Learn, build, and grow with a modern, animated, and tech-forward community platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2 w-full sm:w-auto">
              <Link
                href="/join"
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 bg-blue-600 text-white rounded-full text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors shadow-md text-center"
              >
                Join the Community
              </Link>
              <Link
                href="/events"
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 bg-white text-blue-600 rounded-full text-sm sm:text-base font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-sm text-center"
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
      <section className="w-full bg-black text-white py-8 sm:py-12 md:py-16 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 md:gap-12 text-center md:text-left">
          <div className="flex-1">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1">2,500+</h3>
            <p className="text-gray-400 font-mono text-xs sm:text-sm uppercase tracking-widest">Active Members</p>
          </div>
          <div className="flex-1">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1">120+</h3>
            <p className="text-gray-400 font-mono text-xs sm:text-sm uppercase tracking-widest">Events Hosted</p>
          </div>
          <div className="flex-1">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1">50+</h3>
            <p className="text-gray-400 font-mono text-xs sm:text-sm uppercase tracking-widest">Build Projects</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          EDITORIAL FEATURED SECTION
      ════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-14 sm:py-20 md:py-32"
        style={{ backgroundColor: '#0f0f0f' }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <h2
            className="text-[16vw] md:text-[14vw] font-black uppercase leading-none text-center whitespace-nowrap"
            style={{
              color: '#ea4335',
              opacity: 0.08,
              letterSpacing: '-0.04em',
            }}
          >
            BUILDING
          </h2>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 md:px-16">
          {/* Top meta row */}
          <div className="flex justify-between items-start mb-8 sm:mb-12 md:mb-16">
            <div>
              <p className="text-gray-500 font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] mb-1">Since</p>
              <p className="text-white font-bold text-xl sm:text-2xl md:text-4xl">2023</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] mb-1">Chapter</p>
              <p className="text-white font-bold text-xl sm:text-2xl md:text-4xl">UNIBEN</p>
            </div>
          </div>

          {/* Primary headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-8 sm:mb-14 md:mb-20"
          >
            <h2
              className="text-3xl sm:text-5xl md:text-[6rem] font-black uppercase leading-[1.05] tracking-tight"
              style={{ color: '#ea4335' }}
            >
              THE COMMUNITY
            </h2>
            <h2 className="text-3xl sm:text-5xl md:text-[6rem] font-black uppercase leading-[1.05] tracking-tight text-white">
              THAT KEEPS
            </h2>
            <h2
              className="text-3xl sm:text-5xl md:text-[6rem] font-black uppercase leading-[1.05] tracking-tight"
              style={{ color: '#ea4335' }}
            >
              BUILDING.
            </h2>
          </motion.div>

          {/* Center: GDG logo emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center mb-10 sm:mb-14 md:mb-20"
          >
            <div
              className="relative flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full border border-white/10"
              style={{ background: 'radial-gradient(circle, #1a1a1a 0%, #0f0f0f 100%)' }}
            >
              <div className="absolute inset-0 rounded-full border border-white/5" />
              <div className="absolute inset-2 sm:inset-3 rounded-full border border-white/5" />

              <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-md shadow" style={{ backgroundColor: '#4285f4' }} />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-md shadow" style={{ backgroundColor: '#34a853' }} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-md shadow" style={{ backgroundColor: '#f9ab00' }} />
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-md shadow" style={{ backgroundColor: '#ea4335' }} />
              </div>

              <span className="absolute bottom-2 sm:bottom-3 text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-gray-500">GDG</span>
            </div>
          </motion.div>

          {/* Bottom card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-sm"
          >
            <div
              className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-white/10"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <GdgSquares size={9} />
                <span className="text-gray-500 text-[10px] sm:text-xs font-mono uppercase tracking-widest">Current Events</span>
              </div>
              <h3 className="text-white text-base sm:text-lg md:text-xl font-bold mb-2 leading-snug">
                Google Developer happenings on campus right now.
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                Workshops, study jams, and hackathons — all designed to level up every student developer.
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white group"
              >
                <span>See what&apos;s on</span>
                <ArrowRight
                  size={15}
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
      <section className="py-14 sm:py-20 md:py-28 bg-gray-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16">
          <div className="mb-10 sm:mb-16 md:mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-none max-w-2xl">
              What we do.
            </h2>
            <p className="text-gray-500 max-w-sm text-sm sm:text-base md:text-lg">
              Bridging the gap between academic theory and practical industry experience through hands-on initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: 'Technical Workshops',
                desc: 'Hands-on training sessions focusing on specific tech stacks and tools.',
                icon: <Code2 className="text-blue-500" size={26} />,
              },
              {
                title: 'Study Jams',
                desc: 'Collaborative learning environments for mastering complex concepts.',
                icon: <Users className="text-green-500" size={26} />,
              },
              {
                title: 'Hackathons',
                desc: 'Intense, time-boxed coding competitions to solve real-world problems.',
                icon: <Rocket className="text-yellow-500" size={26} />,
              },
              {
                title: 'Speaker Events',
                desc: 'Insights and guidance from seasoned industry professionals.',
                icon: <CalendarDays className="text-red-500" size={26} />,
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white/80 backdrop-blur-md p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col h-full group relative overflow-hidden"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed flex-grow">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          EXPLORE EVENTS CTA SECTION
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 md:py-28 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16">
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20 items-start">

            {/* Left: headline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-blue-600 mb-2 sm:mb-3">
                Featured
              </p>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4 sm:mb-6">
                Events that inspire.{' '}
                <span className="text-gray-400">Community that delivers.</span>
              </h2>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3.5 bg-black text-white rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-800 transition-colors shadow-md group mt-2"
              >
                Explore All Events
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Right: stacked event cards */}
            <div className="flex-1 flex flex-col gap-3 sm:gap-4 w-full">
              {featuredEvents.map((ev, idx) => {
                const { month, day } = parseEventDate(ev.date);
                return (
                  <motion.div
                    key={ev.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                  >
                    <Link
                      href={`/events/${ev.id}`}
                      className="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all bg-white group"
                    >
                      <div className="shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-blue-600 flex flex-col items-center justify-center text-white shadow-sm">
                        <span className="text-[9px] font-bold uppercase tracking-wider leading-none opacity-80">
                          {month}
                        </span>
                        <span className="text-base sm:text-lg font-black leading-none mt-0.5">{day}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h4 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {ev.title}
                          </h4>
                          {ev.isPast ? (
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0">
                              Past
                            </span>
                          ) : (
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 shrink-0">
                              Upcoming
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-gray-500 text-[11px] sm:text-xs">
                          <span className="flex items-center gap-1 min-w-0">
                            <MapPin size={11} className="shrink-0" />
                            <span className="truncate min-w-0">{ev.location}</span>
                          </span>
                          <span className="flex items-center gap-1 shrink-0">
                            <Clock size={11} />
                            {ev.startTime}
                          </span>
                        </div>
                      </div>

                      <ArrowRight
                        size={15}
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
          UPCOMING EVENTS GRID
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 md:py-28 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16">
          <div className="flex justify-between items-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">Upcoming Events</h2>
            <Link
              href="/events"
              className="hidden md:inline-flex items-center gap-2 font-semibold text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              View all events <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {upcomingEvents.map((ev, i) => {
              const { month, day } = parseEventDate(ev.date);
              return (
                <Link
                  key={ev.id || i}
                  href={`/events/${ev.id}`}
                  className="group cursor-pointer bg-white p-3.5 sm:p-4 rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="w-full aspect-[4/3] rounded-xl sm:rounded-[1.5rem] mb-4 sm:mb-5 overflow-hidden relative bg-gray-100">
                    {ev.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={ev.image}
                        alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${ev.coverGradient || 'from-blue-600 to-indigo-500'} flex items-center justify-center text-white/40 group-hover:scale-105 transition-transform duration-300`}
                      >
                        <CalendarDays size={36} strokeWidth={1.5} className="text-white/70" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                    <div className="absolute top-2.5 right-2.5 z-20">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-white/90 backdrop-blur-md text-gray-800 shadow-sm">
                        {ev.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-col items-center justify-start text-blue-600 shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider">{month}</span>
                      <span className="text-lg sm:text-xl font-black leading-none">{day}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm sm:text-base font-bold mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {ev.title}
                      </h4>
                      <p className="text-gray-500 text-[11px] sm:text-xs truncate">
                        {ev.location} • {ev.startTime}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/events" className="inline-flex items-center gap-1.5 font-semibold text-sm text-blue-600">
              View all events <span>→</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
