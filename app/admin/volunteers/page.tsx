'use client';



import React, { useEffect, useState, useMemo } from 'react';

import AdminLayout from '@/components/AdminLayout';

import { getCollection, saveCollection, deleteDocument, logActivity } from '@/lib/db';

import {

  CheckCircle,

  XCircle,

  Trash2,

  Mail,

  Search,

  Filter,

  Eye,

  Phone,

  Calendar,

  Clock,

  Sparkles,

  User,
  Users,

  BookOpen,

  Send,

  X,

  ExternalLink,

  MessageSquare,

  AlertCircle,

  CheckCircle2,

  Image as ImageIcon,

  Link as LinkIcon,

  HelpCircle,

  Loader2,

  ChevronRight,

  GraduationCap

} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';



interface VolunteerData {

  id: string;

  fullName: string;

  email: string;

  phone: string;

  department: string;

  year: string;

  role: string;

  whyVolunteer: string;

  skills: string;

  availability: string[];

  status: string;

  date: string;

}



const ROLE_LABELS: Record<string, string> = {

  'dev-rel': 'Dev Rel',

  'events': 'Events',

  'content': 'Content',

  'technical': 'Technical',

  'design': 'Design',

  'general': 'General',

  'general-open': 'General Volunteer',

};



const ROLE_COLORS: Record<string, string> = {

  'dev-rel': 'bg-blue-500/10 text-blue-400 border-blue-500/20',

  'events': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',

  'content': 'bg-amber-500/10 text-amber-400 border-amber-500/20',

  'technical': 'bg-rose-500/10 text-rose-400 border-rose-500/20',

  'design': 'bg-purple-500/10 text-purple-400 border-purple-500/20',

  'general': 'bg-pink-500/10 text-pink-400 border-pink-500/20',

  'general-open': 'bg-pink-500/10 text-pink-400 border-pink-500/20',

};



