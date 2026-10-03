'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, Users } from 'lucide-react';
import { getCollection } from '@/lib/db';

// ─── Types ────────────────────────────────────────────────────────────────────

type Division = 'All' | 'Technical' | 'Design' | 'Content' | 'Outreach';

interface Leader {
  id?: string;
  name: string;
  role: string;
  bio: string;
  gradient: string;
  photoUrl?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

interface Member {
  id?: string;
  name: string;
  role: string;
  division: Exclude<Division, 'All'>;
  bio: string;
  gradient: string;
  photoUrl?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const LEADERS: Leader[] = [
  {
    id: '1',
    name: 'Jane Adeyemi',
    role: 'Chapter Lead',
    bio: 'Computer Science major. Passionate about AI and community building. Oversees all chapter operations and strategy for GDGOC UNIBEN.',
    gradient: 'from-blue-400 via-blue-500 to-indigo-600',
    github: '#',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '2',
    name: 'Chukwuemeka Obi',
    role: 'Co-Lead',
    bio: 'Software Engineering major. Full-stack developer and Google Developer Expert aspirant driving technical workshops and project initiatives.',
    gradient: 'from-green-400 via-emerald-500 to-teal-600',
    github: '#',
    linkedin: '#',
    twitter: '#',
  },
];

const DIVISION_COLORS: Record<Exclude<Division, 'All'>, string> = {
  Technical: 'bg-blue-100 text-blue-700',
  Design: 'bg-purple-100 text-purple-700',
  Content: 'bg-yellow-100 text-yellow-700',
  Outreach: 'bg-green-100 text-green-700',
};

const MEMBERS: Member[] = [
  {
    id: '4',
    name: 'Tunde Afolabi',
    role: 'Frontend Engineer',
    division: 'Technical',
    bio: 'React & Next.js specialist. Leads weekly web dev study jams and mentors junior members.',
    gradient: 'from-sky-300 to-blue-500',
    github: '#',
    linkedin: '#',
  },
  {
    id: '5',
    name: 'Amaka Nwosu',
    role: 'UI/UX Designer',
    division: 'Design',
    bio: 'Figma expert with an eye for human-centred interfaces. Creates all chapter design assets.',
    gradient: 'from-violet-300 to-purple-500',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '6',
    name: 'Ibrahim Salisu',
    role: 'DevOps Engineer',
    division: 'Technical',
    bio: 'Cloud & CI/CD enthusiast. Manages chapter infrastructure and Google Cloud workshops.',
    gradient: 'from-cyan-300 to-teal-500',
    github: '#',
    linkedin: '#',
  },
  {
    id: '3',
    name: 'Chisom Ezeh',
    role: 'Content Lead',
    division: 'Content',
    bio: 'Tech writer and social media strategist. Grows our online presence across all platforms.',
    gradient: 'from-amber-300 to-orange-500',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '7',
    name: 'Blessing Eze',
    role: 'Brand Designer',
    division: 'Design',
    bio: 'Graphic design graduate student. Handles all event branding, merch, and visual identity.',
    gradient: 'from-pink-300 to-rose-500',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '8',
    name: 'Kingsley Nwachukwu',
    role: 'Outreach Coordinator',
    division: 'Outreach',
    bio: 'Manages external partnerships with sponsors, companies, and sister GDG chapters.',
    gradient: 'from-green-300 to-emerald-500',
    github: '#',
    linkedin: '#',
  },
  {
    id: '9',
    name: 'Fatimah Bello',
    role: 'ML Engineer',
    division: 'Technical',
    bio: 'TensorFlow & Keras practitioner. Hosts AI/ML study jams and Kaggle competition groups.',
    gradient: 'from-indigo-300 to-blue-600',
    github: '#',
    linkedin: '#',
  },
  {
    id: '10',
    name: 'Daniel Okonkwo',
    role: 'Community Manager',
    division: 'Outreach',
    bio: 'Keeps our WhatsApp & Discord communities thriving. Organises networking events.',
    gradient: 'from-lime-300 to-green-500',
    linkedin: '#',
    twitter: '#',
  },
];

const FILTERS: Division[] = ['All', 'Technical', 'Design', 'Content', 'Outreach'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SocialLinks({
  github,
  linkedin,
  twitter,
  size = 18,
  className = '',
}: {
  github?: string;
  linkedin?: string;
  twitter?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {github && (
        <a href={github} className="hover:text-black transition-colors" aria-label="GitHub">
          <Github size={size} />
        </a>
      )}
      {linkedin && (
        <a href={linkedin} className="hover:text-blue-600 transition-colors" aria-label="LinkedIn">
          <Linkedin size={size} />
        </a>
      )}
      {twitter && (
        <a href={twitter} className="hover:text-sky-500 transition-colors" aria-label="Twitter/X">
          <Twitter size={size} />
        </a>
      )}
    </div>
  );
}

function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-white/60 backdrop-blur-md border border-white/40 rounded-[2rem] p-8 flex flex-col sm:flex-row gap-8 items-center hover:shadow-2xl hover:border-white/60 transition-all duration-300"
    >
      {/* Avatar */}
      <div className="shrink-0">
        <div className={`w-36 h-36 rounded-full bg-gradient-to-br ${leader.gradient} shadow-lg overflow-hidden`}>
          {leader.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={leader.photoUrl} alt={leader.name} className="w-full h-full object-cover" />
          )}
        </div>
      </div>
      {/* Info */}
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-2xl font-bold mb-1 text-gray-900">{leader.name}</h3>
        <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
          {leader.role}
        </span>
        <p className="text-sm text-gray-500 leading-relaxed mb-5">{leader.bio}</p>
        <SocialLinks
          github={leader.github}
          linkedin={leader.linkedin}
          twitter={leader.twitter}
          className="text-gray-400 justify-center sm:justify-start"
        />
      </div>
    </motion.div>
  );
}

