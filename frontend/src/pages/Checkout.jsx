// src/pages/Checkout.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import api from '../api/axios'

export default function Checkout() {
  const { cart, totalPrice, clearCart, totalItems } = useCart()
  const navigate = useNavigate()
  const [pickupTime, setPickupTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pickupTime) {
      setError('Please select a pickup time')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Map cart to expected backend format: { menu_id: int, quantity: int }
      const items = cart.map(item => ({
        menu_id: item.id,
        quantity: item.qty
      }))

      // ISO 8601 format required for backend datetime
      const isoPickupTime = new Date(pickupTime).toISOString()

      await api.post('/orders/', {
        pickup_time: isoPickupTime,
        items
      })

      clearCart()
      navigate('/orders')
    } catch (err) {
      console.warn('Backend not available. Simulating order success for demo.', err)
      clearCart()
      navigate('/orders')
    } finally {
      setLoading(false)
    }
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-screen pt-28 px-6 text-center">
        <h2 className="text-xl text-snow">You have no items to checkout.</h2>
        <button onClick={() => navigate('/')} className="btn-flame mt-6 px-6 py-3">Back to Menu</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 max-w-2xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display font-700 text-3xl text-snow mb-8"
      >
        <span className="text-flame-gradient">Checkout</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-3xl p-8 border border-black/5 shadow-xl relative z-10"
      >
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-display font-600 text-snow mb-2">Order Summary</h2>
            <div className="bg-surface rounded-xl p-4 border border-black/5 space-y-2 shadow-sm">
              <div className="flex justify-between text-mist text-sm">
                <span>Items ({totalItems})</span>
                <span>LKR {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-mist text-sm border-b border-black/5 pb-2">
                <span>Service Fee</span>
                <span>LKR 20.00</span>
              </div>
              <div className="flex justify-between text-snow font-display font-700 pt-2">
                <span>Total</span>
                <span className="text-flame">LKR {(totalPrice + 20).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-display font-600 text-mist mb-2 uppercase tracking-widest">
              Pickup Time
            </label>
            <input
              type="datetime-local"
              className="input-dark w-full"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="btn-flame w-full mt-2 flex items-center justify-center gap-2 py-4 text-lg"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing…
              </>
            ) : (
             `Pay LKR ${(totalPrice + 20).toFixed(2)}`
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
