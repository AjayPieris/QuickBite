// src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import api from '../api/axios'
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Receipt, 
  Bot, 
  Utensils, 
  ArrowLeft, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Wallet,
  Clock,
  Flame,
  ImagePlus,
  CheckCircle,
  Plus
} from 'lucide-react'

// Common neumorphic styles
const colors = {
  primary: '#2C1A0E',
  muted: '#A08060',
  accent: '#E8732A',
  bg: '#F0E8DC',
  success: '#5AAB5E',
  error: '#E85A2A',
  blue: '#4A90E2', 
  warning: '#F5A623', 
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

const fonts = {
  heading: { fontFamily: "'Outfit', sans-serif" },
  body: { fontFamily: "'Outfit', sans-serif" }
}

/* ─── Sidebar ─────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'menu',      icon: UtensilsCrossed, label: 'Menu' },
  { id: 'orders',    icon: Receipt,         label: 'Orders' },
  { id: 'ai',        icon: Bot,             label: 'Insights' },
]

function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 250 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-screen sticky top-0 flex-shrink-0 flex flex-col py-6 overflow-hidden z-20"
      style={{ ...neumorphic.raised, borderRadius: '0 32px 32px 0' }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-4 px-6 mb-10 ${collapsed ? 'justify-center px-4' : ''}`}>
        <div 
          className="w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0"
          style={neumorphic.inset}
        >
          <Utensils size={24} color={colors.accent} strokeWidth={2} />
        </div>
        {!collapsed && <span className="text-[20px] font-bold whitespace-nowrap" style={{ ...fonts.heading, color: colors.primary }}>QuickBite</span>}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-3 px-4 flex-1">
        {NAV_ITEMS.map(item => {
          const IconObj = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-[18px] transition-all text-left group`}
              style={isActive ? neumorphic.buttonRaised : { color: colors.muted, background: 'transparent' }}
            >
              <IconObj size={20} className="flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              {!collapsed && (
                <span 
                  className={`text-[15px] font-semibold whitespace-nowrap transition-colors`}
                >
                  {item.label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-4 mt-auto">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-4 rounded-[18px] transition-colors"
          style={{ color: colors.muted, ...(collapsed ? {} : { justifyContent: 'flex-start', gap: '12px' }) }}
        >
          {collapsed ? <ArrowRight size={20} /> : (
            <>
              <ArrowLeft size={20} />
              <span className="text-[14px] font-semibold">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  )
}

/* ─── KPI Card ────────────────────────────────────────── */
function KpiCard({ icon: Icon, label, value, trend, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="rounded-[24px] p-6 transition-all"
      style={neumorphic.raised}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-[16px] flex items-center justify-center" style={neumorphic.inset}>
          <Icon size={24} color={color} strokeWidth={2} />
        </div>
        <div 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold"
          style={{ 
            background: trend >= 0 ? 'rgba(90, 171, 94, 0.1)' : 'rgba(232, 90, 42, 0.1)',
            color: trend >= 0 ? colors.success : colors.error
          }}
        >
          {trend >= 0 ? <TrendingUp size={14} strokeWidth={3} /> : <TrendingDown size={14} strokeWidth={3} />}
          {Math.abs(trend)}%
        </div>
      </div>
      <p className="text-[28px] font-bold mb-1 tracking-tight" style={{ ...fonts.heading, color }}>{value}</p>
      <p className="font-semibold text-[14px]" style={{ color: colors.muted }}>{label}</p>
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
    <div className="space-y-8">
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard icon={ShoppingBag} label="Today's Orders"  value={todaysOrders.length.toString()} trend={0}  color={colors.accent} />
        <KpiCard icon={Wallet}      label="Today's Revenue" value={`LKR ${todaysRevenue.toFixed(0)}`} trend={0} color={colors.warning} />
        <KpiCard icon={Clock}       label="Pending"         value={pendingOrders.toString()}       trend={0}  color={colors.blue} />
        <KpiCard icon={Flame}       label="Top Item"        value={topItem}   trend={0}  color={colors.success} />
      </div>

      {/* Chart */}
      <div className="rounded-[28px] p-8" style={neumorphic.raised}>
        <h3 className="text-[18px] font-bold mb-6 flex items-center gap-3" style={{ ...fonts.heading, color: colors.primary }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={neumorphic.inset}>
            <LayoutDashboard size={14} color={colors.accent} />
          </div>
          Orders This Week
        </h3>
        {orders.length > 0 ? (
          <div className="rounded-[20px] p-4 pt-8" style={neumorphic.inset}>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <XAxis dataKey="day" stroke={colors.muted} tick={{ fontSize: 13, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
                <YAxis stroke={colors.muted} tick={{ fontSize: 13, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: colors.bg, border: 'none', borderRadius: '16px', color: colors.primary, fontSize: 14, boxShadow: '6px 6px 16px rgba(180,130,90,0.32), -6px -6px 16px rgba(255,255,255,0.85)', padding: '12px 16px', fontWeight: 600 }}
                  cursor={{ stroke: 'rgba(232,115,42,0.15)', strokeWidth: 2 }}
                />
                <Line type="monotone" dataKey="orders" stroke={colors.accent} strokeWidth={3.5} dot={{ fill: colors.bg, stroke: colors.accent, strokeWidth: 3, r: 6 }} activeDot={{ r: 8, fill: colors.accent }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[240px] flex items-center justify-center font-medium rounded-[20px]" style={{ ...neumorphic.inset, color: colors.muted }}>
            No recent orders to display on the chart.
          </div>
        )}
      </div>

      {/* Recent orders table */}
      <div className="rounded-[28px] overflow-hidden p-1 pb-4" style={neumorphic.raised}>
        <div className="px-8 py-6">
          <h3 className="text-[18px] font-bold flex items-center gap-3" style={{ ...fonts.heading, color: colors.primary }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={neumorphic.inset}>
              <Receipt size={14} color={colors.accent} />
            </div>
            Recent Orders
          </h3>
        </div>
        <div className="overflow-x-auto px-4">
          <div className="rounded-[20px] overflow-hidden" style={neumorphic.inset}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  {['ID', 'Customer', 'Items', 'Total', 'Status', 'Action'].map((h, i) => (
                    <th key={h} className="px-6 py-4 text-[12px] font-bold uppercase tracking-widest text-opacity-80" style={{ color: colors.muted, borderBottom: '1px solid rgba(180,130,90,0.1)', paddingLeft: i === 0 ? '24px' : '16px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                 {orders.map((order, i) => (
                  <tr key={order.id} className="transition-colors hover:bg-black/[0.02]">
                    <td className="px-6 py-4 font-bold" style={{ color: colors.primary, borderBottom: '1px solid rgba(180,130,90,0.05)', paddingLeft: '24px' }}>#{order.id}</td>
                    <td className="px-4 py-4 font-medium" style={{ color: colors.muted, borderBottom: '1px solid rgba(180,130,90,0.05)' }}>{order.user?.name || '—'}</td>
                    <td className="px-4 py-4 font-medium truncate max-w-[160px]" style={{ color: colors.muted, borderBottom: '1px solid rgba(180,130,90,0.05)' }}>
                      {Array.isArray(order.items) ? order.items.map(i => `${i.menu_item.name} (${i.quantity})`).join(', ') : order.items}
                    </td>
                    <td className="px-4 py-4 font-bold" style={{ color: colors.accent, borderBottom: '1px solid rgba(180,130,90,0.05)' }}>LKR {order.total_price}</td>
                    <td className="px-4 py-4" style={{ borderBottom: '1px solid rgba(180,130,90,0.05)' }}>
                      <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider`}
                            style={{
                              background: order.status === 'ready' ? 'rgba(90, 171, 94, 0.1)' : order.status === 'preparing' ? 'rgba(74, 144, 226, 0.1)' : 'rgba(245, 166, 35, 0.1)',
                              color: order.status === 'ready' ? colors.success : order.status === 'preparing' ? colors.blue : colors.warning
                            }}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4" style={{ borderBottom: '1px solid rgba(180,130,90,0.05)' }}>
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className="text-[13px] font-bold rounded-[12px] px-3 py-2 outline-none cursor-pointer appearance-none text-center"
                        style={{ ...neumorphic.raised, color: colors.primary }}
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
    </div>
  )
}

/* ─── Menu management tab ─────────────────────────────── */
function MenuTab() {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]     = useState({ name: '', price: '', category: 'All' })
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
      fd.append('category', form.category)
      if (imageFile) fd.append('file', imageFile)
      const res = await api.post('/menu', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setItems(prev => [...prev, res.data])
      setForm({ name: '', price: '', category: 'All' })
      setImageFile(null)
      setShowForm(false)
    } catch {
      // demo: add locally
      setItems(prev => [...prev, { id: Date.now(), name: form.name, price: parseFloat(form.price), image_url: null, category: form.category }])
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[22px] flex items-center gap-3" style={{ ...fonts.heading, color: colors.primary }}>
          Menu Items <span className="text-[14px] px-3 py-1 rounded-full" style={neumorphic.inset}>{items.length}</span>
        </h3>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)} 
          className="text-[14px] font-semibold py-3 px-6 rounded-[16px] flex items-center gap-2"
          style={showForm ? { ...neumorphic.inset, color: colors.muted } : { ...neumorphic.buttonRaised }}
        >
          {showForm ? '✕ Cancel' : <><Plus size={16} /> Add Item</>}
        </motion.button>
      </div>

      {/* Add item form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="rounded-[28px] overflow-hidden"
          >
            <div className="p-8 pb-10" style={neumorphic.raised}>
              <h4 className="text-[18px] font-bold mb-6 flex items-center gap-3" style={{ ...fonts.heading, color: colors.primary }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={neumorphic.inset}>
                  <UtensilsCrossed size={14} color={colors.accent} />
                </div>
                New Menu Item
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[12px] font-bold mb-3 uppercase tracking-widest pl-2" style={{ color: colors.muted }}>Name</label>
                  <input 
                    placeholder="e.g. Chicken Rice" 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                    className="w-full outline-none font-medium text-[15px] rounded-[18px] px-5 py-4"
                    style={{ ...neumorphic.inset, color: colors.primary }}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold mb-3 uppercase tracking-widest pl-2" style={{ color: colors.muted }}>Price (LKR)</label>
                  <input 
                    type="number" 
                    placeholder="350" 
                    value={form.price} 
                    onChange={e => setForm({ ...form, price: e.target.value })} 
                    className="w-full outline-none font-medium text-[15px] rounded-[18px] px-5 py-4"
                    style={{ ...neumorphic.inset, color: colors.primary }}
                    required 
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-[12px] font-bold mb-3 uppercase tracking-widest pl-2" style={{ color: colors.muted }}>Category</label>
                <select 
                  className="w-full outline-none font-medium text-[15px] rounded-[18px] px-5 py-4 appearance-none"
                  style={{ ...neumorphic.inset, color: colors.primary }}
                  value={form.category} 
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  <option value="All">All</option>
                  <option value="Rice">Rice</option>
                  <option value="Noodles">Noodles</option>
                  <option value="FastFood">FastFood</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>
              {/* Image drop zone */}
              <label 
                className="block rounded-[20px] p-10 text-center cursor-pointer hover:opacity-80 transition-opacity mb-8 flex flex-col items-center justify-center gap-4"
                style={neumorphic.inset}
              >
                <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                <div 
                  className="w-16 h-16 rounded-[16px] flex items-center justify-center"
                  style={neumorphic.raised}
                >
                  {imageFile ? <CheckCircle size={28} color={colors.success} /> : <ImagePlus size={28} color={colors.accent} />}
                </div>
                <p className="font-semibold text-[14px]" style={{ color: colors.muted }}>
                  {imageFile ? imageFile.name : 'Click or drag to upload image (optional)'}
                </p>
              </label>
              
              <div className="flex justify-end">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  disabled={saving} 
                  className="py-3.5 px-10 rounded-[18px] font-bold text-[15px]"
                  style={neumorphic.buttonRaised}
                >
                  {saving ? 'Saving…' : 'Save Item'}
                </motion.button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Items table */}
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-[80px] rounded-[20px]" style={{ background: 'rgba(180,130,90,0.1)' }} />)}</div>
      ) : items.length === 0 ? (
         <div className="rounded-[32px] py-20 flex flex-col items-center justify-center text-center max-w-lg mx-auto mt-10" style={neumorphic.raised}>
          <div className="w-24 h-24 rounded-[24px] flex items-center justify-center mb-6" style={neumorphic.inset}>
            <UtensilsCrossed size={48} color={colors.muted} strokeWidth={1} />
          </div>
          <p className="text-[20px] font-bold mb-2" style={{ color: colors.primary }}>Your menu is empty.</p>
          <p className="text-[14px] font-medium" style={{ color: colors.muted }}>Time to add some culinary creations!</p>
         </div>
      ) : (
        <div className="rounded-[28px] overflow-hidden p-1 pb-4" style={neumorphic.raised}>
          <div className="overflow-x-auto px-4 pt-4">
            <div className="rounded-[20px] overflow-hidden" style={neumorphic.inset}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    {['Image', 'Name', 'Category', 'Price', 'Actions'].map((h, i) => (
                      <th key={h} className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-opacity-80" style={{ color: colors.muted, borderBottom: '1px solid rgba(180,130,90,0.1)', paddingLeft: i === 0 ? '24px' : '16px' }}>{h}</th>
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
                      className="transition-colors hover:bg-black/[0.02]"
                    >
                      <td className="px-4 py-4" style={{ borderBottom: '1px solid rgba(180,130,90,0.05)', paddingLeft: '24px' }}>
                        <div className="w-[48px] h-[48px] rounded-[14px] overflow-hidden flex items-center justify-center" style={neumorphic.raised}>
                          {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover p-1 rounded-[12px]" alt="" /> : <Utensils size={20} color={colors.accent} />}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold" style={{ color: colors.primary, borderBottom: '1px solid rgba(180,130,90,0.05)' }}>{item.name}</td>
                      <td className="px-4 py-4 font-medium" style={{ color: colors.muted, borderBottom: '1px solid rgba(180,130,90,0.05)' }}>{item.category || 'All'}</td>
                      <td className="px-4 py-4 font-bold" style={{ color: colors.accent, borderBottom: '1px solid rgba(180,130,90,0.05)' }}>LKR {item.price?.toFixed(2)}</td>
                      <td className="px-4 py-4" style={{ borderBottom: '1px solid rgba(180,130,90,0.05)' }}>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="px-4 py-2 rounded-[12px] text-[13px] font-bold transition-all"
                          style={{ ...neumorphic.raised, color: colors.error }}
                        >Delete</button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
    <div className="space-y-8">
      {/* Filters */}
      <div 
        className="p-2 rounded-[24px] inline-flex flex-wrap gap-2 overflow-hidden"
        style={neumorphic.inset}
      >
        {['all', 'pending', 'preparing', 'ready'].map(s => {
          const isActive = filter === s;
          return (
            <motion.button
              key={s}
              onClick={() => setFilter(s)}
              whileTap={{ scale: isActive ? 1 : 0.96 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-[16px] text-sm md:text-[15px] font-semibold transition-colors duration-300 capitalize`}
              style={isActive ? neumorphic.buttonRaised : { color: colors.muted, background: 'transparent' }}
            >
              {s === 'all' ? 'All Orders' : s}
            </motion.button>
          )
        })}
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-[80px] rounded-[20px]" style={{ background: 'rgba(180,130,90,0.1)' }} />)}</div>
      ) : (
        <div className="rounded-[28px] overflow-hidden p-1 pb-4" style={neumorphic.raised}>
          <div className="overflow-x-auto px-4 pt-4">
            <div className="rounded-[20px] overflow-hidden" style={neumorphic.inset}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    {['Order', 'Customer', 'Total', 'Pickup', 'Status', 'Update'].map((h, i) => (
                      <th key={h} className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-opacity-80" style={{ color: colors.muted, borderBottom: '1px solid rgba(180,130,90,0.1)', paddingLeft: i === 0 ? '24px' : '16px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => (
                    <tr key={order.id} className="transition-colors hover:bg-black/[0.02]">
                      <td className="px-6 py-4 font-bold" style={{ color: colors.primary, borderBottom: '1px solid rgba(180,130,90,0.05)', paddingLeft: '24px' }}>#{order.id}</td>
                      <td className="px-4 py-4 font-medium" style={{ color: colors.muted, borderBottom: '1px solid rgba(180,130,90,0.05)' }}>{order.user?.name || '—'}</td>
                      <td className="px-4 py-4 font-bold" style={{ color: colors.accent, borderBottom: '1px solid rgba(180,130,90,0.05)' }}>LKR {order.total_price}</td>
                      <td className="px-4 py-4 font-semibold text-[13px]" style={{ color: colors.muted, borderBottom: '1px solid rgba(180,130,90,0.05)' }}>
                        {new Date(order.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-4" style={{ borderBottom: '1px solid rgba(180,130,90,0.05)' }}>
                        <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider`}
                            style={{
                              background: order.status === 'ready' ? 'rgba(90, 171, 94, 0.1)' : order.status === 'preparing' ? 'rgba(74, 144, 226, 0.1)' : 'rgba(245, 166, 35, 0.1)',
                              color: order.status === 'ready' ? colors.success : order.status === 'preparing' ? colors.blue : colors.warning
                            }}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4" style={{ borderBottom: '1px solid rgba(180,130,90,0.05)' }}>
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          className="text-[13px] font-bold rounded-[12px] px-3 py-2 outline-none cursor-pointer appearance-none text-center"
                          style={{ ...neumorphic.raised, color: colors.primary }}
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

  const formatHour = (h) => {
    if (h === 0) return '12am'
    if (h === 12) return '12pm'
    return h > 12 ? `${h - 12}pm` : `${h}am`
  }
  const busyHoursData = insights?.busy_hours?.map(b => ({
    hour: formatHour(b.hour),
    orders: b.orders
  })) || []

  const PIE_COLORS = [colors.accent, colors.warning, colors.blue, colors.success, colors.muted]
  const totalFoods = insights?.popular_foods?.reduce((sum, f) => sum + f.total_ordered, 0) || 1
  const popularData = insights?.popular_foods?.map((p, i) => ({
    name: p.name,
    value: Math.round((p.total_ordered / totalFoods) * 100),
    count: p.total_ordered,
    color: PIE_COLORS[i % PIE_COLORS.length]
  })) || []

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
    <div className="space-y-8">
      {/* AI Summary card */}
      <div className="rounded-[28px] p-8 relative overflow-hidden" style={neumorphic.raised}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-[20px] flex items-center justify-center text-xl shrink-0" style={neumorphic.inset}>
            <Bot size={28} color={colors.accent} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-[20px] font-bold tracking-tight" style={{ ...fonts.heading, color: colors.primary }}>AI Insights Analysis</h3>
            <p className="font-medium text-[13px] uppercase tracking-widest mt-1" style={{ color: colors.muted }}>Powered by Gemini</p>
          </div>
        </div>
        {loading
          ? <div className="space-y-3 p-4 rounded-[20px]" style={neumorphic.inset}>{[1,2,3].map(i => <div key={i} className={`h-3 rounded-full w-${i === 3 ? '1/2' : 'full'}`} style={{ background: 'rgba(180,130,90,0.1)' }} />)}</div>
          : <div className="p-6 rounded-[20px] text-[15px] font-medium leading-relaxed" style={{ ...neumorphic.inset, color: colors.primary }}>
              {typedText}
              <span className="inline-block w-1.5 h-4 ml-1 animate-pulse align-middle rounded-full" style={{ background: colors.accent }} />
            </div>
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Busy hours bar chart */}
        <div className="rounded-[28px] p-6 lg:p-8" style={neumorphic.raised}>
          <h3 className="text-[18px] font-bold mb-6 flex items-center gap-3" style={{ ...fonts.heading, color: colors.primary }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={neumorphic.inset}>
              <Clock size={14} color={colors.accent} />
            </div>
            Peak Hours
          </h3>
          <div className="rounded-[20px] p-4 pt-8" style={neumorphic.inset}>
            {busyHoursData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={busyHoursData}>
                  <XAxis dataKey="hour" stroke={colors.muted} tick={{ fontSize: 12, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
                  <YAxis stroke={colors.muted} tick={{ fontSize: 12, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: colors.bg, border: 'none', borderRadius: '16px', color: colors.primary, fontSize: 13, boxShadow: '6px 6px 16px rgba(180,130,90,0.32), -6px -6px 16px rgba(255,255,255,0.85)', padding: '10px 14px', fontWeight: 600 }} cursor={{ fill: 'rgba(232,115,42,0.06)' }} />
                  <Bar dataKey="orders" fill={colors.accent} radius={[8, 8, 8, 8]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center font-medium" style={{ color: colors.muted }}>No order data available yet.</div>
            )}
          </div>
        </div>

        {/* Popular foods donut */}
        <div className="rounded-[28px] p-6 lg:p-8" style={neumorphic.raised}>
          <h3 className="text-[18px] font-bold mb-6 flex items-center gap-3" style={{ ...fonts.heading, color: colors.primary }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={neumorphic.inset}>
              <Flame size={14} color={colors.accent} />
            </div>
            Hot Items
          </h3>
          <div className="rounded-[20px] p-6 lg:p-8" style={neumorphic.inset}>
            {popularData.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <PieChart width={160} height={160}>
                  <Pie data={popularData} cx={75} cy={75} innerRadius={50} outerRadius={76} paddingAngle={4} stroke="none" dataKey="value">
                    {popularData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
                <div className="flex flex-col gap-4 flex-1 w-full">
                  {popularData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 w-32">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 10px ${item.color}66` }} />
                        <span className="font-semibold text-[13px] truncate" style={{ color: colors.primary }} title={item.name}>{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={neumorphic.inset}>
                          <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                        </div>
                        <span className="text-[13px] font-bold w-8 text-right" style={{ color: colors.primary }}>{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[160px] flex items-center justify-center font-medium" style={{ color: colors.muted }}>No food items ordered yet.</div>
            )}
          </div>
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
    dashboard: 'General Dashboard',
    menu:      'Menu Configuration',
    orders:    'Live Orders Feed',
    ai:        'Gemini Data Insights',
  }

  return (
    <div className="flex min-h-screen" style={{ background: colors.bg, ...fonts.body }}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="flex-1 overflow-x-hidden p-6 lg:p-12 mb-10">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-[1200px] mx-auto"
        >
          <div className="mb-10 mt-4">
            <h1 className="text-[36px] font-bold tracking-tight text-transparent bg-clip-text" style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.muted})`, WebkitBackgroundClip: 'text' }}>
              {TAB_TITLES[active]}
            </h1>
            <p className="font-medium mt-1" style={{ color: colors.muted }}>System Administration Console</p>
          </div>
          {TAB_CONTENT[active]}
        </motion.div>
      </main>
    </div>
  )
}
