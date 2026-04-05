// src/pages/OrderHistory.jsx
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import OrderStatusBadge from '../components/OrderStatusBadge'

const DEMO_ORDERS = [
  { id: 1, created_at: new Date().toISOString(), pickup_time: new Date().toISOString(), total_price: 760, status: 'ready', items: [] },
  { id: 2, created_at: new Date(Date.now() - 86400000).toISOString(), pickup_time: new Date(Date.now() - 86400000).toISOString(), total_price: 480, status: 'preparing', items: [] },
  { id: 3, created_at: new Date(Date.now() - 172800000).toISOString(), pickup_time: new Date(Date.now() - 172800000).toISOString(), total_price: 320, status: 'pending', items: [] },
]

function SkeletonOrder() {
  return (
    <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-24 shimmer-loading rounded-lg" />
        <div className="h-5 w-20 shimmer-loading rounded-full" />
      </div>
      <div className="h-3 w-48 shimmer-loading rounded-lg" />
      <div className="h-3 w-32 shimmer-loading rounded-lg" />
    </div>
  )
}

export default function OrderHistory() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.get('/orders/my')
      .then(res => setOrders(res.data))
      .catch(() => setOrders(DEMO_ORDERS))
      .finally(() => setLoading(false))
  }, [])

  const filtered = orders.filter(o => {
    if (filter === 'active') return ['pending', 'preparing'].includes(o.status)
    if (filter === 'done')   return o.status === 'ready'
    return true
  })

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display font-700 text-3xl text-snow mb-1">
          My <span className="text-flame-gradient">Orders</span>
        </h1>
        <p className="text-ash text-sm">{orders.length} orders total</p>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8">
        {[
          { key: 'all',    label: 'All Orders' },
          { key: 'active', label: '🔄 Active' },
          { key: 'done',   label: '✅ Completed' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-display font-600 transition-all ${
              filter === tab.key
                ? 'bg-flame text-white shadow-lg shadow-flame/25'
                : 'glass-light text-mist hover:text-snow border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <SkeletonOrder key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-7xl mb-4">🧾</div>
          <h3 className="font-display font-600 text-snow text-xl mb-2">No orders yet</h3>
          <p className="text-ash mb-8">Start ordering from the menu!</p>
          <Link to="/" className="btn-flame px-8 py-3">Browse Menu</Link>
        </div>
      ) : (
        /* Timeline */
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-flame/30 via-border to-transparent" />

          <div className="space-y-4 pl-14">
            {filtered.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className={`absolute -left-[3.25rem] top-5 w-3 h-3 rounded-full border-2 border-ink z-10 ${
                  order.status === 'ready' ? 'bg-emerald-400' :
                  order.status === 'preparing' ? 'bg-blue-400' : 'bg-gold'
                }`} />

                <div className="glass rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-all">
                  {/* Header */}
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display font-700 text-snow text-sm">Order #{order.id}</span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <p className="text-ash text-xs">{formatDate(order.created_at)}</p>
                        <p className="text-mist text-xs mt-1">
                          Pickup: {formatDate(order.pickup_time)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-display font-700 text-flame text-lg">LKR {order.total_price?.toFixed(2)}</p>
                        <button className="text-ash text-xs mt-1 hover:text-snow transition-colors">
                          {expanded === order.id ? '▲ Hide' : '▼ Details'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable details */}
                  <AnimatePresence>
                    {expanded === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/5 px-5 py-4">
                          {order.items?.length > 0 ? (
                            <div className="space-y-2 mb-4">
                              {order.items.map((item, j) => (
                                <div key={j} className="flex justify-between text-sm text-mist">
                                  <span>{item.menu_item?.name || `Item #${item.menu_id}`} × {item.quantity}</span>
                                  <span className="text-snow">LKR {(item.menu_item?.price * item.quantity || 0).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-ash text-sm mb-4">No item details available</p>
                          )}
                          <Link to="/" className="btn-outline text-xs py-2 px-4">🔄 Reorder</Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
