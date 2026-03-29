// src/pages/Checkout.jsx
// Final checkout page: order review, payment method, place order with success animation

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import PageTransition from '../components/PageTransition'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, clearCart, totalPrice } = useCart()
  const [checkoutData, setCheckoutData] = useState(null)
  const [payMethod, setPayMethod] = useState('cash')
  const [status, setStatus] = useState('idle') // idle | loading | success
  const [showItems, setShowItems] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('quickbite_checkout')
    setTimeout(() => {
      if (saved) {
        setCheckoutData(JSON.parse(saved))
      } else if (cart.length > 0) {
        setCheckoutData({ items: cart, pickupTime: '12:00', total: totalPrice, tax: totalPrice * 0.05, discount: 0 })
      } else {
        navigate('/cart')
      }
    }, 0)
  }, [cart, navigate, totalPrice])

  const placeOrder = async () => {
    if (!checkoutData) return
    setStatus('loading')
    try {
      // Build pickup time as today + selected time
      const today = new Date()
      const [h, m] = checkoutData.pickupTime.split(':')
      today.setHours(parseInt(h), parseInt(m), 0, 0)

      await api.post('/orders/', {
        pickup_time: today.toISOString(),
        items: checkoutData.items.map(it => ({
          menu_id: it.id,
          quantity: it.quantity,
        })),
      })

      setStatus('success')
      clearCart()
      localStorage.removeItem('quickbite_checkout')
      setTimeout(() => navigate('/orders'), 3000)
    } catch (err) {
      setStatus('idle')
      alert(err.response?.data?.detail || 'Failed to place order')
    }
  }

  if (!checkoutData) return null

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[60vh]">
              {/* Success checkmark explosion */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-[#22c55e]/20 flex items-center justify-center mb-6 relative"
              >
                <svg className="w-12 h-12 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                {/* Expanding ring */}
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1, repeat: 2 }}
                  className="absolute inset-0 rounded-full border-2 border-[#22c55e]"
                />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Order Placed! 🎉</h2>
              <p className="text-[#9ca3af] mb-2">Your order has been confirmed</p>
              <p className="text-[#9ca3af] text-sm">Redirecting to order history...</p>
            </motion.div>
          ) : (
            <motion.div key="checkout">
              <h1 className="text-3xl font-bold text-white mb-2">
                <span className="gradient-text">Checkout</span>
              </h1>
              <p className="text-[#9ca3af] mb-8">Review and confirm your order</p>

              <div className="space-y-6">
                {/* Order Review */}
                <div className="glass-strong rounded-2xl p-6">
                  <button onClick={() => setShowItems(!showItems)} className="w-full flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Order Items ({checkoutData.items.length})</h3>
                    <svg className={`w-5 h-5 text-[#9ca3af] transition-transform ${showItems ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {showItems && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="mt-4 space-y-3">
                          {checkoutData.items.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-[#9ca3af]">{item.name} × {item.quantity}</span>
                              <span className="text-white">Rs.{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Pickup Time Confirmation */}
                <div className="glass-strong rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">Pickup Time</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#f97316]/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Today</p>
                      <p className="text-[#9ca3af] text-sm">{checkoutData.pickupTime}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="glass-strong rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <button onClick={() => setPayMethod('cash')} className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${payMethod === 'cash' ? 'bg-[#f97316]/10 border border-[#f97316]/30' : 'glass'}`}>
                      <span className="text-2xl">💵</span>
                      <div className="text-left">
                        <p className="text-white font-medium text-sm">Cash on Pickup</p>
                        <p className="text-[#9ca3af] text-xs">Pay when you collect</p>
                      </div>
                      {payMethod === 'cash' && <div className="ml-auto w-5 h-5 rounded-full bg-[#f97316] flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg></div>}
                    </button>
                    <button disabled className="w-full flex items-center gap-4 p-4 rounded-xl glass opacity-50 cursor-not-allowed">
                      <span className="text-2xl">💳</span>
                      <div className="text-left">
                        <p className="text-white font-medium text-sm">Card Payment</p>
                        <p className="text-[#9ca3af] text-xs">Coming soon</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="glass-strong rounded-2xl p-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-[#9ca3af]"><span>Subtotal</span><span>Rs.{totalPrice.toFixed(2)}</span></div>
                    <div className="flex justify-between text-[#9ca3af]"><span>Tax</span><span>Rs.{checkoutData.tax.toFixed(2)}</span></div>
                    {checkoutData.discount > 0 && <div className="flex justify-between text-[#22c55e]"><span>Discount</span><span>-Rs.{checkoutData.discount.toFixed(2)}</span></div>}
                    <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold text-lg">
                      <span>Total</span><span>Rs.{checkoutData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={placeOrder} disabled={status === 'loading'}
                  className="w-full py-4 rounded-2xl btn-glow text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {status === 'loading' ? (
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  ) : '🎉 Place Order'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
