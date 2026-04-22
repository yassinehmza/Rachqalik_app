import { motion } from 'framer-motion'
import {
  TrendingUp, Package, Users, ShoppingBag,
  ArrowRight, ArrowUpRight, Clock, CheckCircle, Truck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { MOCK_ALL_ORDERS, MOCK_PRODUCTS } from '../../data/mockData'
import PageTransition from '../../components/layout/PageTransition'

/* ── Static chart data (14-day revenue trend) ─────────────── */
const CHART_DAYS = [
  { label: '9',  value: 1200 },
  { label: '10', value: 1850 },
  { label: '11', value: 1450 },
  { label: '12', value: 2100 },
  { label: '13', value: 1700 },
  { label: '14', value: 2350 },
  { label: '15', value: 2000 },
  { label: '16', value: 2480 },
  { label: '17', value: 2100 },
  { label: '18', value: 2900 },
  { label: '19', value: 2550 },
  { label: '20', value: 3200 },
  { label: '21', value: 2850 },
  { label: '22', value: 3500 },
]

const USER_NAMES = {
  '64abc123def456789012345': 'Karim Benali',
  '64abc456def789012345678': 'Sara El Fassi',
  '64abc888def000000000888': 'Youssef Mansouri',
  '64abc777def000000000777': 'Nadia Cherkaoui',
}

const STATUS_CFG = {
  pending: { label: 'Pending', color: '#fb923c', bg: 'rgba(251,146,60,0.12)', Icon: Clock },
  paid:    { label: 'Paid',    color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  Icon: CheckCircle },
  shipped: { label: 'Shipped', color: '#4ade80', bg: 'rgba(74,222,128,0.12)', Icon: Truck },
}

/* ── SVG smooth-curve helpers ─────────────────────────────── */
const VB_W = 600, VB_H = 80, PAD = 6

function buildPts(data) {
  const max = Math.max(...data.map((d) => d.value))
  const min = Math.min(...data.map((d) => d.value))
  const range = max - min || 1
  return data.map((d, i) => [
    PAD + (i / (data.length - 1)) * (VB_W - PAD * 2),
    PAD + (1 - (d.value - min) / range) * (VB_H - PAD * 2),
  ])
}

function smoothLine(pts) {
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const cx = ((x0 + x1) / 2).toFixed(1)
    d += ` C ${cx} ${y0.toFixed(1)}, ${cx} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`
  }
  return d
}

