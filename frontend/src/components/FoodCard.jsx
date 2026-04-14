// src/components/FoodCard.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { Plus, Minus, ShoppingBag, Flame, Utensils } from 'lucide-react'

// Food placeholder icons array for items without images
const FOOD_ICONS = [
  <Utensils size={40} strokeWidth={1.2} className="text-flame/40" />,
  <ShoppingBag size={40} strokeWidth={1.2} className="text-flame/40" />,
]

export default function FoodCard({ item }) {
  const { cart, addItem, updateQty } = useCart()
  const [popping, setPopping] = useState(false)
  const cartItem = cart.find(c => c.id === item.id)

  const handleAdd = () => {
    addItem(item)
    setPopping(true)
    setTimeout(() => setPopping(false), 600)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden border border-black/5 hover:border-flame/20 transition-all duration-300 group"
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.05)', fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-orange-50/50">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
            <Utensils size={52} strokeWidth={1} className="text-orange-200" />
          </div>
        )}

        {/* Popular badge with Lucide icon */}
        {item.id % 3 === 0 && (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-flame/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-white">
            <Flame size={11} fill="white" strokeWidth={0} />
            Popular
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base leading-tight truncate">{item.name}</h3>
        <p className="font-bold text-flame text-lg mt-1">
          LKR {item.price?.toFixed(2)}
        </p>

        {/* Cart control */}
        <div className="mt-3">
          <AnimatePresence mode="wait">
            {cartItem ? (
              <motion.div
                key="stepper"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-between bg-gray-50 rounded-xl border border-black/5 overflow-hidden"
              >
                <button
                  onClick={() => updateQty(item.id, cartItem.qty - 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-colors"
                >
                  <Minus size={15} strokeWidth={2.5} />
                </button>
                <span className="font-bold text-gray-900 text-sm">{cartItem.qty}</span>
                <button
                  onClick={() => updateQty(item.id, cartItem.qty + 1)}
                  className="w-10 h-10 flex items-center justify-center text-flame hover:bg-flame/10 transition-colors"
                >
                  <Plus size={15} strokeWidth={2.5} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="add"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleAdd}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
                  ${popping ? 'bg-flame/20 border-flame scale-95' : 'bg-flame/8 hover:bg-flame/15 border border-flame/25 hover:border-flame/50'}
                  text-flame`}
                style={{ background: popping ? 'rgba(255,77,0,0.15)' : 'rgba(255,77,0,0.06)' }}
              >
                <motion.div
                  animate={popping ? { rotate: [0, -20, 20, 0], scale: [1, 1.3, 0.9, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Plus size={16} strokeWidth={2.5} />
                </motion.div>
                Add to Cart
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
