import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Crown, Flame, Star, ShoppingCart, CheckCircle, X, Filter, RotateCcw } from 'lucide-react'
import { MOCK_PRODUCTS, PRODUCT_CATEGORIES } from '../../data/mockData'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import PageTransition from '../../components/layout/PageTransition'

const MAX_PRICE = 3500

function StarRow({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < Math.floor(value)
              ? 'fill-[#FF9F1A] text-[#FF9F1A]'
              : 'fill-[#2a2a2a] text-[#3a3a3a]'
          }`}
        />
      ))}
    </div>
  )
}

function ProductCard({ product, onAdd, added }) {
  const isLowStock = product.stock <= 20

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#141414] rounded-2xl overflow-hidden border border-[#222] hover:border-[#FF9F1A]/40 transition-all duration-300 group"
    >
      <div className="relative aspect-square p-6 bg-[#0d0d0d]">
        <Link to={`/shop/${product._id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {product.bestSeller && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#FF9F1A] text-black px-2 py-0.5 text-[10px] font-semibold">
            <Flame className="w-2.5 h-2.5" />
            Best Seller
          </span>
        )}

        <div className="absolute top-3 right-3 bg-[#FF9F1A] text-black px-3 py-1.5 rounded-full font-semibold text-sm">
          {Math.round(product.price).toLocaleString()} MAD
        </div>

        {isLowStock && (
          <span className="absolute bottom-3 left-3 rounded-full bg-red-500/90 text-white px-2 py-0.5 text-[10px] font-semibold">
            Only {product.stock} left
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <Link
          to={`/shop/${product._id}`}
          className="text-white font-medium hover:text-[#FF9F1A] transition-colors line-clamp-2 block text-sm"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-2">
          <StarRow value={product.rating} />
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>

        <button
          onClick={() => onAdd(product)}
          disabled={added}
          className={`w-full flex items-center justify-center gap-2 h-9 rounded-xl text-sm font-semibold transition-all duration-300 ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-[#FF9F1A] hover:bg-[#FF9F1A]/90 text-black shadow-[0_4px_14px_rgba(255,159,26,0.3)]'
          } disabled:cursor-not-allowed`}
        >
          {added ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

export default function Shop() {
  const { addItem } = useCart()
  const { isAuthenticated, isPremium } = useAuth()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCats, setSelectedCats] = useState([])
  const [priceMax, setPriceMax] = useState(MAX_PRICE)
  const [selectedRating, setSelectedRating] = useState(null)
  const [added, setAdded] = useState({})
  const [showBanner, setShowBanner] = useState(true)

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (selectedCats.length > 0 && !selectedCats.includes(p.category)) return false
      if (p.price > priceMax) return false
      if (selectedRating !== null && p.rating < selectedRating) return false
      return true
    })
  }, [searchQuery, selectedCats, priceMax, selectedRating])

  const toggleCat = (slug) => {
    setSelectedCats((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  const handleAdd = (product) => {
    addItem(product)
    setAdded((prev) => ({ ...prev, [product._id]: true }))
    setTimeout(() => setAdded((prev) => ({ ...prev, [product._id]: false })), 2000)
  }

  const handleReset = () => {
    setSearchQuery('')
    setSelectedCats([])
    setPriceMax(MAX_PRICE)
    setSelectedRating(null)
  }

  const hasActiveFilters =
    searchQuery || selectedCats.length > 0 || priceMax < MAX_PRICE || selectedRating !== null

  return (
    <PageTransition>
      <div className="text-white">
        {/* Premium banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ y: -60 }}
              animate={{ y: 0 }}
              exit={{ y: -60 }}
              className="sticky top-0 z-50 bg-gradient-to-r from-[#FF9F1A] to-[#FFB84D] text-black py-3 px-6"
            >
              <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 shrink-0" />
                  {isPremium ? (
                    <span className="font-semibold text-sm">
                      Premium Member — your 30% discount is active at checkout
                    </span>
                  ) : (
                    <span className="font-semibold text-sm">
                      Premium Members get 30% off every order —{' '}
                      <Link
                        to={isAuthenticated ? '/upgrade' : '/register'}
                        className="underline underline-offset-2 hover:no-underline"
                      >
                        {isAuthenticated ? 'Upgrade now' : 'Join free'}
                      </Link>
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowBanner(false)}
                  className="hover:bg-black/10 p-1 rounded-full transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-[1600px] mx-auto flex gap-6 p-6">
          {/* Sidebar */}
          <aside className="w-[230px] flex-shrink-0 sticky top-24 h-fit">
            <div className="bg-[#111] rounded-2xl border border-[#222] overflow-hidden">

              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1e1e1e]">
                <Filter className="w-3.5 h-3.5 text-[#FF9F1A]" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">Filters</span>
                {hasActiveFilters && (
                  <button
                    onClick={handleReset}
                    className="ml-auto flex items-center gap-1 text-[10px] text-[#FF9F1A]/70 hover:text-[#FF9F1A] transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              <div className="p-4 space-y-5">

                {/* Search */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Search</p>
                  <div className="flex items-center gap-2 h-9 rounded-xl border border-[#2e2e2e] bg-[#181818] px-3 focus-within:border-[#FF9F1A]/50 transition-colors">
                    <Search className="w-3.5 h-3.5 text-white/30 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search products…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-white/20 hover:text-white/60 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="h-px bg-[#1e1e1e]" />

                {/* Categories */}
                <div className="space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Categories</p>
                  {PRODUCT_CATEGORIES.map((cat) => {
                    const checked = selectedCats.includes(cat.slug)
                    return (
                      <label
                        key={cat.slug}
                        onClick={() => toggleCat(cat.slug)}
                        className="flex items-center gap-3 cursor-pointer select-none group"
                      >
                        <div className={`h-[18px] w-[18px] shrink-0 rounded-[5px] border transition-all flex items-center justify-center ${
                          checked
                            ? 'bg-[#FF9F1A] border-[#FF9F1A]'
                            : 'bg-[#181818] border-[#333] group-hover:border-[#FF9F1A]/40'
                        }`}>
                          {checked && (
                            <svg className="w-2.5 h-2.5 text-black" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm transition-colors ${checked ? 'text-white font-medium' : 'text-white/55 group-hover:text-white/80'}`}>
                          {cat.label}
                        </span>
                      </label>
                    )
                  })}
                </div>

                <div className="h-px bg-[#1e1e1e]" />

                {/* Price range */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Price</p>
                    <span className="text-xs font-semibold text-white/70">
                      up to <span className="text-[#FF9F1A]">{priceMax.toLocaleString()} MAD</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={MAX_PRICE}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-[#FF9F1A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-white/25">
                    <span>0 MAD</span>
                    <span>{MAX_PRICE.toLocaleString()} MAD</span>
                  </div>
                </div>

                <div className="h-px bg-[#1e1e1e]" />

                {/* Rating */}
                <div className="space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Rating</p>
                  <div className="space-y-1.5">
                    {[4, 3, 2].map((r) => {
                      const active = selectedRating === r
                      return (
                        <button
                          key={r}
                          onClick={() => setSelectedRating(active ? null : r)}
                          className={`w-full flex items-center justify-between h-9 px-3 rounded-xl border transition-all ${
                            active
                              ? 'bg-[#FF9F1A]/10 border-[#FF9F1A]/35'
                              : 'bg-[#181818] border-[#272727] hover:bg-[#1e1e1e] hover:border-[#333]'
                          }`}
                        >
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 transition-colors ${
                                  i < r
                                    ? active
                                      ? 'fill-[#FF9F1A] text-[#FF9F1A]'
                                      : 'fill-white text-white'
                                    : 'fill-white/10 text-white/10'
                                }`}
                              />
                            ))}
                          </div>
                          <span className={`text-[11px] font-medium transition-colors ${active ? 'text-[#FF9F1A]' : 'text-white/40'}`}>
                            & up
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

              </div>

              {/* Apply */}
              <div className="px-4 pb-4">
                <button
                  onClick={() => {}}
                  className="w-full flex items-center justify-center gap-2 h-9 rounded-xl bg-[#FF9F1A] text-black text-xs font-bold hover:bg-[#FF9F1A]/90 transition-colors shadow-[0_4px_14px_rgba(255,159,26,0.25)]"
                >
                  <Filter className="w-3.5 h-3.5" />
                  Apply Filters
                </button>
              </div>

            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Wellness Boutique</h1>
              <p className="text-gray-400">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                {hasActiveFilters && (
                  <button
                    onClick={handleReset}
                    className="ml-3 text-[#FF9F1A] text-sm hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAdd={handleAdd}
                    added={added[product._id]}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center mb-4">
                  <Search className="w-9 h-9 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-500 mb-6 text-sm">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-[#FF9F1A] text-black font-semibold text-sm hover:bg-[#FF9F1A]/90 transition-colors"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </PageTransition>
  )
}
