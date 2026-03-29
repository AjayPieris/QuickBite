// src/pages/Cart.jsx
// Cart page with item management, promo code, pickup time selector, order summary

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import PageTransition from '../components/PageTransition'

// Pickup time slots
const timeSlots = [
  { label: '11:00 AM', value: '11:00' },
  { label: '11:30 AM', value: '11:30' },
  { label: '12:00 PM', value: '12:00' },
  { label: '12:30 PM', value: '12:30' },
  { label: '1:00 PM', value: '13:00' },
  { label: '1:30 PM', value: '13:30' },
  { label: '2:00 PM', value: '14:00' },
  { label: '5:00 PM', value: '17:00' },
  { label: '5:30 PM', value: '17:30' },
  { label: '6:00 PM', value: '18:00' },
]

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart } = useCart()
  const navigate = useNavigate()
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [selectedTime, setSelectedTime] = useState('')

  const tax = totalPrice * 0.05
  const discount = promoApplied ? totalPrice * 0.1 : 0
  const finalTotal = totalPrice + tax - discount

  const applyPromo = () => {
    if (promo.toLowerCase() === 'quick10') {
      setPromoApplied(true)
    }
  }

  const handleCheckout = () => {
    if (!selectedTime) return
    // Store checkout data in localStorage for checkout page
    localStorage.setItem('quickbite_checkout', JSON.stringify({
      items: cart, pickupTime: selectedTime, total: finalTotal, tax, discount
    }))
    navigate('/checkout')
  }

  // Empty cart state
  if (cart.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-20 flex items-center justify-center px-4">
          <div className="text-center">
            <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 3, repeat: Infinity }} className="text-7xl mb-6">
              🍜
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-[#9ca3af] mb-8">Add some delicious items from our menu!</p>
            <Link to="/menu">
              <motion.button whileHover={{ scale: 1.05 }} className="btn-glow px-8 py-3 rounded-xl text-white font-semibold">
                Browse Menu
              </motion.button>
            </Link>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Your <span className="gradient-text">Cart</span></h1>
        <p className="text-[#9ca3af] mb-8">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="glass rounded-2xl p-4 flex items-center gap-4"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                    <img
                      src={item.image_url || `https://placehold.co/100x100/111/f97316?text=${encodeURIComponent(item.name?.charAt(0))}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate">{item.name}</h3>
                    <p className="text-[#9ca3af] text-xs">Rs.{item.price.toFixed(2)} each</p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-lg transition-colors">−</button>
                    <motion.span key={item.quantity} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="w-8 text-center text-white font-semibold text-sm">{item.quantity}</motion.span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-[#f97316]/20 hover:bg-[#f97316]/30 text-[#f97316] flex items-center justify-center text-lg transition-colors">+</button>
                  </div>

                  {/* Subtotal */}
                  <span className="text-white font-semibold text-sm w-20 text-right hidden sm:block">
                    Rs.{(item.price * item.quantity).toFixed(2)}
                  </span>

                  {/* Delete */}
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-[#9ca3af] hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-300 transition-colors mt-2">
              Clear Cart
            </button>
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#9ca3af]">
                  <span>Subtotal</span>
                  <span>Rs.{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#9ca3af]">
                  <span>Tax (5%)</span>
                  <span>Rs.{tax.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex justify-between text-[#22c55e]">
                    <span>Discount (10%)</span>
                    <span>-Rs.{discount.toFixed(2)}</span>
                  </motion.div>
                )}
                <div className="border-t border-white/10 pt-3 flex justify-between text-white font-bold text-base">
                  <span>Total</span>
                  <span>Rs.{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text" placeholder="Promo code" value={promo} onChange={e => setPromo(e.target.value)}
                    disabled={promoApplied}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-[#9ca3af] disabled:opacity-50"
                  />
                  <motion.button whileTap={{ scale: 0.95 }} onClick={applyPromo} disabled={promoApplied}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${promoApplied ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#f97316]/20 text-[#f97316] hover:bg-[#f97316]/30'}`}
                  >
                    {promoApplied ? '✓ Applied' : 'Apply'}
                  </motion.button>
                </div>
                <p className="text-[10px] text-[#9ca3af] mt-1">Try "QUICK10" for 10% off</p>
              </div>
            </div>

            {/* Pickup Time */}
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Pickup Time</h3>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map(slot => (
                  <button key={slot.value} onClick={() => setSelectedTime(slot.value)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                      selectedTime === slot.value
                        ? 'bg-[#f97316] text-white shadow-lg shadow-[#f97316]/25'
                        : 'glass text-[#9ca3af] hover:text-white'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              disabled={!selectedTime}
              className="w-full py-4 rounded-2xl btn-glow text-white font-bold flex items-center justify-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
              <motion.svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
