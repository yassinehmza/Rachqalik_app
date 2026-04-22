import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart2,
  Settings, LogOut, Activity, ArrowLeft,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

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
      { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
      { to: '/admin/customers', icon: Users, label: 'Customers', soon: true },
    ],
  },
  {
    label: 'ANALYTICS',
    items: [{ to: '/admin/analytics', icon: BarChart2, label: 'Analytics', soon: true }],
  },
  {
    label: 'SYSTEM',
    items: [{ to: '/admin/settings', icon: Settings, label: 'Settings', soon: true }],
  },
]

function NavItem({ item }) {
  if (item.soon) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl select-none cursor-not-allowed">
        <item.icon className="h-4 w-4 shrink-0 text-white/15" />
        <span className="flex-1 text-sm text-white/15">{item.label}</span>
        <span className="text-[9px] font-bold uppercase tracking-wide text-white/20 bg-white/[0.05] rounded-full px-1.5 py-0.5">
          Soon
        </span>
      </div>
    )
  }
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border
        ${isActive
          ? 'bg-[#FF9F1A]/[0.09] text-white border-[#FF9F1A]/25'
          : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04] border-transparent'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-[#FF9F1A]' : ''}`} />
          <span className="flex-1 truncate">{item.label}</span>
          {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#FF9F1A] shrink-0" />}
        </>
      )}
    </NavLink>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-[#060606] overflow-hidden">
      {/* Admin sidebar */}
      <aside className="w-64 shrink-0 flex flex-col bg-[#060810] border-r border-white/[0.06]">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF9F1A] to-[#FF6B00] shadow-[0_0_24px_rgba(255,159,26,0.35)]">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Rachqalik</p>
              <p className="text-[10px] font-bold text-[#FF9F1A] uppercase tracking-[0.16em]">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {SECTIONS.map((s) => (
            <div key={s.label}>
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/20">
                {s.label}
              </p>
              <div className="space-y-0.5">
                {s.items.map((item) => <NavItem key={item.to} item={item} />)}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/[0.05] space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.03] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Link>

          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="relative shrink-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FF9F1A]/40 to-[#FF6B00]/20 flex items-center justify-center text-sm font-bold text-white border border-[#FF9F1A]/30">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-[#060810]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] font-bold text-[#FF9F1A]/80 uppercase tracking-wide">Administrator</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/') }}
              title="Logout"
              className="rounded-lg p-1.5 text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-[#060606]">
        <Outlet />
      </main>
    </div>
  )
}
