'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ─── Social SVG Icons (inline — no extra dependency) ─────────────────────────

function IconX({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 4l11.733 16h4.267l-11.733-16z" />
      <path d="M4 20l6.768-6.768m2.46-2.46l6.772-6.772" />
    </svg>
  );
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function IconDiscord({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
    </svg>
  );
}

// ─── Multi-layer Google-colour SVG wave ───────────────────────────────────────

function FooterWave() {
  return (
    <div className="absolute bottom-0 left-0 w-full pointer-events-none" aria-hidden>
      <svg
        viewBox="0 0 1440 180"
        className="w-full h-auto"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blue wave */}
        <path
          fill="#4285F4"
          fillOpacity="0.18"
          d="M0,120 C240,60 480,180 720,120 C960,60 1200,180 1440,120 L1440,180 L0,180 Z"
        />
        {/* Green wave */}
        <path
          fill="#34A853"
          fillOpacity="0.15"
          d="M0,140 C200,90 440,180 720,140 C1000,100 1220,180 1440,130 L1440,180 L0,180 Z"
        />
        {/* Yellow wave */}
        <path
          fill="#F9AB00"
          fillOpacity="0.12"
          d="M0,160 C360,110 720,180 1080,145 C1200,130 1320,170 1440,155 L1440,180 L0,180 Z"
        />
        {/* Red accent wave */}
        <path
          fill="#EA4335"
          fillOpacity="0.08"
          d="M0,168 C180,145 540,180 900,162 C1080,152 1260,175 1440,165 L1440,180 L0,180 Z"
        />
      </svg>
    </div>
  );
}

// ─── Social icon button ───────────────────────────────────────────────────────

function SocialBtn({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:shadow-md hover:scale-110 transition-all duration-200"
    >
      {children}
    </a>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer
      className="w-full bg-white p-6 md:p-8"
      style={{ fontFamily: "'Google Sans', sans-serif" }}
    >
      {/* ── Inner card ──────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-7xl mx-auto bg-gray-50/80 rounded-[2.5rem] border border-gray-100 overflow-hidden pt-14 pb-28 px-8 md:px-14">

        {/* ── Top section: brand + nav ──────────────────────────────────────── */}
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-12 mb-16">

          {/* Brand left */}
          <div className="max-w-xs">
            {/* Logo */}
            <div className="flex items-center mb-5 h-10">
              <img src="/logo.png" alt="GDGOC UNIBEN" className="h-[200%] w-auto object-contain -ml-4" />
            </div>
            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed mb-7">
              Empowering students to transform ideas into reality. Learn, build, and grow with a
              modern, tech-forward community platform.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              <SocialBtn href="#" label="X / Twitter">
                <IconX />
              </SocialBtn>
              <SocialBtn href="#" label="LinkedIn">
                <IconLinkedIn />
              </SocialBtn>
              <SocialBtn href="#" label="Instagram">
                <IconInstagram />
              </SocialBtn>
              <SocialBtn href="#" label="Discord">
                <IconDiscord />
              </SocialBtn>
            </div>
          </div>

          {/* Nav columns right */}
          <div className="flex gap-12 md:gap-20 flex-wrap">
            {/* Ecosystem */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                Ecosystem
              </h4>
              <Link href="/events" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Events
              </Link>
              <Link href="/events/create" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Create Event
              </Link>
              <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link href="/showcase" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Showcase
              </Link>
            </div>
            {/* Community */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                Community
              </h4>
              <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/team" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Team
              </Link>
              <Link href="/join" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Join
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </Link>
              <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────────── */}
        <div className="relative z-10 border-t border-gray-200/70 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          {/* Copyright */}
          <div className="flex flex-col gap-1 items-center md:items-start">
            <span>© {new Date().getFullYear()} GDGOC UNIBEN. All rights reserved.</span>
            <span className="text-blue-500 font-medium">Made by Yemuel - 09064982841</span>
          </div>
          {/* Disclaimer */}
          <span className="text-center max-w-md text-[10px] text-gray-300">
            GDG on Campus is an independent group; activities and opinions expressed should not be
            linked to Google, the corporation.
          </span>
          {/* Links */}
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-gray-800 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/code-of-conduct" className="hover:text-gray-800 transition-colors">
              Code of Conduct
            </Link>
          </div>
        </div>

        {/* ── Scenic wave graphic ───────────────────────────────────────────── */}
        <FooterWave />
      </div>

      {/* ── Ghost watermark text — outside card, below it ────────────────── */}
      <div
        className="text-[20vw] font-black text-gray-100 text-center select-none pointer-events-none -mt-8 relative z-0 leading-none overflow-hidden"
        aria-hidden
      >
        GDGOC
      </div>
    </footer>
  );
}
