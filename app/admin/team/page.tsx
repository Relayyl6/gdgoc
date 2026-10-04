'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import { getCollection, saveCollection, saveDocument, deleteDocument } from '@/lib/db';
import { uploadImage } from '@/lib/upload';
import {
  Plus,
  X,
  Pencil,
  Trash2,
  Github,
  Linkedin,
  Twitter,
  ShieldCheck,
  ChevronDown,
  ImagePlus,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Division = 'Leadership' | 'Technical' | 'Design' | 'Content' | 'Outreach';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: Division;
  bio: string;
  github: string;
  linkedin: string;
  twitter: string;
  photoUrl: string; // base64 or URL
}

const EMPTY_FORM: Omit<TeamMember, 'id'> = {
  name: '',
  role: '',
  division: 'Technical',
  bio: '',
  github: '',
  linkedin: '',
  twitter: '',
  photoUrl: '',
};

const DIVISION_COLORS: Record<Division, string> = {
  Leadership: 'bg-red-100 text-red-700',
  Technical: 'bg-blue-100 text-blue-700',
  Design: 'bg-purple-100 text-purple-700',
  Content: 'bg-yellow-100 text-yellow-700',
  Outreach: 'bg-green-100 text-green-700',
};

const MOCK_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Jane Adeyemi',
    role: 'Chapter Lead',
    division: 'Leadership',
    bio: 'Computer Science major. Passionate about AI and community building. Oversees all chapter operations and strategy for GDGOC UNIBEN.',
    github: '#',
    linkedin: '#',
    twitter: '#',
    photoUrl: '',
  },
  {
    id: '2',
    name: 'Chukwuemeka Obi',
    role: 'Co-Lead',
    division: 'Leadership',
    bio: 'Software Engineering major. Full-stack developer and Google Developer Expert aspirant driving technical workshops and project initiatives.',
    github: '#',
    linkedin: '#',
    twitter: '#',
    photoUrl: '',
  },
  {
    id: '3',
    name: 'Chisom Ezeh',
    role: 'Content Lead',
    division: 'Content',
    bio: 'Tech writer and social media strategist. Grows our online presence across all platforms.',
    github: '',
    linkedin: '#',
    twitter: '#',
    photoUrl: '',
  },
  {
    id: '4',
    name: 'Tunde Afolabi',
    role: 'Frontend Engineer',
    division: 'Technical',
    bio: 'React & Next.js specialist. Leads weekly web dev study jams and mentors junior members.',
    github: '#',
    linkedin: '#',
    twitter: '',
    photoUrl: '',
  },
  {
    id: '5',
    name: 'Amaka Nwosu',
    role: 'UI/UX Designer',
    division: 'Design',
    bio: 'Figma expert with an eye for human-centred interfaces. Creates all chapter design assets.',
    github: '',
    linkedin: '#',
    twitter: '#',
    photoUrl: '',
  },
  {
    id: '6',
    name: 'Ibrahim Salisu',
    role: 'DevOps Engineer',
    division: 'Technical',
    bio: 'Cloud & CI/CD enthusiast. Manages chapter infrastructure and Google Cloud workshops.',
    github: '#',
    linkedin: '#',
    twitter: '',
    photoUrl: '',
  },
  {
    id: '7',
    name: 'Blessing Eze',
    role: 'Brand Designer',
    division: 'Design',
    bio: 'Graphic design graduate student. Handles all event branding, merch, and visual identity.',
    github: '',
    linkedin: '#',
    twitter: '#',
    photoUrl: '',
  },
  {
    id: '8',
    name: 'Kingsley Nwachukwu',
    role: 'Outreach Coordinator',
    division: 'Outreach',
    bio: 'Manages external partnerships with sponsors, companies, and sister GDG chapters.',
    github: '#',
    linkedin: '#',
    twitter: '',
    photoUrl: '',
  },
  {
    id: '9',
    name: 'Fatimah Bello',
    role: 'ML Engineer',
    division: 'Technical',
    bio: 'TensorFlow & Keras practitioner. Hosts AI/ML study jams and Kaggle competition groups.',
    github: '#',
    linkedin: '#',
    twitter: '',
    photoUrl: '',
  },
  {
    id: '10',
    name: 'Daniel Okonkwo',
    role: 'Community Manager',
    division: 'Outreach',
    bio: 'Keeps our WhatsApp & Discord communities thriving. Organises networking events.',
    github: '',
    linkedin: '#',
    twitter: '#',
    photoUrl: '',
  },
];

