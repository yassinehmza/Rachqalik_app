import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Package } from 'lucide-react'
import { MOCK_PRODUCTS } from '../../data/mockData'
import PageTransition from '../../components/layout/PageTransition'

const EMPTY_FORM = { name: '', price: '', description: '', image: '', stock: '' }

export default function AdminProducts() {
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')

  const handleCreate = (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.price || !form.description || !form.stock) {
      setError('All fields except image are required.')
      return
    }
    const newProduct = {
      _id: `prod_${Date.now()}`,
      name: form.name.trim(),
      price: parseFloat(form.price),
      description: form.description.trim(),
      image: form.image || 'https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=800',
      stock: parseInt(form.stock),
      category: 'accessories',
      rating: 0,
      reviewCount: 0,
      bestSeller: false,
    }
    setProducts((prev) => [newProduct, ...prev])
    setForm(EMPTY_FORM)
    setShowModal(false)
  }

  const handleDelete = (id) => {
    setDeleting(id)
    setTimeout(() => {
      setProducts((prev) => prev.filter((p) => p._id !== id))
      setDeleting(null)
    }, 500)
  }

  return (
    <PageTransition>
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <p className="text-sm text-white/40 mt-0.5">{products.length} products in catalogue</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF9F1A] to-[#FF6B00] px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,159,26,0.3)] hover:shadow-[0_4px_20px_rgba(255,159,26,0.45)] transition-shadow"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0e0e0e] overflow-hidden">
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_80px] gap-4 px-5 py-3 border-b border-white/[0.05]">
            {['Product', 'Price', 'Stock', ''].map((h) => (
              <p key={h} className="text-xs font-semibold text-white/30 uppercase tracking-wider">{h}</p>
            ))}
          </div>
          <AnimatePresence>
            {products.map((p) => (
              <motion.div
                key={p._id}
                layout
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_1fr_80px] gap-4 items-center px-5 py-4 border-b border-white/[0.04] last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={p.image} alt={p.name} className="h-11 w-11 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                    <p className="text-[11px] text-white/30 truncate">{p.description}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{Math.round(p.price).toLocaleString()} MAD</p>
                </div>
                <div>
                  <span
                    className="text-xs font-semibold rounded-full px-2.5 py-1"
                    style={{
                      backgroundColor: p.stock > 50 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                      color: p.stock > 50 ? '#4ade80' : '#f87171',
                    }}
                  >
                    {p.stock} left
                  </span>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(p._id)}
                    disabled={deleting === p._id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 rounded-2xl border border-white/[0.1] bg-[#0e0e0e] p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-white">Add New Product</h2>
                  <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-white/30 hover:text-white transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-3">
                  {[
                    { key: 'name', label: 'Name', placeholder: 'Product name', type: 'text' },
                    { key: 'price', label: 'Price (MAD)', placeholder: '0', type: 'number' },
                    { key: 'stock', label: 'Stock', placeholder: '0', type: 'number' },
                    { key: 'image', label: 'Image URL (optional)', placeholder: 'https://...', type: 'text' },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key}>
                      <label className="text-xs font-semibold text-white/50 block mb-1">{label}</label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                        className="w-full h-10 rounded-xl border border-white/[0.08] bg-[#141414] px-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/20 transition-colors"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold text-white/50 block mb-1">Description</label>
                    <textarea
                      placeholder="Product description..."
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                      rows={3}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#141414] px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/20 transition-colors resize-none"
                    />
                  </div>

                  {error && <p className="text-xs text-red-400">{error}</p>}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-[#FF9F1A] to-[#FF6B00] py-2.5 text-sm font-bold text-white"
                  >
                    Create Product
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