function RevenueChart() {
  const pts = buildPts(CHART_DAYS)
  const linePath = smoothLine(pts)
  const last = pts[pts.length - 1]
  const areaPath = `${linePath} L ${last[0].toFixed(1)} ${VB_H} L ${pts[0][0].toFixed(1)} ${VB_H} Z`

  const axisLabels = CHART_DAYS.filter((_, i) => i % 2 === 0)
  const axisPts    = pts.filter((_, i) => i % 2 === 0)

  return (
    <div className="space-y-2">
      <div className="relative w-full" style={{ height: 100 }}>
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#FF9F1A" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#FF9F1A" stopOpacity="0"    />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#revGrad)" />
          <path d={linePath} fill="none" stroke="#FF9F1A" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" />
          {/* End-point glow */}
          <circle cx={last[0]} cy={last[1]} r="5"  fill="#FF9F1A" fillOpacity="0.2" />
          <circle cx={last[0]} cy={last[1]} r="2.5" fill="#FF9F1A" />
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="relative w-full flex">
        {axisLabels.map((d, i) => {
          const pct = ((axisPts[i][0] - PAD) / (VB_W - PAD * 2)) * 100
          return (
            <span
              key={d.label}
              className="absolute text-[10px] text-white/20 -translate-x-1/2"
              style={{ left: `${pct}%` }}
            >
              {d.label} Apr
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* ── Main component ───────────────────────────────────────── */
export default function AdminDashboard() {
  const totalRevenue = MOCK_ALL_ORDERS.reduce((s, o) => s + o.total, 0)
  const pendingOrders  = MOCK_ALL_ORDERS.filter((o) => o.status === 'pending')
  const paidOrders     = MOCK_ALL_ORDERS.filter((o) => o.status === 'paid')
  const shippedOrders  = MOCK_ALL_ORDERS.filter((o) => o.status === 'shipped')
  const uniqueUsers    = new Set(MOCK_ALL_ORDERS.map((o) => o.userId)).size
  const aov            = Math.round(totalRevenue / MOCK_ALL_ORDERS.length)
  const total          = MOCK_ALL_ORDERS.length

  const kpis = [
    {
      label: 'Total Revenue',
      value: `${Math.round(totalRevenue).toLocaleString()} MAD`,
      sub: '+18% this week',
      subPositive: true,
      icon: TrendingUp,
      color: '#4ade80',
      bg: 'rgba(74,222,128,0.08)',
    },
    {
      label: 'Total Orders',
      value: total,
      sub: `${pendingOrders.length} pending`,
      subPositive: false,
      icon: Package,
      color: '#60a5fa',
      bg: 'rgba(96,165,250,0.08)',
    },
    {
      label: 'Customers',
      value: uniqueUsers,
      sub: '1 premium member',
      subPositive: true,
      icon: Users,
      color: '#a78bfa',
      bg: 'rgba(167,139,250,0.08)',
    },
    {
      label: 'Avg Order Value',
      value: `${aov.toLocaleString()} MAD`,
      sub: '↑ up from last week',
      subPositive: true,
      icon: ShoppingBag,
      color: '#FF9F1A',
      bg: 'rgba(255,159,26,0.08)',
    },
  ]

  const pipeline = [
    { label: 'Pending',  count: pendingOrders.length, color: '#fb923c' },
    { label: 'Paid',     count: paidOrders.length,    color: '#60a5fa' },
    { label: 'Shipped',  count: shippedOrders.length, color: '#4ade80' },
  ]

  const topProducts = [...MOCK_PRODUCTS].sort((a, b) => b.price - a.price).slice(0, 4)

  const recentOrders = [...MOCK_ALL_ORDERS]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const today = new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <PageTransition>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">

        {/* ── Header ───────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Overview</h1>
            <p className="text-sm text-white/30 mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/[0.07] px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            <span className="text-xs font-semibold text-green-400">Live</span>
          </div>
        </div>

        {/* ── KPI cards ────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-white/[0.07] bg-[#0c0c14] p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: k.bg }}
                >
                  <k.icon className="h-4 w-4" style={{ color: k.color }} />
                </div>
                <span
                  className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                  style={{
                    color: k.subPositive ? '#4ade80' : '#fb923c',
                    backgroundColor: k.subPositive ? 'rgba(74,222,128,0.08)' : 'rgba(251,146,60,0.08)',
                  }}
                >
                  {k.subPositive ? <ArrowUpRight className="h-2.5 w-2.5" /> : null}
                  {k.sub}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{k.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{k.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Revenue chart + pipeline ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="lg:col-span-2 rounded-2xl border border-white/[0.07] bg-[#0c0c14] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Revenue Trend</p>
                <p className="text-xs text-white/30 mt-0.5">Daily · April 2026</p>
              </div>
              <span className="rounded-full border border-[#FF9F1A]/25 bg-[#FF9F1A]/10 px-2.5 py-1 text-[10px] font-bold text-[#FF9F1A]">
                +47% growth
              </span>
            </div>

            <RevenueChart />

            {/* Mini legend */}
            <div className="pt-4 flex items-center justify-between text-xs text-white/30">
              <span>Lowest: 1,200 MAD</span>
              <span className="text-[#FF9F1A] font-semibold">Today: 3,500 MAD</span>
              <span>Highest: 3,500 MAD</span>
            </div>
          </motion.div>

          {/* Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 }}
            className="rounded-2xl border border-white/[0.07] bg-[#0c0c14] p-5 space-y-5"
          >
            <div>
              <p className="text-sm font-semibold text-white">Order Pipeline</p>
              <p className="text-xs text-white/30 mt-0.5">{total} orders total</p>
            </div>

            <div className="space-y-4">
              {pipeline.map((p) => {
                const pct = Math.round((p.count / total) * 100)
                return (
                  <div key={p.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/60 font-medium">{p.label}</span>
                      <span className="font-bold" style={{ color: p.color }}>
                        {p.count} · {pct}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-3 space-y-1">
              <p className="text-[11px] text-white/30 font-medium uppercase tracking-wide">Fulfillment rate</p>
              <p className="text-2xl font-bold text-white">
                {Math.round((shippedOrders.length / total) * 100)}%
              </p>
              <p className="text-xs text-white/30">{shippedOrders.length} of {total} shipped</p>
            </div>
          </motion.div>
        </div>

        {/* ── Top products + Recent orders ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Top products */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-white/[0.07] bg-[#0c0c14] overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <p className="text-sm font-semibold text-white">Top Products</p>
              <Link to="/admin/products" className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors">
                Manage <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {topProducts.map((p, i) => (
                <div key={p._id} className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <span className="text-xs font-bold text-white/20 w-4 shrink-0">{i + 1}</span>
                  <div className="h-10 w-10 rounded-xl bg-[#141414] border border-white/[0.06] overflow-hidden shrink-0 p-1">
                    <img src={p.image} alt={p.name} className="h-full w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="h-1 w-20 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#FF9F1A]"
                          style={{ width: `${Math.min(100, (p.stock / 150) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-white/25">{p.stock} left</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white shrink-0">{Math.round(p.price).toLocaleString()} MAD</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent orders */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46 }}
            className="rounded-2xl border border-white/[0.07] bg-[#0c0c14] overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <p className="text-sm font-semibold text-white">Recent Orders</p>
              <Link to="/admin/orders" className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {recentOrders.map((order) => {
                const cfg = STATUS_CFG[order.status]
                const name = USER_NAMES[order.userId] || 'Customer'
                const timeAgo = Math.floor((Date.now() - new Date(order.createdAt)) / 86400000)
                return (
                  <div key={order._id} className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: cfg.bg }}
                    >
                      <cfg.Icon className="h-4 w-4" style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-[11px] text-white/35 truncate">{name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-white">{Math.round(order.total).toLocaleString()} MAD</p>
                      <p className="text-[10px] text-white/25">{timeAgo === 0 ? 'Today' : `${timeAgo}d ago`}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

      </div>
    </PageTransition>
  )
}
