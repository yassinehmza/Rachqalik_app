import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle, Truck, ChevronDown, Download, Package } from 'lucide-react'
import { MOCK_ALL_ORDERS } from '../../data/mockData'
import PageTransition from '../../components/layout/PageTransition'

const STATUSES = ['pending', 'paid', 'shipped']

const STATUS_CFG = {
  pending: { label: 'Pending', color: '#fb923c', bg: 'rgba(251,146,60,0.1)', Icon: Clock },
  paid:    { label: 'Paid',    color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', Icon: CheckCircle },
  shipped: { label: 'Shipped', color: '#4ade80', bg: 'rgba(74,222,128,0.1)', Icon: Truck },
}

const USER_NAMES = {
  '64abc123def456789012345': 'Karim Benali',
  '64abc456def789012345678': 'Sara El Fassi',
  '64abc888def000000000888': 'Youssef Mansouri',
  '64abc777def000000000777': 'Nadia Cherkaoui',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState(MOCK_ALL_ORDERS)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)
  const filteredRevenue = filtered.reduce((s, o) => s + o.total, 0)

  const updateStatus = (id, status) =>
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)))

  const handleExport = () => {
    const csv = [
      'Order ID,Customer,Items,Total (MAD),Status,Date',
      ...filtered.map((o) =>
        [
          o._id,
          USER_NAMES[o.userId] || 'Unknown',
          o.products.length,
          o.total,
          o.status,
          new Date(o.createdAt).toLocaleDateString(),
        ].join(',')
      ),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a    = document.createElement('a')
    a.href     = URL.createObjectURL(blob)
    a.download = `rachqalik-orders-${filter}.csv`
    a.click()
  }

  return (
    <PageTransition>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Orders</h1>
            <p className="text-sm text-white/40 mt-0.5">
              {filtered.length} order{filtered.length !== 1 ? 's' : ''} · {Math.round(filteredRevenue).toLocaleString()} MAD
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#0e0e0e] px-3 py-2 text-xs font-medium text-white/50 hover:text-white hover:border-white/[0.14] transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>

        {/* Summary pills */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'All', value: 'all', count: orders.length, revenue: orders.reduce((s, o) => s + o.total, 0), color: 'rgba(255,255,255,0.08)', text: 'white' },
            ...STATUSES.map((s) => ({
              label: STATUS_CFG[s].label,
              value: s,
              count: orders.filter((o) => o.status === s).length,
              revenue: orders.filter((o) => o.status === s).reduce((acc, o) => acc + o.total, 0),
              color: STATUS_CFG[s].bg,
              text: STATUS_CFG[s].color,
            })),
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className="rounded-xl border p-3 text-left transition-all"
              style={{
                backgroundColor: filter === tab.value ? tab.color : 'transparent',
                borderColor: filter === tab.value ? `${tab.text}30` : 'rgba(255,255,255,0.06)',
              }}
            >
              <p className="text-xs font-medium text-white/40">{tab.label}</p>
              <p className="text-lg font-bold mt-0.5" style={{ color: filter === tab.value ? tab.text : 'rgba(255,255,255,0.7)' }}>
                {tab.count}
              </p>
              <p className="text-[10px] text-white/25">{Math.round(tab.revenue).toLocaleString()} MAD</p>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0c0c14] overflow-hidden">
          <div className="hidden md:grid grid-cols-[auto_1fr_1fr_1fr_1fr_160px] gap-4 px-5 py-3.5 border-b border-white/[0.05]">
            {['', 'Order', 'Customer', 'Items', 'Total', 'Status'].map((h) => (
              <p key={h} className="text-[10px] font-semibold text-white/25 uppercase tracking-wider">{h}</p>
            ))}
          </div>

          <AnimatePresence>
            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <Package className="h-8 w-8 text-white/10 mx-auto mb-3" />
                <p className="text-sm text-white/25">No orders for this filter</p>
              </div>
            )}
            {filtered.map((order, i) => {
              const cfg      = STATUS_CFG[order.status]
              const customer = USER_NAMES[order.userId] || 'Unknown'
              const dateStr  = new Date(order.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_1fr_1fr_160px] gap-3 md:gap-4 items-center px-5 py-4 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.015] transition-colors"
                >
                  <div
                    className="hidden md:flex h-8 w-8 items-center justify-center rounded-xl shrink-0"
                    style={{ backgroundColor: cfg.bg }}
                  >
                    <cfg.Icon className="h-4 w-4" style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">#{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-[11px] text-white/30">{dateStr}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/80 font-medium truncate">{customer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/55">{order.products.length} item{order.products.length !== 1 ? 's' : ''}</p>
                    <p className="text-[11px] text-white/25 truncate">
                      {order.products.map((p) => p.name.split(' ').slice(-1)[0]).join(', ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{Math.round(order.total).toLocaleString()} MAD</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5"
                    style={{ borderColor: `${cfg.color}30`, backgroundColor: cfg.bg }}
                  >
                    <cfg.Icon className="h-3.5 w-3.5 shrink-0" style={{ color: cfg.color }} />
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="flex-1 bg-transparent text-xs font-semibold outline-none cursor-pointer appearance-none"
                      style={{ color: cfg.color }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} style={{ backgroundColor: '#111', color: '#fff' }}>
                          {STATUS_CFG[s].label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="h-3 w-3 shrink-0" style={{ color: cfg.color }} />
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

      </div>
    </PageTransition>
  )
}
