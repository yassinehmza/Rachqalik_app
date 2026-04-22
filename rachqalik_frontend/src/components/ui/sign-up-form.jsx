import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, User, Activity } from 'lucide-react'

const field =
  'group flex h-12 items-center gap-3 rounded-2xl border bg-[#0a0a0a] px-4 transition-all duration-200 ' +
  'border-white/10 focus-within:border-[#FF9F1A]/50 focus-within:shadow-[0_0_0_3px_rgba(255,159,26,0.08)]'

const iconCls = 'h-4 w-4 shrink-0 text-white/25 transition-colors group-focus-within:text-[#FF9F1A]/60'

function getStrength(pw) {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const STRENGTH = [
  null,
  { label: 'Weak', color: '#f87171', bars: 1 },
  { label: 'Fair', color: '#fb923c', bars: 2 },
  { label: 'Good', color: '#fbbf24', bars: 3 },
  { label: 'Strong', color: '#4ade80', bars: 4 },
]

export default function SignUpForm({
  form = { name: '', email: '', password: '', terms: false },
  setForm = () => {},
  onSubmit = (e) => e.preventDefault(),
  loading = false,
  error = '',
}) {
  const [showPw, setShowPw] = useState(false)
  const strength = getStrength(form.password)
  const strengthInfo = STRENGTH[strength]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-[440px] rounded-[28px] border border-white/[0.1] bg-[#050505] p-8 sm:p-10 shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* Brand mark */}
        <div className="flex flex-col items-center gap-3 pb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF9F1A] to-[#FF6B00] shadow-[0_6px_20px_rgba(255,159,26,0.35)]">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-white/40">
              Start your 15-day free trial today
            </p>
          </div>
        </div>

        {/* Full name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="su-name" className="text-xs font-semibold uppercase tracking-wider text-white/40">
            Full Name
          </label>
          <div className={field}>
            <User className={iconCls} />
            <input
              id="su-name"
              type="text"
              placeholder="Alex Martin"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none"
              required
              autoComplete="name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="su-email" className="text-xs font-semibold uppercase tracking-wider text-white/40">
            Email Address
          </label>
          <div className={field}>
            <Mail className={iconCls} />
            <input
              id="su-email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none"
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="su-password" className="text-xs font-semibold uppercase tracking-wider text-white/40">
            Password
          </label>
          <div className={field}>
            <Lock className={iconCls} />
            <input
              id="su-password"
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((v) => !v)}
              className="ml-1 shrink-0 text-white/20 hover:text-white/60 transition-colors"
            >
              {showPw ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>

          {/* Strength meter */}
          {form.password.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-1.5"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <motion.div
                    key={n}
                    className="h-1 flex-1 rounded-full"
                    style={{
                      backgroundColor: strength >= n && strengthInfo
                        ? strengthInfo.color
                        : 'rgba(255,255,255,0.07)',
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: n * 0.04 }}
                  />
                ))}
              </div>
              {strengthInfo && (
                <p className="text-[11px] font-medium" style={{ color: strengthInfo.color }}>
                  {strengthInfo.label} password
                  {strength < 3 && ' — add uppercase, numbers or symbols'}
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5 cursor-pointer select-none group">
          <div
            onClick={() => setForm((p) => ({ ...p, terms: !p.terms }))}
            className={`mt-0.5 h-4 w-4 shrink-0 rounded-[4px] border transition-all flex items-center justify-center ${
              form.terms
                ? 'bg-[#FF9F1A] border-[#FF9F1A]'
                : 'bg-transparent border-white/15 group-hover:border-white/30'
            }`}
          >
            {form.terms && (
              <svg className="w-2.5 h-2.5 text-black" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-xs leading-5 text-white/40">
            I agree to the{' '}
            <a href="#" className="font-semibold text-white/70 hover:text-white transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-semibold text-white/70 hover:text-white transition-colors">
              Privacy Policy
            </a>
          </span>
        </label>

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400"
          >
            {error}
          </motion.p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !form.terms}
          className="relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF9F1A] to-[#FF6B00] text-sm font-bold text-white shadow-[0_8px_24px_rgba(255,159,26,0.35)] transition-all duration-200 hover:shadow-[0_8px_32px_rgba(255,159,26,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
              />
              Creating account…
            </>
          ) : (
            'Get Started →'
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[11px] text-white/20 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-white/30">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-white hover:text-[#FF9F1A] transition-colors">
            Sign In
          </Link>
        </p>
      </form>
    </motion.div>
  )
}
