// src/pages/Cart.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart, ArrowRight, Utensils } from 'lucide-react'

// Common neumorphic styles
const neumorphic = {
  raised: {
    background: '#F0E8DC',
    boxShadow: '6px 6px 16px rgba(180,130,90,0.32), -6px -6px 16px rgba(255,255,255,0.85)',
    border: 'none',
  },
  inset: {
    background: '#F0E8DC',
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

const colors = {
  primary: '#2C1A0E',
  muted: '#A08060',
  accent: '#E8732A',
  bg: '#F0E8DC',
  success: '#5AAB5E',
  error: '#E85A2A'
}

export default function Cart() {
  const { cart, removeItem, updateQty, totalPrice, totalItems } = useCart()
  const navigate = useNavigate()

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom = 0) => ({
      opacity: 1, 
      y: 0, 
      transition: { delay: custom * 0.05, duration: 0.5, ease: 'easeOut' }
    })
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center text-center px-6 overflow-x-hidden" style={{ background: colors.bg, ...fonts.body }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div 
            className="w-32 h-32 rounded-[32px] flex items-center justify-center mb-8"
            style={neumorphic.inset}
          >
            <ShoppingCart size={48} color={colors.muted} />
          </div>
          <h2 className="text-[28px] font-semibold mb-3" style={{ ...fonts.heading, color: colors.primary }}>
            Your cart is empty
          </h2>
          <p className="mb-10 text-[15px] font-medium" style={{ color: colors.muted }}>
            Browse the menu and add some delicious items
          </p>
          <Link to="/">
            <motion.button
              whileHover={{ 
                y: -1, 
                boxShadow: '6px 6px 16px rgba(180,130,90,0.32), -6px -6px 16px rgba(255,255,255,0.85), 0 6px 14px rgba(232,115,42,0.45)' 
              }}
              whileTap={{ 
                scale: 0.98, 
                boxShadow: 'inset 6px 6px 12px rgba(180, 70, 0, 0.4), inset -4px -4px 10px rgba(255, 180, 100, 0.3)' 
              }}
              className="px-10 py-4 rounded-[20px] flex items-center gap-2 font-medium"
              style={{ ...neumorphic.buttonRaised, fontSize: '16px' }}
            >
               Browse Menu <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-24 px-6 overflow-x-hidden" style={{ background: colors.bg, ...fonts.body }}>
      <div className="max-w-5xl mx-auto">
        <motion.h1
          custom={0} initial="hidden" animate="visible" variants={fadeInUp}
          className="text-[32px] font-semibold mb-8"
          style={{ ...fonts.heading, color: colors.primary }}
        >
          Your{' '}
          <span style={{ 
            background: `linear-gradient(90deg, ${colors.accent}, #C8931A)`, 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>
            Cart
          </span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Items list — takes 3/5 */}
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence>
              {cart.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 flex items-center gap-4 sm:gap-6"
                  style={{ ...neumorphic.inset, borderRadius: '24px' }}
                >
                  {/* Image wrapper */}
                  <div 
                    className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-[18px] overflow-hidden flex-shrink-0 flex items-center justify-center relative"
                    style={{ ...neumorphic.raised }}
                  >
                    {item.image_url ? (
                      <img src={item.image_url} className="w-full h-full object-cover p-1.5 rounded-[18px]" alt={item.name} />
                    ) : (
                      <div className="w-full h-full p-2 flex items-center justify-center">
                         <div style={{...neumorphic.inset, width:'100%', height:'100%', borderRadius:'12px'}} className="flex justify-center items-center">
                            <Utensils size={24} color={colors.accent} opacity={0.7} />
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="text-base font-semibold truncate mb-1" style={{ ...fonts.heading, color: colors.primary }}>
                      {item.name}
                    </h3>
                    <p className="text-sm font-bold" style={{ color: colors.accent }}>
                      LKR {item.price?.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div 
                    className="flex items-center gap-1 sm:gap-2 px-1.5 py-1.5"
                    style={{ ...neumorphic.raised, borderRadius: '16px' }}
                  >
                    <motion.button 
                      whileTap={{ scale: 0.9, ...neumorphic.inset }}
                      onClick={() => updateQty(item.id, item.qty - 1)} 
                      className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-[10px] flex items-center justify-center transition-colors"
                      style={{ color: colors.primary }}
                    >
                      <Minus size={14} strokeWidth={2.5} />
                    </motion.button>
                    <span 
                      className="font-bold text-sm w-4 sm:w-6 text-center" 
                      style={{ color: colors.primary }}
                    >
                      {item.qty}
                    </span>
                    <motion.button 
                      whileTap={{ scale: 0.9, ...neumorphic.inset }}
                      onClick={() => updateQty(item.id, item.qty + 1)} 
                      className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-[10px] flex items-center justify-center transition-colors"
                      style={{ color: colors.accent }}
                    >
                      <Plus size={14} strokeWidth={2.5} />
                    </motion.button>
                  </div>

                  {/* Subtotal (hidden on very small screens) */}
                  <span className="hidden sm:block font-semibold text-[15px] w-24 text-right" style={{ color: colors.primary }}>
                    LKR {(item.price * item.qty).toFixed(2)}
                  </span>

                  {/* Remove Button */}
                  <div className="pr-1">
                    <motion.button
                      whileHover={{ scale: 1.1, color: colors.error }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item.id)}
                      className="p-2 sm:p-2.5 rounded-[12px] flex items-center justify-center transition-colors"
                      style={{ ...neumorphic.raised, color: colors.muted }}
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order summary — takes 2/5 */}
          <motion.div
            custom={2} initial="hidden" animate="visible" variants={fadeInUp}
            className="lg:col-span-2"
          >
            <div className="p-7 sm:p-8 sticky top-28" style={{ ...neumorphic.raised, borderRadius: '28px' }}>
              <h2 className="text-[20px] font-semibold mb-6" style={{ ...fonts.heading, color: colors.primary }}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[14px] font-medium" style={{ color: colors.muted }}>
                  <span>Subtotal ({totalItems} items)</span>
                  <span style={{ color: colors.primary }}>LKR {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[14px] font-medium" style={{ color: colors.muted }}>
                  <span>Service fee</span>
                  <span style={{ color: colors.primary }}>LKR 20.00</span>
                </div>
                
                <div className="pt-5 mt-2 flex justify-between items-center" style={{ borderTop: `2px dashed rgba(180,130,90,0.15)` }}>
                  <span className="text-[16px] font-semibold" style={{ color: colors.primary }}>Total amount</span>
                  <span className="text-[22px] font-bold" style={{ ...fonts.heading, color: colors.accent }}>
                    LKR {(totalPrice + 20).toFixed(2)}
                  </span>
                </div>
              </div>

              <motion.button
                onClick={() => navigate('/checkout')}
                whileHover={{ 
                  y: -1, 
                  boxShadow: '6px 6px 16px rgba(180,130,90,0.32), -6px -6px 16px rgba(255,255,255,0.85), 0 6px 14px rgba(232,115,42,0.45)' 
                }}
                whileTap={{ 
                  scale: 0.98, 
                  boxShadow: 'inset 6px 6px 12px rgba(180, 70, 0, 0.4), inset -4px -4px 10px rgba(255, 180, 100, 0.3)' 
                }}
                className="w-full py-4 rounded-[18px] flex items-center justify-center gap-2 font-medium"
                style={{ ...neumorphic.buttonRaised, fontSize: '16px' }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </motion.button>

              <Link to="/" className="block mt-5">
                <motion.div 
                  whileHover={{ x: -2, color: colors.primary }}
                  className="flex items-center justify-center gap-1.5 text-[13px] font-medium transition-colors"
                  style={{ color: colors.muted }}
                >
                  <ArrowLeft size={14} /> Continue shopping
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
