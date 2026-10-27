'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Globe2,
  Users,
  Rocket,
  Target,
  Code2,
  Lightbulb,
  Cpu,
  Mic2,
  Trophy,
  BookOpen,
  Handshake,
} from 'lucide-react';

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Data ─── */
const stats = [
  { value: '2023', label: 'Year Founded' },
  { value: '200+', label: 'Members' },
  { value: '30+', label: 'Events Held' },
  { value: '5', label: 'Core Teams' },
];

const whatWeDo = [
  {
    icon: <Code2 size={20} />,
    title: 'Build Projects',
    desc: 'Hands-on engineering projects solving real local problems.',
    color: '#4285F4',
  },
  {
    icon: <Lightbulb size={20} />,
    title: 'Run Workshops',
    desc: 'Peer-led sessions on web, mobile, cloud, ML, and more.',
    color: '#34A853',
  },
  {
    icon: <Mic2 size={20} />,
    title: 'Host Events',
    desc: 'DevFests, hackathons, study jams, and speaker series.',
    color: '#FBBC04',
  },
  {
    icon: <Cpu size={20} />,
    title: 'Explore AI & ML',
    desc: 'Dedicated tracks for machine learning and AI exploration.',
    color: '#EA4335',
  },
  {
    icon: <Trophy size={20} />,
    title: 'Compete & Win',
    desc: 'Google Solution Challenge and other global competitions.',
    color: '#4285F4',
  },
  {
    icon: <BookOpen size={20} />,
    title: 'Study Jams',
    desc: 'Free guided learning using Google\'s developer tools.',
    color: '#34A853',
  },
  {
    icon: <Handshake size={20} />,
    title: 'Network',
    desc: 'Connect with industry professionals and Google Developer Experts.',
    color: '#FBBC04',
  },
  {
    icon: <Rocket size={20} />,
    title: 'Launch Startups',
    desc: 'Support for student founders to prototype and validate ideas.',
    color: '#EA4335',
  },
];

const timeline = [
  {
    year: '2023',
    title: 'Chapter Founded',
    desc: 'Established as GDSC UNIBEN — Google Developer Student Clubs at the University of Benin. First cohort of 40 members.',
    color: '#4285F4',
  },
  {
    year: '2024',
    title: 'Rebranded & First DevFest',
    desc: 'Rebranded to GDG on Campus UNIBEN. Hosted our first DevFest, drawing 300+ attendees from across Edo State.',
    color: '#34A853',
  },
  {
    year: '2025',
    title: '200+ Members Milestone',
    desc: 'Crossed 200 active members. Solution Challenge finalist. Launched dedicated tracks for AI/ML and Cloud computing.',
    color: '#FBBC04',
  },
  {
    year: '2026',
    title: 'Growing & Expanding',
    desc: 'Expanding outreach across all 13 faculties. Launching mentorship programme and alumni network for career support.',
    color: '#EA4335',
  },
];

