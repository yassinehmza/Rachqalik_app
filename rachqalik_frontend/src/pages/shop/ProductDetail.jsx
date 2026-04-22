import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Minus, Plus, Star, CheckCircle, Shield, Truck, RefreshCcw } from 'lucide-react'
import { MOCK_PRODUCTS } from '../../data/mockData'
import { useCart } from '../../context/CartContext'
import PageTransition from '../../components/layout/PageTransition'

const GUARANTEES = [
  { icon: Truck, text: 'Free shipping on orders over 999 MAD' },
  { icon: Shield, text: '30-night sleep trial guarantee' },
  { icon: RefreshCcw, text: 'Easy returns within 60 days' },
]

export default function ProductDetail() {
  const { id } = useParams()
  const product = MOCK_PRODUCTS.find((p) => p._id === id)
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <p className="text-white/40 text-sm">Product not found.</p>
        <Link
          to="/shop"
          className="text-sm font-semibold text-[#FF9F1A] hover:underline"
        >
          ← Back to Shop
        </Link>
      </div>
    )
  }

  const handleAdd = () => {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  const relatedProducts = MOCK_PRODUCTS.filter((p) => p._id !== product._id)

  return (
    <PageTransition>
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-7"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* ── Image column ── */}
          <div className="space-y-3">
            {/* Main image — div wrapper, NOT motion element directly on img */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="relative rounded-2xl overflow-hidden border border-white/[0.07] bg-[#111] shadow-[0_0_60px_rgba(255,159,26,0.06)]"
              style={{ aspectRatio: '1 / 1' }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>

            {/* Thumbnail strip */}
            <div className="flex gap-2">
              {relatedProducts.map((p) => (
                <Link
                  key={p._id}
                  to={`/shop/${p._id}`}
                  className="group relative overflow-hidden rounded-xl border border-white/[0.06] hover:border-white/[0.18] transition-colors flex-1"
                  style={{ aspectRatio: '1 / 1' }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <p className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-semibold text-white/70 leading-tight line-clamp-2">
                    {p.name.split(' ').slice(-2).join(' ')}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Details column ── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#FF9F1A] text-[#FF9F1A]" />
                ))}
              </div>
              <span className="text-xs text-white/40">4.8 · 128 reviews</span>
            </div>

            {/* Title + description */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {product.name}
              </h1>
              <p className="mt-3 text-sm text-white/55 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Guarantees */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 space-y-2.5">
              {GUARANTEES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-white/50">
                  <Icon className="h-3.5 w-3.5 text-green-400 shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{Math.round(product.price).toLocaleString()} MAD</span>
              <span className="text-sm text-white/30">{product.stock} in stock</span>
            </div>

            {/* Quantity control */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/50 w-6">Qty</span>
              <div className="inline-flex items-center rounded-xl border border-white/[0.08] bg-[#111] overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="flex h-10 w-10 items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.05] transition-all disabled:opacity-30"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-white">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  disabled={qty >= product.stock}
                  className="flex h-10 w-10 items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.05] transition-all disabled:opacity-30"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-sm text-white/30">
                = {Math.round(product.price * qty).toLocaleString()} MAD
              </span>
            </div>

            {/* Add to cart CTA */}
            <button
              onClick={handleAdd}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all duration-300 active:scale-[0.98]"
              style={{
                background: added
                  ? 'rgba(74,222,128,0.1)'
                  : 'linear-gradient(135deg, #FF9F1A, #FF6B00)',
                color: added ? '#4ade80' : '#fff',
                border: added ? '1px solid rgba(74,222,128,0.3)' : 'none',
                boxShadow: added ? 'none' : '0 8px 28px rgba(255,159,26,0.35)',
              }}
            >
              {added ? (
                <><CheckCircle className="h-4 w-4" /> Added to Cart!</>
              ) : (
                <><ShoppingCart className="h-4 w-4" /> Add to Cart — {Math.round(product.price * qty).toLocaleString()} MAD</>
              )}
            </button>

            <Link
              to="/cart"
              className="block text-center text-xs text-white/25 hover:text-white/50 transition-colors"
            >
              View Cart →
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