export default function AdminVolunteersPage() {

  const [volunteers, setVolunteers] = useState<VolunteerData[]>([]);

  const [searchQuery, setSearchQuery] = useState('');

  const [statusFilter, setStatusFilter] = useState<'all' | 'New' | 'Approved' | 'Rejected'>('all');

  const [roleFilter, setRoleFilter] = useState<string>('all');

  const [selectedIds, setSelectedIds] = useState<string[]>([]);



  // Modals & Drawers

  const [detailVolunteer, setDetailVolunteer] = useState<VolunteerData | null>(null);

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);



  // Email state

  const [emailAudience, setEmailAudience] = useState<'all' | 'selected' | 'Approved' | 'New' | 'Rejected'>('all');

  const [emailRoleFilter, setEmailRoleFilter] = useState<string>('all');

  const [emailSubject, setEmailSubject] = useState('');

  const [emailContent, setEmailContent] = useState('');

  const [emailTab, setEmailTab] = useState<'edit' | 'preview'>('edit');

  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const [emailSuccessMessage, setEmailSuccessMessage] = useState<string | null>(null);

  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(null);



  useEffect(() => {

    getCollection('gdgoc_volunteers')

      .then((data) => {

        if (data && Array.isArray(data)) {

          // Strictly filter out any old dummy/mock entry

          const realOnly = (data as VolunteerData[]).filter(

            (v) => !(v.id === '1' && v.fullName === 'Ada Okonkwo')

          );

          setVolunteers(realOnly);

        } else {

          setVolunteers([]);

        }

      })

      .catch((err) => {

        console.error('Failed to load volunteers from db:', err);

        setVolunteers([]);

      });

  }, []);



  // Filtered list

  const filteredVolunteers = useMemo(() => {

    return volunteers.filter((vol) => {

      const q = searchQuery.toLowerCase().trim();

      const matchesSearch =

        !q ||

        vol.fullName.toLowerCase().includes(q) ||

        vol.email.toLowerCase().includes(q) ||

        (vol.phone && vol.phone.toLowerCase().includes(q)) ||

        vol.department.toLowerCase().includes(q) ||

        vol.role.toLowerCase().includes(q) ||

        (vol.skills && vol.skills.toLowerCase().includes(q));



      const matchesStatus =

        statusFilter === 'all' ||

        (statusFilter === 'New' && (vol.status === 'New' || vol.status === 'Pending Review' || vol.status === 'Pending')) ||

        (statusFilter === 'Approved' && vol.status.toLowerCase().includes('approved')) ||

        (statusFilter === 'Rejected' && vol.status.toLowerCase().includes('rejected'));



      const matchesRole =

        roleFilter === 'all' || vol.role.toLowerCase() === roleFilter.toLowerCase();



      return matchesSearch && matchesStatus && matchesRole;

    });

  }, [volunteers, searchQuery, statusFilter, roleFilter]);



  // Handle individual actions

  const handleApprove = (id: string) => {

    setVolunteers((prev) => {

      const updated = prev.map((v) => (v.id === id ? { ...v, status: 'Reviewed - Approved' } : v));

      saveCollection('gdgoc_volunteers', updated);

      return updated;

    });

    if (detailVolunteer?.id === id) {

      setDetailVolunteer((prev) => (prev ? { ...prev, status: 'Reviewed - Approved' } : null));

    }

    logActivity('Approved volunteer application', 'volunteer');

  };



  const handleReject = (id: string) => {

    setVolunteers((prev) => {

      const updated = prev.map((v) => (v.id === id ? { ...v, status: 'Reviewed - Rejected' } : v));

      saveCollection('gdgoc_volunteers', updated);

      return updated;

    });

    if (detailVolunteer?.id === id) {

      setDetailVolunteer((prev) => (prev ? { ...prev, status: 'Reviewed - Rejected' } : null));

    }

    logActivity('Rejected volunteer application', 'volunteer');

  };



  const handleDelete = (id: string) => {

    if (!confirm('Are you sure you want to permanently delete this application?')) return;

    deleteDocument('gdgoc_volunteers', id);

    setVolunteers((prev) => {

      const updated = prev.filter((v) => v.id !== id);

      saveCollection('gdgoc_volunteers', updated);

      return updated;

    });

    if (detailVolunteer?.id === id) {

      setDetailVolunteer(null);

    }

    setSelectedIds((prev) => prev.filter((item) => item !== id));

  };



  // Selection handlers

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.checked) {

      setSelectedIds(filteredVolunteers.map((v) => v.id));

    } else {

      setSelectedIds([]);

    }

  };



  const handleToggleSelect = (id: string) => {

    setSelectedIds((prev) =>

      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]

    );

  };



  // Calculate target recipients for email modal

  const targetRecipients = useMemo(() => {

    let pool = volunteers;



    if (emailAudience === 'selected') {

      pool = volunteers.filter((v) => selectedIds.includes(v.id));

    } else if (emailAudience === 'New') {

      pool = volunteers.filter(

        (v) => v.status === 'New' || v.status === 'Pending Review' || v.status === 'Pending'

      );

    } else if (emailAudience === 'Approved') {

      pool = volunteers.filter((v) => v.status.toLowerCase().includes('approved'));

    } else if (emailAudience === 'Rejected') {

      pool = volunteers.filter((v) => v.status.toLowerCase().includes('rejected'));

    }



    if (emailRoleFilter !== 'all') {

      pool = pool.filter((v) => v.role.toLowerCase() === emailRoleFilter.toLowerCase());

    }



    return pool.map((v) => ({ email: v.email, name: v.fullName }));

  }, [volunteers, emailAudience, selectedIds, emailRoleFilter]);



  // Open email modal for specific single volunteer

  const handleOpenEmailForOne = (volunteer: VolunteerData) => {

    setSelectedIds([volunteer.id]);

    setEmailAudience('selected');

    setEmailSubject(`Update regarding your GDGOC UNIBEN Volunteer Application`);

    setEmailContent(

      `<p>Hi {{name}},</p>\n<p>Thank you for applying to volunteer with GDG on Campus University of Benin for the <strong>${

        ROLE_LABELS[volunteer.role] || volunteer.role

      }</strong> role.</p>\n<p>We are excited to connect with you regarding the next steps.</p>\n<p>Best regards,<br><strong>GDG on Campus UNIBEN Team</strong></p>`

    );

    setEmailSuccessMessage(null);

    setEmailErrorMessage(null);

    setIsEmailModalOpen(true);

  };



  // Open mass email modal

  const handleOpenMassEmail = () => {

    if (selectedIds.length > 0) {

      setEmailAudience('selected');

    } else {

      setEmailAudience('all');

    }

    if (!emailSubject) {

      setEmailSubject('Important Update from GDG on Campus UNIBEN');

    }

    if (!emailContent) {

      setEmailContent(

        `<p>Hello {{name}},</p>\n<p>Thank you for expressing your interest and volunteering with <strong>Google Developer Groups on Campus — UNIBEN</strong>!</p>\n<p>We would love to share an exciting update regarding our upcoming community activities and your role.</p>\n<p>Stay tuned for more details and feel free to reply to this email if you have any questions.</p>\n<p>Warm regards,<br><strong>GDG on Campus UNIBEN Team</strong></p>`

      );

    }

    setEmailSuccessMessage(null);

    setEmailErrorMessage(null);

    setIsEmailModalOpen(true);

  };



  // Insert helpers into email content

  const handleInsertHelper = (snippet: string) => {

    setEmailContent((prev) => prev + snippet);

  };



  // Send Email API Call

  const handleSendEmail = async () => {

    if (targetRecipients.length === 0) {

      setEmailErrorMessage('No recipients match the selected audience filter.');

      return;

    }

    if (!emailSubject.trim()) {

      setEmailErrorMessage('Please provide an email subject.');

      return;

    }

    if (!emailContent.trim()) {

      setEmailErrorMessage('Please enter email content.');

      return;

    }



    setIsSendingEmail(true);

    setEmailSuccessMessage(null);

    setEmailErrorMessage(null);



    try {

      const response = await fetch('/api/admin/volunteers/email', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({

          recipients: targetRecipients,

          subject: emailSubject,

          messageHtml: emailContent,

        }),

      });



      const data = await response.json();



      if (!response.ok) {

        throw new Error(data.error || 'Failed to send emails.');

      }



      setEmailSuccessMessage(

        `Successfully sent email to ${data.sentCount} of ${data.total} volunteer${

          data.total === 1 ? '' : 's'

        }!`

      );

      logActivity(`Sent mass email to ${data.sentCount} volunteers`, 'volunteer');

    } catch (err: any) {

      console.error('Error sending email:', err);

      setEmailErrorMessage(err.message || 'Error sending email. Please check your SMTP settings.');

    } finally {

      setIsSendingEmail(false);

    }

  };



  return (

    <AdminLayout activePage="volunteers">

      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">

        

        {/* ── Top Header ─────────────────────────────────────────── */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">

              Volunteer Applications

              <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-mono font-medium">

                {volunteers.length} Total

              </span>

            </h1>

            <p className="text-gray-400 text-sm mt-1">

              Review, filter, inspect volunteer details, and dispatch personalized emails.

            </p>

          </div>



          <div className="flex items-center gap-3">

            <button

              onClick={handleOpenMassEmail}

              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95"

            >

              <Mail className="w-4 h-4" />

              {selectedIds.length > 0 ? `Email Selected (${selectedIds.length})` : 'Send Mass Email'}

            </button>

          </div>

        </div>



        {/* ── Filters & Search Bar ──────────────────────────────── */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#111111] border border-white/10 rounded-2xl p-4">

          {/* Search */}

          <div className="relative">

            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

            <input

              type="text"

              value={searchQuery}

              onChange={(e) => setSearchQuery(e.target.value)}

              placeholder="Search by name, email, skills..."

              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"

            />

          </div>



          {/* Status Filter */}

          <div className="flex items-center gap-2">

            <Filter className="w-4 h-4 text-gray-500 shrink-0" />

            <select

              value={statusFilter}

              onChange={(e: any) => setStatusFilter(e.target.value)}

              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-blue-500/50"

            >

              <option value="all" className="bg-[#1a1a1a]">All Statuses</option>

              <option value="New" className="bg-[#1a1a1a]">Pending / New</option>

              <option value="Approved" className="bg-[#1a1a1a]">Approved</option>

              <option value="Rejected" className="bg-[#1a1a1a]">Rejected</option>

            </select>

          </div>



          {/* Role Filter */}

          <div>

            <select

              value={roleFilter}

              onChange={(e) => setRoleFilter(e.target.value)}

              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-blue-500/50"

            >

              <option value="all" className="bg-[#1a1a1a]">All Roles</option>

              <option value="dev-rel" className="bg-[#1a1a1a]">Dev Rel</option>

              <option value="events" className="bg-[#1a1a1a]">Events</option>

              <option value="content" className="bg-[#1a1a1a]">Content</option>

              <option value="technical" className="bg-[#1a1a1a]">Technical</option>

              <option value="design" className="bg-[#1a1a1a]">Design</option>

              <option value="general" className="bg-[#1a1a1a]">General</option>

            </select>

          </div>



          {/* Selection indicator */}

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-gray-400">

            <span>

              Showing <strong className="text-white">{filteredVolunteers.length}</strong> of{' '}

              <strong className="text-white">{volunteers.length}</strong>

            </span>

            {selectedIds.length > 0 && (

              <button

                onClick={() => setSelectedIds([])}

                className="text-blue-400 hover:text-blue-300 underline"

              >

                Clear ({selectedIds.length})

              </button>

            )}

          </div>

        </div>



        {/* ── Table Container ───────────────────────────────────── */}

        <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">

          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm text-gray-300">

              <thead className="bg-white/5 text-gray-400 uppercase text-xs border-b border-white/10 select-none">

                <tr>

                  <th className="px-4 py-3.5 w-10 text-center">

                    <input

                      type="checkbox"

                      checked={

                        filteredVolunteers.length > 0 &&

                        selectedIds.length === filteredVolunteers.length

                      }

                      onChange={handleSelectAll}

                      className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-0 cursor-pointer"

                    />

                  </th>

                  <th className="px-5 py-3.5 font-semibold">Name & Contact</th>

                  <th className="px-5 py-3.5 font-semibold">Department & Level</th>

                  <th className="px-5 py-3.5 font-semibold">Role</th>

                  <th className="px-5 py-3.5 font-semibold">Status</th>

                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>

                </tr>

              </thead>

              <tbody className="divide-y divide-white/5">

                {filteredVolunteers.length === 0 ? (

                  <tr>

                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">

                      <div className="max-w-xs mx-auto space-y-2">

                        <Users className="w-8 h-8 mx-auto text-gray-600" />

                        <p className="font-medium text-gray-400">No applications found</p>

                        <p className="text-xs text-gray-600">

                          Try adjusting your search query or status and role filters.

                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  filteredVolunteers.map((vol) => {

                    const isSelected = selectedIds.includes(vol.id);

                    const isApproved = vol.status.toLowerCase().includes('approved');

                    const isRejected = vol.status.toLowerCase().includes('rejected');

                    const isNew = !isApproved && !isRejected;



                    return (

                      <motion.tr

                        key={vol.id}

                        initial={{ opacity: 0 }}

                        animate={{ opacity: 1 }}

                        className={`hover:bg-white/[0.04] transition-colors cursor-pointer group ${

                          isSelected ? 'bg-blue-500/[0.06]' : ''

                        }`}

                        onClick={() => setDetailVolunteer(vol)}

                      >

                        {/* Checkbox */}

                        <td

                          className="px-4 py-4 text-center"

                          onClick={(e) => e.stopPropagation()}

                        >

                          <input

                            type="checkbox"

                            checked={isSelected}

                            onChange={() => handleToggleSelect(vol.id)}

                            className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-0 cursor-pointer"

                          />

                        </td>



                        {/* Name & Contact */}

                        <td className="px-5 py-4">

                          <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">

                            {vol.fullName}

                          </div>

                          <div className="text-gray-400 text-xs flex items-center gap-2 mt-0.5">

                            <span>{vol.email}</span>

                          </div>

                          {vol.phone && (

                            <div className="text-gray-500 text-xs flex items-center gap-1.5 mt-0.5">

                              <Phone className="w-3 h-3 text-gray-500" />

                              <span>{vol.phone}</span>

                            </div>

                          )}

                        </td>



                        {/* Department & Level */}

                        <td className="px-5 py-4">

                          <div className="text-gray-200">{vol.department}</div>

                          <div className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">

                            <GraduationCap className="w-3 h-3 text-gray-500" />

                            {vol.year}

                          </div>

                        </td>



                        {/* Role */}

                        <td className="px-5 py-4">

                          <span

                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${

                              ROLE_COLORS[vol.role] || 'bg-white/10 text-gray-300 border-white/10'

                            }`}

                          >

                            {ROLE_LABELS[vol.role] || vol.role}

                          </span>

                        </td>



                        {/* Status */}

                        <td className="px-5 py-4">

                          <span

                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${

                              isApproved

                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'

                                : isRejected

                                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'

                                : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'

                            }`}

                          >

                            <span

                              className={`w-1.5 h-1.5 rounded-full ${

                                isApproved

                                  ? 'bg-emerald-400'

                                  : isRejected

                                  ? 'bg-rose-400'

                                  : 'bg-blue-400 animate-pulse'

                              }`}

                            />

                            {isApproved

                              ? 'Approved'

                              : isRejected

                              ? 'Rejected'

                              : 'Pending Review'}

                          </span>

                        </td>



                        {/* Actions */}

                        <td

                          className="px-5 py-4 text-right"

                          onClick={(e) => e.stopPropagation()}

                        >

                          <div className="flex items-center justify-end gap-1.5">

                            {/* View Details */}

                            <button

                              onClick={() => setDetailVolunteer(vol)}

                              className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"

                              title="View Full Application Details"

                            >

                              <Eye size={17} />

                            </button>



                            {/* Email single volunteer */}

                            <button

                              onClick={() => handleOpenEmailForOne(vol)}

                              className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"

                              title="Send Email"

                            >

                              <Mail size={17} />

                            </button>



                            {/* Approve */}

                            <button

                              onClick={() => handleApprove(vol.id)}

                              className="p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"

                              title="Approve Application"

                            >

                              <CheckCircle size={17} />

                            </button>



                            {/* Reject */}

                            <button

                              onClick={() => handleReject(vol.id)}

                              className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"

                              title="Reject Application"

                            >

                              <XCircle size={17} />

                            </button>



                            {/* Delete */}

                            <button

                              onClick={() => handleDelete(vol.id)}

                              className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-red-500/20 rounded-lg transition-colors"

                              title="Delete Application"

                            >

                              <Trash2 size={17} />

                            </button>

                          </div>

                        </td>

                      </motion.tr>

                    );

                  })

                )}

              </tbody>

            </table>

          </div>

        </div>



        {/* ── Detail Drawer Modal (Shows ALL Volunteer Form Details) ── */}

        <AnimatePresence>

          {detailVolunteer && (

            <motion.div

              initial={{ opacity: 0 }}

              animate={{ opacity: 1 }}

              exit={{ opacity: 0 }}

              onClick={() => setDetailVolunteer(null)}

              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md"

            >

              <motion.div

                initial={{ scale: 0.95, opacity: 0, y: 15 }}

                animate={{ scale: 1, opacity: 1, y: 0 }}

                exit={{ scale: 0.95, opacity: 0, y: 15 }}

                onClick={(e) => e.stopPropagation()}

                className="relative w-full max-w-2xl bg-[#141414] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"

              >

                {/* Header */}

                <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">

                      {detailVolunteer.fullName.slice(0, 2).toUpperCase()}

                    </div>

                    <div>

                      <h2 className="text-xl font-bold text-white leading-tight">

                        {detailVolunteer.fullName}

                      </h2>

                      <p className="text-xs text-gray-400 mt-0.5">

                        Applied for{' '}

                        <span className="text-blue-400 font-semibold">

                          {ROLE_LABELS[detailVolunteer.role] || detailVolunteer.role}

                        </span>{' '}

                        · {new Date(detailVolunteer.date || Date.now()).toLocaleDateString()}

                      </p>

                    </div>

                  </div>



                  <button

                    onClick={() => setDetailVolunteer(null)}

                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"

                  >

                    <X className="w-5 h-5" />

                  </button>

                </div>



                {/* Body Content - Scrollable */}

                <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-300">

                  {/* Status Banner */}

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">

                    <div className="flex items-center gap-2">

                      <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">

                        Application Status:

                      </span>

                      <span

                        className={`text-xs font-bold px-3 py-1 rounded-full ${

                          detailVolunteer.status.toLowerCase().includes('approved')

                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'

                            : detailVolunteer.status.toLowerCase().includes('rejected')

                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'

                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'

                        }`}

                      >

                        {detailVolunteer.status}

                      </span>

                    </div>



                    <div className="flex items-center gap-2">

                      <button

                        onClick={() => handleApprove(detailVolunteer.id)}

                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition"

                      >

                        Approve

                      </button>

                      <button

                        onClick={() => handleReject(detailVolunteer.id)}

                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 transition"

                      >

                        Reject

                      </button>

                    </div>

                  </div>



                  {/* Contact & Academic Grid */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">

                      <span className="text-xs uppercase font-semibold tracking-wider text-gray-400 flex items-center gap-1.5">

                        <User className="w-3.5 h-3.5 text-blue-400" /> Contact Details

                      </span>

                      <div className="space-y-1.5">

                        <div className="flex items-center justify-between text-xs">

                          <span className="text-gray-500">Email:</span>

                          <a

                            href={`mailto:${detailVolunteer.email}`}

                            className="text-blue-400 hover:underline font-medium"

                          >

                            {detailVolunteer.email}

                          </a>

                        </div>

                        <div className="flex items-center justify-between text-xs">

                          <span className="text-gray-500">Phone:</span>

                          <span className="font-mono text-gray-200">

                            {detailVolunteer.phone || 'Not provided'}

                          </span>

                        </div>

                        {detailVolunteer.phone && (

                          <div className="pt-2 flex gap-2">

                            <a

                              href={`tel:${detailVolunteer.phone}`}

                              className="flex-1 text-center py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-gray-300 transition"

                            >

                              Call

                            </a>

                            <a

                              href={`https://wa.me/${detailVolunteer.phone.replace(/[^0-9]/g, '')}`}

                              target="_blank"

                              rel="noreferrer"

                              className="flex-1 text-center py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-lg text-xs font-medium transition"

                            >

                              WhatsApp

                            </a>

                          </div>

                        )}

                      </div>

                    </div>



                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">

                      <span className="text-xs uppercase font-semibold tracking-wider text-gray-400 flex items-center gap-1.5">

                        <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> Academic Info

                      </span>

                      <div className="space-y-1.5">

                        <div className="flex items-center justify-between text-xs">

                          <span className="text-gray-500">Department:</span>

                          <span className="font-medium text-gray-200">

                            {detailVolunteer.department}

                          </span>

                        </div>

                        <div className="flex items-center justify-between text-xs">

                          <span className="text-gray-500">Year / Level:</span>

                          <span className="font-medium text-gray-200">

                            {detailVolunteer.year}

                          </span>

                        </div>

                        <div className="flex items-center justify-between text-xs">

                          <span className="text-gray-500">Target Role:</span>

                          <span className="font-semibold text-blue-400">

                            {ROLE_LABELS[detailVolunteer.role] || detailVolunteer.role}

                          </span>

                        </div>

                      </div>

                    </div>

                  </div>



                  {/* Why Volunteer (Full detail) */}

                  <div className="space-y-2">

                    <span className="text-xs uppercase font-semibold tracking-wider text-gray-400 flex items-center gap-1.5">

                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Why They Want to Volunteer

                    </span>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-200 leading-relaxed text-sm whitespace-pre-wrap">

                      {detailVolunteer.whyVolunteer || 'No response provided.'}

                    </div>

                  </div>



                  {/* Relevant Skills & Experience (Full detail) */}

                  <div className="space-y-2">

                    <span className="text-xs uppercase font-semibold tracking-wider text-gray-400 flex items-center gap-1.5">

                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Relevant Skills & Experience

                    </span>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-200 leading-relaxed text-sm whitespace-pre-wrap">

                      {detailVolunteer.skills || 'No skills or past experience listed.'}

                    </div>

                  </div>



                  {/* Availability (Full detail) */}

                  <div className="space-y-2">

                    <span className="text-xs uppercase font-semibold tracking-wider text-gray-400 flex items-center gap-1.5">

                      <Clock className="w-3.5 h-3.5 text-blue-400" /> Availability

                    </span>

                    <div className="flex flex-wrap gap-2">

                      {detailVolunteer.availability && detailVolunteer.availability.length > 0 ? (

                        detailVolunteer.availability.map((slot) => (

                          <span

                            key={slot}

                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300"

                          >

                            {slot}

                          </span>

                        ))

                      ) : (

                        <span className="text-xs text-gray-500">Flexible / Not specified</span>

                      )}

                    </div>

                  </div>

                </div>



                {/* Footer Actions */}

                <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">

                  <button

                    onClick={() => handleDelete(detailVolunteer.id)}

                    className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition"

                  >

                    <Trash2 className="w-3.5 h-3.5" /> Delete Application

                  </button>



                  <div className="flex items-center gap-3">

                    <button

                      onClick={() => {

                        const target = detailVolunteer;

                        setDetailVolunteer(null);

                        handleOpenEmailForOne(target);

                      }}

                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"

                    >

                      <Mail className="w-3.5 h-3.5" />

                      Email This Volunteer

                    </button>

                  </div>

                </div>

              </motion.div>

            </motion.div>

          )}

        </AnimatePresence>



        {/* ── Mass Email Compose Modal ──────────────────────────── */}

        <AnimatePresence>

          {isEmailModalOpen && (

            <motion.div

              initial={{ opacity: 0 }}

              animate={{ opacity: 1 }}

              exit={{ opacity: 0 }}

              onClick={() => {

                if (!isSendingEmail) setIsEmailModalOpen(false);

              }}

              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-md"

            >

              <motion.div

                initial={{ scale: 0.95, opacity: 0, y: 15 }}

                animate={{ scale: 1, opacity: 1, y: 0 }}

                exit={{ scale: 0.95, opacity: 0, y: 15 }}

                onClick={(e) => e.stopPropagation()}

                className="relative w-full max-w-3xl bg-[#141414] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"

              >

                {/* Modal Header */}

                <div className="p-5 sm:p-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">

                      <Mail className="w-5 h-5" />

                    </div>

                    <div>

                      <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">

                        Compose Broadcast Email

                      </h2>

                      <p className="text-xs text-gray-400 mt-0.5">

                        Sending via official sender{' '}

                        <strong className="text-white">yemuelinc@gmail.com</strong>

                      </p>

                    </div>

                  </div>



                  <button

                    disabled={isSendingEmail}

                    onClick={() => setIsEmailModalOpen(false)}

                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition disabled:opacity-50"

                  >

                    <X className="w-5 h-5" />

                  </button>

                </div>



                {/* Modal Body */}

                <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">

                  {/* Status Alerts */}

                  {emailSuccessMessage && (

                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-start gap-3">

                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />

                      <div>

                        <p className="font-semibold">{emailSuccessMessage}</p>

                        <p className="text-xs text-emerald-400/80 mt-0.5">

                          The emails have been delivered to the selected recipients.

                        </p>

                      </div>

                    </div>

                  )}



                  {emailErrorMessage && (

                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-start gap-3">

                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

                      <div>

                        <p className="font-semibold">Delivery Issue</p>

                        <p className="text-xs text-rose-400/90 mt-0.5">{emailErrorMessage}</p>

                      </div>

                    </div>

                  )}



                  {/* Audience Selector & Target Preview */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">

                    <div>

                      <label className="block text-xs uppercase font-semibold text-gray-400 tracking-wider mb-1.5">

                        Recipient Group

                      </label>

                      <select

                        value={emailAudience}

                        onChange={(e: any) => setEmailAudience(e.target.value)}

                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-blue-500"

                      >

                        <option value="all" className="bg-[#1a1a1a]">All Volunteers ({volunteers.length})</option>

                        {selectedIds.length > 0 && (

                          <option value="selected" className="bg-[#1a1a1a]">

                            Selected Checkboxes ({selectedIds.length})

                          </option>

                        )}

                        <option value="Approved" className="bg-[#1a1a1a]">Approved Applicants</option>

                        <option value="New" className="bg-[#1a1a1a]">Pending / New Applicants</option>

                        <option value="Rejected" className="bg-[#1a1a1a]">Rejected Applicants</option>

                      </select>

                    </div>



                    <div>

                      <label className="block text-xs uppercase font-semibold text-gray-400 tracking-wider mb-1.5">

                        Filter by Volunteer Role

                      </label>

                      <select

                        value={emailRoleFilter}

                        onChange={(e) => setEmailRoleFilter(e.target.value)}

                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-blue-500"

                      >

                        <option value="all" className="bg-[#1a1a1a]">All Roles</option>

                        <option value="dev-rel" className="bg-[#1a1a1a]">Dev Rel</option>

                        <option value="events" className="bg-[#1a1a1a]">Events</option>

                        <option value="content" className="bg-[#1a1a1a]">Content</option>

                        <option value="technical" className="bg-[#1a1a1a]">Technical</option>

                        <option value="design" className="bg-[#1a1a1a]">Design</option>

                        <option value="general" className="bg-[#1a1a1a]">General</option>

                      </select>

                    </div>



                    <div className="col-span-1 sm:col-span-2 pt-1 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">

                      <span>

                        Targeting:{' '}

                        <strong className="text-blue-400 font-semibold">

                          {targetRecipients.length} volunteer{targetRecipients.length === 1 ? '' : 's'}

                        </strong>

                      </span>

                      <span className="truncate max-w-xs text-gray-500">

                        {targetRecipients.slice(0, 3).map((r) => r.name?.split(' ')[0] || r.email).join(', ')}

                        {targetRecipients.length > 3 ? ` +${targetRecipients.length - 3} more` : ''}

                      </span>

                    </div>

                  </div>



                  {/* Subject Line */}

                  <div>

                    <label className="block text-xs uppercase font-semibold text-gray-400 tracking-wider mb-1.5">

                      Email Subject *

                    </label>

                    <input

                      type="text"

                      value={emailSubject}

                      onChange={(e) => setEmailSubject(e.target.value)}

                      placeholder="e.g. Welcome to GDGOC UNIBEN Volunteers!"

                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"

                    />

                  </div>



                  {/* Formatting Toolbar */}

                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white/[0.02] border border-white/10 rounded-xl">

                    <button

                      type="button"

                      onClick={() => handleInsertHelper('{{name}}')}

                      className="px-2.5 py-1 text-xs rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 font-mono transition"

                      title="Insert personalized volunteer name"

                    >

                      + Name

                    </button>

                    <button

                      type="button"

                      onClick={() => handleInsertHelper('<p><strong>Your Heading Here</strong></p>\n')}

                      className="px-2.5 py-1 text-xs rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 transition"

                    >

                      Heading

                    </button>

                    <button

                      type="button"

                      onClick={() => handleInsertHelper('<p>Write your paragraph here...</p>\n')}

                      className="px-2.5 py-1 text-xs rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 transition"

                    >

                      Paragraph

                    </button>

                    <button

                      type="button"

                      onClick={() => {

                        const url = prompt('Enter link URL (e.g. https://gdgocuniben.com):');

                        const text = prompt('Enter link text:', 'Click here');

                        if (url) {

                          handleInsertHelper(`<a href="${url}">${text || url}</a>`);

                        }

                      }}

                      className="px-2.5 py-1 text-xs rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 transition flex items-center gap-1"

                    >

                      <LinkIcon className="w-3 h-3" /> Link

                    </button>

                    <button

                      type="button"

                      onClick={() => {

                        const url = prompt('Enter image URL:');

                        if (url) {

                          handleInsertHelper(`<img src="${url}" alt="Event Photo" />\n`);

                        }

                      }}

                      className="px-2.5 py-1 text-xs rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 transition flex items-center gap-1"

                    >

                      <ImageIcon className="w-3 h-3" /> Image

                    </button>

                    <button

                      type="button"

                      onClick={() => {

                        const url = prompt('Enter button URL:');

                        const label = prompt('Enter button label:', 'Join WhatsApp Group');

                        if (url) {

                          handleInsertHelper(

                            `<div class="btn-container"><a href="${url}" class="btn">${label || 'View Details'}</a></div>\n`

                          );

                        }

                      }}

                      className="px-2.5 py-1 text-xs rounded-lg bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 border border-indigo-500/30 transition font-semibold"

                    >

                      + Button

                    </button>

                  </div>



                  {/* Tabs: Write vs Preview */}

                  <div className="space-y-2">

                    <div className="flex items-center justify-between">

                      <div className="flex gap-2">

                        <button

                          type="button"

                          onClick={() => setEmailTab('edit')}

                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${

                            emailTab === 'edit'

                              ? 'bg-blue-600 text-white'

                              : 'bg-white/5 text-gray-400 hover:text-white'

                          }`}

                        >

                          Write (HTML / Text)

                        </button>

                        <button

                          type="button"

                          onClick={() => setEmailTab('preview')}

                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${

                            emailTab === 'preview'

                              ? 'bg-blue-600 text-white'

                              : 'bg-white/5 text-gray-400 hover:text-white'

                          }`}

                        >

                          Live Template Preview

                        </button>

                      </div>



                      <span className="text-[11px] text-gray-500">

                        Supports HTML tags, images, links, and custom styling

                      </span>

                    </div>



                    {emailTab === 'edit' ? (

                      <textarea

                        rows={9}

                        value={emailContent}

                        onChange={(e) => setEmailContent(e.target.value)}

                        placeholder="Write your email here. Supports HTML like <p>, <strong>, <a href='...'>, <img src='...'>..."

                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-mono text-gray-200 focus:outline-none focus:border-blue-500 resize-none"

                      />

                    ) : (

                      /* Live Branded Email Preview */

                      <div className="border border-white/10 rounded-2xl p-4 bg-[#0a0a0a] max-h-80 overflow-y-auto">

                        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden text-slate-800">

                          {/* Accent Bar */}

                          <div

                            style={{

                              height: '5px',

                              background:

                                'linear-gradient(90deg, #4285F4 25%, #EA4335 25% 50%, #FBBC04 50% 75%, #34A853 75%)',

                            }}

                          />

                          {/* Header */}

                          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">

                            <span className="font-bold text-sm text-slate-900 tracking-tight">

                              <span className="text-[#4285F4]">G</span>

                              <span className="text-[#EA4335]">D</span>

                              <span className="text-[#FBBC04]">G</span> on Campus

                            </span>

                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-200">

                              UNIBEN Chapter

                            </span>

                          </div>

                          {/* Content */}

                          <div

                            className="p-5 text-xs leading-relaxed text-slate-600 space-y-3"

                            dangerouslySetInnerHTML={{

                              __html: emailContent.replace(/\{\{name\}\}/gi, volunteers[0]?.fullName?.split(' ')[0] || 'Volunteer'),

                            }}

                          />

                          {/* Footer */}

                          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center">

                            Google Developer Groups on Campus — University of Benin

                          </div>

                        </div>

                      </div>

                    )}

                  </div>

                </div>



                {/* Modal Footer */}

                <div className="p-4 sm:p-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">

                  <span className="text-xs text-gray-400">

                    Recipients:{' '}

                    <strong className="text-white">{targetRecipients.length}</strong>

                  </span>



                  <div className="flex items-center gap-3">

                    <button

                      type="button"

                      disabled={isSendingEmail}

                      onClick={() => setIsEmailModalOpen(false)}

                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs transition"

                    >

                      Close

                    </button>



                    <button

                      type="button"

                      disabled={isSendingEmail || targetRecipients.length === 0}

                      onClick={handleSendEmail}

                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"

                    >

                      {isSendingEmail ? (

                        <>

                          <Loader2 className="w-4 h-4 animate-spin" />

                          Sending Emails...

                        </>

                      ) : (

                        <>

                          <Send className="w-4 h-4" />

                          Send Broadcast ({targetRecipients.length})

                        </>

                      )}

                    </button>

                  </div>

                </div>

              </motion.div>

            </motion.div>

          )}

        </AnimatePresence>



      </div>

    </AdminLayout>

  );

}

