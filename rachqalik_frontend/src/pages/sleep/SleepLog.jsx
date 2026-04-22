import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, CheckCircle, Minus, Plus } from 'lucide-react'
import PageTransition from '../../components/layout/PageTransition'

const QUALITIES = [
  { value: 'bad', emoji: '😞', label: 'Bad', desc: 'Restless, tired', color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.3)' },
  { value: 'average', emoji: '😐', label: 'Average', desc: 'Could be better', color: '#fb923c', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.3)' },
  { value: 'good', emoji: '😊', label: 'Good', desc: 'Rested & refreshed', color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.3)' },
]

export default function SleepLog() {
  const navigate = useNavigate()
  const [hours, setHours] = useState(7)
  const [minutes, setMinutes] = useState(30)
  const [quality, setQuality] = useState(null)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const duration = hours + minutes / 60

  const adjustHours = (delta) => setHours((h) => Math.min(12, Math.max(0, h + delta)))
  const adjustMinutes = (delta) => {
    setMinutes((m) => {
      const next = m + delta
      if (next < 0) { adjustHours(-1); return 45 }
      if (next >= 60) { adjustHours(1); return 0 }
      return next
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!quality) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => navigate('/sleep/history'), 1500)
    }, 800)
  }

  return (
    <PageTransition>
      <div className="min-h-full flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20"
                >
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white">Sleep Logged!</h2>
                <p className="text-white/50 text-sm">Redirecting to your history...</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                className="space-y-6"
              >
                {/* Header */}
                <div className="text-center space-y-1">
                  <div className="flex items-center justify-center h-12 w-12 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-3">
                    <Moon className="h-6 w-6 text-purple-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Log Your Sleep</h1>
                  <p className="text-sm text-white/40">How did you sleep last night?</p>
                </div>

                {/* Duration picker */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-6">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Duration</p>
                  <div className="flex items-center justify-center gap-6">
                    {/* Hours */}
                    <div className="flex flex-col items-center gap-2">
                      <button type="button" onClick={() => adjustHours(1)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white transition-colors">
                        <Plus className="h-4 w-4" />
                      </button>
                      <div className="text-center">
                        <span className="text-4xl font-bold text-white">{String(hours).padStart(2, '0')}</span>
                        <p className="text-xs text-white/30 mt-1">hours</p>
                      </div>
                      <button type="button" onClick={() => adjustHours(-1)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white transition-colors">
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>

                    <span className="text-3xl font-light text-white/30 pb-4">:</span>

                    {/* Minutes */}
                    <div className="flex flex-col items-center gap-2">
                      <button type="button" onClick={() => adjustMinutes(15)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white transition-colors">
                        <Plus className="h-4 w-4" />
                      </button>
                      <div className="text-center">
                        <span className="text-4xl font-bold text-white">{String(minutes).padStart(2, '0')}</span>
                        <p className="text-xs text-white/30 mt-1">minutes</p>
                      </div>
                      <button type="button" onClick={() => adjustMinutes(-15)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white transition-colors">
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-center text-xs text-white/30 mt-4">= {duration.toFixed(1)} hours total</p>
                </div>

                {/* Quality picker */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-5">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Sleep Quality</p>
                  <div className="grid grid-cols-3 gap-2">
                    {QUALITIES.map((q) => (
                      <button
                        key={q.value}
                        type="button"
                        onClick={() => setQuality(q.value)}
                        className="flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-150"
                        style={{
                          backgroundColor: quality === q.value ? q.bg : 'transparent',
                          borderColor: quality === q.value ? q.border : 'rgba(255,255,255,0.07)',
                        }}
                      >
                        <span className="text-2xl">{q.emoji}</span>
                        <span className="text-xs font-semibold" style={{ color: quality === q.value ? q.color : 'rgba(255,255,255,0.5)' }}>
                          {q.label}
                        </span>
                        <span className="text-[10px] text-white/30 text-center">{q.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-5">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Date</p>
                  <input
                    type="date"
                    value={date}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-white text-sm outline-none [color-scheme:dark]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!quality || loading}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#FF9F1A] to-[#FF6B00] py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(255,159,26,0.3)] transition-all hover:shadow-[0_8px_32px_rgba(255,159,26,0.45)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Sleep Entry'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}
