import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, CheckCircle, ShoppingBag, Package } from 'lucide-react'
import { useCart } from '../context/CartContext'
import PageTransition from '../components/layout/PageTransition'

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total, count } = useCart()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleCheckout = () => {
    setPlacing(true)
    setTimeout(() => {
      clearCart()
      setSuccess(true)
      setTimeout(() => navigate('/orders'), 2200)
    }, 1000)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 p-8 py-24">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20"
        >
          <CheckCircle className="h-12 w-12 text-green-400" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Order Placed!</h2>
          <p className="text-white/40 text-sm">Redirecting you to your orders…</p>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center h-full gap-5 p-8 py-24">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.07]">
            <ShoppingCart className="h-9 w-9 text-white/20" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-white/40 text-sm">Add some products to get started</p>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-2 rounded-xl bg-[#FF9F1A] px-5 py-2.5 text-sm font-bold text-black shadow-[0_4px_14px_rgba(255,159,26,0.3)] hover:bg-[#FF9F1A]/90 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Browse Shop
          </Link>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
            <p className="text-white/40 text-sm mt-1">{count} {count === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={clearCart} className="text-xs text-white/30 hover:text-red-400 transition-colors">
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-4 hover:border-white/[0.12] transition-colors"
                >
                  <div className="h-16 w-16 rounded-xl bg-[#141414] border border-white/[0.06] overflow-hidden shrink-0 p-1.5">
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">{Math.round(item.price).toLocaleString()} MAD each</p>
                  </div>
                  <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#141414] overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-white w-24 text-right shrink-0">
                    {Math.round(item.price * item.quantity).toLocaleString()} MAD
                  </span>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="rounded-lg p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-5 sticky top-6 space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#FF9F1A]" />
                <p className="text-sm font-semibold text-white">Order Summary</p>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-xs text-white/40">
                    <span className="truncate mr-2">{item.name} ×{item.quantity}</span>
                    <span className="shrink-0">{Math.round(item.price * item.quantity).toLocaleString()} MAD</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-3 space-y-2">
                <div className="flex justify-between text-xs text-white/40">
                  <span>Subtotal</span>
                  <span>{Math.round(total).toLocaleString()} MAD</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Shipping</span>
                  <span className="text-green-400 font-medium">Free</span>
                </div>
              </div>
              <div className="border-t border-white/[0.06] pt-3 flex justify-between items-center">
                <span className="font-semibold text-white text-sm">Total</span>
                <span className="font-bold text-white text-xl">{Math.round(total).toLocaleString()} MAD</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={placing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF9F1A] py-3 text-sm font-bold text-black shadow-[0_6px_20px_rgba(255,159,26,0.3)] hover:bg-[#FF9F1A]/90 hover:shadow-[0_6px_28px_rgba(255,159,26,0.45)] transition-all disabled:opacity-60"
              >
                {placing ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                      className="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black"
                    />
                    Placing Order…
                  </>
                ) : (
                  <>Place Order <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
              <Link to="/shop" className="block text-center text-xs text-white/30 hover:text-white/60 transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
