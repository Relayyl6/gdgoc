'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle, XCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import { getCollection, saveCollection, deleteDocument, saveDocument } from '@/lib/db';
import AdminLayout from '@/components/AdminLayout';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getCollection('gdgoc_community_projects');
      setProjects(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (project: any, status: 'approved' | 'rejected') => {
    try {
      const updated = { ...project, status };
      await saveDocument('gdgoc_community_projects', project.id, updated);
      setProjects(prev => prev.map(p => p.id === project.id ? updated : p));
    } catch (e) {
      alert('Failed to update project');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project submission entirely?')) return;
    try {
      await deleteDocument('gdgoc_community_projects', id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert('Failed to delete');
    }
  };

  if (loading) {
    return (
      <AdminLayout activePage="projects">
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </AdminLayout>
    );
  }

  const pending = projects.filter(p => p.status === 'pending');
  const approved = projects.filter(p => p.status === 'approved');
  const rejected = projects.filter(p => p.status === 'rejected');

  return (
    <AdminLayout activePage="projects">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Community Projects</h1>

        {/* Pending */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            Pending Approval <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">{pending.length}</span>
          </h2>
          {pending.length === 0 ? (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 text-center text-gray-500">
              No pending projects.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pending.map(p => (
                <ProjectAdminCard key={p.id} project={p} onApprove={() => handleUpdateStatus(p, 'approved')} onReject={() => handleUpdateStatus(p, 'rejected')} onDelete={() => handleDelete(p.id)} />
              ))}
            </div>
          )}
        </section>

        {/* Approved */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            Approved (Live) <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs">{approved.length}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approved.map(p => (
              <ProjectAdminCard key={p.id} project={p} onDelete={() => handleDelete(p.id)} onReject={() => handleUpdateStatus(p, 'rejected')} />
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function ProjectAdminCard({ project, onApprove, onReject, onDelete }: { project: any, onApprove?: ()=>void, onReject?: ()=>void, onDelete: ()=>void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 shadow-sm hover:shadow transition">
      {project.imageUrl ? (
        <img src={project.imageUrl} alt={project.title} className="w-full sm:w-32 h-32 object-cover rounded-xl bg-gray-100 shrink-0" />
      ) : (
        <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
          <span className="text-gray-400 text-xs">No Image</span>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-900 truncate">{project.title}</h3>
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md shrink-0">
            {project.projectType}
          </span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{project.description}</p>
        
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="font-medium">By: {Array.isArray(project.contributors) ? project.contributors.join(', ') : project.contributors}</span>
          {project.liveLink && <a href={project.liveLink} target="_blank" className="text-blue-500 hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3"/> Live</a>}
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          {project.status === 'pending' && onApprove && (
            <button onClick={onApprove} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-lg text-xs font-semibold transition">
              Approve
            </button>
          )}
          {project.status !== 'rejected' && onReject && (
            <button onClick={onReject} className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 py-1.5 rounded-lg text-xs font-semibold transition">
              Reject
            </button>
          )}
          <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
