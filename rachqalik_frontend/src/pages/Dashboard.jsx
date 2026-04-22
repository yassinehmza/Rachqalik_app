import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Moon, ShoppingBag, Package, TrendingUp,
  Zap, Crown, ArrowRight, Star, Activity, Calendar,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { MOCK_SLEEP } from '../data/mockData'
import PageTransition from '../components/layout/PageTransition'

const qualityColor = { good: '#4ade80', average: '#fb923c', bad: '#f87171' }
const qualityLabel = { good: 'Good', average: 'Average', bad: 'Poor' }

function SleepRing({ avg }) {
  const pct  = Math.min(avg / 9, 1)
  const r    = 52
  const circ = 2 * Math.PI * r
  const score = Math.round(pct * 100)
  const scoreColor = score >= 75 ? '#4ade80' : score >= 50 ? '#fb923c' : '#f87171'

  return (
    <div className="relative flex items-center justify-center w-[148px] h-[148px] mx-auto">
      <svg width="148" height="148" className="-rotate-90">
        <circle cx="74" cy="74" r={r} fill="none" stroke="#1a1a1a" strokeWidth="12" />
        <motion.circle
          cx="74" cy="74" r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - circ * pct }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9F1A" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center gap-0.5">
        <span className="text-3xl font-bold text-white leading-none">{avg}h</span>
        <span className="text-[11px] text-white/40 font-medium">avg / night</span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 border"
          style={{
            color: scoreColor,
            backgroundColor: `${scoreColor}18`,
            borderColor: `${scoreColor}30`,
          }}
        >
          {score}% score
        </span>
      </div>
    </div>
  )
}

function MiniBar({ entry, maxDur }) {
  const pct   = (entry.duration / maxDur) * 100
  const color = qualityColor[entry.quality]
  const day   = new Date(entry.date).toLocaleDateString('en', { weekday: 'short' })

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] text-white/30 font-medium">{entry.duration}h</span>
      <div className="flex h-20 w-6 items-end rounded-lg overflow-hidden bg-white/[0.04]">
        <motion.div
          className="w-full rounded-lg"
          style={{ backgroundColor: color }}
          initial={{ height: 0 }}
          animate={{ height: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
      <span className="text-[10px] text-white/30">{day}</span>
    </div>
  )
}

export default function Dashboard() {
  const { user, isPremium, trialDaysLeft } = useAuth()

  const last7 = MOCK_SLEEP.slice(-7)
  const avg = useMemo(() => {
    const a = MOCK_SLEEP.reduce((s, e) => s + e.duration, 0) / MOCK_SLEEP.length
    return Math.round(a * 10) / 10
  }, [])
  const maxDur     = Math.max(...last7.map((e) => e.duration))
  const goodNights = MOCK_SLEEP.filter((e) => e.quality === 'good').length
  const bestNight  = Math.max(...MOCK_SLEEP.map((e) => e.duration))
  const streak     = 5

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const dateStr  = new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })

  const stats = [
    { label: 'Avg Duration', value: `${avg}h`,         sub: 'per night',               color: '#FF9F1A', icon: Activity    },
    { label: 'Best Night',   value: `${bestNight}h`,   sub: 'recorded',                color: '#a78bfa', icon: Star        },
    { label: 'Total Logs',   value: MOCK_SLEEP.length, sub: 'entries',                 color: '#60a5fa', icon: Calendar    },
    { label: 'Good Nights',  value: goodNights,         sub: `of ${MOCK_SLEEP.length}`, color: '#4ade80', icon: TrendingUp  },
  ]

  const quickActions = [
    { to: '/sleep/log', icon: Moon,        label: "Log Tonight's Sleep", color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
    { to: '/shop',      icon: ShoppingBag, label: 'Browse Shop',         color: '#FF9F1A', bg: 'rgba(255,159,26,0.1)'  },
    { to: '/orders',    icon: Package,     label: 'My Orders',           color: '#60a5fa', bg: 'rgba(96,165,250,0.1)'  },
  ]

  return (
    <PageTransition>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/40">{dateStr}</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">
              {greeting}, {user?.name?.split(' ')[0]} 👋
            </h1>
          </div>
          {!isPremium && (
            <Link
              to="/upgrade"
              className="flex items-center gap-1.5 rounded-full border border-[#FF9F1A]/30 bg-[#FF9F1A]/10 px-3 py-1.5 text-xs font-semibold text-[#FF9F1A] hover:bg-[#FF9F1A]/20 transition-colors"
            >
              <Crown className="h-3.5 w-3.5" />
              {trialDaysLeft > 0 ? `${trialDaysLeft}d trial left` : 'Upgrade now'}
            </Link>
          )}
        </div>

        {/* Sleep score + bar chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Ring card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-5 flex flex-col gap-4"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Sleep Score</p>
            <SleepRing avg={avg} />
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-3 space-y-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500/10">
                  <Star className="h-3.5 w-3.5 text-green-400" />
                </div>
                <p className="text-lg font-bold text-white">{goodNights}</p>
                <p className="text-[10px] text-white/40">Good nights</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-3 space-y-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF9F1A]/10">
                  <Zap className="h-3.5 w-3.5 text-[#FF9F1A]" />
                </div>
                <p className="text-lg font-bold text-white">{streak}d</p>
                <p className="text-[10px] text-white/40">Current streak</p>
              </div>
            </div>
          </motion.div>

          {/* Bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] lg:col-span-2 p-5 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Last 7 Nights</p>
              <Link to="/sleep/analytics" className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="flex items-end justify-around flex-1 min-h-[90px]">
              {last7.map((entry) => (
                <MiniBar key={entry._id} entry={entry} maxDur={maxDur} />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center gap-5">
              {Object.entries(qualityColor).map(([q, c]) => (
                <div key={q} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c }} />
                  <span className="text-[11px] text-white/40">{qualityLabel[q]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-4 space-y-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${s.color}18` }}
              >
                <s.icon className="h-4 w-4" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs font-semibold text-white/70 mt-0.5">{s.label}</p>
                <p className="text-[11px] text-white/30">{s.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-3">Quick Actions</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-4 hover:border-white/[0.13] hover:bg-[#141414] transition-all duration-200"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: a.bg }}>
                  <a.icon className="h-5 w-5" style={{ color: a.color }} />
                </div>
                <span className="flex-1 text-sm font-medium text-white/60 group-hover:text-white transition-colors">
                  {a.label}
                </span>
                <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </motion.div>

      </div>
    </PageTransition>
  )
}
