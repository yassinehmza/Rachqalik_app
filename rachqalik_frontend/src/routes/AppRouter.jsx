import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

import Navbar from '../components/Navbar'
import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'

import Dashboard from '../pages/Dashboard'
import SleepLog from '../pages/sleep/SleepLog'
import SleepHistory from '../pages/sleep/SleepHistory'
import SleepAnalytics from '../pages/sleep/SleepAnalytics'
import Shop from '../pages/shop/Shop'
import ProductDetail from '../pages/shop/ProductDetail'
import Cart from '../pages/Cart'
import Orders from '../pages/Orders'
import Profile from '../pages/Profile'
import Upgrade from '../pages/Upgrade'

import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminProducts from '../pages/admin/AdminProducts'
import AdminOrders from '../pages/admin/AdminOrders'

function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

function PublicShell() {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<PublicOnlyRoute><Login /></PublicOnlyRoute>}
          />
          <Route
            path="/register"
            element={<PublicOnlyRoute><Register /></PublicOnlyRoute>}
          />
          <Route
            path="/forgot-password"
            element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>}
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public pages — floating pill Navbar */}
      <Route path="/*" element={<PublicShell />} />

      {/* Authenticated app — sidebar layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/sleep/log" element={<SleepLog />} />
        <Route path="/sleep/history" element={<SleepHistory />} />
        <Route path="/sleep/analytics" element={<SleepAnalytics />} />

        {/* Shop inside the sidebar layout — no navbar overlay issue */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<ProductDetail />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/upgrade" element={<Upgrade />} />

        <Route
          path="/admin"
          element={<AdminRoute><AdminDashboard /></AdminRoute>}
        />
        <Route
          path="/admin/products"
          element={<AdminRoute><AdminProducts /></AdminRoute>}
        />
        <Route
          path="/admin/orders"
          element={<AdminRoute><AdminOrders /></AdminRoute>}
        />
      </Route>
    </Routes>
  )
}
