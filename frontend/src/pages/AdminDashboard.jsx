// src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import api from '../api/axios'

/* ─── Sidebar ─────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'menu',      icon: '🍽',  label: 'Menu' },
  { id: 'orders',    icon: '🧾',  label: 'Orders' },
  { id: 'ai',        icon: '🤖',  label: 'AI Insights' },
]

function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-screen sticky top-0 flex-shrink-0 glass border-r border-black/5 flex flex-col py-6 overflow-hidden z-20 shadow-sm"
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 mb-8 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-flame to-ember flex items-center justify-center text-base flex-shrink-0">🍽</div>
        {!collapsed && <span className="font-display font-700 text-snow text-base whitespace-nowrap">QuickBite</span>}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-2 flex-1">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
              active === item.id ? 'bg-flame/10 text-flame' : 'text-mist hover:text-ink hover:bg-black/5'
            }`}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="text-sm font-display font-600 whitespace-nowrap">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-2 mt-2 p-2 rounded-xl text-ash hover:text-snow hover:bg-white/5 transition-all text-sm"
      >
        {collapsed ? '→' : '← Collapse'}
      </button>
    </motion.aside>
  )
}

/* ─── KPI Card ────────────────────────────────────────── */
function KpiCard({ icon, label, value, trend, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="glass rounded-2xl p-5 border border-black/5 hover:border-flame/20 transition-all shadow-sm bg-white"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-display font-600 px-2 py-1 rounded-lg ${trend >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      </div>
      <p className={`font-display font-700 text-2xl mb-1`} style={{ color }}>{value}</p>
      <p className="text-ash text-xs">{label}</p>
    </motion.div>
  )
}

function DashboardTab() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data)).catch(() => {})
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status?status=${status}`)
    } catch { /* ignore */ }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  // Calculate KPIs
  const today = new Date().setHours(0, 0, 0, 0)
  const todaysOrders = orders.filter(o => new Date(o.created_at).setHours(0, 0, 0, 0) === today)
  const todaysRevenue = todaysOrders.reduce((sum, o) => sum + o.total_price, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length

  const itemCounts = {}
  orders.forEach(o => {
    if (Array.isArray(o.items)) {
      o.items.forEach(i => {
        itemCounts[i.menu_item?.name] = (itemCounts[i.menu_item?.name] || 0) + i.quantity
      })
    }
  })
  const topItem = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

  // Calculate Weekly Chart Data
  const last7Days = Array.from({length: 7}).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateString: d.toDateString()
    }
  })

  const chartData = last7Days.map(dayObj => {
    const count = orders.filter(o => new Date(o.created_at).toDateString() === dayObj.dateString).length
    return { day: dayObj.day, orders: count }
  })

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon="🧾" label="Today's Orders"  value={todaysOrders.length.toString()} trend={0}  color="#f97316" />
        <KpiCard icon="💰" label="Today's Revenue" value={`LKR ${todaysRevenue.toFixed(0)}`} trend={0} color="#ffc947" />
        <KpiCard icon="⏳" label="Pending"         value={pendingOrders.toString()}       trend={0}  color="#60a5fa" />
        <KpiCard icon="🔥" label="Top Item"        value={topItem}   trend={0}  color="#34d399" />
      </div>

      {/* Chart */}
      <div className="glass rounded-2xl p-6 border border-white/5">
        <h3 className="font-display font-600 text-snow mb-5">Orders This Week</h3>
        {orders.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="day" stroke="#6b6b7b" tick={{ fontSize: 12, fontFamily: 'DM Sans' }} />
              <YAxis stroke="#6b6b7b" tick={{ fontSize: 12, fontFamily: 'DM Sans' }} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 12, color: '#0c0c0e', fontSize: 13, boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}
                cursor={{ stroke: 'rgba(255,77,0,0.1)' }}
              />
              <Line type="monotone" dataKey="orders" stroke="#ff4d00" strokeWidth={2.5} dot={{ fill: '#ff4d00', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-ash text-sm">No recent orders to display on the chart.</div>
        )}
      </div>

      {/* Recent orders table */}
      <div className="glass rounded-2xl border border-black/5 overflow-hidden shadow-sm bg-white">
        <div className="px-6 py-4 border-b border-black/5">
          <h3 className="font-display font-600 text-snow">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5">
                {['ID', 'Customer', 'Items', 'Total', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-display font-600 text-mist uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
               {orders.map(order => (
                <tr key={order.id} className="border-b border-black/[0.03] hover:bg-black/[0.01] transition-colors">
                  <td className="px-6 py-4 font-display font-600 text-snow">#{order.id}</td>
                  <td className="px-6 py-4 text-mist">{order.user?.name || '—'}</td>
                  <td className="px-6 py-4 text-mist truncate max-w-[160px]">
                    {Array.isArray(order.items) ? order.items.map(i => `${i.menu_item.name} (${i.quantity})`).join(', ') : order.items}
                  </td>
                  <td className="px-6 py-4 text-flame font-display font-600">LKR {order.total_price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-display font-600 border ${
                      order.status === 'ready' ? 'badge-ready' : order.status === 'preparing' ? 'badge-preparing' : 'badge-pending'
                    }`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className="bg-white text-mist text-xs rounded-lg px-2 py-1.5 border border-black/10 outline-none focus:border-flame cursor-pointer shadow-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ─── Menu management tab ─────────────────────────────── */
