'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Users,
  HandHelping,
  TrendingUp,
  Plus,
  FolderGit2
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

import { getCollection } from '@/lib/db';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// ── Quick actions ─────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: '+ New Event', href: '/admin/events/create', color: 'bg-[#4285F4] hover:bg-[#3367d6]' },
  { label: '+ New Blog Post', href: '/admin/blog/new', color: 'bg-[#EA4335] hover:bg-[#c5392e]' },
  { label: 'Manage Team', href: '/admin/team', color: 'bg-[#34A853] hover:bg-[#2a8a45]' },
  { label: 'Showcase Gallery', href: '/admin/showcase', color: 'bg-[#FBBC05] text-black hover:bg-[#f0b200]' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState([
    { label: 'Total Events', value: 0, icon: CalendarDays, color: 'text-[#4285F4]', bg: 'bg-[#4285F4]/10', border: 'border-[#4285F4]/20' },
    { label: 'Total Attendees', value: 0, icon: Users, color: 'text-[#EA4335]', bg: 'bg-[#EA4335]/10', border: 'border-[#EA4335]/20' },
    { label: 'Total Volunteers', value: 0, icon: HandHelping, color: 'text-[#34A853]', bg: 'bg-[#34A853]/10', border: 'border-[#34A853]/20' },
    { label: 'Total Projects', value: 0, icon: FolderGit2, color: 'text-[#FBBC05]', bg: 'bg-[#FBBC05]/10', border: 'border-[#FBBC05]/20' },
  ]);

  const [recentActivity, setRecentActivity] = useState<{ text: string; time: string; dot: string; dateObj: Date }[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      // 1. Compute Stats
      let totalEvents = 0;
      let totalAttendees = 0;
      let totalVolunteers = 0;
      let totalProjects = 0;
      let allEvents: any[] = [];

      try {
        const parsedEvents = await getCollection('gdgoc_events');
        if (parsedEvents && parsedEvents.length > 0) {
          totalEvents = parsedEvents.length;
          allEvents = parsedEvents;
        }
      } catch (e) {
        console.error("Error fetching events:", e);
      }

      allEvents.forEach(ev => {
        totalAttendees += (ev.registeredCount || 0);
      });

      // Prepare chart data (Registrations per event)
      const cData = allEvents.map(e => ({
        name: e.title.length > 15 ? e.title.substring(0, 15) + '...' : e.title,
        registrations: e.registeredCount || 0,
        fullTitle: e.title
      }));
      setChartData(cData);

      try {
        const parsedVolunteers = await getCollection('gdgoc_volunteers');
        if (parsedVolunteers) totalVolunteers = parsedVolunteers.length;
      } catch (e) {
        console.error("Error fetching volunteers:", e);
      }

      try {
        let parsedProjects = await getCollection('gdgoc_projects');
        if (!parsedProjects || parsedProjects.length === 0) {
          parsedProjects = await getCollection('gdgoc_community_projects');
        }
        if (parsedProjects) totalProjects = parsedProjects.length;
      } catch (e) {
        console.error("Error fetching projects:", e);
      }

      setStats([
        { label: 'Total Events', value: totalEvents, icon: CalendarDays, color: 'text-[#4285F4]', bg: 'bg-[#4285F4]/10', border: 'border-[#4285F4]/20' },
        { label: 'Total Attendees', value: totalAttendees, icon: Users, color: 'text-[#EA4335]', bg: 'bg-[#EA4335]/10', border: 'border-[#EA4335]/20' },
        { label: 'Total Volunteers', value: totalVolunteers, icon: HandHelping, color: 'text-[#34A853]', bg: 'bg-[#34A853]/10', border: 'border-[#34A853]/20' },
        { label: 'Total Projects', value: totalProjects, icon: FolderGit2, color: 'text-[#FBBC05]', bg: 'bg-[#FBBC05]/10', border: 'border-[#FBBC05]/20' },
      ]);

      // 2. Compute Recent Activity dynamically from gdgoc_activity
      const activities: { text: string; time: string; dot: string; dateObj: Date }[] = [];
      
      try {
        const parsed = await getCollection('gdgoc_activity');
        if (parsed) {
          const typeColors: Record<string, string> = {
            event: 'bg-[#4285F4]',
            blog: 'bg-[#EA4335]',
            team: 'bg-[#34A853]',
            media: 'bg-[#FBBC05]',
            volunteer: 'bg-[#A142F4]',
            system: 'bg-gray-500'
          };
          
          parsed.forEach((act: any) => {
            const date = new Date(act.time);
            const diffMs = Date.now() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHrs = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHrs / 24);
            
            let timeStr = 'Just now';
            if (diffDays > 0) timeStr = `${diffDays} days ago`;
            else if (diffHrs > 0) timeStr = `${diffHrs} hours ago`;
            else if (diffMins > 0) timeStr = `${diffMins} minutes ago`;

            activities.push({
              text: act.action,
              time: timeStr,
              dot: typeColors[act.type] || typeColors.system,
              dateObj: date
            });
          });
        }
      } catch(e) {
        console.error("Error fetching activity:", e);
      }

      // Add fallbacks if empty so the dashboard isn't completely bare initially
      if (activities.length === 0) {
        activities.push({ text: 'Team member profile updated: Tope Adeyemi', time: '3 days ago', dot: 'bg-[#34A853]', dateObj: new Date(Date.now() - 3 * 86400000) });
        activities.push({ text: 'Media gallery updated with DevFest photos', time: '5 days ago', dot: 'bg-[#4285F4]', dateObj: new Date(Date.now() - 5 * 86400000) });
      }

      activities.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
      setRecentActivity(activities.slice(0, 5));
    }
    fetchData();

  }, []);

  return (
    <AdminLayout activePage="dashboard">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Analytics</h1>
          <p className="text-white/50 text-sm mt-1">
            Overview of GDGOC registrations, volunteers, and overall growth.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
            <div
              key={label}
              className={`${bg} ${border} border rounded-xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className={`${bg} ${border} border rounded-lg p-2.5`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-white/50 text-xs font-medium">{label}</p>
                <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-white font-semibold text-sm mb-4">Event Registrations</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#ffffff10' }}
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff20', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff', marginBottom: '4px' }}
                    itemStyle={{ color: '#4285F4' }}
                  />
                  <Bar dataKey="registrations" fill="#4285F4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-white font-semibold text-sm mb-4">Growth Over Time</h2>
            <div className="h-64 w-full flex items-center justify-center border border-white/5 rounded-lg bg-black/20">
               <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff20', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff', marginBottom: '4px' }}
                    itemStyle={{ color: '#34A853' }}
                  />
                  <Line type="monotone" dataKey="registrations" stroke="#34A853" strokeWidth={3} dot={{ fill: '#34A853', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom grid: activity + quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-white/60" />
              <h2 className="text-white font-semibold text-sm">Recent Activity</h2>
            </div>
            <ul className="space-y-4">
              {recentActivity.length === 0 ? (
                <li className="text-white/40 text-sm">No recent activity.</li>
              ) : (
                recentActivity.map(({ text, time, dot }, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dot}`} />
                    <div>
                      <p className="text-white/80 text-sm">{text}</p>
                      <p className="text-white/35 text-xs mt-0.5">{time}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Plus className="w-4 h-4 text-white/60" />
              <h2 className="text-white font-semibold text-sm">Quick Actions</h2>
            </div>
            <div className="flex flex-col gap-3">
              {QUICK_ACTIONS.map(({ label, href, color }) => (
                <Link
                  key={label}
                  href={href}
                  className={`${color} text-white text-sm font-medium rounded-lg px-4 py-3 text-center transition-colors duration-150`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
