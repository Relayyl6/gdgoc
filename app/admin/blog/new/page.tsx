'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import {
  ArrowLeft,
  Save,
  FileText,
  LayoutDashboard,
  Calendar,
  Users,
  HandHeart,
  LogOut,
  Image as ImageIcon,
  CheckCircle,
  ChevronDown,
  Eye,
  Send,
  Upload,
  X,
} from 'lucide-react';
import { getCollection, saveCollection } from '@/lib/db';

// Dynamically import the editor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────

interface PostForm {
  title: string;
  category: string;
  author: string;
  authorRole: string;
  excerpt: string;
  keywords: string;
  coverImage: string;
  readTime: string;
  content: string;
  status: 'draft' | 'published';
}



// ─── Field helpers ────────────────────────────────────────────────────────────

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';

const labelCls = 'block text-xs font-medium text-gray-400 mb-1.5';

const CATEGORIES = ['Frontend', 'Backend', 'Android', 'AI', 'Design', 'Community'];

const EMPTY_FORM: PostForm = {
  title: '',
  category: 'Frontend',
  author: '',
  authorRole: '',
  excerpt: '',
  keywords: '',
  coverImage: '',
  readTime: '',
  content: '',
  status: 'published',
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NewBlogPostPage() {
  const router = useRouter();
  const [form, setForm] = useState<PostForm>(EMPTY_FORM);
  const [isVerifying, setIsVerifying] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [coverPreviewError, setCoverPreviewError] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auth check
  useEffect(() => {
    fetch('/api/admin/verify')
      .then((r) => r.json())
      .then((data) => {
        if (!data.isAdmin) router.push('/admin/login');
        else setIsVerifying(false);
      })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'coverImage') setCoverPreviewError(false);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContentChange = (html: string) => {
    setForm((prev) => ({ ...prev, content: html }));
  };

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, coverImage: url }));
    setCoverPreviewError(false);
  }

  function removeCover() {
    setForm((prev) => ({ ...prev, coverImage: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleSubmit = async (e: React.FormEvent, overrideStatus?: 'draft' | 'published') => {
    e.preventDefault();
    const status = overrideStatus ?? form.status;

    const id = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newPost = {
      id,
      ...form,
      status,
      date: new Date().toISOString().slice(0, 10),
      keywords: form.keywords
        .split(',')
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean),
    };

    try {
      await import('@/lib/db').then((db) => db.saveDocument('gdgoc_blog_posts', newPost.id, newPost));
    } catch {
      // ignore storage errors
    }

    showToast(status === 'draft' ? 'Draft saved!' : 'Post published successfully!');
    setTimeout(() => router.push('/admin/blog'), 1200);
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-sm animate-pulse">Verifying access…</div>
      </div>
    );
  }

  return (
    <AdminLayout activePage="blog">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -16, x: '-50%' }}
            className="fixed top-24 left-1/2 z-50 flex items-center gap-2.5 bg-green-600 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl"
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/blog"
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">New Blog Post</h1>
                <p className="text-gray-400 text-sm mt-0.5">Create and publish a new article</p>
              </div>
            </div>
            {/* Status toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 font-medium">Status:</span>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    status: prev.status === 'draft' ? 'published' : 'draft',
                  }))
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  form.status === 'published'
                    ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                    : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                }`}
              >
                {form.status === 'published' ? '● Published' : '◐ Draft'}
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ── Left: main content (2/3) ── */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <label className={labelCls}>
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="Your post title…"
                    className="w-full bg-transparent border-none text-white text-2xl font-bold placeholder-gray-600 focus:outline-none"
                  />
                </div>

                {/* Excerpt */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={labelCls.replace(' mb-1.5', '')}>Excerpt</label>
                    <span className={`text-xs ${form.excerpt.length > 200 ? 'text-red-400' : 'text-gray-500'}`}>
                      {form.excerpt.length}/200
                    </span>
                  </div>
                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    rows={3}
                    maxLength={200}
                    placeholder="A short description shown in the blog listing…"
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Rich Text Content */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <label className={labelCls}>
                    Content <span className="text-red-400">*</span>
                  </label>
                  {/* The RichTextEditor has a light background — wrap it */}
                  <div className="rounded-xl overflow-hidden">
                    <RichTextEditor
                      value={form.content}
                      onChange={handleContentChange}
                      placeholder="Start writing your article…"
                    />
                  </div>
                </div>
              </div>

              {/* ── Right: metadata sidebar (1/3) ── */}
              <div className="space-y-5">
                {/* Publish actions */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-white">Publish</h3>
                  <button
                    type="submit"
                    onClick={(e) => handleSubmit(e, 'published')}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow"
                  >
                    <Send className="w-4 h-4" />
                    Publish Post
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e as unknown as React.FormEvent, 'draft')}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-white/10"
                  >
                    <Save className="w-4 h-4" />
                    Save as Draft
                  </button>
                </div>

                {/* Category */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <label className={labelCls}>Category</label>
                  <div className="relative">
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className={`${inputCls} appearance-none pr-8`}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-gray-900">
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Author */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-white">Author</h3>
                  <div>
                    <label className={labelCls}>Name</label>
                    <input
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      placeholder="Author name…"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Role</label>
                    <input
                      name="authorRole"
                      value={form.authorRole}
                      onChange={handleChange}
                      placeholder="e.g. Technical Lead"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Keywords */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <label className={labelCls}>Keywords</label>
                  <input
                    name="keywords"
                    value={form.keywords}
                    onChange={handleChange}
                    placeholder="nextjs, react, api (comma-separated)"
                    className={inputCls}
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Used for related post matching</p>
                </div>

                {/* Cover Image */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <label className={labelCls}>Cover Image</label>
                  <AnimatePresence mode="wait">
                    {form.coverImage ? (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative mt-2"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={form.coverImage}
                          alt="Cover preview"
                          className="w-full h-32 object-cover rounded-xl border border-white/10"
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
                        className="mt-2"
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
                          className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-white/10 cursor-pointer hover:border-white/30 hover:bg-white/5 transition-all"
                        >
                          <Upload className="w-6 h-6 text-gray-400 mb-2" />
                          <p className="text-sm font-semibold text-gray-300">Click to upload</p>
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Read Time */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <label className={labelCls}>Estimated Read Time</label>
                  <input
                    name="readTime"
                    value={form.readTime}
                    onChange={handleChange}
                    placeholder="e.g. 5 min read"
                    className={inputCls}
                  />
                </div>

                {/* Preview link */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-xs text-gray-500 mb-3">After saving, view it at:</p>
                  <div className="text-xs text-blue-400 font-mono break-all">
                    /blog/
                    {form.title
                      ? form.title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '')
                      : 'post-slug'}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
    </AdminLayout>
  );
}
