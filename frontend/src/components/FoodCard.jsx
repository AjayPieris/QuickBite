// src/components/FoodCard.jsx
// Beautiful food card with hover effects, quantity selector, and add-to-cart animation

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'

export default function FoodCard({ item, index = 0 }) {
  const { addToCart, cart, updateQuantity } = useCart()
  const [imgLoaded, setImgLoaded] = useState(false)

  // Find this item in cart if it exists
  const cartItem = cart.find(i => i.id === item.id)
  const quantity = cartItem ? cartItem.quantity : 0

  // Placeholder image if no image_url
  const imageUrl = item.image_url || `https://placehold.co/400x300/111111/f97316?text=${encodeURIComponent(item.name)}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group glass rounded-2xl overflow-hidden card-hover relative"
    >
      {/* ── Image ── */}
      <div className="relative h-48 overflow-hidden bg-[#1a1a1a]">
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        <img
          src={imageUrl}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            e.target.src = `https://placehold.co/400x300/111111/f97316?text=${encodeURIComponent(item.name)}`
            setImgLoaded(true)
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

        {/* Popular / New Badge */}
        {item.badge && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full ${
              item.badge === 'Popular'
                ? 'bg-[#f97316]/90 text-white'
                : 'bg-emerald-500/90 text-white'
            }`}
          >
            {item.badge}
          </motion.span>
        )}
      </div>

      {/* ── Content ── */}
      <div className="p-4">
        {/* Name & Price */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-semibold text-base leading-tight">{item.name}</h3>
          <span className="text-[#f97316] font-bold text-lg whitespace-nowrap ml-2">
            Rs.{item.price.toFixed(2)}
          </span>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map(star => (
            <svg
              key={star}
              className={`w-3.5 h-3.5 ${star <= (item.rating || 4) ? 'text-[#fbbf24]' : 'text-[#333]'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-[#9ca3af] text-xs ml-1">{item.rating || 4.0}</span>
        </div>

        {/* ── Quantity + Add to Cart ── */}
        {quantity > 0 ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 glass rounded-xl px-2 py-1">
              <button
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#f97316]/20 text-white flex items-center justify-center transition-colors font-bold"
              >
                −
              </button>
              <motion.span
                key={quantity}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-white font-semibold w-6 text-center"
              >
                {quantity}
              </motion.span>
              <button
                onClick={() => updateQuantity(item.id, quantity + 1)}
                className="w-8 h-8 rounded-lg bg-[#f97316]/20 hover:bg-[#f97316]/40 text-[#f97316] flex items-center justify-center transition-colors font-bold"
              >
                +
              </button>
            </div>
            <span className="text-[#9ca3af] text-sm font-medium">
              Rs.{(item.price * quantity).toFixed(2)}
            </span>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(item)}
            className="w-full py-2.5 rounded-xl btn-glow text-white text-sm font-semibold flex items-center justify-center gap-2 group/btn"
          >
            <svg className="w-4 h-4 transition-transform group-hover/btn:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add to Cart
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}