import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Moon, Award } from 'lucide-react'
import { MOCK_SLEEP } from '../../data/mockData'
import PageTransition from '../../components/layout/PageTransition'

const qColor = { good: '#4ade80', average: '#fb923c', bad: '#f87171' }
const qBg = { good: 'rgba(74,222,128,0.1)', average: 'rgba(251,146,60,0.1)', bad: 'rgba(248,113,113,0.1)' }

function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.duration))
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((entry, i) => {
        const pct = (entry.duration / max) * 100
        const color = qColor[entry.quality]
        const day = new Date(entry.date).toLocaleDateString('en', { weekday: 'short' })
        return (
          <div key={entry._id} className="flex flex-1 flex-col items-center gap-1.5 group">
            <span className="text-[9px] text-white/0 group-hover:text-white/50 transition-colors font-medium">{entry.duration}h</span>
            <div className="w-full flex items-end justify-center h-24">
              <motion.div
                className="w-full rounded-t-lg min-h-[4px]"
                style={{ backgroundColor: color, opacity: 0.8 }}
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[9px] text-white/30">{day}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function SleepAnalytics() {
  const stats = useMemo(() => {
    const durations = MOCK_SLEEP.map((e) => e.duration)
    const avg = durations.reduce((s, d) => s + d, 0) / durations.length
    return {
      avg: Math.round(avg * 10) / 10,
      min: Math.min(...durations),
      max: Math.max(...durations),
      total: MOCK_SLEEP.length,
      good: MOCK_SLEEP.filter((e) => e.quality === 'good').length,
      average: MOCK_SLEEP.filter((e) => e.quality === 'average').length,
      bad: MOCK_SLEEP.filter((e) => e.quality === 'bad').length,
    }
  }, [])

  const last14 = MOCK_SLEEP.slice(-14)
  const last7 = MOCK_SLEEP.slice(-7)

  return (
    <PageTransition>
      <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Sleep Analytics</h1>
          <p className="text-sm text-white/40 mt-0.5">Based on {stats.total} recorded nights</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Avg Duration', value: `${stats.avg}h`, icon: Moon, color: '#a78bfa', trend: '+0.3h' },
            { label: 'Best Night', value: `${stats.max}h`, icon: Award, color: '#4ade80' },
            { label: 'Worst Night', value: `${stats.min}h`, icon: TrendingDown, color: '#f87171' },
            { label: 'Improvement', value: '+12%', icon: TrendingUp, color: '#FF9F1A' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <s.icon className="h-4 w-4" style={{ color: s.color }} />
                {s.trend && <span className="text-[10px] font-semibold text-green-400">{s.trend}</span>}
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* 14-day chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Last 14 Nights</p>
            <div className="flex items-center gap-3">
              {Object.entries(qColor).map(([q, c]) => (
                <div key={q} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: c }} />
                  <span className="text-[10px] text-white/30 capitalize">{q}</span>
                </div>
              ))}
            </div>
          </div>
          <BarChart data={last14} />
          <div className="mt-3 flex justify-between text-[10px] text-white/20">
            <span>0h</span>
            <span>4h</span>
            <span>8h</span>
            <span>12h</span>
          </div>
        </motion.div>

        {/* Quality breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-5"
        >
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Quality Breakdown</p>
          <div className="space-y-3">
            {[
              { label: 'Good nights', count: stats.good, key: 'good' },
              { label: 'Average nights', count: stats.average, key: 'average' },
              { label: 'Bad nights', count: stats.bad, key: 'bad' },
            ].map((q) => {
              const pct = Math.round((q.count / stats.total) * 100)
              return (
                <div key={q.key} className="flex items-center gap-3">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold"
                    style={{ backgroundColor: qBg[q.key], color: qColor[q.key] }}
                  >
                    {pct}%
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60">{q.label}</span>
                      <span className="text-white/40">{q.count} nights</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: qColor[q.key] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Weekly comparison */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-5"
        >
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">This Week vs Last Week</p>
          <div className="grid grid-cols-2 gap-4">
            {['This week', 'Last week'].map((label, wi) => {
              const weekData = wi === 0 ? last7 : MOCK_SLEEP.slice(-14, -7)
              const weekAvg = (weekData.reduce((s, e) => s + e.duration, 0) / weekData.length).toFixed(1)
              const goodCount = weekData.filter((e) => e.quality === 'good').length
              return (
                <div key={label} className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4">
                  <p className="text-xs text-white/40 mb-2">{label}</p>
                  <p className="text-xl font-bold text-white">{weekAvg}h</p>
                  <p className="text-[11px] text-white/30 mt-1">{goodCount}/7 good nights</p>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
