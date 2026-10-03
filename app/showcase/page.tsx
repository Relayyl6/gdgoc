'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Camera, Calendar, MapPin, Users, Sparkles, ArrowRight, ExternalLink,
  Award, Layers, ChevronRight, Heart, Upload, X, Loader2, Code, Figma, Blocks, CheckCircle
} from 'lucide-react';
import { getCollection, saveCollection, saveDocument } from '@/lib/db';
import { uploadImage } from '@/lib/upload';



export default function ShowcasePage() {
  const [activeTab, setActiveTab] = useState<'memories' | 'projects'>('memories');
  const [memories, setMemories] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedMemory, setSelectedMemory] = useState<any | null>(null);
  
  // Submit modal state
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Load memories
    getCollection('gdgoc_media_gallery').then(async (dbMedia) => {
      const allEvents = await getCollection('gdgoc_events') || [];
      if (dbMedia && Array.isArray(dbMedia) && dbMedia.length > 0) {
        const aspects = ['aspect-[4/3]', 'aspect-[16/10]', 'aspect-[4/5]', 'aspect-[16/11]'];
        const formatted = dbMedia.map((m: any, idx: number) => {
          const ev = allEvents.find((e: any) => e.id === m.eventId);
          let cat = 'Community';
          if (ev?.type) {
            const t = ev.type.toLowerCase();
            if (t.includes('workshop') || t.includes('study')) cat = 'Workshops';
            else if (t.includes('hackathon')) cat = 'Hackathons';
            else if (t.includes('conference') || t.includes('devfest')) cat = 'Conferences';
          }
          return {
            id: m.id || `sc-${idx}`,
            title: m.caption || m.title || ev?.title || 'Community Photo',
            category: cat,
            date: ev?.date ? new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : (m.uploadedAt || 'Recent'),
            year: ev?.date ? new Date(ev.date).getFullYear().toString() : '2026',
            attendees: ev?.registeredCount || 50,
            location: ev?.location || 'UNIBEN',
            image: m.url || m.src || '',
            caption: m.caption || ev?.description || 'A vibrant moment captured at GDGOC UNIBEN.',
            highlightStat: m.highlightStat || 'Community Vibe',
            aspect: m.aspect || aspects[idx % aspects.length],
          };
        });
        setMemories(formatted);
      }
    });

    // Load projects
    getCollection('gdgoc_community_projects').then((dbProj) => {
      if (dbProj) {
        setProjects(dbProj.filter((p: any) => p.status === 'approved'));
      }
    });
  }, []);

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      
      {/* Hero */}
      <section className="pt-6 pb-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="tracking-wide uppercase">Community Showcase</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Built by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">UNIBEN.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Explore the vibrant moments from our past events and discover the incredible projects shipped by our student developers and designers.
          </motion.p>

          <div className="flex justify-center items-center gap-4">
            <div className="flex bg-gray-100 p-1.5 rounded-2xl shadow-inner">
              <button onClick={() => setActiveTab('memories')} className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'memories' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                Event Memories
              </button>
              <button onClick={() => setActiveTab('projects')} className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'projects' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                Community Projects
              </button>
            </div>
            
            {activeTab === 'projects' && (
              <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:scale-105 transition-all">
                <Upload className="w-4 h-4" />
                Submit Project
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        {activeTab === 'memories' ? (
          <MemoriesView memories={memories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} setSelectedMemory={setSelectedMemory} />
        ) : (
          <ProjectsView projects={projects} />
        )}
      </div>

      {/* Memory Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div key="memory-modal" exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMemory(null)} className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl z-10 max-h-[90vh]">
              <button onClick={() => setSelectedMemory(null)} className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition">
                <X className="w-5 h-5" />
              </button>
              <div className="w-full md:w-3/5 h-64 md:h-auto relative bg-gray-100">
                <img src={selectedMemory.image} alt={selectedMemory.title} className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-2/5 p-8 flex flex-col overflow-y-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">{selectedMemory.category}</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedMemory.title}</h3>
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">{selectedMemory.caption}</p>
                <div className="space-y-4 mb-auto">
                  <div className="flex items-center gap-3 text-sm text-gray-600"><Calendar className="w-4 h-4 text-blue-500" /> <span>{selectedMemory.date}</span></div>
                  <div className="flex items-center gap-3 text-sm text-gray-600"><MapPin className="w-4 h-4 text-blue-500" /> <span>{selectedMemory.location}</span></div>
                  <div className="flex items-center gap-3 text-sm text-gray-600"><Users className="w-4 h-4 text-blue-500" /> <span>{selectedMemory.attendees} Attendees</span></div>
                  <div className="flex items-center gap-3 text-sm text-gray-600"><Award className="w-4 h-4 text-blue-500" /> <span className="font-semibold text-gray-900">{selectedMemory.highlightStat}</span></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Project Modal */}
      <AnimatePresence>
        {showModal && <SubmitProjectModal key="submit-modal" onClose={() => setShowModal(false)} />}
      </AnimatePresence>

    </div>
  );
}

