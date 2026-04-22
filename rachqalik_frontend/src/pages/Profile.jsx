import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, CheckCircle, Crown, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import PageTransition from '../components/layout/PageTransition'

export default function Profile() {
  const { user, updateProfile, isPremium, isAdmin } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', password: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (form.password && form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password && form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (form.name.trim().length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }

    setSaving(true)
    setTimeout(() => {
      updateProfile({ name: form.name.trim() })
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }, 700)
  }

  return (
    <PageTransition>
      <div className="p-6 md:p-8 max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-sm text-white/40 mt-0.5">Manage your account settings</p>
        </div>

        {/* Avatar card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-5"
        >
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF9F1A] to-[#FF6B00] text-2xl font-bold text-white">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            {isPremium && (
              <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 border-2 border-[#060606]">
                <Crown className="h-2.5 w-2.5 text-black" />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-white">{user?.name}</p>
            <p className="text-sm text-white/40">{user?.email}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{
                  backgroundColor: isPremium ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.06)',
                  color: isPremium ? '#fbbf24' : 'rgba(255,255,255,0.4)',
                  border: `1px solid ${isPremium ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {isPremium ? <><Crown className="h-2.5 w-2.5" /> Premium</> : 'Free Plan'}
              </span>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                  <Shield className="h-2.5 w-2.5" /> Admin
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Edit form */}
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-5 space-y-4"
        >
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Edit Profile</p>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/60">Full Name</label>
            <div className="flex h-11 items-center rounded-xl border border-white/[0.08] bg-[#141414] px-3 focus-within:border-white/20 transition-colors">
              <User className="h-4 w-4 text-white/30 shrink-0" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="flex-1 bg-transparent px-3 text-sm text-white placeholder:text-white/30 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/60">Email Address</label>
            <div className="flex h-11 items-center rounded-xl border border-white/[0.04] bg-[#0c0c0c] px-3 opacity-50">
              <Mail className="h-4 w-4 text-white/30 shrink-0" />
              <input
                type="email"
                value={user?.email}
                disabled
                className="flex-1 bg-transparent px-3 text-sm text-white outline-none cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-white/25">Email cannot be changed</p>
          </div>

          <div className="border-t border-white/[0.05] pt-4 space-y-3">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Change Password</p>

            {['password', 'confirm'].map((field) => (
              <div key={field} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/60">
                  {field === 'password' ? 'New Password' : 'Confirm Password'}
                </label>
                <div className="flex h-11 items-center rounded-xl border border-white/[0.08] bg-[#141414] px-3 focus-within:border-white/20 transition-colors">
                  <Lock className="h-4 w-4 text-white/30 shrink-0" />
                  <input
                    type="password"
                    placeholder={field === 'password' ? 'Min. 8 characters' : 'Repeat password'}
                    value={form[field]}
                    onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                    className="flex-1 bg-transparent px-3 text-sm text-white placeholder:text-white/25 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all duration-200"
            style={{
              backgroundColor: saved ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.06)',
              color: saved ? '#4ade80' : 'rgba(255,255,255,0.8)',
              border: `1px solid ${saved ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            {saved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.form>
      </div>
    </PageTransition>
  )
}
