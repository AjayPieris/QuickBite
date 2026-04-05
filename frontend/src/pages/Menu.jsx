// src/pages/Menu.jsx
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import FoodCard from '../components/FoodCard'
import { useCart } from '../context/CartContext'

const CATEGORIES = ['All', 'Rice', 'Noodles', 'Drinks', 'Snacks', 'Salads']

// Skeleton loader card
function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-white/5">
      <div className="h-44 shimmer-loading" />
      <div className="p-4 space-y-2">
        <div className="h-4 rounded-lg shimmer-loading w-3/4" />
        <div className="h-4 rounded-lg shimmer-loading w-1/3" />
        <div className="h-10 rounded-xl shimmer-loading mt-3" />
      </div>
    </div>
  )
}

// Floating cart button
function CartFloating({ totalItems, totalPrice }) {
  if (totalItems === 0) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
    >
      <Link
        to="/cart"
        className="flex items-center gap-4 px-6 py-4 rounded-2xl shadow-xl"
        style={{ background: 'linear-gradient(135deg, #ff4d00, #ff8c42)', boxShadow: '0 8px 32px rgba(255,77,0,0.4)' }}
      >
        <span className="font-display font-700 text-white text-sm">
          🛒 {totalItems} item{totalItems > 1 ? 's' : ''}
        </span>
        <span className="w-px h-4 bg-white/30" />
        <span className="font-display font-700 text-white text-sm">
          LKR {totalPrice.toFixed(2)} →
        </span>
      </Link>
    </motion.div>
  )
}

export default function Menu() {
  const [items, setItems]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [category, setCategory]   = useState('All')
  const [search, setSearch]       = useState('')
  const { totalItems, totalPrice } = useCart()

  // Fallback demo data if API isn't connected
  const DEMO_ITEMS = [
    { id: 1, name: 'Chicken Fried Rice', price: 350, image_url: null },
    { id: 2, name: 'Beef Kottu', price: 420, image_url: null },
    { id: 3, name: 'Vegetable Noodles', price: 280, image_url: null },
    { id: 4, name: 'Fish Curry Rice', price: 390, image_url: null },
    { id: 5, name: 'Egg Sandwich', price: 120, image_url: null },
    { id: 6, name: 'Mango Juice', price: 80, image_url: null },
    { id: 7, name: 'Dhal Curry Plate', price: 220, image_url: null },
    { id: 8, name: 'Chicken Burger', price: 480, image_url: null },
  ]

  useEffect(() => {
    api.get('/menu')
      .then(res => setItems(res.data))
      .catch(() => setItems(DEMO_ITEMS))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display font-700 text-3xl md:text-4xl text-snow mb-1">
          Today's <span className="text-flame-gradient">Menu</span>
        </h1>
        <p className="text-ash text-sm">{items.length} items available</p>
      </motion.div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="text"
            className="input-dark pl-11"
            placeholder="Search menu…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-sm font-display font-600 whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-flame text-white shadow-lg shadow-flame/30'
                  : 'glass-light text-mist hover:text-snow hover:border-white/20 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-7xl mb-4">🍽</div>
          <h3 className="font-display font-600 text-snow text-xl mb-2">Nothing found</h3>
          <p className="text-ash">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <FoodCard item={item} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating cart */}
      <AnimatePresence>
        <CartFloating totalItems={totalItems} totalPrice={totalPrice} />
      </AnimatePresence>
    </div>
  )
}
