import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Moon, History, BarChart2, ShoppingBag,
  ShoppingCart, Package, User, Crown, Shield, LogOut,
  ChevronRight, Menu, X, Activity,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/sleep/log', icon: Moon, label: 'Sleep Log' },
  { to: '/sleep/history', icon: History, label: 'Sleep History' },
  { to: '/sleep/analytics', icon: BarChart2, label: 'Analytics' },
  null,
  { to: '/shop', icon: ShoppingBag, label: 'Shop' },
  { to: '/cart', icon: ShoppingCart, label: 'Cart', cart: true },
  { to: '/orders', icon: Package, label: 'My Orders' },
  null,
  { to: '/profile', icon: User, label: 'Profile' },
]

function NavItem({ item, collapsed, onClick }) {
  const { count } = useCart()
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 group
        ${isActive
          ? 'bg-white/[0.08] text-white'
          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active"
              className="absolute inset-0 rounded-xl bg-white/[0.08]"
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            />
          )}
          <item.icon className="relative z-10 h-4 w-4 shrink-0" />
          <span className={`relative z-10 flex-1 truncate transition-opacity duration-200 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            {item.label}
          </span>
          {item.cart && count > 0 && !collapsed && (
            <span className="relative z-10 ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#FF9F1A] text-[10px] font-bold text-black">
              {count}
            </span>
          )}
          {item.cart && count > 0 && collapsed && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#FF9F1A]" />
          )}
        </>
      )}
    </NavLink>
  )
}

function Sidebar({ collapsed, setCollapsed, onClose, mobile }) {
  const { user, logout, isAdmin, isPremium, trialDaysLeft } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    onClose?.()
  }

  return (
    <div className={`flex h-full flex-col bg-[#090909] border-r border-white/[0.06] transition-all duration-300 ${mobile ? 'w-72' : collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/[0.06]">
        <div className={`flex items-center gap-2 overflow-hidden`}>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF9F1A] to-[#FF6B00]">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className={`font-bold text-white text-sm tracking-wide transition-all duration-200 ${collapsed && !mobile ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            Rachqalik
          </span>
        </div>
        {!mobile && (
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-lg p-1 text-white/30 hover:text-white/70 transition-colors"
          >
            <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        )}
        {mobile && (
          <button onClick={onClose} className="rounded-lg p-1 text-white/30 hover:text-white/70">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV.map((item, i) =>
          item === null ? (
            <div key={`sep-${i}`} className="my-2 border-t border-white/[0.05]" />
          ) : (
            <NavItem key={item.to} item={item} collapsed={collapsed && !mobile} onClick={onClose} />
          )
        )}

        {!isPremium && (
          <NavLink
            to="/upgrade"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150
              ${isActive ? 'bg-amber-500/10 text-[#FF9F1A]' : 'text-[#FF9F1A]/60 hover:text-[#FF9F1A] hover:bg-amber-500/[0.06]'}`
            }
          >
            <Crown className="h-4 w-4 shrink-0" />
            <span className={`truncate transition-opacity duration-200 ${collapsed && !mobile ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              Upgrade Plan
            </span>
          </NavLink>
        )}

        {isAdmin && (
          <>
            <div className="my-2 border-t border-white/[0.05]" />
            {[
              { to: '/admin', icon: Shield, label: 'Admin Dashboard' },
              { to: '/admin/products', icon: ShoppingBag, label: 'Products' },
              { to: '/admin/orders', icon: Package, label: 'Orders' },
            ].map((item) => (
              <NavItem key={item.to} item={item} collapsed={collapsed && !mobile} onClick={onClose} />
            ))}
          </>
        )}
      </nav>

      {/* User section */}
      <div className="border-t border-white/[0.06] p-3">
        {!isPremium && !(collapsed && !mobile) && (
          <div className="mb-3 rounded-xl bg-amber-500/[0.07] border border-amber-500/20 px-3 py-2">
            <p className="text-[11px] text-amber-400/80 font-medium">
              {trialDaysLeft > 0 ? `${trialDaysLeft} trial days left` : 'Trial expired'}
            </p>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className={`flex-1 overflow-hidden transition-all duration-200 ${collapsed && !mobile ? 'opacity-0 w-0' : 'opacity-100'}`}>
            <p className="truncate text-xs font-semibold text-white">{user?.name}</p>
            <p className="truncate text-[11px] text-white/40">{user?.plan === 'premium' ? '✦ Premium' : 'Free plan'}</p>
          </div>
          <button
            onClick={handleLogout}
            className={`rounded-lg p-1.5 text-white/30 hover:text-red-400 transition-colors ${collapsed && !mobile ? 'ml-auto' : ''}`}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#060606] overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:block h-full shrink-0">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              <Sidebar mobile onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex h-14 items-center gap-3 border-b border-white/[0.06] bg-[#090909] px-4 md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1.5 text-white/50 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#FF9F1A] to-[#FF6B00]">
              <Activity className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">Rachqalik</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
