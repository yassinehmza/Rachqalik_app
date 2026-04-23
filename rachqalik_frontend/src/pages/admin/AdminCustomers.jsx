import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Pencil, Trash2, Crown, Users, ShoppingBag, TrendingUp } from 'lucide-react'
import { MOCK_CUSTOMERS } from '../../data/mockData'
import PageTransition from '../../components/layout/PageTransition'

function Avatar({ name, size = 'md' }) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
  const colors = [
    'from-[#FF9F1A] to-[#FF6B00]',
    'from-[#818cf8] to-[#6366f1]',
    'from-[#34d399] to-[#10b981]',
    'from-[#f472b6] to-[#ec4899]',
    'from-[#60a5fa] to-[#3b82f6]',
  ]
  const color = colors[name.charCodeAt(0) % colors.length]
  const sz = size === 'lg' ? 'h-12 w-12 text-base' : 'h-9 w-9 text-sm'
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-bold text-white shrink-0`}>
      {initials}
    </div>
  )
}

function PlanBadge({ plan }) {
  return plan === 'premium' ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold rounded-full bg-[#FF9F1A]/10 text-[#FF9F1A] border border-[#FF9F1A]/20 px-2 py-0.5">
      <Crown className="h-2.5 w-2.5" /> Premium
    </span>
  ) : (
    <span className="text-[10px] font-bold rounded-full bg-white/[0.06] text-white/40 border border-white/[0.08] px-2 py-0.5">
      Free
    </span>
  )
}

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return '1 day ago'
  if (diff < 30) return `${diff} days ago`
  const months = Math.floor(diff / 30)
  return `${months} month${months > 1 ? 's' : ''} ago`
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', plan: 'free' })
  const [deleting, setDeleting] = useState(null)

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase()
      if (q && !c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false
      if (planFilter !== 'all' && c.plan !== planFilter) return false
      return true
    })
  }, [customers, search, planFilter])

  const stats = useMemo(() => ({
    total: customers.length,
    premium: customers.filter((c) => c.plan === 'premium').length,
    revenue: customers.reduce((s, c) => s + c.totalSpent, 0),
  }), [customers])

  const openEdit = (c) => {
    setForm({ name: c.name, email: c.email, plan: c.plan })
    setEditing(c._id)
  }

  const handleSave = (e) => {
    e.preventDefault()
    setCustomers((prev) =>
      prev.map((c) => c._id === editing ? { ...c, name: form.name, email: form.email, plan: form.plan } : c)
    )
    setEditing(null)
  }

  const handleDelete = (id) => {
    setDeleting(id)
    setTimeout(() => {
      setCustomers((prev) => prev.filter((c) => c._id !== id))
      setDeleting(null)
    }, 400)
  }

  return (
    <PageTransition>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-sm text-white/40 mt-0.5">{customers.length} registered accounts</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, label: 'Total Users', value: stats.total, color: '#818cf8' },
            { icon: Crown, label: 'Premium', value: stats.premium, color: '#FF9F1A' },
            { icon: TrendingUp, label: 'Total Spent', value: `${stats.revenue.toLocaleString()} MAD`, color: '#34d399' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4" style={{ color }} />
                <p className="text-xs text-white/40 font-semibold uppercase tracking-wide">{label}</p>
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 h-10 flex-1 max-w-xs rounded-xl border border-white/[0.08] bg-[#141414] px-3 focus-within:border-white/20 transition-colors">
            <Search className="h-3.5 w-3.5 text-white/25 shrink-0" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-white/20 hover:text-white/50 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#141414] p-1">
            {['all', 'free', 'premium'].map((v) => (
              <button
                key={v}
                onClick={() => setPlanFilter(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  planFilter === v
                    ? 'bg-[#FF9F1A] text-black'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] overflow-hidden">
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3 border-b border-white/[0.05]">
            {['Customer', 'Plan', 'Orders', 'Joined', ''].map((h) => (
              <p key={h} className="text-xs font-semibold text-white/30 uppercase tracking-wider">{h}</p>
            ))}
          </div>
          <AnimatePresence>
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <Users className="h-10 w-10 text-white/10 mb-3" />
                <p className="text-sm text-white/30">No customers match your filters</p>
              </motion.div>
            )}
            {filtered.map((c) => (
              <motion.div
                key={c._id}
                layout
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 items-center px-5 py-4 border-b border-white/[0.04] last:border-0"
              >
                {/* Customer */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={c.name} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                    <p className="text-[11px] text-white/35 truncate">{c.email}</p>
                  </div>
                </div>

                {/* Plan */}
                <PlanBadge plan={c.plan} />

                {/* Orders */}
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-white/20" />
                  <span className="text-sm text-white/60">{c.orders}</span>
                  {c.totalSpent > 0 && (
                    <span className="text-[11px] text-white/25">· {c.totalSpent.toLocaleString()} MAD</span>
                  )}
                </div>

                {/* Joined */}
                <p className="text-[11px] text-white/35">{timeAgo(c.createdAt)}</p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => openEdit(c)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 hover:text-[#FF9F1A] hover:bg-[#FF9F1A]/10 transition-all"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    disabled={deleting === c._id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditing(null)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 rounded-2xl border border-white/[0.1] bg-[#0e0e0e] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <Avatar name={form.name || '?'} size="lg" />
                  <div>
                    <h2 className="text-base font-bold text-white">Edit Customer</h2>
                    <p className="text-xs text-white/30">{form.email}</p>
                  </div>
                </div>
                <button onClick={() => setEditing(null)} className="rounded-lg p-1 text-white/30 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-white/50 block mb-1">Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full h-10 rounded-xl border border-white/[0.08] bg-[#141414] px-3 text-sm text-white outline-none focus:border-white/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/50 block mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full h-10 rounded-xl border border-white/[0.08] bg-[#141414] px-3 text-sm text-white outline-none focus:border-white/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/50 block mb-1">Plan</label>
                  <div className="flex items-center gap-2">
                    {['free', 'premium'].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, plan: v }))}
                        className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border text-sm font-semibold capitalize transition-all ${
                          form.plan === v
                            ? v === 'premium'
                              ? 'bg-[#FF9F1A]/15 border-[#FF9F1A]/40 text-[#FF9F1A]'
                              : 'bg-white/10 border-white/20 text-white'
                            : 'bg-[#141414] border-white/[0.08] text-white/30 hover:text-white/60'
                        }`}
                      >
                        {v === 'premium' && <Crown className="h-3.5 w-3.5" />}
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-[#FF9F1A] to-[#FF6B00] py-2.5 text-sm font-bold text-white mt-1"
                >
                  Save Changes
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
