import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Check, Zap, BarChart2, Moon, ShoppingBag, Headphones, CheckCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageTransition from '../components/layout/PageTransition'

const FEATURES = [
  { icon: Moon, text: 'Unlimited sleep logging', premium: true },
  { icon: BarChart2, text: 'Full analytics & insights', premium: true },
  { icon: Zap, text: 'AI-powered sleep recommendations', premium: true },
  { icon: ShoppingBag, text: 'Exclusive member discounts', premium: true },
  { icon: Headphones, text: 'Priority customer support', premium: true },
]

const FREE_FEATURES = [
  'Sleep logging (15-day trial)',
  'Basic history view',
  'Product browsing',
]

export default function Upgrade() {
  const { isPremium, upgradePlan } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (isPremium) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center h-full gap-5 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <Crown className="h-8 w-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">You're on Premium</h2>
          <p className="text-white/50 text-sm max-w-xs">
            You already have full access to all Rachqalik features. Enjoy!
          </p>
          <Link to="/dashboard" className="text-sm text-[#FF9F1A] hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </PageTransition>
    )
  }

  const handleUpgrade = () => {
    setLoading(true)
    setTimeout(() => {
      upgradePlan()
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    }, 1000)
  }

  return (
    <PageTransition>
      <div className="min-h-full flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-5 py-16 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_60px_rgba(251,191,36,0.4)]"
                >
                  <Crown className="h-10 w-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white">Welcome to Premium!</h2>
                <p className="text-white/50">Redirecting to your dashboard...</p>
              </motion.div>
            ) : (
              <motion.div key="plans" className="space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5">
                    <Crown className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400">Upgrade to Premium</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    Sleep better, live better
                  </h1>
                  <p className="text-white/50 max-w-md mx-auto">
                    Unlock the full Rachqalik experience with unlimited sleep tracking, AI insights, and exclusive member benefits.
                  </p>
                </div>

                {/* Plans comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {/* Free */}
                  <div className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-6 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Free</p>
                      <p className="text-3xl font-bold text-white mt-1">0 MAD</p>
                      <p className="text-xs text-white/30">15-day trial then limited</p>
                    </div>
                    <ul className="space-y-2.5">
                      {FREE_FEATURES.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-white/50">
                          <Check className="h-3.5 w-3.5 text-white/20 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] py-2.5 text-center text-sm text-white/30 font-medium">
                      Current Plan
                    </div>
                  </div>

                  {/* Premium */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="relative rounded-2xl border border-amber-500/30 bg-[#0e0e0e] p-6 space-y-4 shadow-[0_0_40px_rgba(255,159,26,0.08)]"
                  >
                    {/* Shimmer border effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/10 via-transparent to-amber-600/5 pointer-events-none" />

                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-gradient-to-r from-[#FF9F1A] to-[#FF6B00] px-3 py-1 text-[10px] font-bold text-white shadow-[0_4px_12px_rgba(255,159,26,0.4)]">
                        RECOMMENDED
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-amber-400/70 uppercase tracking-wider">Premium</p>
                      <div className="flex items-end gap-1 mt-1">
                        <p className="text-3xl font-bold text-white">99 MAD</p>
                        <p className="text-white/40 text-sm pb-1">/mois</p>
                      </div>
                      <p className="text-xs text-white/30">Cancel anytime</p>
                    </div>

                    <ul className="space-y-2.5">
                      {FEATURES.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-2 text-sm text-white/80">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
                            <Check className="h-3 w-3 text-amber-400" />
                          </div>
                          {text}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={handleUpgrade}
                      disabled={loading}
                      className="relative w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF9F1A] to-[#FF6B00] py-3 text-sm font-bold text-white shadow-[0_6px_24px_rgba(255,159,26,0.4)] hover:shadow-[0_6px_32px_rgba(255,159,26,0.55)] transition-shadow disabled:opacity-60"
                    >
                      <Crown className="h-4 w-4" />
                      {loading ? 'Upgrading...' : 'Upgrade Now'}
                    </button>
                  </motion.div>
                </div>

                <p className="text-center text-xs text-white/20">
                  Secure payment · No commitments · Cancel anytime
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}
