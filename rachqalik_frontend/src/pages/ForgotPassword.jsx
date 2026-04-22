import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [form, setForm] = useState({ email: '', newPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!form.email || !form.newPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 800)
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-black px-4 py-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[480px] rounded-[28px] border border-white/20 bg-[#050505] text-white shadow-[0_30px_100px_rgba(0,0,0,0.7)]"
      >
        <div className="p-8 sm:p-10">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-6 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Password Reset</h2>
              <p className="text-white/60 text-sm">
                Your password has been updated successfully. You can now sign in with your new credentials.
              </p>
              <Link
                to="/login"
                className="mt-2 inline-flex h-11 items-center justify-center rounded-2xl bg-white px-6 text-sm font-semibold text-black hover:bg-zinc-200 transition-colors"
              >
                Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Sign In
                </Link>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  Reset Password
                </h1>
                <p className="text-sm text-white/50">
                  Enter your email and choose a new password.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="fp-email" className="text-sm font-semibold text-white/80">
                  Email Address
                </label>
                <div className="group flex h-12 items-center gap-3 rounded-2xl border border-white/15 bg-[#0c0c0c] px-4 transition focus-within:border-white/30">
                  <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                  <input
                    id="fp-email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="fp-password" className="text-sm font-semibold text-white/80">
                  New Password
                </label>
                <div className="group flex h-12 items-center gap-3 rounded-2xl border border-white/15 bg-[#0c0c0c] px-4 transition focus-within:border-white/30">
                  <Lock className="h-4 w-4 shrink-0 text-zinc-400" />
                  <input
                    id="fp-password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={form.newPassword}
                    onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="h-12 rounded-2xl bg-white text-sm font-semibold text-black hover:bg-zinc-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </main>
  )
}
