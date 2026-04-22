import { motion } from 'framer-motion'
import { Package, ChevronDown, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { MOCK_ORDERS } from '../data/mockData'
import PageTransition from '../components/layout/PageTransition'

const statusConfig = {
  pending: { label: 'Pending', color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.2)' },
  paid: { label: 'Paid', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
  shipped: { label: 'Shipped', color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = statusConfig[order.status]
  const dateStr = new Date(order.createdAt).toLocaleDateString('en', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <motion.div
      layout
      className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] overflow-hidden"
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
        >
          <Package className="h-5 w-5" style={{ color: cfg.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">Order #{order._id.slice(-6).toUpperCase()}</p>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
            >
              {cfg.label}
            </span>
          </div>
          <p className="text-xs text-white/40 mt-0.5">{dateStr} · {order.products.length} item{order.products.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-white">{Math.round(order.total).toLocaleString()} MAD</p>
          <ChevronDown
            className="h-4 w-4 text-white/30 ml-auto mt-1 transition-transform"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </button>

      <AnimateCollapse open={expanded}>
        <div className="px-4 pb-4 border-t border-white/[0.04]">
          <div className="mt-3 space-y-2">
            {order.products.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-white/60">{item.name} ×{item.quantity}</span>
                <span className="text-white/40">{Math.round(item.price * item.quantity).toLocaleString()} MAD</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-white/[0.04] pt-2">
            <span className="text-xs text-white/40">Total</span>
            <span className="text-sm font-bold text-white">{Math.round(order.total).toLocaleString()} MAD</span>
          </div>
        </div>
      </AnimateCollapse>
    </motion.div>
  )
}

function AnimateCollapse({ open, children }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      style={{ overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  )
}

export default function Orders() {
  return (
    <PageTransition>
      <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Orders</h1>
            <p className="text-sm text-white/40 mt-0.5">{MOCK_ORDERS.length} orders placed</p>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#0e0e0e] px-3 py-2 text-xs font-medium text-white/60 hover:text-white hover:border-white/[0.15] transition-all"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Shop
          </Link>
        </div>

        <div className="space-y-3">
          {MOCK_ORDERS.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <OrderCard order={order} />
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
