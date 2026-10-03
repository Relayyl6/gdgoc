'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCollection, saveCollection } from '@/lib/db';
import {
  Users, Calendar, FileText, Code2, Palette, Heart,
  Clock, CheckCheck, ArrowRight, CheckCircle2, X
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface VolunteerRole {
  id: string;
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
  requirements: string[];
  commitment: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  role: string;
  whyVolunteer: string;
  skills: string;
  availability: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const volunteerRoles: VolunteerRole[] = [
  {
    id: 'dev-rel',
    icon: <Users size={28} />,
    color: 'text-blue-500',
    title: 'Dev Rel Volunteer',
    description: 'Help grow and engage our developer community through outreach and online presence.',
    requirements: ['Strong communication skills', 'Social media savvy', 'Developer background'],
    commitment: '3–5 hrs/week',
  },
  {
    id: 'events',
    icon: <Calendar size={28} />,
    color: 'text-green-500',
    title: 'Events Volunteer',
    description: 'Help organize and run GDGOC events, from setup to post-event wrap-up.',
    requirements: ['Organizational skills', 'Reliability', 'Teamwork'],
    commitment: 'Event days + 2 hrs planning/week',
  },
  {
    id: 'content',
    icon: <FileText size={28} />,
    color: 'text-yellow-500',
    title: 'Content Volunteer',
    description: "Write blog posts, create social content, and tell our community's story.",
    requirements: ['Writing or video skills', 'Tech knowledge', 'Creativity'],
    commitment: '2–4 hrs/week',
  },
  {
    id: 'technical',
    icon: <Code2 size={28} />,
    color: 'text-red-500',
    title: 'Technical Volunteer',
    description: 'Facilitate workshops, study jams, and technical sessions for our members.',
    requirements: ['Technical expertise in one track', 'Teaching ability', 'Patience'],
    commitment: '4–6 hrs/week',
  },
  {
    id: 'design',
    icon: <Palette size={28} />,
    color: 'text-purple-500',
    title: 'Design Volunteer',
    description: 'Create eye-catching graphics, presentation slides, and event banners.',
    requirements: ['Figma proficiency', 'Strong design sense', 'Attention to detail'],
    commitment: '3–5 hrs/week',
  },
  {
    id: 'general',
    icon: <Heart size={28} />,
    color: 'text-pink-500',
    title: 'General Volunteer',
    description: 'Support events, logistics, and community tasks wherever help is needed most.',
    requirements: ['Willingness to help', 'Positive attitude'],
    commitment: 'Flexible',
  },
];

const availabilityOptions = ['Weekday Mornings', 'Weekday Evenings', 'Weekends'];

const initialForm: FormData = {
  fullName: '',
  email: '',
  phone: '',
  department: '',
  year: '',
  role: '',
  whyVolunteer: '',
  skills: '',
  availability: [],
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function RoleCard({ role, onApply }: { role: VolunteerRole; onApply: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-8 flex flex-col gap-5 shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className={`${role.color} w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center`}>
        {role.icon}
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">{role.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{role.description}</p>
      </div>

      <ul className="space-y-1">
        {role.requirements.map((req) => (
          <li key={req} className="flex items-start gap-2 text-sm text-gray-600">
            <CheckCheck size={15} className="mt-0.5 text-green-500 shrink-0" />
            {req}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full w-fit">
        <Clock size={14} className="text-gray-400" />
        <span className="text-xs font-semibold text-gray-600">{role.commitment}</span>
      </div>

      <button
        onClick={() => onApply(role.id)}
        className="mt-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors group"
      >
        Apply to Volunteer
        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VolunteerPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleRoleApply = (roleId: string) => {
    setForm((prev) => ({ ...prev, role: roleId }));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAvailability = (option: string) => {
    setForm((prev) => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter((a) => a !== option)
        : [...prev.availability, option],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    
    const newVol = { ...form, id: Date.now().toString(), status: 'New', date: new Date().toISOString() };
    const existing = (await getCollection('gdgoc_volunteers')) || [];
    await saveCollection('gdgoc_volunteers', [newVol, ...existing]);
    
    setSubmitting(false);
    setSubmitted(true);
  };

  const inputClass =
    'w-full bg-white/70 backdrop-blur border border-gray-200 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-400';

  return (
    <div
      className="min-h-screen bg-white text-black pt-24 pb-24"
      style={{ fontFamily: "'Google Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-sm font-bold mb-8 border border-blue-100">
            <Heart size={15} /> Volunteer Programme
          </span>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-none">
            Volunteer.
          </h1>
          <p className="text-2xl text-gray-500 leading-relaxed">
            Use your skills to power the community. We need passionate people for various roles across events,
            content, design, engineering, and community relations.
          </p>
        </motion.div>

        {/* ── Stats strip ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24"
        >
          {[
            { label: 'Open Roles', value: '6' },
            { label: 'Active Volunteers', value: '20+' },
            { label: 'Events Per Year', value: '12+' },
            { label: 'Hours Contributed', value: '500+' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-50 border border-gray-100 rounded-3xl p-6 text-center"
            >
              <p className="text-4xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Section heading ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Open Roles</h2>
          <p className="text-gray-500 text-lg max-w-xl">
            Click <strong>"Apply to Volunteer"</strong> on any card to jump straight to the application form below.
          </p>
        </motion.div>

        {/* ── Role Cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-28">
          {volunteerRoles.map((role) => (
            <RoleCard key={role.id} role={role} onApply={handleRoleApply} />
          ))}
        </div>

        {/* ── Application Form ─────────────────────────────────────────────── */}
        <div ref={formRef} className="scroll-mt-24 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/60 backdrop-blur-md border border-white/40 rounded-[2.5rem] p-10 md:p-14 shadow-sm"
          >
            <h2 className="text-3xl font-bold mb-2">Volunteer Application</h2>
            <p className="text-gray-500 mb-10">
              Fill out the form below and we'll reach out within 3–5 business days.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center text-center py-16 gap-5"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                    className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h4 className="text-2xl font-bold">Application Submitted!</h4>
                  <p className="text-gray-500 max-w-sm">
                    Thanks for stepping up, {form.fullName.split(' ')[0] || 'volunteer'}! We'll be in touch within 3–5 business days.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm(initialForm); }}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition mt-4"
                  >
                    <X size={14} /> Submit another application
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name *</label>
                      <input
                        required
                        className={inputClass}
                        placeholder="Ada Okonkwo"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email *</label>
                      <input
                        required
                        type="email"
                        className={inputClass}
                        placeholder="ada@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Phone</label>
                      <input
                        className={inputClass}
                        placeholder="+234 800 000 0000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Department *</label>
                      <input
                        required
                        className={inputClass}
                        placeholder="Computer Science"
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Year of Study *</label>
                      <select
                        required
                        className={inputClass}
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                      >
                        <option value="">Select year</option>
                        {['100 Level', '200 Level', '300 Level', '400 Level', '500 Level', 'Postgraduate'].map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Applying for Role *</label>
                      <select
                        required
                        className={inputClass}
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                      >
                        <option value="">Select a role</option>
                        {volunteerRoles.map((r) => (
                          <option key={r.id} value={r.id}>{r.title}</option>
                        ))}
                        <option value="general-open">General Volunteer</option>
                      </select>
                    </div>
                  </div>

                  {/* Why Volunteer */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Why do you want to volunteer? *</label>
                    <textarea
                      required
                      rows={4}
                      className={inputClass + ' resize-none'}
                      placeholder="Tell us what motivates you to contribute..."
                      value={form.whyVolunteer}
                      onChange={(e) => setForm({ ...form, whyVolunteer: e.target.value })}
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Relevant Skills or Experience</label>
                    <textarea
                      rows={3}
                      className={inputClass + ' resize-none'}
                      placeholder="List any relevant skills, tools, or past experience..."
                      value={form.skills}
                      onChange={(e) => setForm({ ...form, skills: e.target.value })}
                    />
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Availability *</label>
                    <div className="flex flex-wrap gap-3">
                      {availabilityOptions.map((opt) => {
                        const checked = form.availability.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleAvailability(opt)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                              checked
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            {checked && <CheckCheck size={13} className="inline mr-1.5" />}
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full text-base font-bold hover:bg-blue-700 disabled:opacity-60 transition-colors mt-2"
                  >
                    {submitting ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full block"
                        />
                        Submitting…
                      </>
                    ) : (
                      <>Submit Volunteer Application <ArrowRight size={18} /></>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
