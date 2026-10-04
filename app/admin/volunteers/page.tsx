'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getCollection, saveCollection, saveDocument, deleteDocument } from '@/lib/db';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<VolunteerData[]>([]);

  useEffect(() => {
    getCollection('gdgoc_volunteers').then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setVolunteers(data as VolunteerData[]);
      } else {
        // Mock data
        const mockVolunteers: VolunteerData[] = [
          {
            id: '1',
            fullName: 'Ada Okonkwo',
            email: 'ada@example.com',
            phone: '+234 800 000 0000',
            department: 'Computer Science',
            year: '300 Level',
            role: 'dev-rel',
            whyVolunteer: 'I love community building.',
            skills: 'React, Node, Communication',
            availability: ['Weekends'],
            status: 'New',
            date: new Date().toISOString(),
          }
        ];
        setVolunteers(mockVolunteers);
        saveCollection('gdgoc_volunteers', mockVolunteers);
      }
    });
  }, []);

  const handleApprove = (id: string) => {
    setVolunteers(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, status: 'Reviewed - Approved' } : v);
      saveCollection('gdgoc_volunteers', updated);
      return updated;
    });
  };

  const handleReject = (id: string) => {
    setVolunteers(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, status: 'Reviewed - Rejected' } : v);
      saveCollection('gdgoc_volunteers', updated);
      return updated;
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this application entirely?')) return;
    deleteDocument('gdgoc_volunteers', id);
    setVolunteers(prev => {
      const updated = prev.filter(v => v.id !== id);
      saveCollection('gdgoc_volunteers', updated);
      return updated;
    });
  };

  return (
    <AdminLayout activePage="volunteers">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Volunteer Applications</h1>
        <p className="text-gray-400 mb-8">Review and manage community volunteer submissions.</p>

        <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 text-gray-400 uppercase text-xs border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name & Email</th>
                  <th className="px-6 py-4 font-semibold">Department & Level</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {volunteers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  volunteers.map((vol) => (
                    <motion.tr 
                      key={vol.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{vol.fullName}</div>
                        <div className="text-gray-500">{vol.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{vol.department}</div>
                        <div className="text-gray-500">{vol.year}</div>
                      </td>
                      <td className="px-6 py-4 capitalize">{vol.role.replace('-', ' ')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          vol.status === 'New' 
                            ? 'bg-blue-500/20 text-blue-400'
                            : vol.status.includes('Approved')
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                        }`}>
                          {vol.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApprove(vol.id)}
                            className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-md transition-colors"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleReject(vol.id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(vol.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-md transition-colors"
                            title="Delete entirely"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
