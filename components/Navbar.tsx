'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',     href: '/' },
  { label: 'About',    href: '/about' },
  { label: 'Events',   href: '/events' },
  { label: 'Showcase', href: '/showcase' },
  { label: 'Team',     href: '/team' },
  { label: 'Blog',     href: '/blog' },
  { label: 'Contact',  href: '/contact' },
];

const GDG_SQUARES = [
  { color: '#4285f4' }, // blue
  { color: '#34a853' }, // green
  { color: '#f9ab00' }, // yellow
  { color: '#ea4335' }, // red
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between h-16">

          {/* ── Left: Logo ── */}
          <Link href="/" className="flex items-center shrink-0 h-10">
            <img src="/logo.png" alt="GDGOC UNIBEN" className="h-[200%] md:h-[220%] w-auto object-contain " />
          </Link>

          {/* ── Center: Desktop nav links ── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 group transition-colors"
              >
                {link.label}
                {/* Underline animation */}
                <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
              </Link>
            ))}
          </nav>

          {/* ── Right: CTA buttons ── */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              href="/events"
              className="px-4 py-2 text-sm font-semibold rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Explore Events
            </Link>
            <Link
              href="/join"
              className="px-4 py-2 text-sm font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
            >
              Join Community
            </Link>
          </div>

          {/* ── Mobile: hamburger ── */}
          <button
            className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-16 left-0 right-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-white/30 shadow-xl"
          >
            <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-base font-medium text-gray-800 hover:text-blue-600 border-b border-gray-100 last:border-0 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col gap-3 mt-4">
                <Link
                  href="/events"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-3 rounded-full border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
                >
                  Explore Events
                </Link>
                <Link
                  href="/join"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md"
                >
                  Join Community
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
