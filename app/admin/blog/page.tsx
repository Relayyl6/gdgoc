'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Edit2, Trash2, FileText, Tag, Clock } from 'lucide-react';
import { getCollection, saveCollection } from '@/lib/db';

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: 'bg-blue-100 text-blue-700',
  Backend: 'bg-green-100 text-green-700',
  Android: 'bg-emerald-100 text-emerald-700',
  AI: 'bg-purple-100 text-purple-700',
  Design: 'bg-pink-100 text-pink-700',
  Community: 'bg-orange-100 text-orange-700',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  status?: 'published' | 'draft';
  coverImage?: string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'getting-started-gemini-api',
    title: 'Getting Started with the Gemini API in Next.js',
    excerpt:
      "A step-by-step guide to integrating Google's Gemini API into your Next.js 14 app using the App Router.",
    category: 'Frontend',
    author: 'Chidi Okonkwo',
    authorRole: 'Technical Lead',
    date: '2026-09-28',
    readTime: '8 min read',
    content: '',
  },
  {
    id: 'android-jetpack-compose-intro',
    title: 'Building Beautiful UIs with Jetpack Compose',
    excerpt:
      'Jetpack Compose is the modern toolkit for building native Android UIs. Here is how we used it for our Solution Challenge project.',
    category: 'Android',
    author: 'Ngozi Eze',
    authorRole: 'Android Developer',
    date: '2026-09-20',
    readTime: '6 min read',
    content: '',
  },
  {
    id: 'ai-ml-study-jam-recap',
    title: 'AI/ML Study Jam Recap: What We Learned',
    excerpt:
      'A comprehensive recap of our Google AI Essentials Study Jam, covering key takeaways from 3 weeks of collaborative learning.',
    category: 'AI',
    author: 'Emeka Nwachukwu',
    authorRole: 'Content Lead',
    date: '2026-09-10',
    readTime: '5 min read',
    content: '',
  },
  {
    id: 'figma-to-code-workflow',
    title: 'From Figma to Code: Our Design-Dev Workflow',
    excerpt:
      'How the GDGOC Design Team collaborates with developers to ship polished UIs. Our complete design-to-code process.',
    category: 'Design',
    author: 'Adaeze Obi',
    authorRole: 'Design Lead',
    date: '2026-08-30',
    readTime: '7 min read',
    content: '',
  },
  {
    id: 'backend-fastapi-cloud-run',
    title: 'Deploying FastAPI to Google Cloud Run',
    excerpt:
      'We deployed our Solution Challenge backend using FastAPI and Google Cloud Run. Here is our step-by-step deployment guide.',
    category: 'Backend',
    author: 'Praise Ehigie',
    authorRole: 'Backend Developer',
    date: '2026-08-15',
    readTime: '10 min read',
    content: '',
  },
  {
    id: 'devfest-2025-recap',
    title: 'DevFest UNIBEN 2025: A Year in Review',
    excerpt:
      'Reliving the highlights of our biggest event yet. 400+ attendees, 12 speakers, and a hackathon that produced 3 funded startups.',
    category: 'Frontend',
    author: 'Tope Adeyemi',
    authorRole: 'GDGOC Lead',
    date: '2026-07-01',
    readTime: '4 min read',
    content: '',
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [isVerifying, setIsVerifying] = useState(true);

  // Auth check + load localStorage posts
  useEffect(() => {
    fetch('/api/admin/verify')
      .then((r) => {
        if (!r.ok) router.push('/admin/login');
        else {
          setIsVerifying(false);
          // Load db posts — they override seed data
          getCollection('gdgoc_blog_posts').then((stored: any) => {
            if (stored && stored.length > 0) {
              setPosts((prev) => {
                const storedIds = new Set(stored.map((p: any) => p.id));
                // Keep seed posts that aren't in localStorage, then prepend localStorage posts
                const seedOnly = prev.filter((p) => !storedIds.has(p.id));
                return [...stored, ...seedOnly];
              });
            }
          }).catch(() => {});
        }
      })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-sm animate-pulse">Verifying access…</div>
      </div>
    );
  }

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    const next = posts.filter((p) => p.id !== id);
    setPosts(next);
    await saveCollection('gdgoc_blog_posts', next);
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <AdminLayout activePage="blog">
      <div className="max-w-5xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
              <p className="text-gray-400 text-sm mt-1">{posts.length} posts total</p>
            </div>
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Link>
          </div>

          {/* Form has been moved to its own page /admin/blog/new and /admin/blog/[id]/edit */}

          {/* Posts list */}
          <div className="space-y-3">
            {posts.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No posts yet. Create your first post above.</p>
              </div>
            )}

            {posts.map((post, index) => {
              const catColor = CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-700';
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-start gap-4 group hover:border-white/20 transition-all"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span
                        className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-full ${catColor}`}
                      >
                        &lt;{post.category} /&gt;
                      </span>
                      {post.status === 'draft' && (
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500">
                          Draft
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white text-sm leading-snug mb-1 line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-1 mb-2">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                      <span>{post.date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
    </AdminLayout>
  );
}
