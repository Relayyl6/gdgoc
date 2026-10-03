'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCollection, saveCollection, saveDocument, deleteDocument } from '@/lib/db';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Calendar, Clock, PenLine } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 'getting-started-gemini-api',
    title: 'Getting Started with the Gemini API in Next.js',
    excerpt: "A step-by-step guide to integrating Google's Gemini API into your Next.js 14 app using the App Router.",
    category: 'Frontend',
    author: 'Chidi Okonkwo',
    authorRole: 'Technical Lead',
    date: '2026-09-28',
    readTime: '8 min read',
  },
  {
    id: 'android-jetpack-compose-intro',
    title: 'Building Beautiful UIs with Jetpack Compose',
    excerpt: 'Jetpack Compose is the modern toolkit for building native Android UIs. Here is how we used it for our Solution Challenge project.',
    category: 'Android',
    author: 'Ngozi Eze',
    authorRole: 'Android Developer',
    date: '2026-09-20',
    readTime: '6 min read',
  },
  {
    id: 'ai-ml-study-jam-recap',
    title: 'AI/ML Study Jam Recap: What We Learned',
    excerpt: 'A comprehensive recap of our Google AI Essentials Study Jam, covering key takeaways from 3 weeks of collaborative learning.',
    category: 'AI',
    author: 'Emeka Nwachukwu',
    authorRole: 'Content Lead',
    date: '2026-09-10',
    readTime: '5 min read',
  },
  {
    id: 'figma-to-code-workflow',
    title: 'From Figma to Code: Our Design-Dev Workflow',
    excerpt: 'How the GDGOC Design Team collaborates with developers to ship polished UIs. Our complete design-to-code process.',
    category: 'Design',
    author: 'Adaeze Obi',
    authorRole: 'Design Lead',
    date: '2026-08-30',
    readTime: '7 min read',
  },
  {
    id: 'backend-fastapi-cloud-run',
    title: 'Deploying FastAPI to Google Cloud Run',
    excerpt: 'We deployed our Solution Challenge backend using FastAPI and Google Cloud Run. Here is our step-by-step deployment guide.',
    category: 'Backend',
    author: 'Praise Ehigie',
    authorRole: 'Backend Developer',
    date: '2026-08-15',
    readTime: '10 min read',
  },
  {
    id: 'devfest-2025-recap',
    title: 'DevFest UNIBEN 2025: A Year in Review',
    excerpt: 'Reliving the highlights of our biggest event yet. 400+ attendees, 12 speakers, and a hackathon that produced 3 funded startups.',
    category: 'Frontend',
    author: 'Tope Adeyemi',
    authorRole: 'GDGOC Lead',
    date: '2026-07-01',
    readTime: '4 min read',
  },
];

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Android', 'AI', 'Design', 'Community'];

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: 'bg-blue-100 text-blue-700',
  Backend: 'bg-green-100 text-green-700',
  Android: 'bg-emerald-100 text-emerald-700',
  AI: 'bg-purple-100 text-purple-700',
  Design: 'bg-pink-100 text-pink-700',
  Community: 'bg-orange-100 text-orange-700',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function CategoryBadge({ category }: { category: string }) {
  const colors = CATEGORY_COLORS[category] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`font-mono text-xs font-semibold px-2.5 py-1 rounded-full ${colors}`}>
      &lt;{category} /&gt;
    </span>
  );
}

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
}

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link href={`/blog/${post.id}`} className="group block h-full">
        <div className="h-full bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-white/70 transition-all duration-300 flex flex-col">
          {/* Category */}
          <div className="mb-4">
            <CategoryBadge category={post.category} />
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-5">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {getInitials(post.author)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 leading-none">{post.author}</p>
              <p className="text-xs text-gray-400 mt-0.5">{post.authorRole}</p>
            </div>
          </div>

          {/* Meta + Arrow */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FeaturedCard({ post }: { post: Post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <Link href={`/blog/${post.id}`} className="group block">
        <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl hover:border-white/70 transition-all duration-300">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Featured
                </span>
                <CategoryBadge category={post.category} />
              </div>
              <h2 className="font-extrabold text-gray-900 text-2xl md:text-3xl leading-tight group-hover:text-blue-600 transition-colors duration-200">
                {post.title}
              </h2>
              <p className="text-gray-500 leading-relaxed">{post.excerpt}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  {getInitials(post.author)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{post.author}</p>
                  <p className="text-xs text-gray-400">{post.authorRole}</p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-6 md:items-end">
              <div className="w-full md:w-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl h-40 md:h-48 flex items-center justify-center border border-blue-100/60">
                <span className="font-mono text-5xl font-black text-blue-200 select-none">01</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1 text-blue-500 font-medium group-hover:gap-2 transition-all duration-200">
                  Read post <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState(BLOG_POSTS);

  useEffect(() => {
    fetch('/api/admin/verify')
      .then((r) => r.json())
      .then((data) => { if (data.isAdmin) setIsAdmin(true); })
      .catch(() => {});
    getCollection('gdgoc_blog_posts').then(stored => {
      if (stored && Array.isArray(stored)) {
        const publishedStored = stored.filter((p: any) => p.status === 'published' || !p.status);
        if (publishedStored.length > 0) {
          const storedIds = new Set(publishedStored.map((p: any) => p.id));
          const seedOnly = BLOG_POSTS.filter((p) => !storedIds.has(p.id));
          setPosts([...publishedStored, ...seedOnly]);
        }
      }
    });
  }, []);

  const filtered = posts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q || post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const [featured, ...rest] = filtered;

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            GDGOC <span className="text-blue-600">Blog</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Tutorials, event recaps, and insights from the GDGOC UNIBEN community.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10"
        >
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-gray-900 text-white shadow'
                    : 'bg-white/70 backdrop-blur-sm border border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {cat === 'All' ? 'All Posts' : cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80 flex items-center gap-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
              />
            </div>
            {isAdmin && (
              <Link href="/admin/blog/new">
                <button className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-gray-900 text-white shadow-md hover:bg-blue-600 transition-colors" title="Create New Post">
                  <PenLine size={16} />
                </button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* No results */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-gray-400"
          >
            <p className="text-lg font-medium">No posts found.</p>
            <p className="text-sm mt-1">Try a different category or search term.</p>
          </motion.div>
        )}

        {/* Featured post */}
        {featured && <FeaturedCard post={featured} />}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Admin floating button — only visible to admins */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm"
          >
            <PenLine className="w-4 h-4" />
            Write Post
          </Link>
        </motion.div>
      )}
    </div>
  );
}
