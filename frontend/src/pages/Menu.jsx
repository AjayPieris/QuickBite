// src/pages/Menu.jsx
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, ShoppingCart, ArrowRight, Utensils } from 'lucide-react'
import api from '../api/axios'
import FoodCard from '../components/FoodCard'
import { useCart } from '../context/CartContext'

const CATEGORIES = ['All', 'Rice', 'Noodles', 'FastFood', 'Drinks', 'Snacks']

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm">
      <div className="h-44 shimmer-loading" />
      <div className="p-4 space-y-2">
        <div className="h-4 rounded-lg shimmer-loading w-3/4" />
        <div className="h-4 rounded-lg shimmer-loading w-1/3" />
        <div className="h-10 rounded-xl shimmer-loading mt-3" />
      </div>
    </div>
  )
}

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
        style={{ background: 'linear-gradient(135deg, #ff4d00, #ff8c42)', boxShadow: '0 8px 32px rgba(255,77,0,0.4)', fontFamily: "'Outfit', sans-serif" }}
      >
        <ShoppingCart size={18} className="text-white" strokeWidth={2} />
        <span className="font-bold text-white text-sm">
          {totalItems} item{totalItems > 1 ? 's' : ''}
        </span>
        <span className="w-px h-4 bg-white/30" />
        <span className="font-bold text-white text-sm flex items-center gap-1">
          LKR {totalPrice.toFixed(2)} <ArrowRight size={14} />
        </span>
      </Link>
    </motion.div>
  )
}

export default function Menu() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [category, setCategory] = useState('All')
  const [search, setSearch]     = useState('')
  const { totalItems, totalPrice } = useCart()

  const DEMO_ITEMS = [
    { id: 1, name: 'Chicken Fried Rice', price: 350, image_url: null },
    { id: 2, name: 'Beef Kottu',         price: 420, image_url: null },
    { id: 3, name: 'Vegetable Noodles',  price: 280, image_url: null },
    { id: 4, name: 'Fish Curry Rice',    price: 390, image_url: null },
    { id: 5, name: 'Egg Sandwich',       price: 120, image_url: null },
    { id: 6, name: 'Mango Juice',        price: 80,  image_url: null },
    { id: 7, name: 'Dhal Curry Plate',   price: 220, image_url: null },
    { id: 8, name: 'Chicken Burger',     price: 480, image_url: null },
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
    <div className="min-h-screen pt-24 pb-32 px-6 max-w-7xl mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-bold text-3xl md:text-4xl text-gray-900 mb-1">
          Today's <span className="text-flame-gradient">Menu</span>
        </h1>
        <p className="text-gray-400 text-sm">{items.length} items available</p>
      </motion.div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2} />
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
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                category === cat
                  ? 'bg-flame text-white shadow-lg shadow-flame/30'
                  : 'bg-white text-gray-400 hover:text-gray-700 hover:border-gray-200 border border-gray-100'
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
          <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
            <Utensils size={36} strokeWidth={1.2} className="text-orange-200" />
          </div>
          <h3 className="font-bold text-gray-900 text-xl mb-2">Nothing found</h3>
          <p className="text-gray-400">Try a different search term</p>
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