function MemberCard({ member, index }: { member: Member; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group flex flex-col focus:outline-none"
      tabIndex={0}
    >
      {/* Photo */}
      <div className="relative w-full aspect-square rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100">
        {/* Gradient placeholder — grayscale by default, colour on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${member.gradient} transition-all duration-500 ${member.photoUrl ? 'opacity-0' : 'grayscale group-hover:grayscale-0 group-focus:grayscale-0'}`}
        />
        {/* Actual photo if set */}
        {member.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.photoUrl} alt={member.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        {/* Hover overlay with social links */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-focus:opacity-100 focus-within:opacity-100 active:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          {member.github && (
            <a
              href={member.github}
              className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          )}
          {member.twitter && (
            <a
              href={member.twitter}
              className="w-10 h-10 rounded-full bg-white text-sky-500 flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Twitter/X"
            >
              <Twitter size={18} />
            </a>
          )}
        </div>
      </div>
      {/* Text */}
      <h4 className="text-lg font-bold text-gray-900 leading-tight">{member.name}</h4>
      <p className="text-sm font-medium text-gray-500 mb-2">{member.role}</p>
      <span
        className={`self-start text-xs font-semibold px-3 py-1 rounded-full mb-3 ${DIVISION_COLORS[member.division]}`}
      >
        {member.division}
      </span>
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{member.bio}</p>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [activeFilter, setActiveFilter] = useState<Division>('All');
  const [leaders, setLeaders] = useState<Leader[]>(LEADERS);
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [volunteers, setVolunteers] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // Load Team
      let allTeam: any[] = [];
      try {
        const savedTeam = await getCollection('gdgoc_team');
        if (savedTeam && savedTeam.length > 0) {
          allTeam = savedTeam; } } catch (e) { console.error('Failed to load team', e); }
      
      // Split into leaders and members
      const activeLeaders: Leader[] = [];
      const activeMembers: Member[] = [];
      
      const aspects = ['from-sky-300 to-blue-500', 'from-violet-300 to-purple-500', 'from-cyan-300 to-teal-500', 'from-amber-300 to-orange-500', 'from-pink-300 to-rose-500', 'from-green-300 to-emerald-500'];
      
      allTeam.forEach((person, idx) => {
        const gradient = person.gradient || aspects[idx % aspects.length];
        const isLeadership = person.division === 'Leadership' || person.role === 'Chapter Lead' || person.role === 'Co-Lead';
        
        if (isLeadership) {
          activeLeaders.push({ ...person, gradient });
        } else {
          activeMembers.push({ ...person, gradient, division: person.division || 'Technical' });
        }
      });
      
      if (activeLeaders.length > 0) setLeaders(activeLeaders);
      if (activeMembers.length > 0) setMembers(activeMembers);

      // Load Volunteers
      try {
        const parsed = await getCollection('gdgoc_volunteers');
        if (parsed) {
          setVolunteers(parsed.filter((v: any) => v.status === 'Reviewed - Approved'));
        }
      } catch (e) {}
    };
    
    loadData();
  }, []);

  const filtered =
    activeFilter === 'All' ? members : members.filter((m) => m.division === activeFilter);

  return (
    <div
      className="min-h-screen bg-white text-black pt-24 pb-24"
      style={{ fontFamily: "'Google Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-24"
        >
          <p className="text-sm font-semibold tracking-widest text-blue-500 uppercase mb-4">
            The People
          </p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 leading-none">
            Meet the<br />Team.
          </h1>
          <p className="text-xl text-gray-400 font-light">
            Student-led. Google-supported.
          </p>
        </motion.div>

        {/* ── Leadership ────────────────────────────────────────────────────── */}
        <section className="mb-28">
          <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
            <span className="w-8 h-1 bg-blue-500 rounded-full inline-block" />
            Leadership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leaders.map((leader) => (
              <LeaderCard key={leader.name} leader={leader} />
            ))}
          </div>
        </section>

        {/* ── Core Team ─────────────────────────────────────────────────────── */}
        <section className="mb-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-8 h-1 bg-green-500 rounded-full inline-block" />
              Core Team
            </h2>
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                    activeFilter === f
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Member Grid */}
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((member, idx) => (
                <MemberCard key={member.name} member={member} index={idx} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-300">
              <Users size={48} className="mx-auto mb-4" />
              <p>No members in this division yet.</p>
            </div>
          )}
        </section>

        {/* ── Volunteers Section ────────────────────────────────────────────── */}
        {volunteers.length > 0 && (
          <section className="mb-32">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-8 h-1 bg-green-500 rounded-full" />
              <h2 className="text-3xl font-bold text-gray-900">Volunteers</h2>
            </div>
            
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {volunteers.map((vol, idx) => (
                  <motion.div
                    key={vol.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    className="group flex flex-col"
                  >
                    <div className="relative w-full aspect-square rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100 flex items-center justify-center text-4xl shadow-inner">
                      🧑‍💻
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 leading-tight">{vol.fullName}</h4>
                    <p className="text-sm font-medium text-gray-500 mb-2 capitalize">{vol.role.replace('-', ' ')} Volunteer</p>
                    <span className="self-start text-xs font-semibold px-3 py-1 rounded-full mb-3 bg-gray-100 text-gray-700">
                      {vol.department}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </section>
        )}

        {/* ── CTA Banner ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[3rem] overflow-hidden p-12 md:p-16 text-center border border-white/40"
        >
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50" />
          <div className="absolute inset-0 backdrop-blur-sm bg-white/40" />
          {/* Decorative circles */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-green-200/30 blur-3xl" />

          <div className="relative z-10">
            <p className="text-xs font-bold tracking-widest uppercase text-blue-500 mb-4">
              Applications Open
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-gray-900">
              Joining the Core Team
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
              We're recruiting passionate students for our Design and Content divisions.
              Gain real-world experience, build your portfolio, and grow with a global community.
            </p>
            <a
              href="/join"
              className="inline-block bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 active:scale-95 transition-all duration-200"
            >
              Apply Now →
            </a>
          </div>
        </motion.div>

        {/* ── Admin Shortcuts ────────────────────────────────────────────── */}
        <div className="flex justify-end mt-4">
          <Link href="/admin">
            <button className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors opacity-60 hover:opacity-100">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Admin Portal
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}

