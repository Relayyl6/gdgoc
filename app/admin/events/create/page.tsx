'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Type,
  Calendar,
  Clock,
  MapPin,
  Users,
  AlignLeft,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  Wifi,
  Building2,
  CheckCircle2,
  Upload,
  X,
} from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { getCollection, saveCollection, saveDocument, deleteDocument } from '@/lib/db';

// ─── Constants ────────────────────────────────────────────────────────────────

const EVENT_TYPE_OPTIONS = [
  'Workshop',
  'Speaker Event',
  'Hackathon',
  'Study Jam',
  'Build Project',
  'Showcase',
];

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';

const labelCls = 'block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide';

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow"
    >
      <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-5">{title}</h3>
      {children}
    </motion.div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>
        {Icon && <Icon className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />}
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 px-4 rounded-xl bg-white/5 border border-white/10">
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
          value ? 'bg-blue-500' : 'bg-white/20'
        }`}
      >
        <motion.div
          animate={{ x: value ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
        />
      </button>
    </div>
  );
}

// ─── Success State ────────────────────────────────────────────────────────────

function SuccessState({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="flex flex-col items-center justify-center py-24 gap-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl"
      >
        <CheckCircle2 className="w-12 h-12 text-white" />
      </motion.div>
      <div>
        <h2 className="text-3xl font-extrabold text-white">Event Created!</h2>
        <p className="text-gray-400 text-sm mt-2 max-w-xs">
          <span className="font-semibold text-blue-600">"{title}"</span> has been successfully created and is now live.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/events">
          <button className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-white/80 hover:bg-white/10 border-white/20 transition-colors">
            View All Events
          </button>
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow hover:shadow-blue-300 transition-shadow"
        >
          Create Another
        </button>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreateEventPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    type: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    meetingLink: '',
    bevyLink: '', speakerLink: '', traineeLink: '',
    
    description: '',
    whatToExpect: '',
  });

  const [isOnline, setIsOnline] = useState(false);
  const [allowSpeakers, setAllowSpeakers] = useState(false);
  const [allowTrainees, setAllowTrainees] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [publishNow, setPublishNow] = useState(true);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function setField(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function removeCover() {
    setCoverImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newEvent = {
      id: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
      title: form.title,
      type: form.type,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.location,
      meetingLink: isOnline ? form.meetingLink : undefined,
      bevyLink: form.bevyLink || undefined,
      allowSpeakers,
      allowTrainees,
      status: publishNow ? "published" : "draft",
      isOnline,
      description: form.description,
      whatToExpect: form.whatToExpect.split('\n').filter(s => s.trim()),
      speakers: [],
      agenda: [],
      
      
      coverGradient: 'from-blue-600 to-blue-400',
      isPast: false,
      featured: featured,
      image: coverImage || undefined,
    };
    
    if (featured) {
      const existing = await getCollection('gdgoc_events');
      let featuredEvents = existing.filter((e: any) => e.featured);
      if (featuredEvents.length >= 4) {
        // Sort by date (oldest first)
        featuredEvents.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const toUnfeatureCount = featuredEvents.length - 3; // Make room for 1
        const toUnfeature = featuredEvents.slice(0, toUnfeatureCount);
        
        for (const ev of toUnfeature) {
          await saveDocument('gdgoc_events', ev.id, { ...ev, featured: false });
        }
      }
    }

    await saveDocument('gdgoc_events', newEvent.id, newEvent);
    
    import('@/lib/db').then(({ logActivity }) => {

      logActivity(`Created new event: ${newEvent.title}`, 'event');
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <AdminLayout activePage="events">
        <div className="min-h-[80vh] flex items-center justify-center px-6">
          <SuccessState title={form.title || 'New Event'} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activePage="events">
      <div className="py-10 px-8 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          {/* Admin badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-semibold mb-5">
            <ShieldAlert className="w-3.5 h-3.5" />
            Admin Access Required
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Create Event
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Fill in the details below to publish a new event for GDGOC UNIBEN.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-6">

            {/* ── Left Column ── */}
            <div className="flex flex-col gap-6">

              {/* Basic Info */}
              <SectionCard title="Basic Information" delay={0.05}>
                <div className="flex flex-col gap-4">
                  <Field label="Event Title" icon={Type}>
                    <input
                      required
                      className={inputCls}
                      placeholder="e.g. Flutter & Dart Workshop"
                      value={form.title}
                      onChange={setField('title')}
                    />
                  </Field>

                  <Field label="Event Type" icon={ChevronDown}>
                    <div className="relative">
                      <select
                        required
                        className={`${inputCls} appearance-none`}
                        value={form.type}
                        onChange={setField('type')}
                      >
                        <option value="" className="bg-zinc-900 text-white">Select event type</option>
                          {EVENT_TYPE_OPTIONS.map((t) => (
                            <option key={t} className="bg-zinc-900 text-white">{t}</option>
                          ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </Field>

                  

                  <Field label="Bevy Event URL (Optional)" icon={MapPin}>
                    <input
                      type="url"
                      className={inputCls}
                      placeholder="https://gdg.community.dev/events/details/..."
                      value={form.bevyLink}
                      onChange={setField('bevyLink')}
                    />
                    <p className="text-xs text-gray-400 mt-1">If provided, attendees will be redirected here to register.</p>
                  </Field>
                </div>
              </SectionCard>

              {/* Date & Time */}
              <SectionCard title="Date & Time" delay={0.1}>
                <div className="flex flex-col gap-4">
                  <Field label="Date" icon={Calendar}>
                    <input
                      required
                      type="date"
                      className={inputCls}
                      value={form.date}
                      onChange={setField('date')}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Start Time" icon={Clock}>
                      <input
                        required
                        type="time"
                        className={inputCls}
                        value={form.startTime}
                        onChange={setField('startTime')}
                      />
                    </Field>
                    <Field label="End Time" icon={Clock}>
                      <input
                        required
                        type="time"
                        className={inputCls}
                        value={form.endTime}
                        onChange={setField('endTime')}
                      />
                    </Field>
                  </div>
                </div>
              </SectionCard>

              {/* Location */}
              <SectionCard title="Location" delay={0.15}>
                <div className="flex flex-col gap-4">
                  <Field label="Venue" icon={Building2}>
                    <input
                      required
                      className={inputCls}
                      placeholder="e.g. Engineering Auditorium, UNIBEN"
                      value={form.location}
                      onChange={setField('location')}
                    />
                  </Field>

                  <Toggle
                    label="Online / Virtual"
                    description="Streamed or hosted on Google Meet"
                    value={isOnline}
                    onChange={setIsOnline}
                  />

                  <AnimatePresence>
                    {isOnline && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Field label="Meeting Link" icon={Wifi}>
                          <input
                            className={inputCls}
                            placeholder="https://meet.google.com/xxx-yyyy-zzz"
                            value={form.meetingLink}
                            onChange={setField('meetingLink')}
                          />
                        </Field>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </SectionCard>

              {/* Cover Image */}
              <SectionCard title="Cover Image" delay={0.2}>
                <AnimatePresence mode="wait">
                  {coverImage ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverImage}
                        alt="Cover preview"
                        className="w-full h-44 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={removeCover}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label
                        htmlFor="cover-upload"
                        className="flex flex-col items-center justify-center w-full h-44 rounded-xl border-2 border-dashed border-blue-500/30 cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition-all"
                      >
                        <Upload className="w-8 h-8 text-blue-400 mb-2" />
                        <p className="text-sm font-semibold text-blue-600">Click to upload</p>
                        <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP (max 5 MB)</p>
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SectionCard>
            </div>

            {/* ── Right Column ── */}
            <div className="flex flex-col gap-6">

              {/* Description */}
              <SectionCard title="Description" delay={0.05}>
                <div className="flex flex-col gap-4">
                  <Field label="About This Event" icon={AlignLeft}>
                    <textarea
                      required
                      rows={5}
                      className={`${inputCls} resize-none`}
                      placeholder="Describe the event — what it's about, who it's for, what participants will gain..."
                      value={form.description}
                      onChange={setField('description')}
                    />
                  </Field>
                  <Field label="What to Expect" icon={AlignLeft}>
                    <textarea
                      rows={5}
                      className={`${inputCls} resize-none`}
                      placeholder="List the key highlights, learning outcomes, or agenda points... (one per line)"
                      value={form.whatToExpect}
                      onChange={setField('whatToExpect')}
                    />
                    <p className="text-xs text-gray-400 mt-1">Tip: Enter one item per line for bullet-point display.</p>
                  </Field>
                </div>
              </SectionCard>

              {/* Settings */}
              <SectionCard title="Event Settings" delay={0.1}>
                <div className="flex flex-col gap-3">
                  <Toggle
                    label="Feature this Event"
                    description="Show this on the Home page (max 4 recommended)"
                    value={featured}
                    onChange={setFeatured}
                  />
                  <Toggle
                    label="Allow Speakers to Apply"
                    description="Enables a Speaker registration tab on the event page"
                    value={allowSpeakers}
                    onChange={setAllowSpeakers}
                  />
                  <Toggle
                    label="Publish Immediately"
                    description="If off, event is saved as a draft"
                    value={publishNow}
                    onChange={setPublishNow}
                  />
                </div>
              </SectionCard>

              {/* Preview Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow"
              >
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Live Preview</h3>
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-500 p-5 text-white">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20">
                    {form.type || 'Event Type'}
                  </span>
                  <h4 className="text-lg font-bold mt-2 leading-snug">
                    {form.title || 'Your Event Title'}
                  </h4>
                  <div className="flex flex-col gap-1 mt-3 text-white/80 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {form.date || 'Date TBD'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      {form.location || 'Location TBD'}
                    </span>
                    
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  {publishNow
                    ? '✅ Will publish immediately after creation'
                    : '📝 Will be saved as a draft'}
                </p>
              </motion.div>
            </div>
          </div>

          {/* ── Submit ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between"
          >
            <p className="text-xs text-gray-400 order-2 sm:order-1">
              Ensure all required fields are completed before submitting.
            </p>
            <div className="flex gap-3 order-1 sm:order-2">
              <Link href="/events">
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-white/80 hover:bg-white/10 border-white/20 transition-colors"
                >
                  Cancel
                </button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-blue-300 transition-shadow flex items-center gap-2"
              >
                {publishNow ? '🚀 Publish Event' : '💾 Save as Draft'}
              </motion.button>
            </div>
          </motion.div>
        </form>
      </div>
    </AdminLayout>
  );
}
