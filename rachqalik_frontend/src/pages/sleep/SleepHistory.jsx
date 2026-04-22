import { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MOCK_SLEEP } from '../../data/mockData'
import PageTransition from '../../components/layout/PageTransition'

const qualityConfig = {
  good: { label: 'Good', color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
  average: { label: 'Average', color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.2)' },
  bad: { label: 'Bad', color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
}

export default function SleepHistory() {
  const [filter, setFilter] = useState('all')

  const sorted = [...MOCK_SLEEP].reverse()
  const filtered = filter === 'all' ? sorted : sorted.filter((e) => e.quality === filter)

  return (
    <PageTransition>
      <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Sleep History</h1>
            <p className="text-sm text-white/40 mt-0.5">{MOCK_SLEEP.length} entries recorded</p>
          </div>
          <Link
            to="/sleep/log"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF9F1A] to-[#FF6B00] px-4 py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(255,159,26,0.3)] hover:shadow-[0_4px_20px_rgba(255,159,26,0.45)] transition-shadow"
          >
            <Moon className="h-3.5 w-3.5" />
            Log Sleep
          </Link>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-white/30" />
          <div className="flex gap-1.5">
            {['all', 'good', 'average', 'bad'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-150"
                style={{
                  backgroundColor: filter === f
                    ? f === 'all' ? 'rgba(255,255,255,0.1)' : qualityConfig[f]?.bg
                    : 'transparent',
                  color: filter === f
                    ? f === 'all' ? '#fff' : qualityConfig[f]?.color
                    : 'rgba(255,255,255,0.3)',
                  border: `1px solid ${filter === f
                    ? f === 'all' ? 'rgba(255,255,255,0.15)' : qualityConfig[f]?.border
                    : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {filtered.map((entry, i) => {
            const cfg = qualityConfig[entry.quality]
            const dateStr = new Date(entry.date).toLocaleDateString('en', {
              weekday: 'short', month: 'short', day: 'numeric',
            })

            return (
              <motion.div
                key={entry._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-4 hover:border-white/[0.12] transition-colors"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
                >
                  <Moon className="h-5 w-5" style={{ color: cfg.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{dateStr}</p>
                  <p className="text-xs text-white/40 mt-0.5">{entry.duration}h of sleep</p>
                </div>

                <div
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                >
                  {cfg.label}
                </div>

                {/* Duration bar */}
                <div className="hidden sm:flex w-20 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(entry.duration / 9) * 100}%`, backgroundColor: cfg.color }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Moon className="h-10 w-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No entries for this filter.</p>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
