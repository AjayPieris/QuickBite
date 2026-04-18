// src/pages/Menu.jsx
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, ShoppingCart, ArrowRight, Utensils } from 'lucide-react'
import api from '../api/axios'
import FoodCard from '../components/FoodCard'
import { useCart } from '../context/CartContext'

const CATEGORIES = ['All', 'Rice', 'Noodles', 'FastFood', 'Drinks', 'Snacks']

// Common neumorphic styles
const colors = {
  primary: '#2C1A0E',
  muted: '#A08060',
  accent: '#E8732A',
  bg: '#F0E8DC',
  success: '#5AAB5E',
  error: '#E85A2A',
}

const neumorphic = {
  raised: {
    background: colors.bg,
    boxShadow: '6px 6px 16px rgba(180,130,90,0.32), -6px -6px 16px rgba(255,255,255,0.85)',
    border: 'none',
  },
  inset: {
    background: colors.bg,
    boxShadow: 'inset 5px 5px 12px rgba(180,130,90,0.26), inset -5px -5px 12px rgba(255,255,255,0.78)',
    border: 'none',
  },
  buttonRaised: {
    background: 'linear-gradient(135deg, #E8732A, #C87820)',
    boxShadow: '6px 6px 16px rgba(180,130,90,0.32), -6px -6px 16px rgba(255,255,255,0.85), 0 4px 12px rgba(232,115,42,0.3)',
    border: 'none',
    color: '#ffffff'
  }
}

const fonts = {
  heading: { fontFamily: "'Outfit', sans-serif" },
  body: { fontFamily: "'Outfit', sans-serif" }
}

function SkeletonCard() {
  return (
    <div style={{ ...neumorphic.raised, borderRadius: '24px', overflow: 'hidden' }}>
      <div className="h-[180px]" style={{ background: 'rgba(180,130,90,0.1)' }} />
      <div className="p-4 pt-4 pb-5 px-4 sm:px-[18px] space-y-3">
        <div className="h-[22px] rounded-lg w-3/4" style={{ background: 'rgba(180,130,90,0.1)' }} />
        <div className="h-6 rounded-lg w-1/3" style={{ background: 'rgba(180,130,90,0.1)' }} />
        <div className="h-12 rounded-[14px] mt-3.5" style={{ background: 'rgba(180,130,90,0.1)' }} />
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
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
    >
      <Link to="/cart">
        <motion.button
          whileHover={{ y: -1, boxShadow: neumorphic.buttonRaised.boxShadow.replace('0.3', '0.45') }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-4 px-7 py-4 rounded-[20px] transition-transform duration-200"
          style={{ ...neumorphic.buttonRaised, ...fonts.body }}
        >
          <ShoppingCart size={18} className="text-white" strokeWidth={2} />
          <span className="font-bold text-white text-[15px]">
            {totalItems} item{totalItems > 1 ? 's' : ''}
          </span>
          <span className="w-px h-4 bg-white/30" />
          <span className="font-bold text-white text-[15px] flex items-center gap-1">
            LKR {totalPrice.toFixed(2)} <ArrowRight size={14} />
          </span>
        </motion.button>
      </Link>
    </motion.div>
  )
}

export default function Menu() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [category, setCategory] = useState('All')
  const [search, setSearch]     = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { totalItems, totalPrice } = useCart()

  const DEMO_ITEMS = [
    { id: 1, name: 'Chicken Fried Rice', price: 350, category: 'Rice', image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Beef Kottu', price: 420, category: 'FastFood', image_url: 'https://images.unsplash.com/photo-1544025162-811cce66eb5f?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Vegetable Noodles', price: 280, category: 'Noodles', image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: 'Fish Curry Rice', price: 390, category: 'Rice', image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&q=80&w=400' },
    { id: 5, name: 'Egg Sandwich', price: 120, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400' },
    { id: 6, name: 'Mango Juice', price: 80, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400' },
    { id: 7, name: 'Dhal Curry Plate', price: 220, category: 'Rice', image_url: 'https://images.unsplash.com/photo-1627883216892-0b73df727aa4?auto=format&fit=crop&q=80&w=400' },
    { id: 8, name: 'Chicken Burger', price: 480, category: 'FastFood', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400' },
  ]

  useEffect(() => {
    api.get('/menu')
      .then(res => setItems(res.data))
      .catch(() => setItems(DEMO_ITEMS))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || item.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div 
      className="min-h-screen pt-[6rem] pb-32 px-6 overflow-x-hidden" 
      style={{ 
        background: colors.bg,
        ...fonts.body
      }}
    >
      <div className="max-w-[1100px] mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mb-10 text-center flex flex-col items-center"
        >
          <div 
            className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2"
            style={{ 
              ...neumorphic.inset,
              fontWeight: 600,
              fontSize: '13px',
              color: colors.accent
            }}
          >
            <Utensils size={14} /> {items.length} items available
          </div>
          <h1 className="text-[40px] mb-3 font-bold leading-tight" style={{ ...fonts.heading, color: colors.primary }}>
            Today's <span style={{ background: `linear-gradient(90deg, ${colors.accent}, #C8931A)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Menu</span>
          </h1>
          <p className="text-[15px] font-medium max-w-md mx-auto" style={{ color: colors.muted }}>
            Artisanally crafted dishes from our kitchen. Pre-order your meals and have them ready when you arrive in-store.
          </p>
        </motion.div>

        {/* Search + filter bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-[340px]">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: isSearchFocused ? colors.accent : colors.muted }} strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search delicacies…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full outline-none transition-all duration-300"
              style={{
                ...neumorphic.inset,
                borderRadius: '18px',
                padding: '14px 18px 14px 48px',
                fontWeight: 500,
                fontSize: '15px',
                color: colors.primary,
                boxShadow: isSearchFocused 
                  ? `0 0 0 3px rgba(232,115,42,0.15), ${neumorphic.inset.boxShadow}`
                  : neumorphic.inset.boxShadow
              }}
            />
          </div>

          {/* Category pills */}
          <div 
            className="flex gap-2 overflow-x-auto scrollbar-hide p-2 w-full md:w-auto"
            style={{ ...neumorphic.inset, borderRadius: '999px' }}
          >
            {CATEGORIES.map(cat => {
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="relative px-5 py-2.5 rounded-full text-[14px] font-semibold whitespace-nowrap transition-colors z-10"
                  style={{ 
                    color: isActive ? '#FFFFFF' : colors.muted, 
                    ...fonts.body
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) e.currentTarget.style.color = colors.primary
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) e.currentTarget.style.color = colors.muted
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 rounded-full z-[-1]"
                      style={neumorphic.buttonRaised}
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[80px] text-center max-w-sm mx-auto" style={{ ...neumorphic.raised, borderRadius: '32px' }}>
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-[88px] h-[88px] rounded-[24px] flex items-center justify-center mb-6"
              style={neumorphic.inset}
            >
              <Utensils size={42} strokeWidth={1.5} color={colors.muted} />
            </motion.div>
            <h3 className="font-semibold text-[22px] mb-2" style={{ ...fonts.heading, color: colors.primary }}>No delicacies found</h3>
            <p className="text-[15px] font-medium px-6" style={{ color: colors.muted }}>We couldn't find anything matching "{search}". Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: i * 0.05,
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1] 
                }}
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
    </div>
  )
}
