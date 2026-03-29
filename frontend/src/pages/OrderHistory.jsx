// src/pages/OrderHistory.jsx
// Timeline layout with filter tabs, expandable order cards, reorder button

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/axios'
import OrderStatusBadge from '../components/OrderStatusBadge'
import PageTransition from '../components/PageTransition'

const tabs = ['all', 'active', 'completed']

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/orders/my')
        setOrders(res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
      } catch { setOrders([]) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  const filtered = orders.filter(o => {
    if (activeTab === 'active') return o.status === 'pending' || o.status === 'preparing'
    if (activeTab === 'completed') return o.status === 'ready'
    return true
  })

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Order <span className="gradient-text">History</span></h1>
        <p className="text-[#9ca3af] mb-6">Track and review your past orders</p>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                activeTab === tab ? 'bg-[#f97316] text-white shadow-lg shadow-[#f97316]/25' : 'glass text-[#9ca3af] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="glass rounded-2xl p-6">
                <div className="flex justify-between mb-3"><div className="h-4 w-24 skeleton" /><div className="h-6 w-20 skeleton rounded-full" /></div>
                <div className="h-3 w-48 skeleton mb-2" /><div className="h-3 w-32 skeleton" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <motion.div animate={{ y: [-5,5,-5] }} transition={{ duration: 3, repeat: Infinity }} className="text-6xl mb-4">📋</motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
            <p className="text-[#9ca3af] text-sm">Start ordering from our menu!</p>
          </motion.div>
        ) : (
          /* Timeline */
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5 hidden md:block" />

            <div className="space-y-4">
              <AnimatePresence>
                {filtered.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative md:pl-14"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-[#f97316] border-4 border-[#0a0a0a] hidden md:block z-10" />

                    <div className="glass rounded-2xl p-6 card-hover">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="text-white font-semibold">Order #{order.id}</p>
                          <p className="text-[#9ca3af] text-xs">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <OrderStatusBadge status={order.status} />
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-[#f97316] font-bold">Rs.{order.total_price.toFixed(2)}</p>
                        <div className="flex gap-2">
                          <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                            className="px-3 py-1.5 rounded-lg glass text-[#9ca3af] hover:text-white text-xs font-medium transition-colors"
                          >
                            {expanded === order.id ? 'Hide' : 'Details'}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Details */}
                      <AnimatePresence>
                        {expanded === order.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="mt-4 pt-4 border-t border-white/5">
                              <p className="text-xs text-[#9ca3af] mb-2">Pickup: {new Date(order.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              <p className="text-xs text-[#9ca3af]">Order placed at: {new Date(order.created_at).toLocaleString()}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