// ─── Form Field ───────────────────────────────────────────────────────────────

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(MOCK_MEMBERS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<TeamMember, 'id'>>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    getCollection('gdgoc_team').then(parsed => {
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        setMembers(parsed as TeamMember[]);
      } else {
        setMembers(MOCK_MEMBERS);
        saveCollection('gdgoc_team', MOCK_MEMBERS);
      }
    });
  }, []);

  const saveMembers = (newMembersOrFn: TeamMember[] | ((prev: TeamMember[]) => TeamMember[])) => {
    setMembers((prev) => {
      const updated = typeof newMembersOrFn === 'function' ? newMembersOrFn(prev) : newMembersOrFn;
      saveCollection('gdgoc_team', updated);
      return updated;
    });
  };

  // ── Form helpers ────────────────────────────────────────────────────────────

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);
    
    // Upload to Vercel Blob
    setUploadingPhoto(true);
    try {
      const url = await uploadImage(file, 'team');
      setField('photoUrl', url);
      setPhotoPreview(url);
    } catch (err: any) {
      alert('Photo upload failed: ' + err.message);
      setPhotoPreview('');
      setField('photoUrl', '');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) return;

    if (editingId) {
      saveMembers((prev) =>
        prev.map((m) => (m.id === editingId ? { ...form, id: editingId } : m))
      );
      import('@/lib/db').then(({ logActivity }) => logActivity(`Updated team member: ${form.name}`, 'team'));
    } else {
      saveMembers((prev) => [...prev, { ...form, id: crypto.randomUUID() }]);
      import('@/lib/db').then(({ logActivity }) => logActivity(`Added team member: ${form.name}`, 'team'));
    }
    resetForm();
  };

  const handleEdit = (member: TeamMember) => {
    const { id, ...rest } = member;
    setForm(rest);
    setPhotoPreview(rest.photoUrl);
    setEditingId(id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemove = (id: string) => {
    deleteDocument('gdgoc_team_members', id);
    const member = members.find(m => m.id === id);
    saveMembers((prev) => prev.filter((m) => m.id !== id));
    if (member) {
      import('@/lib/db').then(({ logActivity }) => logActivity(`Removed team member: ${member.name}`, 'team'));
    }
    setDeleteConfirm(null);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setPhotoPreview('');
    setEditingId(null);
    setShowForm(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <AdminLayout activePage="team">
      <div
        className="bg-gray-50 pt-8 pb-24 px-4 md:px-8 min-h-full"
        style={{ fontFamily: "'Google Sans', sans-serif" }}
      >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={18} className="text-blue-500" />
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                Admin Panel
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Team Management</h1>
            <p className="text-sm text-gray-400 mt-1">Add, edit, or remove core team members.</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm((prev) => !prev);
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
              showForm
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {showForm ? (
              <>
                <X size={16} /> Cancel
              </>
            ) : (
              <>
                <Plus size={16} /> Add Team Member
              </>
            )}
          </button>
        </div>

        {/* ── Add / Edit Form ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 mb-8 shadow-xl"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingId ? 'Edit Member' : 'New Team Member'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <Field
                  label="Full Name"
                  id="name"
                  value={form.name}
                  onChange={(v) => setField('name', v)}
                  placeholder="Jane Adeyemi"
                />
                {/* Role */}
                <Field
                  label="Role / Title"
                  id="role"
                  value={form.role}
                  onChange={(v) => setField('role', v)}
                  placeholder="Frontend Engineer"
                />
                {/* Division */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="division"
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    Division
                  </label>
                  <div className="relative">
                    <select
                      id="division"
                      value={form.division}
                      onChange={(e) => setField('division', e.target.value as Division)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 text-sm text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all pr-10"
                    >
                      {(['Leadership', 'Technical', 'Design', 'Content', 'Outreach'] as Division[]).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
                {/* Photo */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Photo
                  </label>
                  <label className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 bg-white/50 cursor-pointer hover:border-blue-400 transition-colors">
                    {photoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photoPreview}
                        alt="preview"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      ) : (
                        <ImagePlus size={18} className="text-gray-400" />
                      )}
                    <span className="text-sm text-gray-400">
                      {uploadingPhoto ? 'Uploading to cloud...' : photoPreview ? 'Change photo' : 'Upload photo'}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} disabled={uploadingPhoto} />
                  </label>
                </div>
                {/* Bio — full width */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label
                    htmlFor="bio"
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setField('bio', e.target.value)}
                    placeholder="Short 1–2 sentence bio…"
                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 text-sm text-gray-800 placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                </div>
                {/* Social links */}
                <Field
                  label="GitHub URL"
                  id="github"
                  value={form.github}
                  onChange={(v) => setField('github', v)}
                  placeholder="https://github.com/…"
                />
                <Field
                  label="LinkedIn URL"
                  id="linkedin"
                  value={form.linkedin}
                  onChange={(v) => setField('linkedin', v)}
                  placeholder="https://linkedin.com/in/…"
                />
                <Field
                  label="Twitter / X URL"
                  id="twitter"
                  value={form.twitter}
                  onChange={(v) => setField('twitter', v)}
                  placeholder="https://twitter.com/…"
                />
                {/* Actions */}
                <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 active:scale-95 transition-all"
                  >
                    {editingId ? 'Save Changes' : 'Add Member'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Member Table ────────────────────────────────────────────────── */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2rem] overflow-hidden shadow-lg">
          {/* Table header */}
          <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              All Members{' '}
              <span className="text-xs font-semibold text-gray-400 ml-2">({members.length})</span>
            </h2>
          </div>

          {members.length === 0 ? (
            <div className="py-20 text-center text-gray-300">
              <p className="text-sm">No members yet. Add one above.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <AnimatePresence>
                {members.map((member) => (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-5 px-8 py-5 hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* Thumbnail */}
                    <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                      {member.photoUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{member.name}</p>
                      <p className="text-xs text-gray-400 truncate">{member.role}</p>
                    </div>

                    {/* Division badge */}
                    <span
                      className={`hidden sm:inline-block text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${DIVISION_COLORS[member.division]}`}
                    >
                      {member.division}
                    </span>

                    {/* Social icons */}
                    <div className="hidden md:flex items-center gap-2 text-gray-300">
                      {member.github && <Github size={14} />}
                      {member.linkedin && <Linkedin size={14} />}
                      {member.twitter && <Twitter size={14} />}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {deleteConfirm === member.id ? (
                        <>
                          <span className="text-xs text-red-500 font-semibold mr-1">Remove?</span>
                          <button
                            onClick={() => handleRemove(member.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-all"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-all"
                          >
                            No
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(member)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                            aria-label="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(member.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                            aria-label="Remove"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-300 mt-8">
          Changes are local to this session — connect to a database to persist data.
        </p>
      </div>
      </div>
    </AdminLayout>
  );
}
