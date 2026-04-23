import { motion } from 'framer-motion'
import {
  TrendingUp, Package, Users, ShoppingBag, Bell,
  ArrowUpRight, Clock, CheckCircle, Truck, Crown,
  AlertTriangle, ArrowRight, Activity, Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { MOCK_ALL_ORDERS, MOCK_PRODUCTS } from '../../data/mockData'
import PageTransition from '../../components/layout/PageTransition'
import { useAuth } from '../../context/AuthContext'

/* ── Static data ──────────────────────────────────────────── */
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

const SPARKLINES = {
  revenue:   [1200, 1850, 1700, 2350, 2000, 2900, 3500],
  orders:    [1, 1, 2, 1, 3, 2, 5],
  customers: [1, 2, 2, 3, 3, 4, 4],
  aov:       [900, 1200, 1100, 1400, 1200, 1550, 2220],
}

const ACTIVITY = [
  { id: 1, Icon: ShoppingBag,   text: 'New order placed',     sub: 'Rachqalik Ice · 999 MAD',       time: '2m',  color: '#60a5fa' },
  { id: 2, Icon: Crown,         text: 'Premium upgrade',      sub: 'Sara El Fassi',                  time: '14m', color: '#a78bfa' },
  { id: 3, Icon: AlertTriangle, text: 'Low stock alert',      sub: 'Rachqalik Zen · 19 units left',  time: '1h',  color: '#fb923c' },
  { id: 4, Icon: CheckCircle,   text: 'Payment confirmed',    sub: '#ORD005 · 2,008 MAD',            time: '2h',  color: '#60a5fa' },
  { id: 5, Icon: Truck,         text: 'Order shipped',        sub: '#ORD004 · Tracking added',       time: '6h',  color: '#4ade80' },
  { id: 6, Icon: Package,       text: 'Restock request',      sub: 'Rachqalik Cloud · 5 left',       time: '1d',  color: '#FF9F1A' },
]

const USER_NAMES = {
  '64abc123def456789012345': 'Karim Benali',
  '64abc456def789012345678': 'Sara El Fassi',
  '64abc888def000000000888': 'Youssef Mansouri',
  '64abc777def000000000777': 'Nadia Cherkaoui',
}

const STATUS_CFG = {
  pending: { label: 'Pending', color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  Icon: Clock },
  paid:    { label: 'Paid',    color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  Icon: CheckCircle },
  shipped: { label: 'Shipped', color: '#4ade80', bg: 'rgba(74,222,128,0.12)', Icon: Truck },
}

/* ── Revenue chart ────────────────────────────────────────── */
const VBW = 580, VBH = 90, PAD = 8

function buildPts(data) {
  const vals = data.map(d => d.value)
  const max = Math.max(...vals), min = Math.min(...vals), range = max - min || 1
  return data.map((d, i) => [
    PAD + (i / (data.length - 1)) * (VBW - PAD * 2),
    PAD + (1 - (d.value - min) / range) * (VBH - PAD * 2),
  ])
}

function smoothPath(pts) {
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
  const pts     = buildPts(CHART_DAYS)
  const linePath = smoothPath(pts)
  const last     = pts[pts.length - 1]
  const areaPath = `${linePath} L ${last[0].toFixed(1)} ${VBH} L ${pts[0][0].toFixed(1)} ${VBH} Z`
  const evens    = CHART_DAYS.filter((_, i) => i % 2 === 0)
  const evenPts  = pts.filter((_, i) => i % 2 === 0)

  return (
    <div className="space-y-2.5">
      <div className="relative w-full" style={{ height: 110 }}>
        <svg viewBox={`0 0 ${VBW} ${VBH}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="revGradA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#FF9F1A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FF9F1A" stopOpacity="0"    />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map(f => (
            <line
              key={f}
              x1={PAD} y1={PAD + f * (VBH - PAD * 2)}
              x2={VBW - PAD} y2={PAD + f * (VBH - PAD * 2)}
              stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4"
            />
          ))}
          <path d={areaPath} fill="url(#revGradA)" />
          <path d={linePath} fill="none" stroke="#FF9F1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={last[0]} cy={last[1]} r="5.5" fill="#FF9F1A" fillOpacity="0.2" />
          <circle cx={last[0]} cy={last[1]} r="2.5" fill="#FF9F1A" />
        </svg>
      </div>
      <div className="relative w-full flex h-4">
        {evens.map((d, i) => {
          const pct = ((evenPts[i][0] - PAD) / (VBW - PAD * 2)) * 100
          return (
            <span key={d.label} className="absolute text-[10px] text-white/20 -translate-x-1/2" style={{ left: `${pct}%` }}>
              {d.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* ── Tiny sparkline ───────────────────────────────────────── */
function Sparkline({ data, color }) {
  const W = 56, H = 22
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / range) * H * 0.75 - H * 0.1,
  ])
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  return (
    <svg width={W} height={H} className="overflow-visible opacity-70">
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2" fill={color} />
    </svg>
  )
}

/* ── Donut chart ──────────────────────────────────────────── */
function Donut({ segments, size = 96, thickness = 11 }) {
  const r            = (size - thickness) / 2
  const cx           = size / 2
  const cy           = size / 2
  const circumference = 2 * Math.PI * r
  const total        = segments.reduce((s, d) => s + d.value, 0)
  let startAngle     = -90

  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={thickness} />
      {segments.map((seg, i) => {
        const pct    = seg.value / total
        const len    = pct * circumference
        const gap    = circumference - len
        const rotate = startAngle
        startAngle  += pct * 360
        return (
          <motion.circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={thickness}
            strokeDashoffset={0}
            transform={`rotate(${rotate.toFixed(2)} ${cx} ${cy})`}
            strokeLinecap="butt"
            initial={{ strokeDasharray: `0 ${circumference.toFixed(2)}` }}
            animate={{ strokeDasharray: `${len.toFixed(2)} ${gap.toFixed(2)}` }}
            transition={{ duration: 0.8, delay: i * 0.18, ease: 'easeOut' }}
          />
        )
      })}
    </svg>
  )
}

/* ── Main component ───────────────────────────────────────── */
export default function AdminDashboard() {
  const { user } = useAuth()

  const totalRevenue   = MOCK_ALL_ORDERS.reduce((s, o) => s + o.total, 0)
  const pendingOrders  = MOCK_ALL_ORDERS.filter(o => o.status === 'pending')
  const paidOrders     = MOCK_ALL_ORDERS.filter(o => o.status === 'paid')
  const shippedOrders  = MOCK_ALL_ORDERS.filter(o => o.status === 'shipped')
  const uniqueUsers    = new Set(MOCK_ALL_ORDERS.map(o => o.userId)).size
  const aov            = Math.round(totalRevenue / MOCK_ALL_ORDERS.length)
  const total          = MOCK_ALL_ORDERS.length
  const fulfillmentPct = Math.round((shippedOrders.length / total) * 100)

  const stockAlerts = [...MOCK_PRODUCTS].filter(p => p.stock < 60).sort((a, b) => a.stock - b.stock)

  const kpis = [
    {
      label: 'Total Revenue',
      value: `${(totalRevenue / 1000).toFixed(1)}k MAD`,
      sub: '+18% this week', positive: true,
      icon: TrendingUp, color: '#4ade80', bg: 'rgba(74,222,128,0.08)',
      spark: SPARKLINES.revenue,
    },
    {
      label: 'Total Orders',
      value: total,
      sub: `${pendingOrders.length} pending`, positive: false,
      icon: Package, color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',
      spark: SPARKLINES.orders,
    },
    {
      label: 'Customers',
      value: uniqueUsers,
      sub: '1 premium member', positive: true,
      icon: Users, color: '#a78bfa', bg: 'rgba(167,139,250,0.08)',
      spark: SPARKLINES.customers,
    },
    {
      label: 'Avg Order Value',
      value: `${aov.toLocaleString()} MAD`,
      sub: '↑ up from last week', positive: true,
      icon: ShoppingBag, color: '#FF9F1A', bg: 'rgba(255,159,26,0.08)',
      spark: SPARKLINES.aov,
    },
  ]

  const pipelineSegments = [
    { label: 'Pending', value: pendingOrders.length,  color: '#fb923c' },
    { label: 'Paid',    value: paidOrders.length,     color: '#60a5fa' },
    { label: 'Shipped', value: shippedOrders.length,  color: '#4ade80' },
  ]

  const recentOrders = [...MOCK_ALL_ORDERS]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const topProducts = [...MOCK_PRODUCTS].sort((a, b) => b.price - a.price).slice(0, 4)

  const today    = new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })
  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const TARGETS = [
    { label: 'Revenue Goal',  current: totalRevenue, target: 20000, color: '#FF9F1A' },
    { label: 'Orders Target', current: total,        target: 15,    color: '#60a5fa' },
    { label: 'New Customers', current: uniqueUsers,  target: 10,    color: '#a78bfa' },
  ]

  return (
    <PageTransition>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {greeting}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-white/30 mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="relative p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#fb923c] border border-[#060606]" />
            </button>
            <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/[0.07] px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-green-400 opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-green-400" />
              </span>
              <span className="text-xs font-semibold text-green-400">Live</span>
            </div>
          </div>
        </div>

        {/* ── KPI cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-white/[0.07] bg-[#0c0c14] p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="h-9 w-9 flex items-center justify-center rounded-xl"
                  style={{ backgroundColor: k.bg }}
                >
                  <k.icon className="h-4 w-4" style={{ color: k.color }} />
                </div>
                <Sparkline data={k.spark} color={k.color} />
              </div>
              <p className="text-2xl font-bold text-white leading-none mb-1">{k.value}</p>
              <p className="text-[11px] text-white/35 mb-2.5">{k.label}</p>
              <span
                className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                style={{
                  color: k.positive ? '#4ade80' : '#fb923c',
                  backgroundColor: k.positive ? 'rgba(74,222,128,0.08)' : 'rgba(251,146,60,0.08)',
                }}
              >
                {k.positive && <ArrowUpRight className="h-2.5 w-2.5" />}
                {k.sub}
              </span>
            </motion.div>
          ))}
        </div>

        {/* ── Revenue chart + Activity feed ──────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Revenue chart */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-2 rounded-2xl border border-white/[0.07] bg-[#0c0c14] p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-semibold text-white">Revenue Trend</p>
                <p className="text-xs text-white/30 mt-0.5">Daily · April 2026</p>
              </div>
              <span className="rounded-full border border-[#FF9F1A]/25 bg-[#FF9F1A]/10 px-2.5 py-1 text-[10px] font-bold text-[#FF9F1A]">
                +47% MoM
              </span>
            </div>
            <RevenueChart />
            <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-white/25">
              <span>Low: 1,200 MAD</span>
              <span className="flex items-center gap-1 text-[#FF9F1A] font-semibold">
                <Activity className="h-3 w-3" />
                Today: 3,500 MAD
              </span>
              <span>Peak: 3,500 MAD</span>
            </div>
          </motion.div>

          {/* Activity feed */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
            className="rounded-2xl border border-white/[0.07] bg-[#0c0c14] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05] shrink-0">
              <p className="text-sm font-semibold text-white">Activity Feed</p>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inset-0 rounded-full bg-[#FF9F1A] opacity-75" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-[#FF9F1A]" />
                </span>
                <span className="text-[10px] text-[#FF9F1A]/70 font-semibold">Live</span>
              </div>
            </div>
            <div className="flex-1 divide-y divide-white/[0.04] overflow-y-auto">
              {ACTIVITY.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.42 + i * 0.06 }}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5"
                    style={{ backgroundColor: `${a.color}15` }}
                  >
                    <a.Icon className="h-3.5 w-3.5" style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white/85 leading-tight">{a.text}</p>
                    <p className="text-[10px] text-white/35 mt-0.5 truncate">{a.sub}</p>
                  </div>
                  <span className="text-[10px] text-white/25 shrink-0 mt-0.5">{a.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom row ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Top products */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44 }}
            className="rounded-2xl border border-white/[0.07] bg-[#0c0c14] overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <p className="text-sm font-semibold text-white">Top Products</p>
              <Link to="/admin/products" className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors">
                Manage <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {topProducts.map((p, i) => {
                const stockPct = Math.min(100, (p.stock / 150) * 100)
                const isLow    = p.stock < 50
                return (
                  <div key={p._id} className="flex items-center gap-3 px-5 py-3.5">
                    <span className="text-xs font-bold text-white/[0.18] w-4 shrink-0">{i + 1}</span>
                    <div className="h-10 w-10 rounded-xl bg-[#141414] border border-white/[0.06] overflow-hidden shrink-0 p-1">
                      <img src={p.image} alt={p.name} className="h-full w-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-white/85 truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1 w-16 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${stockPct}%`, backgroundColor: isLow ? '#fb923c' : '#4ade80' }}
                          />
                        </div>
                        <span className={`text-[10px] font-medium ${isLow ? 'text-[#fb923c]' : 'text-white/25'}`}>
                          {p.stock}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white shrink-0">{p.price.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
            {stockAlerts.length > 0 && (
              <div className="border-t border-white/[0.05] px-5 py-3 bg-[#fb923c]/[0.03]">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3 w-3 text-[#fb923c]" />
                  <p className="text-[10px] font-semibold text-[#fb923c]">
                    {stockAlerts.length} product{stockAlerts.length > 1 ? 's' : ''} with low stock
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Recent orders */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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
                const cfg    = STATUS_CFG[order.status]
                const name   = USER_NAMES[order.userId] || 'Customer'
                const timeAgo = Math.floor((Date.now() - new Date(order.createdAt)) / 86400000)
                return (
                  <div key={order._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: cfg.bg }}
                    >
                      <cfg.Icon className="h-4 w-4" style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-white">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-[10px] text-white/35 truncate">{name}</p>
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

          {/* Pipeline donut + Weekly targets */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.56 }}
            className="rounded-2xl border border-white/[0.07] bg-[#0c0c14] p-5 space-y-5"
          >
            {/* Donut */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-white">Pipeline</p>
                <p className="text-[11px] text-white/30">{total} orders</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <Donut segments={pipelineSegments} size={90} thickness={11} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-lg font-bold text-white leading-none">{fulfillmentPct}%</p>
                    <p className="text-[9px] text-white/30">shipped</p>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  {pipelineSegments.map((seg) => (
                    <div key={seg.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                        <span className="text-white/50">{seg.label}</span>
                      </div>
                      <span className="font-bold" style={{ color: seg.color }}>{seg.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly targets */}
            <div className="border-t border-white/[0.05] pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-white">Weekly Targets</p>
                <Zap className="h-3.5 w-3.5 text-white/20" />
              </div>
              <div className="space-y-3">
                {TARGETS.map((t) => {
                  const pct = Math.min(100, Math.round((t.current / t.target) * 100))
                  return (
                    <div key={t.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/50">{t.label}</span>
                        <span className="font-bold" style={{ color: t.color }}>{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.8 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: t.color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  )
}
