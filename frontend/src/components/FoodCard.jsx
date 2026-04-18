// src/components/FoodCard.jsx
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { Plus, Minus, Utensils } from 'lucide-react'

const colors = {
  primary: '#2C1A0E',
  muted: '#A08060',
  accent: '#E8732A',
  bg: '#F0E8DC',
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

export default function FoodCard({ item }) {
  const { cart, addItem, updateQty } = useCart()
  const [popping, setPopping] = useState(false)
  const cartItem = cart.find(c => c.id === item.id)
  const cardRef = useRef(null)

  const handleAdd = () => {
    addItem(item)
    setPopping(true)
    setTimeout(() => setPopping(false), 250)
  }

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `translateY(-4px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) scale(1.02)`
    // Enhance the neumorphic shadow slightly on lift
    cardRef.current.style.boxShadow = '10px 10px 24px rgba(180,130,90,0.36), -10px -10px 24px rgba(255,255,255,0.9)'
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)'
    // Revert to original neumorphic shadow
    cardRef.current.style.boxShadow = neumorphic.raised.boxShadow
  }

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="rounded-[28px] p-4 transition-all duration-300 ease-out flex flex-col"
      style={{
        ...neumorphic.raised,
        fontFamily: "'Outfit', sans-serif",
        transformStyle: 'preserve-3d',
        height: '100%'
      }}
    >
      {/* Image Section (Inset Container holding image) */}
      <div 
        className="relative h-[200px] w-full rounded-[20px] overflow-hidden flex items-center justify-center shrink-0" 
        style={{ ...neumorphic.inset, transform: 'translateZ(15px)' }}
      >
        {item.image_url ? (
          <div className="w-full h-full p-2">
            <div className="w-full h-full rounded-[14px] overflow-hidden flex items-center justify-center" style={neumorphic.raised}>
              <img
                src={item.image_url}
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
          </div>
        ) : (
          <Utensils size={42} strokeWidth={1.5} color={colors.accent} style={{ opacity: 0.6 }} />
        )}

        {/* Floating Category Badge (Top Left) */}
        {item.category && (
          <span 
            className="absolute top-4 left-4 rounded-[10px] px-3 py-1 font-bold tracking-wider uppercase backdrop-blur-md"
            style={{ 
              background: 'rgba(240, 232, 220, 0.7)', // matches background but transparent
              boxShadow: '0 2px 8px rgba(180,130,90,0.2)',
              color: colors.primary,
              fontSize: '10px',
            }}
          >
            {item.category}
          </span>
        )}

        {/* Circular Plus Button (Top Right, only visible when no cart item) */}
        {!cartItem && (
          <button
            onClick={handleAdd}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{ 
              ...neumorphic.buttonRaised,
              boxShadow: '4px 4px 10px rgba(180,130,90,0.4), -4px -4px 10px rgba(255,255,255,0.7)',
              transform: 'translateZ(25px)'
            }}
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Details Section */}
      <div className="pt-5 pb-2 px-2 text-left flex-1 flex flex-col justify-between items-start w-full" style={{ transform: 'translateZ(20px)' }}>
        <div className="w-full">
          <h3 className="mb-1.5 leading-tight truncate text-[18px] font-semibold" style={{ color: colors.primary }}>
            {item.name}
          </h3>
          <p 
            className="font-bold text-[18px] mb-5" 
            style={{ color: colors.accent }}
          >
            LKR {item.price?.toFixed(2)}
          </p>
        </div>

        {/* Cart control */}
        <div className="mt-auto w-full" style={{ transform: 'translateZ(30px)' }}>
          <AnimatePresence mode="wait">
            {cartItem ? (
              <motion.div
                key="stepper"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-1.5 rounded-[18px]"
                style={neumorphic.inset}
              >
                <motion.button
                  whileTap={{ scale: 0.9, ...neumorphic.inset }}
                  onClick={() => updateQty(item.id, cartItem.qty - 1)}
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center transition-colors"
                  style={{ ...neumorphic.raised, color: colors.primary }}
                >
                  <Minus size={16} strokeWidth={2.5} />
                </motion.button>
                <span className="font-bold text-[16px]" style={{ color: colors.primary }}>{cartItem.qty}</span>
                <motion.button
                  whileTap={{ scale: 0.9, ...neumorphic.inset }}
                  onClick={() => updateQty(item.id, cartItem.qty + 1)}
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center transition-colors"
                  style={{ ...neumorphic.raised, color: colors.accent }}
                >
                  <Plus size={16} strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                key="add"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={handleAdd}
                whileHover={{ y: -1, boxShadow: neumorphic.buttonRaised.boxShadow.replace('0.3', '0.45') }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-[18px] text-white transition-all duration-200 flex items-center justify-center font-medium"
                style={{ 
                  ...neumorphic.buttonRaised,
                  fontSize: '15px'
                }}
              >
                Add to Cart
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
