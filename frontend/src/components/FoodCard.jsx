// src/components/FoodCard.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

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
      className="bg-card rounded-2xl overflow-hidden border border-black/5 hover:border-flame/20 transition-all duration-300 group shadow-sm"
      style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-surface">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-surface to-card">
            {['🍛', '🍜', '🌮', '🍔', '🥗', '🍱', '🧆', '🥘'][item.id % 8]}
          </div>
        )}
        {/* Popular badge */}
        {item.id % 3 === 0 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-flame/90 backdrop-blur-sm rounded-lg text-xs font-display font-600 text-white">
            🔥 Popular
          </span>
        )}
        {/* Quick add overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-display font-600 text-snow text-base leading-tight truncate">{item.name}</h3>
        <p className="text-flame font-display font-700 text-lg mt-1">
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
                className="flex items-center justify-between bg-surface rounded-xl border border-black/5 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => updateQty(item.id, cartItem.qty - 1)}
                  className="w-10 h-10 flex items-center justify-center text-lg text-mist hover:text-ink hover:bg-black/5 transition-colors"
                >
                  −
                </button>
                <span className="font-display font-700 text-snow text-sm">{cartItem.qty}</span>
                <button
                  onClick={() => updateQty(item.id, cartItem.qty + 1)}
                  className="w-10 h-10 flex items-center justify-center text-lg text-flame hover:bg-flame/10 transition-colors"
                >
                  +
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="add"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleAdd}
                className={`w-full py-2.5 rounded-xl font-display font-600 text-sm transition-all duration-200 flex items-center justify-center gap-2
                  ${popping ? 'bg-flame/30 border-flame scale-95' : 'bg-flame/10 hover:bg-flame/20 border border-flame/30 hover:border-flame/60'}
                  text-flame`}
              >
                <motion.span
                  animate={popping ? { rotate: [0, -20, 20, 0], scale: [1, 1.3, 0.9, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  +
                </motion.span>
                Add to Cart
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
