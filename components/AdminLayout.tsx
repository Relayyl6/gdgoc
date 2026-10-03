'use client';

/**
 * components/AdminLayout.tsx
 * Reusable dark sidebar layout for all admin pages.
 * Checks session on mount and redirects non-admins to /admin/login.
 */

import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Users,
  HandHelping,
  Image,
  LogOut,
  Loader2,
  Camera,
  Menu,
  X,
} from 'lucide-react';

export type AdminPage =
  | 'dashboard'
  | 'events'
  | 'blog'
  | 'team'
  | 'volunteers'
  | 'media'
  | 'showcase'
  | 'projects';

interface AdminLayoutProps {
  children: ReactNode;
  activePage: AdminPage;
}

const NAV_ITEMS: {
  id: AdminPage;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { id: 'events', label: 'Events', href: '/admin/events', icon: CalendarDays },
  { id: 'blog', label: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { id: 'team', label: 'Team', href: '/admin/team', icon: Users },
  { id: 'volunteers', label: 'Volunteers', href: '/admin/volunteers', icon: HandHelping },
  { id: 'media', label: 'Media Gallery', href: '/admin/media', icon: Image },
  { id: 'showcase', label: 'Showcase Memories', href: '/admin/showcase', icon: Camera },
  { id: 'projects', label: 'Community Projects', href: '/admin/projects', icon: FileText },
];

export default function AdminLayout({ children, activePage }: AdminLayoutProps) {
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Verify admin session on mount
  useEffect(() => {
    fetch('/api/admin/verify')
      .then((r) => r.json())
      .then((data: { isAdmin: boolean }) => {
        if (!data.isAdmin) {
          router.replace('/admin/login');
        } else {
          setVerified(true);
        }
      })
      .catch(() => router.replace('/admin/login'));
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      router.push('/');
    }
  }

  // Close mobile sidebar when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [activePage]);

  if (!verified) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4285F4] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col lg:flex-row pt-16">
      
      {/* ── Mobile Top Bar ── */}
      <div className="lg:hidden flex items-center px-4 py-3 bg-[#111111] border-b border-white/10 sticky top-16 z-20">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 -ml-1.5 text-white/70 hover:text-white rounded-md bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="ml-3 font-semibold text-white/90 text-sm">Admin Panel</span>
      </div>

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside 
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-[#111111] border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-2 gap-1">
              <span className="w-4 h-4 rounded-[3px] bg-[#4285F4]" />
              <span className="w-4 h-4 rounded-[3px] bg-[#EA4335]" />
              <span className="w-4 h-4 rounded-[3px] bg-[#FBBC05]" />
              <span className="w-4 h-4 rounded-[3px] bg-[#34A853]" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">GDGOC</p>
              <p className="text-white/40 text-xs mt-0.5">UNIBEN</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, href, icon: Icon }) => {
            const isActive = activePage === id;
            return (
              <Link
                key={id}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                  ${
                    isActive
                      ? 'bg-[#4285F4]/20 text-[#4285F4] border border-[#4285F4]/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                       text-red-400 hover:bg-red-500/10 hover:text-red-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-150"
          >
            {loggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 shrink-0" />
            )}
            {loggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 bg-[#0d0d0d] pb-20 lg:pb-0">{children}</main>
    </div>
  );
}