function MemoriesView({ memories, activeCategory, setActiveCategory, setSelectedMemory }: any) {
  const CATEGORIES = ['All', 'Workshops', 'Hackathons', 'Conferences', 'Community'];
  const filtered = activeCategory === 'All' ? memories : memories.filter((m: any) => m.category === activeCategory);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
            {cat}
          </button>
        ))}
      </div>
      <motion.div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence>
          {filtered.map((item: any, idx: number) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, delay: idx * 0.05 }} className="break-inside-avoid">
              <div onClick={() => setSelectedMemory(item)} className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 bg-white">
                <div className={`relative w-full ${item.aspect} overflow-hidden`}>
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  <img src={item.image} alt={item.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-bold uppercase tracking-wider mb-2">{item.category}</span>
                    <h3 className="text-white font-bold text-lg leading-snug mb-1">{item.title}</h3>
                    <p className="text-gray-300 text-sm flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {item.year}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function ProjectsView({ projects }: { projects: any[] }) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <Blocks className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Projects Yet</h3>
        <p className="text-gray-500 mb-6">Be the first to showcase your work to the community!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, idx) => (
        <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group">
          <div className="h-48 relative overflow-hidden bg-gray-100">
            {project.imageUrl ? (
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400"><Code className="w-8 h-8" /></div>
            )}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
              {project.projectType}
            </div>
          </div>
          <div className="p-6 flex flex-col flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">{project.description}</p>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="text-xs text-gray-500 font-medium truncate pr-4">
                By {Array.isArray(project.contributors) ? project.contributors.join(', ') : project.contributors}
              </div>
              <div className="flex gap-2 shrink-0">
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" className="p-2 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition"><Code className="w-4 h-4" /></a>
                )}
                {project.figmaLink && (
                  <a href={project.figmaLink} target="_blank" className="p-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition"><Figma className="w-4 h-4" /></a>
                )}
                {project.liveLink && (
                  <a href={project.liveLink} target="_blank" className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition"><ExternalLink className="w-4 h-4" /></a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SubmitProjectModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ title: '', description: '', projectType: 'Web App', contributors: '', liveLink: '', githubLink: '', figmaLink: '' });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = '';
      if (file) {
        imageUrl = await uploadImage(file, 'community_projects');
      }

      const newProj = {
        id: `proj-${Date.now()}`,
        ...form,
        contributors: form.contributors.split(',').map(s => s.trim()),
        imageUrl,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      await saveDocument('gdgoc_community_projects', newProj.id, newProj);
      setSuccess(true);
    } catch (e) {
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition">
          <X className="w-5 h-5" />
        </button>
        
        {success ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Submitted!</h2>
            <p className="text-gray-600 mb-8">Thank you for sharing your work. Our team will review it shortly. Once approved, it will appear in the Community Showcase.</p>
            <button onClick={onClose} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Your Project</h2>
            <p className="text-gray-500 text-sm mb-6">Built something cool? Whether it's a web app, a mobile app, or a UI design, we want to see it!</p>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Project Title *</label>
                  <input required type="text" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="My Awesome Project" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Project Type *</label>
                  <select required value={form.projectType} onChange={e=>setForm({...form, projectType: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Web App">Web App</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="AI/ML Model">AI/ML Model</option>
                    <option value="Open Source">Open Source Contribution</option>
                    <option value="Hardware/IoT">Hardware / IoT</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                <textarea required rows={3} value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="What does this project do and how was it built?" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Contributors *</label>
                <input required type="text" value={form.contributors} onChange={e=>setForm({...form, contributors: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. John Doe, @janedoe" />
                <p className="text-xs text-gray-400 mt-1">Comma separated list of names or handles</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image (Required)</label>
                <input required type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] || null)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              
              <div className="border-t border-gray-100 pt-5 mt-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Links (Provide at least one)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Live URL</label>
                    <input type="url" value={form.liveLink} onChange={e=>setForm({...form, liveLink: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">GitHub Repo</label>
                    <input type="url" value={form.githubLink} onChange={e=>setForm({...form, githubLink: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Figma Design</label>
                    <input type="url" value={form.figmaLink} onChange={e=>setForm({...form, figmaLink: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://figma.com/..." />
                  </div>
                </div>
              </div>
              
              <button disabled={loading || (!form.liveLink && !form.githubLink && !form.figmaLink)} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition flex justify-center items-center gap-2 mt-6 disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit for Review'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
