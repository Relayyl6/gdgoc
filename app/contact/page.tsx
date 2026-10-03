'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Send } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

function RevealText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

const infoColumns = [
  {
    label: 'General Enquiries',
    links: [
      { text: 'gdscuniben36@gmail.com', href: 'mailto:gdscuniben36@gmail.com', arrow: true },
      { text: 'University of Benin', href: null, arrow: false },
      { text: 'Edo State, Nigeria', href: null, arrow: false },
    ],
  },
  {
    label: 'Socials',
    links: [
      { text: 'X (Twitter)', href: 'https://twitter.com', arrow: true },
      { text: 'Instagram', href: 'https://instagram.com', arrow: true },
      { text: 'LinkedIn', href: 'https://linkedin.com', arrow: true },
    ],
  },
  {
    label: 'Work With Us',
    links: [
      { text: 'Become a Member', href: '/join', arrow: true },
      { text: 'Sponsorship', href: 'mailto:gdscuniben36@gmail.com?subject=Sponsorship', arrow: true },
      { text: 'Speak at Events', href: 'mailto:gdscuniben36@gmail.com?subject=Speaking%20Request', arrow: true },
    ],
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: '-80px' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen bg-black text-white overflow-hidden flex flex-col relative"
      style={{ fontFamily: "'Google Sans', sans-serif" }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* ─── TOP SECTION ─── */}
      <div className="w-full flex flex-col md:flex-row gap-12 px-6 md:px-16 pt-24 pb-16 z-10 relative">

        {/* LEFT — image (1/3) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full md:w-1/3 flex justify-start"
        >
          <div className="w-full max-w-xs aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop"
              alt="GDGOC Uniben Team"
              className="object-cover w-full h-full opacity-80 mix-blend-luminosity"
            />
            <div className="absolute bottom-4 left-4 z-20">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">GDG on Campus</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Uniben Chapter</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — info columns (2/3) */}
        <div className="w-full md:w-2/3 flex flex-col justify-start">
          <RevealText delay={0}>
            <p className="uppercase tracking-[0.25em] text-xs text-gray-500 mb-10">
              Get In Touch
            </p>
          </RevealText>

          <div className="flex flex-col sm:flex-row gap-10 sm:gap-0 sm:divide-x sm:divide-white/10 uppercase text-xs tracking-widest leading-loose">
            {infoColumns.map((col, colIdx) => (
              <RevealText key={col.label} delay={colIdx * 0.2 + 0.1}>
                <div className="sm:pr-12 sm:pl-0 first:pl-0 last:pr-0 sm:first:pr-12 sm:last:pl-12 min-w-[11rem]">
                  <h3 className="text-gray-500 mb-5 font-semibold text-[10px] tracking-[0.3em]">
                    {col.label}
                  </h3>
                  <ul className="space-y-2">
                    {col.links.map((link) =>
                      link.href ? (
                        <li key={link.text}>
                          <a
                            href={link.href}
                            target={link.href.startsWith('http') ? '_blank' : undefined}
                            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="hover:text-gray-300 transition-colors duration-200 flex items-center gap-1 group"
                          >
                            {link.text}
                            {link.arrow && (
                              <ArrowUpRight
                                size={12}
                                className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                              />
                            )}
                          </a>
                        </li>
                      ) : (
                        <li key={link.text} className="text-gray-400">
                          {link.text}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </RevealText>
            ))}
          </div>
        </div>
      </div>

      {/* ─── DIVIDER ─── */}
      <div className="w-full px-6 md:px-16 z-10 relative">
        <div className="border-t border-white/10" />
      </div>

      {/* ─── CONTACT FORM SECTION ─── */}
      <div className="w-full px-6 md:px-16 py-20 z-10 relative" ref={formRef}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          <p className="uppercase tracking-[0.25em] text-xs text-gray-500 mb-3">Send a Message</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-12 leading-tight">
            Let&apos;s Start a<br />
            <span className="text-white/40">Conversation.</span>
          </h2>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center gap-4"
            >
              <CheckCircle2 size={48} className="text-green-400" />
              <h3 className="text-2xl font-bold">Message Sent!</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Thanks for reaching out. We&apos;ll get back to you within 2–3 business days.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="mt-4 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors duration-200"
              >
                Send Another ↗
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-sm text-white placeholder-gray-700 transition-colors duration-300"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-sm text-white placeholder-gray-700 transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What's this about?"
                  className="bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-sm text-white placeholder-gray-700 transition-colors duration-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us more..."
                  className="bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-sm text-white placeholder-gray-700 transition-colors duration-300 resize-none"
                />
              </div>

              <div className="flex justify-end pt-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={14} />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </div>

      {/* ─── MASSIVE BOTTOM TYPOGRAPHY ─── */}
      <div className="w-full relative overflow-hidden flex justify-center items-end mt-auto pointer-events-none select-none z-10">
        <motion.h1
          initial={{ y: 180, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="text-[19vw] leading-[0.82] font-black tracking-tighter text-white/90 m-0 p-0"
        >
          CONTACT
        </motion.h1>
      </div>
    </div>
  );
}