function MenuTab() {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]     = useState({ name: '', price: '' })
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/menu').then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('price', form.price)
      if (imageFile) fd.append('file', imageFile)
      const res = await api.post('/menu', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setItems(prev => [...prev, res.data])
      setForm({ name: '', price: '' })
      setImageFile(null)
      setShowForm(false)
    } catch {
      // demo: add locally
      setItems(prev => [...prev, { id: Date.now(), name: form.name, price: parseFloat(form.price), image_url: null }])
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try { await api.delete(`/menu/${id}`) } catch {}
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-600 text-snow text-lg">Menu Items ({items.length})</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-flame text-sm py-2.5 px-5">
          {showForm ? '✕ Cancel' : '+ Add Item'}
        </button>
      </div>

      {/* Add item form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="glass rounded-2xl p-6 border border-flame/20 space-y-4 overflow-hidden"
          >
            <h4 className="font-display font-600 text-snow">New Menu Item</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display font-600 text-mist mb-2 uppercase tracking-widest">Name</label>
                <input className="input-dark" placeholder="e.g. Chicken Rice" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs font-display font-600 text-mist mb-2 uppercase tracking-widest">Price (LKR)</label>
                <input className="input-dark" type="number" placeholder="350" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
              </div>
            </div>
            {/* Image drop zone */}
            <label className="block border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-flame/40 transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
              <div className="text-3xl mb-2">{imageFile ? '✅' : '🖼'}</div>
              <p className="text-ash text-sm">{imageFile ? imageFile.name : 'Click or drag to upload image (optional)'}</p>
            </label>
            <button type="submit" disabled={saving} className="btn-flame py-3 px-8">
              {saving ? 'Saving…' : 'Add Item'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Items table */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 shimmer-loading rounded-xl" />)}</div>
      ) : items.length === 0 ? (
         <div className="glass rounded-2xl border border-white/5 py-12 flex flex-col items-center justify-center text-ash">
          <div className="text-4xl mb-2">🍽</div>
          <p>Your menu is empty.</p>
         </div>
      ) : (
        <div className="glass rounded-2xl border border-black/5 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5">
                {['Image', 'Name', 'Price', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-display font-600 text-mist uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-black/[0.03] hover:bg-black/[0.01] transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface flex items-center justify-center text-lg">
                      {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" alt="" /> : '🍽'}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-display font-600 text-snow">{item.name}</td>
                  <td className="px-5 py-3 text-flame font-display font-700">LKR {item.price?.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:bg-red-400/10 px-3 py-1.5 rounded-lg text-xs font-display transition-colors">Delete</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ─── Orders management tab ───────────────────────────── */
function OrdersTab() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    try { await api.put(`/orders/${id}/status?status=${status}`) } catch {}
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const filtered = orders.filter(o => filter === 'all' ? true : o.status === filter)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'preparing', 'ready'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-display font-600 transition-all capitalize ${
              filter === s ? 'bg-flame text-white shadow-lg shadow-flame/30' : 'glass-light text-mist hover:text-ink border border-black/5'
            }`}
          >
            {s === 'all' ? 'All Orders' : s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 shimmer-loading rounded-xl" />)}</div>
      ) : (
        <div className="glass rounded-2xl border border-black/5 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5">
                {['Order', 'Customer', 'Total', 'Pickup', 'Status', 'Update'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-display font-600 text-mist uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="border-b border-black/[0.03] hover:bg-black/[0.01] transition-colors">
                  <td className="px-5 py-4 font-display font-600 text-snow">#{order.id}</td>
                  <td className="px-5 py-4 text-mist">{order.user?.name || '—'}</td>
                  <td className="px-5 py-4 text-flame font-display font-600">LKR {order.total_price}</td>
                  <td className="px-5 py-4 text-ash text-xs">{new Date(order.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-display font-600 border ${
                      order.status === 'ready' ? 'badge-ready' : order.status === 'preparing' ? 'badge-preparing' : 'badge-pending'
                    }`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className="bg-surface text-mist text-xs rounded-lg px-2 py-1.5 border border-white/10 outline-none focus:border-flame cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function AITab() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [typedText, setTypedText] = useState('')

  useEffect(() => {
    api.get('/ai/insights')
      .then(res => setInsights(res.data))
      .catch(() => setInsights({ ai_summary: 'Unable to connect to AI service.' }))
      .finally(() => setLoading(false))
  }, [])

  // Format busy hours from backend (hour 14 -> "2pm")
  const formatHour = (h) => {
    if (h === 0) return '12am'
    if (h === 12) return '12pm'
    return h > 12 ? `${h - 12}pm` : `${h}am`
  }
  const busyHoursData = insights?.busy_hours?.map(b => ({
    hour: formatHour(b.hour),
    orders: b.orders
  })) || []

  // Format popular foods and calculate percentage
  const COLORS = ['#ff4d00', '#ffc947', '#60a5fa', '#34d399', '#6b6b7b']
  const totalFoods = insights?.popular_foods?.reduce((sum, f) => sum + f.total_ordered, 0) || 1
  const popularData = insights?.popular_foods?.map((p, i) => ({
    name: p.name,
    value: Math.round((p.total_ordered / totalFoods) * 100),
    count: p.total_ordered,
    color: COLORS[i % COLORS.length]
  })) || []

  // Typewriter for AI summary
  useEffect(() => {
    if (!insights?.ai_summary) return
    let i = 0
    const text = insights.ai_summary
    const timer = setInterval(() => {
      if (i >= text.length) { clearInterval(timer); return }
      setTypedText(text.slice(0, i + 1))
      i++
    }, 18)
    return () => clearInterval(timer)
  }, [insights])

  return (
    <div className="space-y-6">
      {/* AI Summary card */}
      <div className="glass rounded-2xl p-6 border border-flame/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-flame/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-flame/20 to-ember/20 border border-flame/30 flex items-center justify-center text-xl">🤖</div>
          <div>
            <h3 className="font-display font-600 text-snow">AI Insight</h3>
            <p className="text-ash text-xs">Powered by Gemini</p>
          </div>
        </div>
        {loading
          ? <div className="space-y-2">{[1,2,3].map(i => <div key={i} className={`h-3 shimmer-loading rounded w-${i === 3 ? '1/2' : 'full'}`}/>)}</div>
          : <p className="text-mist leading-relaxed text-sm">
              {typedText}
              <span className="inline-block w-0.5 h-4 bg-flame ml-0.5 animate-pulse align-middle" />
            </p>
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Busy hours bar chart */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-display font-600 text-snow mb-5">Busy Hours</h3>
          {busyHoursData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={busyHoursData}>
                <XAxis dataKey="hour" stroke="#6b6b7b" tick={{ fontSize: 11, fontFamily: 'DM Sans' }} />
                <YAxis stroke="#6b6b7b" tick={{ fontSize: 11, fontFamily: 'DM Sans' }} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 12, color: '#0c0c0e', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="orders" fill="#ff4d00" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-ash text-sm">No order data available yet.</div>
          )}
        </div>

        {/* Popular foods donut */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-display font-600 text-snow mb-5">Popular Items</h3>
          {popularData.length > 0 ? (
            <div className="flex items-center gap-6">
              <PieChart width={160} height={160}>
                <Pie data={popularData} cx={75} cy={75} innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {popularData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div className="flex flex-col gap-2 flex-1">
                {popularData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span className="text-mist text-xs truncate max-w-[80px]" title={item.name}>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex-1 h-1.5 bg-black/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                      </div>
                      <span className="text-snow text-xs font-display font-600 w-8 text-right">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[160px] flex items-center justify-center text-ash text-sm">No food items ordered yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Main AdminDashboard ─────────────────────────────── */
export default function AdminDashboard() {
  const [active, setActive]       = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  const TAB_CONTENT = {
    dashboard: <DashboardTab />,
    menu:      <MenuTab />,
    orders:    <OrdersTab />,
    ai:        <AITab />,
  }

  const TAB_TITLES = {
    dashboard: 'Dashboard',
    menu:      'Menu Management',
    orders:    'Order Management',
    ai:        'AI Insights',
  }

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="flex-1 overflow-x-hidden p-6 lg:p-8">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="font-display font-700 text-2xl text-snow mb-6">
            {TAB_TITLES[active]}
          </h1>
          {TAB_CONTENT[active]}
        </motion.div>
      </main>
    </div>
  )
}
