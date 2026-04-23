import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart2,
  Settings, LogOut, ArrowLeft, ChevronLeft, ChevronRight,
  Terminal, TrendingUp, Database, Zap,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { MOCK_ALL_ORDERS } from '../../data/mockData'

const pendingCount  = MOCK_ALL_ORDERS.filter(o => o.status === 'pending').length
const totalRevenue  = MOCK_ALL_ORDERS.reduce((s, o) => s + o.total, 0)

const SECTIONS = [
  {
    label: 'OVERVIEW',
    items: [{ to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true }],
  },
  {
    label: 'CATALOGUE',
    items: [{ to: '/admin/products', icon: Package, label: 'Products' }],
  },
  {
    label: 'OPERATIONS',
    items: [
      { to: '/admin/orders', icon: ShoppingBag, label: 'Orders', badge: String(pendingCount), badgeColor: '#fb923c' },
      { to: '/admin/customers', icon: Users, label: 'Customers' },
    ],
  },
  {
    label: 'INTELLIGENCE',
    items: [{ to: '/admin/analytics', icon: BarChart2, label: 'Analytics', soon: true }],
  },
  {
    label: 'SYSTEM',
    items: [{ to: '/admin/settings', icon: Settings, label: 'Settings', soon: true }],
  },
]

const SYSTEM_HEALTH = [
  { label: 'API', up: true },
  { label: 'DB',  up: true },
  { label: 'CDN', up: true },
]

function NavItem({ item, collapsed }) {
  if (item.soon) {
    return (
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-not-allowed select-none">
        <item.icon className="h-4 w-4 shrink-0 text-white/[0.12]" />
        {!collapsed && (
          <>
            <span className="flex-1 text-sm text-white/[0.15]">{item.label}</span>
            <span className="text-[9px] font-bold uppercase tracking-wide text-white/[0.18] bg-white/[0.04] border border-white/[0.06] rounded-md px-1.5 py-0.5">
              Soon
            </span>
          </>
        )}
      </div>
    )
  }
  return (
    <NavLink
      to={item.to}
      end={item.end}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
        ${isActive ? 'text-white' : 'text-white/40 hover:text-white/75 hover:bg-white/[0.04]'}`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="admin-nav-active"
              className="absolute inset-0 rounded-xl bg-[#FF9F1A]/[0.1] border border-[#FF9F1A]/[0.18]"
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            />
          )}
          <item.icon className={`relative z-10 h-4 w-4 shrink-0 ${isActive ? 'text-[#FF9F1A]' : ''}`} />
          {!collapsed && (
            <>
              <span className="relative z-10 flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span
                  className="relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{
                    color: item.badgeColor || '#FF9F1A',
                    backgroundColor: `${item.badgeColor || '#FF9F1A'}18`,
                    border: `1px solid ${item.badgeColor || '#FF9F1A'}28`,
                  }}
                >
                  {item.badge}
                </span>
              )}
              {isActive && !item.badge && (
                <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-[#FF9F1A] shrink-0" />
              )}
            </>
          )}
          {collapsed && item.badge && (
            <span
              className="absolute top-1 right-1 h-2 w-2 rounded-full border-2 border-[#060810]"
              style={{ backgroundColor: item.badgeColor || '#FF9F1A' }}
            />
          )}
        </>
      )}
    </NavLink>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-[#060606] overflow-hidden">

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside
        className={`shrink-0 flex flex-col bg-[#060810] border-r border-white/[0.06] transition-[width] duration-300 overflow-hidden ${
          collapsed ? 'w-[68px]' : 'w-72'
        }`}
      >
        {/* Logo row */}
        <div
          className={`flex items-center border-b border-white/[0.05] ${
            collapsed ? 'justify-center p-[18px]' : 'gap-3 px-5 py-[18px]'
          }`}
        >
          <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#FF9F1A] to-[#FF6B00] shadow-[0_0_24px_rgba(255,159,26,0.28)]">
            <Terminal className="h-[18px] w-[18px] text-white" />
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-white leading-tight">Rachqalik</p>
                <p className="text-[10px] font-black text-[#FF9F1A] uppercase tracking-[0.2em]">Command Center</p>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="p-1 rounded-lg text-white/25 hover:text-white/60 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Expand button (collapsed state) */}
        {collapsed && (
          <div className="flex justify-center py-2">
            <button
              onClick={() => setCollapsed(false)}
              className="p-1.5 rounded-lg text-white/25 hover:text-white/60 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Live metrics card */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-2">
            <div className="rounded-xl border border-[#FF9F1A]/[0.13] bg-gradient-to-br from-[#FF9F1A]/[0.06] to-transparent p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inset-0 rounded-full bg-green-400 opacity-70" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-green-400" />
                  </span>
                  <span className="text-[9px] font-black text-green-400 uppercase tracking-[0.16em]">Live</span>
                </div>
                <Zap className="h-3 w-3 text-[#FF9F1A]/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] text-white/30 uppercase tracking-wide mb-0.5">Revenue</p>
                  <p className="text-[15px] font-bold text-white leading-none">
                    {(totalRevenue / 1000).toFixed(1)}k{' '}
                    <span className="text-[10px] text-white/30 font-normal">MAD</span>
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <TrendingUp className="h-2.5 w-2.5 text-green-400" />
                    <span className="text-[9px] font-bold text-green-400">+18%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] text-white/30 uppercase tracking-wide mb-0.5">Pending</p>
                  <p className="text-[15px] font-bold text-[#fb923c] leading-none">{pendingCount}</p>
                  <p className="text-[9px] text-white/25 mt-1.5">order{pendingCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto py-3 space-y-4 ${collapsed ? 'px-2' : 'px-3'}`}>
          {SECTIONS.map((s) => (
            <div key={s.label}>
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-white/[0.16]">
                  {s.label}
                </p>
              )}
              {collapsed && <div className="mb-1 h-px bg-white/[0.06]" />}
              <div className="space-y-0.5">
                {s.items.map((item) => (
                  <NavItem key={item.to} item={item} collapsed={collapsed} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* System health */}
        {!collapsed && (
          <div className="px-3 pb-2">
            <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-2.5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/[0.18]">System</p>
                <Database className="h-3 w-3 text-white/[0.12]" />
              </div>
              <div className="flex items-center gap-3">
                {SYSTEM_HEALTH.map((s) => (
                  <div key={s.label} className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    <span className="text-[9px] text-white/30 font-semibold">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={`border-t border-white/[0.05] ${collapsed ? 'p-2 space-y-1' : 'p-3 space-y-1'}`}>
          {!collapsed ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-white/25 hover:text-white/55 hover:bg-white/[0.03] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to App
              </Link>
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="relative shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FF9F1A]/40 to-[#FF6B00]/20 flex items-center justify-center text-sm font-bold text-white border border-[#FF9F1A]/25">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-[#060810]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-[10px] font-bold text-[#FF9F1A]/70 uppercase tracking-wide">Admin</p>
                </div>
                <button
                  onClick={() => { logout(); navigate('/') }}
                  title="Logout"
                  className="rounded-lg p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                title="Back to App"
                className="flex items-center justify-center w-full p-2 rounded-xl text-white/25 hover:text-white/55 hover:bg-white/[0.03] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <button
                onClick={() => { logout(); navigate('/') }}
                title="Logout"
                className="flex items-center justify-center w-full p-2 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto bg-[#060606]">
        <Outlet />
      </main>
    </div>
  )
}
