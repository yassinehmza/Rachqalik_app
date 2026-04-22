import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, Moon } from 'lucide-react'

export default function SignInForm({
  form = { email: '', password: '' },
  setForm = () => {},
  onSubmit = (e) => e.preventDefault(),
  loading = false,
  error = '',
}) {
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-[440px] rounded-3xl border border-[#1a1a1a] bg-[#0a0a0a] p-8 sm:p-10 shadow-[0_40px_120px_rgba(0,0,0,0.9)]"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 pb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF9F1A] to-[#FF6B00] shadow-[0_6px_24px_rgba(255,159,26,0.4)]">
            <Moon className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-500">Sign in to continue your sleep journey</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="si-email" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Email Address
          </label>
          <div className="group flex h-12 items-center gap-3 rounded-xl border border-[#1a1a1a] bg-[#080808] px-4 transition-all focus-within:border-[#FF9F1A]/50 focus-within:shadow-[0_0_0_3px_rgba(255,159,26,0.08)]">
            <Mail className="h-4 w-4 shrink-0 text-gray-600 transition-colors group-focus-within:text-[#FF9F1A]/70" />
            <input
              id="si-email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-700 outline-none"
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="si-password" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Password
          </label>
          <div className="group flex h-12 items-center gap-3 rounded-xl border border-[#1a1a1a] bg-[#080808] px-4 transition-all focus-within:border-[#FF9F1A]/50 focus-within:shadow-[0_0_0_3px_rgba(255,159,26,0.08)]">
            <Lock className="h-4 w-4 shrink-0 text-gray-600 transition-colors group-focus-within:text-[#FF9F1A]/70" />
            <input
              id="si-password"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-700 outline-none"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((v) => !v)}
              className="shrink-0 text-gray-600 hover:text-gray-400 transition-colors"
            >
              {showPw ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Remember + forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <div
              onClick={() => setRemember((v) => !v)}
              className={`h-4 w-4 shrink-0 rounded-[4px] border transition-all flex items-center justify-center ${
                remember
                  ? 'bg-[#FF9F1A] border-[#FF9F1A]'
                  : 'bg-transparent border-[#2a2a2a] group-hover:border-[#3a3a3a]'
              }`}
            >
              {remember && (
                <svg className="w-2.5 h-2.5 text-black" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-xs text-gray-500">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-xs text-gray-500 hover:text-[#FF9F1A] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs font-medium text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="relative flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FF9F1A] text-sm font-bold text-black shadow-[0_6px_24px_rgba(255,159,26,0.35)] hover:bg-[#FF9F1A]/90 hover:shadow-[0_6px_32px_rgba(255,159,26,0.5)] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                className="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black"
              />
              Signing in…
            </>
          ) : (
            'Sign In →'
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#1a1a1a]" />
          <span className="text-[11px] text-gray-700 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-[#1a1a1a]" />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          No account?{' '}
          <Link to="/register" className="font-semibold text-white hover:text-[#FF9F1A] transition-colors">
            Create one free
          </Link>
        </p>
      </form>
    </motion.div>
  )
}
