import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Pencil, Crown, Package, Star } from 'lucide-react'
import { MOCK_PRODUCTS, PRODUCT_CATEGORIES } from '../../data/mockData'
import PageTransition from '../../components/layout/PageTransition'

const EMPTY_FORM = {
  name: '', price: '', description: '', image: '', stock: '',
  category: '', pack: '', bestSeller: false,
}

function packFromProduct(p) {
  return {
    name: p.name,
    price: String(p.price),
    description: p.description,
    image: p.image,
    stock: String(p.stock),
    category: p.category || '',
    pack: p.pack || '',
    bestSeller: p.bestSeller || false,
  }
}

export default function AdminProducts() {
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [mode, setMode] = useState(null)         // 'add' | 'edit'
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setEditTarget(null)
    setError('')
    setMode('add')
  }

  const openEdit = (product) => {
    setForm(packFromProduct(product))
    setEditTarget(product._id)
    setError('')
    setMode('edit')
  }

  const closeModal = () => { setMode(null); setEditTarget(null) }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.price || !form.description || !form.stock) {
      setError('Name, price, description and stock are required.')
      return
    }
    if (mode === 'add') {
      const newProduct = {
        _id: `prod_${Date.now()}`,
        name: form.name.trim(),
        price: parseFloat(form.price),
        description: form.description.trim(),
        image: form.image || '/products/adjustable_pillow.jpg',
        stock: parseInt(form.stock),
        category: form.category || 'accessories',
        pack: form.pack || '',
        bestSeller: form.bestSeller,
        rating: 0,
        reviewCount: 0,
      }
      setProducts((prev) => [newProduct, ...prev])
    } else {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === editTarget
            ? {
                ...p,
                name: form.name.trim(),
                price: parseFloat(form.price),
                description: form.description.trim(),
                image: form.image || p.image,
                stock: parseInt(form.stock),
                category: form.category || p.category,
                pack: form.pack || '',
                bestSeller: form.bestSeller,
              }
            : p
        )
      )
    }
    closeModal()
  }

  const handleDelete = (id) => {
    setDeleting(id)
    setTimeout(() => {
      setProducts((prev) => prev.filter((p) => p._id !== id))
      setDeleting(null)
    }, 400)
  }

  return (
    <PageTransition>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <p className="text-sm text-white/40 mt-0.5">{products.length} products in catalogue</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF9F1A] to-[#FF6B00] px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,159,26,0.3)] hover:shadow-[0_4px_20px_rgba(255,159,26,0.45)] transition-shadow"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] overflow-hidden">
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 px-5 py-3 border-b border-white/[0.05]">
            {['Product', 'Price', 'Stock', 'Pack', ''].map((h) => (
              <p key={h} className="text-xs font-semibold text-white/30 uppercase tracking-wider">{h}</p>
            ))}
          </div>
          <AnimatePresence>
            {products.map((p) => (
              <motion.div
                key={p._id}
                layout
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 items-center px-5 py-4 border-b border-white/[0.04] last:border-0"
              >
                {/* Product info */}
                <div className="flex items-center gap-3 min-w-0">
                  <img src={p.image} alt={p.name} className="h-11 w-11 rounded-xl object-cover shrink-0 bg-[#1a1a1a]" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                      {p.bestSeller && <Star className="h-3 w-3 text-[#FF9F1A] fill-[#FF9F1A] shrink-0" />}
                    </div>
                    <p className="text-[11px] text-white/30 truncate mt-0.5">{p.category}</p>
                  </div>
                </div>

                {/* Price */}
                <p className="text-sm font-bold text-white">{Math.round(p.price).toLocaleString()} MAD</p>

                {/* Stock */}
                <span
                  className="text-xs font-semibold rounded-full px-2.5 py-1 w-fit"
                  style={{
                    backgroundColor: p.stock > 50 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                    color: p.stock > 50 ? '#4ade80' : '#f87171',
                  }}
                >
                  {p.stock} left
                </span>

                {/* Pack badge */}
                <div>
                  {p.pack === 'standard' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold rounded-full bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20 px-2 py-0.5">
                      <Package className="h-2.5 w-2.5" /> Standard
                    </span>
                  )}
                  {p.pack === 'premium' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold rounded-full bg-[#FF9F1A]/10 text-[#FF9F1A] border border-[#FF9F1A]/20 px-2 py-0.5">
                      <Crown className="h-2.5 w-2.5" /> Premium
                    </span>
                  )}
                  {!p.pack && <span className="text-[11px] text-white/20">—</span>}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 hover:text-[#FF9F1A] hover:bg-[#FF9F1A]/10 transition-all"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    disabled={deleting === p._id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add / Edit Modal */}
        <AnimatePresence>
          {mode && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-lg -translate-y-1/2 rounded-2xl border border-white/[0.1] bg-[#0e0e0e] p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-white">
                    {mode === 'add' ? 'Add New Product' : 'Edit Product'}
                  </h2>
                  <button onClick={closeModal} className="rounded-lg p-1 text-white/30 hover:text-white transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Name */}
                  <Field label="Name" placeholder="Product name" value={form.name}
                    onChange={(v) => setForm((p) => ({ ...p, name: v }))} />

                  {/* Price + Stock */}
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Price (MAD)" type="number" placeholder="0" value={form.price}
                      onChange={(v) => setForm((p) => ({ ...p, price: v }))} />
                    <Field label="Stock" type="number" placeholder="0" value={form.stock}
                      onChange={(v) => setForm((p) => ({ ...p, stock: v }))} />
                  </div>

                  {/* Category + Pack */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-white/50 block mb-1">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                        className="w-full h-10 rounded-xl border border-white/[0.08] bg-[#141414] px-3 text-sm text-white outline-none focus:border-white/20 transition-colors"
                      >
                        <option value="">— None —</option>
                        {PRODUCT_CATEGORIES.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-white/50 block mb-1">Pack</label>
                      <select
                        value={form.pack}
                        onChange={(e) => setForm((p) => ({ ...p, pack: e.target.value }))}
                        className="w-full h-10 rounded-xl border border-white/[0.08] bg-[#141414] px-3 text-sm text-white outline-none focus:border-white/20 transition-colors"
                      >
                        <option value="">— None —</option>
                        <option value="standard">Pack Standard</option>
                        <option value="premium">Pack Premium</option>
                      </select>
                    </div>
                  </div>

                  {/* Image URL */}
                  <Field label="Image URL (optional)" placeholder="https://... or /products/..." value={form.image}
                    onChange={(v) => setForm((p) => ({ ...p, image: v }))} />

                  {/* Description */}
                  <div>
                    <label className="text-xs font-semibold text-white/50 block mb-1">Description</label>
                    <textarea
                      placeholder="Product description..."
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                      rows={3}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#141414] px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/20 transition-colors resize-none"
                    />
                  </div>

                  {/* Best Seller toggle */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div
                      onClick={() => setForm((p) => ({ ...p, bestSeller: !p.bestSeller }))}
                      className={`relative h-5 w-9 rounded-full transition-colors ${form.bestSeller ? 'bg-[#FF9F1A]' : 'bg-white/10'}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.bestSeller ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm text-white/60">Mark as Best Seller</span>
                  </label>

                  {error && <p className="text-xs text-red-400">{error}</p>}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-[#FF9F1A] to-[#FF6B00] py-2.5 text-sm font-bold text-white mt-1"
                  >
                    {mode === 'add' ? 'Create Product' : 'Save Changes'}
                  </button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="text-xs font-semibold text-white/50 block mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-xl border border-white/[0.08] bg-[#141414] px-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/20 transition-colors"
      />
    </div>
  )
}
