// src/pages/AdminDashboard.jsx
// Full admin panel: sidebar, KPIs, charts, menu management, orders, AI insights

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import api from '../api/axios'
import OrderStatusBadge from '../components/OrderStatusBadge'
import PageTransition from '../components/PageTransition'

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'menu', label: 'Menu Management', icon: '🍽' },
  { id: 'orders', label: 'Orders', icon: '📦' },
  { id: 'ai', label: 'AI Insights', icon: '🤖' },
]

const COLORS = ['#f97316','#fbbf24','#22c55e','#3b82f6','#a855f7']

export default function AdminDashboard() {
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuItems, setMenuItems] = useState([])
  const [orders, setOrders] = useState([])
  const [aiData, setAiData] = useState(null)
  const [aiTyping, setAiTyping] = useState('')
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', price: '', file: null })
  const [imgPreview, setImgPreview] = useState(null)
  const [loadingAi, setLoadingAi] = useState(false)
  const [orderFilter, setOrderFilter] = useState('all')
  const [orderSearch, setOrderSearch] = useState('')

  // Fetch data
  useEffect(() => {
    api.get('/menu').then(r => setMenuItems(r.data)).catch(() => {})
    api.get('/orders/my').then(r => setOrders(r.data)).catch(() => {})
  }, [])

  // Fetch AI insights
  const fetchAi = async () => {
    setLoadingAi(true)
    try {
      const res = await api.get('/ai/insights')
      setAiData(res.data)
      // Simulate typing animation for AI summary
      const text = res.data.ai_summary || 'No insights available yet.'
      let i = 0
      setAiTyping('')
      const interval = setInterval(() => {
        setAiTyping(text.substring(0, i + 1))
        i++
        if (i >= text.length) clearInterval(interval)
      }, 20)
    } catch { setAiData({ busy_hours: [], popular_foods: [], ai_summary: 'Unable to fetch insights. Make sure you have order data.' }) }
    finally { setLoadingAi(false) }
  }

  useEffect(() => { if (active === 'ai') fetchAi() }, [active])

  // Add menu item
  const handleAddItem = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', newItem.name)
    fd.append('price', parseFloat(newItem.price))
    if (newItem.file) fd.append('file', newItem.file)
    try {
      const res = await api.post('/menu/', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMenuItems([...menuItems, res.data])
      setShowAddItem(false)
      setNewItem({ name: '', price: '', file: null })
      setImgPreview(null)
    } catch (err) { alert(err.response?.data?.detail || 'Failed to add item') }
  }

  // Delete menu item
  const handleDeleteItem = async (id) => {
    if (!confirm('Delete this item?')) return
    try {
      await api.delete(`/menu/${id}`)
      setMenuItems(menuItems.filter(i => i.id !== id))
    } catch { alert('Failed to delete') }
  }

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status?status=${newStatus}`)
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    } catch { alert('Failed to update status') }
  }

  // Mock chart data
  const chartData = [
    { name: 'Mon', orders: 45 }, { name: 'Tue', orders: 52 }, { name: 'Wed', orders: 49 },
    { name: 'Thu', orders: 63 }, { name: 'Fri', orders: 71 }, { name: 'Sat', orders: 38 }, { name: 'Sun', orders: 42 },
  ]

  const filteredOrders = orders.filter(o => {
    const matchFilter = orderFilter === 'all' || o.status === orderFilter
    const matchSearch = orderSearch === '' || String(o.id).includes(orderSearch)
    return matchFilter && matchSearch
  })

  return (
    <PageTransition>
      <div className="min-h-screen pt-16 flex">
        {/* ── Sidebar ── */}
        <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-[#111]/95 backdrop-blur-xl border-r border-white/5 z-30 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4">
            <h2 className="text-lg font-bold gradient-text mb-6">Admin Panel</h2>
            <nav className="space-y-1">
              {sidebarItems.map(item => (
                <button key={item.id} onClick={() => { setActive(item.id); setSidebarOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active === item.id ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile sidebar toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed bottom-6 left-6 z-40 lg:hidden w-12 h-12 rounded-full btn-glow flex items-center justify-center">
          <span className="text-lg">{sidebarOpen ? '✕' : '☰'}</span>
        </button>

        {/* Overlay */}
        {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* ── Main Content ── */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <AnimatePresence mode="wait">
            {/* ═══ DASHBOARD ═══ */}
            {active === 'dashboard' && (
              <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Today's Orders", value: orders.length, icon: '📦', trend: '+12%', color: '#f97316' },
                    { label: 'Revenue', value: `Rs.${orders.reduce((s,o) => s + o.total_price, 0).toFixed(0)}`, icon: '💰', trend: '+8%', color: '#22c55e' },
                    { label: 'Pending', value: orders.filter(o=>o.status==='pending').length, icon: '⏳', trend: '', color: '#eab308' },
                    { label: 'Menu Items', value: menuItems.length, icon: '🍽', trend: '', color: '#3b82f6' },
                  ].map((kpi, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">{kpi.icon}</span>
                        {kpi.trend && <span className="text-xs font-medium text-success">{kpi.trend}</span>}
                      </div>
                      <p className="text-2xl font-bold text-white">{kpi.value}</p>
                      <p className="text-text-muted text-xs mt-1">{kpi.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Orders Chart */}
                <div className="glass rounded-2xl p-6 mb-8">
                  <h3 className="text-lg font-bold text-white mb-4">Orders This Week</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                      <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Recent Orders */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Recent Orders</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-text-muted text-left border-b border-white/5">
                        <th className="pb-3 font-medium">ID</th><th className="pb-3 font-medium">Total</th><th className="pb-3 font-medium">Pickup</th><th className="pb-3 font-medium">Status</th>
                      </tr></thead>
                      <tbody>
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id} className="border-b border-white/5">
                            <td className="py-3 text-white">#{o.id}</td>
                            <td className="py-3 text-white">Rs.{o.total_price.toFixed(2)}</td>
                            <td className="py-3 text-text-muted">{new Date(o.pickup_time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</td>
                            <td className="py-3"><OrderStatusBadge status={o.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ MENU MANAGEMENT ═══ */}
            {active === 'menu' && (
              <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-white">Menu Management</h1>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAddItem(true)} className="btn-glow px-5 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center gap-2">
                    <span>+</span> Add Item
                  </motion.button>
                </div>

                <div className="glass rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="text-text-muted text-left border-b border-white/5">
                      <th className="p-4 font-medium">Image</th><th className="p-4 font-medium">Name</th><th className="p-4 font-medium">Price</th><th className="p-4 font-medium">Actions</th>
                    </tr></thead>
                    <tbody>
                      {menuItems.map(item => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/2">
                          <td className="p-4"><div className="w-10 h-10 rounded-lg bg-surface overflow-hidden"><img src={item.image_url || `https://placehold.co/40x40/111/f97316?text=${item.name?.charAt(0)}`} alt="" className="w-full h-full object-cover" /></div></td>
                          <td className="p-4 text-white font-medium">{item.name}</td>
                          <td className="p-4 text-accent font-semibold">Rs.{item.price.toFixed(2)}</td>
                          <td className="p-4">
                            <button onClick={() => handleDeleteItem(item.id)} className="text-red-400 hover:text-red-300 text-xs font-medium">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {menuItems.length === 0 && <p className="p-8 text-center text-text-muted">No menu items yet</p>}
                </div>

                {/* Add Item Drawer */}
                <AnimatePresence>
                  {showAddItem && (
                    <>
                      <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowAddItem(false)} />
                      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#111] border-l border-white/5 p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-bold text-white">Add New Item</h2>
                          <button onClick={() => setShowAddItem(false)} className="text-text-muted hover:text-white">✕</button>
                        </div>
                        <form onSubmit={handleAddItem} className="space-y-5">
                          <div>
                            <label className="text-xs font-medium text-text-muted mb-1 block">Name</label>
                            <input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-text-muted mb-1 block">Price (Rs.)</label>
                            <input type="number" step="0.01" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-text-muted mb-1 block">Image</label>
                            <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-accent/30 transition-colors cursor-pointer" onClick={() => document.getElementById('item-img').click()}>
                              {imgPreview ? <img src={imgPreview} alt="" className="w-full h-32 object-cover rounded-lg" /> : <p className="text-text-muted text-sm">Click or drag to upload</p>}
                            </div>
                            <input id="item-img" type="file" accept="image/*" className="hidden" onChange={e => { setNewItem({...newItem, file: e.target.files[0]}); setImgPreview(URL.createObjectURL(e.target.files[0])) }} />
                          </div>
                          <button type="submit" className="w-full py-3 rounded-xl btn-glow text-white font-semibold">Add Item</button>
                        </form>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ═══ ORDERS MANAGEMENT ═══ */}
            {active === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-bold text-white mb-6">Order Management</h1>
                <div className="flex flex-wrap gap-3 mb-6">
                  {['all','pending','preparing','ready'].map(f => (
                    <button key={f} onClick={() => setOrderFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${orderFilter === f ? 'bg-accent text-white' : 'glass text-text-muted'}`}>{f}</button>
                  ))}
                  <input type="text" placeholder="Search by ID..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-text-muted ml-auto" />
                </div>
                <div className="glass rounded-2xl overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-text-muted text-left border-b border-white/5">
                      <th className="p-4 font-medium">ID</th><th className="p-4 font-medium">Total</th><th className="p-4 font-medium">Pickup</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Update</th>
                    </tr></thead>
                    <tbody>
                      {filteredOrders.map(o => (
                        <tr key={o.id} className="border-b border-white/5">
                          <td className="p-4 text-white">#{o.id}</td>
                          <td className="p-4 text-white">Rs.{o.total_price.toFixed(2)}</td>
                          <td className="p-4 text-text-muted">{new Date(o.pickup_time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</td>
                          <td className="p-4"><OrderStatusBadge status={o.status} /></td>
                          <td className="p-4">
                            <select value={o.status} onChange={e => handleStatusUpdate(o.id, e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs">
                              <option value="pending">Pending</option>
                              <option value="preparing">Preparing</option>
                              <option value="ready">Ready</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 && <p className="p-8 text-center text-text-muted">No orders found</p>}
                </div>
              </motion.div>
            )}

            {/* ═══ AI INSIGHTS ═══ */}
            {active === 'ai' && (
              <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-bold text-white mb-6">AI <span className="gradient-text">Insights</span></h1>

                {loadingAi ? (
                  <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-48 skeleton rounded-2xl" />)}</div>
                ) : aiData ? (
                  <div className="space-y-6">
                    {/* AI Summary */}
                    <div className="glass-strong rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">🤖 AI Summary</h3>
                      <p className="text-text-muted leading-relaxed">{aiTyping || aiData.ai_summary}<span className="inline-block w-0.5 h-4 bg-accent ml-1 align-middle" style={{ animation: 'blink 1s infinite' }} /></p>
                    </div>

                    {/* Busy Hours Chart */}
                    {aiData.busy_hours?.length > 0 && (
                      <div className="glass rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Busy Hours</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={aiData.busy_hours.map(h => ({ hour: `${h.hour}:00`, orders: h.orders }))}>
                            <XAxis dataKey="hour" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} />
                            <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                            <Bar dataKey="orders" fill="#f97316" radius={[6,6,0,0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* Popular Foods */}
                    {aiData.popular_foods?.length > 0 && (
                      <div className="glass rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Popular Foods</h3>
                        <div className="space-y-3">
                          {aiData.popular_foods.map((f, i) => {
                            const max = Math.max(...aiData.popular_foods.map(x => x.total_ordered))
                            return (
                              <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-white">{f.name}</span>
                                  <span className="text-text-muted">{f.total_ordered} orders</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${(f.total_ordered / max) * 100}%` }} transition={{ duration: 1, delay: i * 0.2 }} className="h-full rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-text-muted">Click to load AI insights</p>
                    <button onClick={fetchAi} className="btn-glow px-6 py-2 rounded-xl text-white text-sm mt-4">Load Insights</button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </PageTransition>
  )
}
