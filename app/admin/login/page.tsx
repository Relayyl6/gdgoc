'use client';

/**
 * app/admin/login/page.tsx
 * Admin portal login page — dark themed, no credentials shown.
 */

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { success: boolean; error?: string };

      if (data.success) {
        const urlParams = new URLSearchParams(window.location.search);
        const from = urlParams.get('from') || '/admin';
        window.location.href = from;
      } else {
        setError(data.error ?? 'Invalid credentials. Please try again.');
        setLoading(false);
      }
    } catch {
      setError('A network error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          {/* Logo — GDGOC colour squares */}
          <div className="flex justify-center mb-6">
            <div className="grid grid-cols-2 gap-1.5">
              <span className="w-6 h-6 rounded-sm bg-[#4285F4]" />
              <span className="w-6 h-6 rounded-sm bg-[#EA4335]" />
              <span className="w-6 h-6 rounded-sm bg-[#FBBC05]" />
              <span className="w-6 h-6 rounded-sm bg-[#34A853]" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-white text-center mb-1">
            Admin Portal
          </h1>
          <p className="text-sm text-white/50 text-center mb-8">
            GDGOC UNIBEN
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/70"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30
                           rounded-lg px-4 py-3 text-sm outline-none
                           focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/30
                           transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/70"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30
                             rounded-lg px-4 py-3 pr-11 text-sm outline-none
                             focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/30
                             transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40
                             hover:text-white/80 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#4285F4] hover:bg-[#3367d6]
                         disabled:opacity-60 disabled:cursor-not-allowed
                         text-white font-semibold rounded-lg py-3 text-sm
                         transition-colors duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-white/25 mt-6">
          Authorized personnel only
        </p>
      </div>
    </main>
  );
}
