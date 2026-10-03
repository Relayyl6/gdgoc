'use client';
import React from 'react';
import Link from 'next/link';
import { getCollection, saveCollection, saveDocument, deleteDocument } from '@/lib/db';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const BLOG_POSTS = [
  {
    id: 'getting-started-gemini-api',
    title: 'Getting Started with the Gemini API in Next.js',
    category: 'Frontend',
    author: 'Chidi Okonkwo',
    authorRole: 'Technical Lead',
    date: '2026-09-28',
    readTime: '8 min read',
    keywords: ['gemini', 'nextjs', 'api', 'frontend', 'react'],
    content: `## Introduction

The Gemini API represents Google's most capable AI model family, bringing multimodal understanding to your applications. In this guide, we will walk through integrating Gemini into a Next.js 14 application using the App Router.

## Prerequisites

Before we start, make sure you have:
- Node.js 18+ installed
- A Google Cloud account
- Basic familiarity with Next.js

## Setting Up Your Project

First, install the Google Generative AI SDK:

\`\`\`bash
npm install @google/generative-ai
\`\`\`

Next, add your API key to \`.env.local\`:

\`\`\`env
GOOGLE_GEMINI_API_KEY=your_api_key_here
\`\`\`

## Building the API Route

Create a server action in \`app/actions/gemini.ts\`:

\`\`\`typescript
'use server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function generateText(prompt: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}
\`\`\`

## Conclusion

The Gemini API opens up incredible possibilities for building AI-powered applications. We explored how to integrate it into Next.js 14, create streaming responses, and build a chat interface. Give it a try in your next project!`,
  },
  {
    id: 'android-jetpack-compose-intro',
    title: 'Building Beautiful UIs with Jetpack Compose',
    category: 'Android',
    author: 'Ngozi Eze',
    authorRole: 'Android Developer',
    date: '2026-09-20',
    readTime: '6 min read',
    keywords: ['android', 'jetpack', 'compose', 'kotlin', 'mobile'],
    content: `## What is Jetpack Compose?

Jetpack Compose is Android's modern toolkit for building native UI. It simplifies and accelerates UI development on Android. Quickly bring your app to life with less code, powerful tools, and intuitive Kotlin APIs.

## Why We Chose Compose for Solution Challenge

For our Solution Challenge project, we needed to build a responsive, beautiful UI quickly. Compose allowed us to:

- Write UI in pure Kotlin
- Use a declarative paradigm
- Hot reload changes instantly
- Integrate Material Design 3 effortlessly

## Key Concepts

**Composable Functions** are the building blocks of Compose UI. They are annotated with @Composable and describe what the UI should look like.

\`\`\`kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name!")
}
\`\`\`

## Conclusion

Jetpack Compose transformed how our team builds Android UIs. The declarative approach, combined with Kotlin's expressiveness, makes building complex UIs a joy rather than a chore.`,
  },
  {
    id: 'ai-ml-study-jam-recap',
    title: 'AI/ML Study Jam Recap: What We Learned',
    category: 'AI',
    author: 'Emeka Nwachukwu',
    authorRole: 'Content Lead',
    date: '2026-09-10',
    readTime: '5 min read',
    keywords: ['ai', 'ml', 'study-jam', 'gemini', 'machine-learning'],
    content: `## About the Study Jam

Over three weeks in August 2026, the GDGOC UNIBEN Technical Team ran a Google AI Essentials Study Jam. Here is what we covered and the key takeaways from each session.

## Week 1: Foundations of AI and ML

We started with the fundamentals: what AI is, how machine learning works, and the difference between supervised, unsupervised, and reinforcement learning. Many attendees were surprised by how approachable these concepts are when explained clearly.

## Week 2: Prompt Engineering

The second session focused on prompt engineering for large language models. We covered:
- Zero-shot vs few-shot prompting
- Chain-of-thought reasoning
- Role prompting
- Temperature and top-p settings

## Week 3: Building with Gemini

The final session was hands-on: attendees built a simple AI-powered application using the Gemini API. The energy in the room (both physical and virtual) was incredible.

## What Participants Said

"I came in thinking AI was beyond me. I left having built my first AI app." — Participant

## Next Steps

We are planning a follow-up Advanced AI Study Jam for November. Register your interest at gdgocuniben.com/events.`,
  },
  {
    id: 'figma-to-code-workflow',
    title: 'From Figma to Code: Our Design-Dev Workflow',
    category: 'Design',
    author: 'Adaeze Obi',
    authorRole: 'Design Lead',
    date: '2026-08-30',
    readTime: '7 min read',
    keywords: ['figma', 'design', 'workflow', 'css', 'tailwind'],
    content: `## The Problem

Like many student tech communities, GDGOC UNIBEN struggled with the handoff between design and development. Designs looked great in Figma but lost quality when implemented in code.

## Our Solution: A Structured Workflow

We established a clear process with defined stages and responsibilities.

### Stage 1: Component Inventory

Before any design work begins, our design and dev teams agree on a shared component vocabulary. What constitutes a Button? A Card? A Modal?

### Stage 2: Design in Figma with Dev Tokens

Our designers use Figma Variables to define colors, spacing, and typography. These directly map to our Tailwind CSS config.

### Stage 3: Annotated Handoff

Every Figma frame gets annotated with interaction notes, responsive breakpoints, and state specifications before being handed to developers.

### Stage 4: Component-First Development

Developers build components in isolation first, using Storybook-style stories, before integrating into pages.

## Results

Since adopting this workflow, our design-to-code fidelity has improved dramatically and we ship features faster.`,
  },
  {
    id: 'backend-fastapi-cloud-run',
    title: 'Deploying FastAPI to Google Cloud Run',
    category: 'Backend',
    author: 'Praise Ehigie',
    authorRole: 'Backend Developer',
    date: '2026-08-15',
    readTime: '10 min read',
    keywords: ['python', 'fastapi', 'cloud', 'backend', 'deploy'],
    content: `## Why FastAPI + Cloud Run?

For our Solution Challenge 2026 submission, we needed a reliable, scalable backend. We chose FastAPI for its speed and developer experience, and Google Cloud Run for its serverless deployment model.

## Setting Up FastAPI

\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "ok"}
\`\`\`

## Containerizing with Docker

\`\`\`dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
\`\`\`

## Deploying to Cloud Run

\`\`\`bash
gcloud run deploy gdgoc-backend --source . --region us-central1 --allow-unauthenticated
\`\`\`

## Conclusion

FastAPI on Cloud Run gives you a production-ready backend in minutes. The automatic scaling means you only pay for what you use.`,
  },
  {
    id: 'devfest-2025-recap',
    title: 'DevFest UNIBEN 2025: A Year in Review',
    category: 'Frontend',
    author: 'Tope Adeyemi',
    authorRole: 'GDGOC Lead',
    date: '2026-07-01',
    readTime: '4 min read',
    keywords: ['devfest', 'event', 'community', 'recap', 'hackathon'],
    content: `## DevFest UNIBEN 2025 in Numbers

- 400+ attendees
- 12 speakers
- 8 workshops
- 3 hackathon-winning projects now receiving funding
- 6 corporate sponsors

## Highlights

### The Keynote

Our opening keynote by Dr. Bola Fashola set the tone perfectly: technology is not just about code, it is about impact. That message resonated throughout the entire day.

### The Hackathon

The 6-hour hackathon produced some remarkable projects. Three teams are now in active conversations with investors. We could not be prouder.

### What We Learned

Organising an event at this scale taught us a lot about logistics, communication, and the power of a dedicated volunteer team.

## Looking Ahead to DevFest 2026

DevFest UNIBEN 2026 is set for November 5th, 2026 at the UNIBEN Main Auditorium. We are aiming for 600+ attendees and an even bigger hackathon prize pool. Register at gdgocuniben.com/events.`,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: 'bg-blue-100 text-blue-700',
  Backend: 'bg-green-100 text-green-700',
  Android: 'bg-emerald-100 text-emerald-700',
  AI: 'bg-purple-100 text-purple-700',
  Design: 'bg-pink-100 text-pink-700',
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
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Detect if content is HTML (from RichTextEditor) or plain markdown
function isHtml(str: string) {
  return /<[a-z][\s\S]*>/i.test(str);
}

function renderContent(content: string) {
  // RichTextEditor outputs HTML — render it directly
  if (isHtml(content)) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="prose prose-lg prose-blue max-w-none prose-img:rounded-xl prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-a:text-blue-600 hover:prose-a:text-blue-500"
      />
    );
  }

  // Legacy: plain markdown content (seed posts)
  const paragraphs = content.split('\n\n');
  return paragraphs.map((para, idx) => {
    if (para.startsWith('## ')) {
      return (
        <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-10 mb-4 border-b border-gray-100 pb-2">
          {para.replace('## ', '')}
        </h2>
      );
    }
    if (para.startsWith('### ')) {
      return (
        <h3 key={idx} className="text-xl font-semibold text-gray-800 mt-8 mb-3">
          {para.replace('### ', '')}
        </h3>
      );
    }
    if (para.startsWith('```')) {
      const lines = para.split('\n');
      const lang = lines[0].replace('```', '').trim();
      const code = lines.slice(1, -1).join('\n');
      return (
        <div key={idx} className="my-6 rounded-xl overflow-hidden border border-gray-200">
          {lang && <div className="bg-gray-800 px-4 py-1.5 text-xs font-mono text-gray-400">{lang}</div>}
          <pre className="bg-gray-900 text-green-300 text-sm font-mono p-4 overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      );
    }
    if (para.trim().startsWith('- ')) {
      const items = para.split('\n').filter((l) => l.startsWith('- '));
      return (
        <ul key={idx} className="list-disc list-inside space-y-1.5 my-4 text-gray-600">
          {items.map((item, i) => <li key={i}>{item.replace('- ', '')}</li>)}
        </ul>
      );
    }
    if (para.includes('**')) {
      const parts = para.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={idx} className="text-gray-600 leading-relaxed my-4">
          {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-900">{part}</strong> : part)}
        </p>
      );
    }
    if (!para.trim()) return null;
    return <p key={idx} className="text-gray-600 leading-relaxed my-4">{para}</p>;
  });
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [mounted, setMounted] = React.useState(false);
  const [post, setPost] = React.useState<any | null>(null);
  const [allPosts, setAllPosts] = React.useState<any[]>(BLOG_POSTS);

  React.useEffect(() => {
    setMounted(true);
    let posts = [...BLOG_POSTS];
    getCollection('gdgoc_blog_posts').then((parsed) => {
      if (parsed && Array.isArray(parsed)) {
        // All published database posts (or those without a status field)
        const publishedStored = parsed.filter((p: any) => p.status === 'published' || !p.status);
        const storedIds = new Set(publishedStored.map((p: any) => p.id));
        // Keep only seed posts whose IDs are NOT overridden in database
        const seedOnly = BLOG_POSTS.filter((p) => !storedIds.has(p.id));
        posts = [...publishedStored, ...seedOnly];
      }
      setAllPosts(posts);
      setPost(posts.find((p) => p.id === params.id) || null);
    });
  }, [params.id]);

  if (!mounted) return null;

  if (!post) {
    return (
      <div className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4">
        <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-12 text-center max-w-md shadow-lg">
          <p className="text-6xl mb-4">📄</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
          <p className="text-gray-500 mb-6">
            The blog post you are looking for does not exist or may have been moved.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // ── Keyword-based related posts ──────────────────────────────────────────────
  const postKeywords = post.keywords ?? [];

  let relatedPosts = allPosts.filter((p) => {
    if (p.id === post.id) return false;
    const sharedKeywords = (p.keywords ?? []).filter((kw: string) => postKeywords.includes(kw));
    return sharedKeywords.length > 0;
  }).slice(0, 3);

  // Fallback: same category if no keyword matches
  if (relatedPosts.length === 0) {
    relatedPosts = allPosts.filter(
      (p) => p.id !== post.id && p.category === post.category,
    ).slice(0, 3);
  }

  // Final fallback: any other posts
  if (relatedPosts.length === 0) {
    relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 3);
  }

  const categoryColor = CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-700';

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white">
      {/* Decorative */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-purple-200/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-10">
          {/* Category */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-3 py-1 rounded-full ${categoryColor}`}
            >
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Author / meta bar */}
          <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {getInitials(post.author)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{post.author}</p>
              <p className="text-xs text-gray-400">{post.authorRole}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400 shrink-0">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>

        {/* Article body */}
        <article className="bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-8 md:p-10 shadow-sm mb-14">
          {post.coverImage && (
            <img src={post.coverImage} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8" alt={post.title} />
          )}
          <div className="prose prose-lg max-w-none prose-blue text-gray-700 [&_pre]:bg-gray-900 [&_pre]:text-green-400 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_code]:bg-gray-100 [&_code]:text-pink-600 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {post.content?.replace(/<p>\s*```/g, '```').replace(/```\s*<\/p>/g, '```')}
            </ReactMarkdown>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((related) => {
                const relColor = CATEGORY_COLORS[related.category] ?? 'bg-gray-100 text-gray-700';
                return (
                  <Link key={related.id} href={`/blog/${related.id}`} className="group block">
                    <div className="h-full bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-white/70 transition-all duration-300 flex flex-col gap-3">
                      <span
                        className={`font-mono text-xs font-semibold px-2.5 py-1 rounded-full self-start ${relColor}`}
                      >
                        &lt;{related.category} /&gt;
                      </span>
                      <h3 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-auto">{related.readTime}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-center text-white shadow-lg">
          <h2 className="text-xl font-bold mb-2">Enjoyed this article?</h2>
          <p className="text-blue-100 text-sm mb-6">
            Explore more tutorials, event recaps, and insights from the GDGOC UNIBEN community.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse All Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
