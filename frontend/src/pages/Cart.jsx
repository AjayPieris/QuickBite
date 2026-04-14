// src/pages/Cart.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart, ArrowRight } from 'lucide-react'

export default function Cart() {
  const { cart, removeItem, updateQty, totalPrice, totalItems } = useCart()
  const navigate = useNavigate()

  if (totalItems === 0) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center text-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="font-display font-700 text-2xl text-snow mb-2">Your cart is empty</h2>
          <p className="text-ash mb-8">Browse the menu and add some delicious items</p>
          <Link to="/" className="btn-flame px-8 py-4">Browse Menu</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 max-w-5xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display font-700 text-3xl text-snow mb-8"
      >
        Your <span className="text-flame-gradient">Cart</span>
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Items list — takes 3/5 */}
        <div className="lg:col-span-3 space-y-3">
          <AnimatePresence>
            {cart.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60, height: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-4 flex items-center gap-4 border border-black/5 shadow-sm"
              >
                {/* Image/emoji */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface flex-shrink-0 flex items-center justify-center text-2xl">
                  {item.image_url
                    ? <img src={item.image_url} className="w-full h-full object-cover" alt={item.name} />
                    : ['🍛', '🍜', '🌮', '🍔', '🥗', '🍱', '🧆', '🥘'][item.id % 8]
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-600 text-snow text-sm truncate">{item.name}</h3>
                  <p className="text-flame text-sm font-700">LKR {item.price?.toFixed(2)}</p>
                </div>

                {/* Qty stepper */}
                <div className="flex items-center gap-2 bg-surface rounded-xl border border-black/5 px-2 py-1 shadow-sm">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-mist hover:text-ink transition-colors">
                    <Minus size={13} strokeWidth={2.5} />
                  </button>
                  <span className="font-bold text-gray-900 text-sm w-4 text-center" style={{fontFamily:"'Outfit',sans-serif"}}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-flame hover:text-ember transition-colors">
                    <Plus size={13} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Subtotal */}
                <span className="font-display font-700 text-snow text-sm w-20 text-right">
                  LKR {(item.price * item.qty).toFixed(2)}
                </span>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 rounded-lg text-mist hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 size={15} strokeWidth={2} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order summary — takes 2/5 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="glass rounded-2xl p-6 border border-black/5 sticky top-28 shadow-md">
            <h2 className="font-display font-700 text-snow text-lg mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-mist">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-snow">LKR {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-mist">
                <span>Service fee</span>
                <span className="text-snow">LKR 20.00</span>
              </div>
              <div className="border-t border-black/5 pt-3 flex justify-between font-display font-700 text-snow">
                <span>Total</span>
                <span className="text-flame text-lg">LKR {(totalPrice + 20).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-flame w-full py-4 text-base"
            >
              Proceed to Checkout →
            </button>

            <Link to="/" className="block text-center text-mist text-sm mt-4 hover:text-ink transition-colors">
              ← Continue shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
