// src/pages/Menu.jsx
// Menu page with category filters, search, responsive food card grid, floating cart button

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/axios'
import FoodCard from '../components/FoodCard'
import PageTransition from '../components/PageTransition'
import { useCart } from '../context/CartContext'

// Category definitions with emojis
const categories = [
  { id: 'all', label: 'All', emoji: '🍽' },
  { id: 'rice', label: 'Rice', emoji: '🍚' },
  { id: 'noodles', label: 'Noodles', emoji: '🍜' },
  { id: 'drinks', label: 'Drinks', emoji: '🥤' },
  { id: 'snacks', label: 'Snacks', emoji: '🍟' },
  { id: 'burgers', label: 'Burgers', emoji: '🍔' },
]

// Realistic placeholder data when API has no items
const placeholderItems = [
  { id: 1, name: 'Chicken Fried Rice', price: 350, image_url: null, category: 'rice', badge: 'Popular', rating: 4.8 },
  { id: 2, name: 'Egg Noodles', price: 300, image_url: null, category: 'noodles', badge: null, rating: 4.5 },
  { id: 3, name: 'Cheese Burger', price: 450, image_url: null, category: 'burgers', badge: 'Popular', rating: 4.9 },
  { id: 4, name: 'Mango Smoothie', price: 200, image_url: null, category: 'drinks', badge: 'New', rating: 4.7 },
  { id: 5, name: 'French Fries', price: 180, image_url: null, category: 'snacks', badge: null, rating: 4.3 },
  { id: 6, name: 'Veggie Rice Bowl', price: 320, image_url: null, category: 'rice', badge: null, rating: 4.4 },
  { id: 7, name: 'Spicy Ramen', price: 380, image_url: null, category: 'noodles', badge: 'Popular', rating: 4.6 },
  { id: 8, name: 'Iced Latte', price: 250, image_url: null, category: 'drinks', badge: 'New', rating: 4.8 },
  { id: 9, name: 'Chicken Wings', price: 420, image_url: null, category: 'snacks', badge: 'Popular', rating: 4.7 },
  { id: 10, name: 'Double Patty Burger', price: 550, image_url: null, category: 'burgers', badge: null, rating: 4.5 },
  { id: 11, name: 'Kottu Roti', price: 400, image_url: null, category: 'rice', badge: 'New', rating: 4.6 },
  { id: 12, name: 'Fresh OJ', price: 150, image_url: null, category: 'drinks', badge: null, rating: 4.2 },
]

export default function Menu() {
  const [items, setItems] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const { totalItems, totalPrice, cartPulse } = useCart()

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get('/menu')
        // Add placeholder fields to API items
        const apiItems = res.data.map((item, i) => ({
          ...item,
          category: item.category || categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id,
          badge: i < 3 ? 'Popular' : i > res.data.length - 3 ? 'New' : null,
          rating: (4 + Math.random()).toFixed(1),
        }))
        setItems(apiItems.length > 0 ? apiItems : placeholderItems)
      } catch {
        setItems(placeholderItems)
      } finally {
        setLoading(false)
      }
    }
    fetchMenu()
  }, [])

  // Filter items by category and search
  const filtered = items.filter(item => {
    const matchCategory = activeCategory === 'all' || item.category === activeCategory
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Our <span className="gradient-text">Menu</span>
          </h1>
          <p className="text-[#9ca3af]">Choose from our delicious selection</p>
        </div>

        {/* ── Sticky Filter Bar ── */}
        <div className="sticky top-[72px] z-20 -mx-6 lg:-mx-8 px-6 lg:px-8 py-4 bg-[#0a0a0a]/90 backdrop-blur-2xl border-b border-white/[0.06]">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[#f97316] text-white shadow-lg shadow-[#f97316]/25'
                      : 'glass text-[#9ca3af] hover:text-white'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative flex-shrink-0 sm:w-64">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                placeholder="Search menu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-[#9ca3af]"
              />
            </div>
          </div>
        </div>

        {/* ── Food Cards Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <div className="h-48 skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 skeleton" />
                  <div className="h-3 w-1/2 skeleton" />
                  <div className="h-10 skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <FoodCard key={item.id} item={item} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty state */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }} className="text-6xl mb-4">
              🍽
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">No items found</h3>
            <p className="text-[#9ca3af] text-sm">Try a different search or category</p>
          </motion.div>
        )}

        {/* ── Floating Cart Summary Button ── */}
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 right-6 z-30"
            >
              <Link to="/cart">
                <motion.button
                  animate={cartPulse ? { scale: [1, 1.1, 1] } : {}}
                  className="btn-glow px-6 py-3 rounded-2xl text-white font-semibold flex items-center gap-3 shadow-2xl"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  <span>{totalItems} items</span>
                  <span className="w-px h-4 bg-white/30" />
                  <span>Rs.{totalPrice.toFixed(2)}</span>
                </motion.button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