/* ─── Page ─── */
export default function AboutPage() {
  return (
    <div
      className="min-h-screen bg-white text-black pb-16 sm:pb-24 overflow-hidden relative"
      style={{ fontFamily: "'Google Sans', sans-serif" }}
    >
      {/* Decorative blobs */}
      <motion.div
        className="absolute top-0 right-0 w-[20rem] sm:w-[35rem] h-[20rem] sm:h-[35rem] rounded-full blur-[90px] pointer-events-none"
        style={{ backgroundColor: 'rgba(66,133,244,0.06)' }}
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[20rem] sm:w-[35rem] h-[20rem] sm:h-[35rem] rounded-full blur-[90px] pointer-events-none"
        style={{ backgroundColor: 'rgba(52,168,83,0.06)' }}
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10 pt-16 sm:pt-24">
        {/* ─── HERO HEADER ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12 sm:mb-16"
        >
          <p className="uppercase tracking-[0.2em] text-[10px] sm:text-xs text-gray-400 mb-3 sm:mb-4">
            About GDG on Campus UNIBEN
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
            Our Story.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 leading-relaxed">
            From GDSC to GDG on Campus, our vision remains the same: uniting students to learn,
            build, and grow together.
          </p>
        </motion.div>

        {/* ─── CHAPTER STATS ─── */}
        <Reveal delay={0} className="mb-14 sm:mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="bg-white/70 backdrop-blur-md p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm text-center"
              >
                <p className="text-2xl sm:text-3xl md:text-4xl font-black mb-1 tracking-tight">{s.value}</p>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-gray-400 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* ─── WHAT WE DO ─── */}
        <Reveal delay={0} className="mb-14 sm:mb-20">
          <p className="uppercase tracking-[0.2em] text-[10px] sm:text-xs text-gray-400 mb-2">Activities</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-10 leading-tight">What We Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {whatWeDo.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.06}
                className="group p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 bg-white hover:shadow-sm transition-all duration-300"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  {item.icon}
                </div>
                <h4 className="font-bold text-sm sm:text-base mb-1.5">{item.title}</h4>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* ─── CHAPTER STORY TIMELINE ─── */}
        <Reveal delay={0} className="mb-14 sm:mb-20">
          <p className="uppercase tracking-[0.2em] text-[10px] sm:text-xs text-gray-400 mb-2">History</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 leading-tight">Our Chapter&apos;s Story</h2>

          <div className="relative">
            <div className="absolute left-[7.5rem] md:left-[9.5rem] top-0 bottom-0 w-px bg-black/10 hidden sm:block" />

            <div className="flex flex-col gap-6 sm:gap-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.12}
                  className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-start"
                >
                  <div className="flex-shrink-0 w-28 md:w-36 text-right hidden sm:block">
                    <span
                      className="text-xs sm:text-sm font-bold uppercase tracking-widest"
                      style={{ color: item.color }}
                    >
                      {item.year}
                    </span>
                  </div>

                  <div className="hidden sm:flex flex-shrink-0 items-center justify-center w-3.5 h-3.5 rounded-full border-2 mt-0.5 relative z-10 bg-white"
                    style={{ borderColor: item.color }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  </div>

                  <div className="flex-1 pb-1">
                    <span
                      className="text-xs font-bold uppercase tracking-widest sm:hidden block mb-1"
                      style={{ color: item.color }}
                    >
                      {item.year}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-xl">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ─── WHAT MAKES US DIFFERENT ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-black text-white p-6 sm:p-10 md:p-16 rounded-2xl sm:rounded-[2.5rem] shadow-xl relative overflow-hidden mb-6"
        >
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <Globe2 className="w-64 h-64 md:w-96 md:h-96 -mr-16 -mb-16" />
          </div>

          <div className="max-w-3xl relative z-10">
            <p className="uppercase tracking-[0.2em] text-[10px] sm:text-xs text-gray-500 mb-3">Global Network</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">What Makes Us Different</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 sm:mb-12 leading-relaxed">
              We are part of an official Google-supported global program designed to help students
              bridge the gap between theory and practice.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <h4 className="text-3xl sm:text-4xl md:text-5xl font-black mb-1" style={{ color: '#4285F4' }}>
                  100+
                </h4>
                <span className="text-gray-400 uppercase tracking-widest text-xs font-mono">
                  Countries
                </span>
              </div>
              <div>
                <h4 className="text-3xl sm:text-4xl md:text-5xl font-black mb-1" style={{ color: '#34A853' }}>
                  2,100+
                </h4>
                <span className="text-gray-400 uppercase tracking-widest text-xs font-mono">
                  Clubs Globally
                </span>
              </div>
              <div>
                <h4 className="text-3xl sm:text-4xl md:text-5xl font-black mb-1" style={{ color: '#FBBC04' }}>
                  GDEs
                </h4>
                <span className="text-gray-400 uppercase tracking-widest text-xs font-mono">
                  Expert Access
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
