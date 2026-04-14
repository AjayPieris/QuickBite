// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import {
  ShoppingCart, User, ClipboardList, LogOut, ChevronDown,
  Menu, X, Utensils, LayoutDashboard, Zap, Home
} from 'lucide-react'

const NAV_STYLE = {
  fontFamily: "'Outfit', sans-serif",
}

// Neumorphic pill container style
const pillStyle = (scrolled) => ({
  background: scrolled
    ? 'rgba(255,255,255,0.85)'
    : 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1.5px solid rgba(255,255,255,0.9)',
  boxShadow: scrolled
    ? '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)'
    : '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
  borderRadius: '9999px',
})

export default function Navbar() {
  const { user, logout } = useAuth()
  const { totalItems }   = useCart()
  const [scrolled, setScrolled]     = useState(false)
  const [dropdown, setDropdown]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location    = useLocation()
  const navigate    = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  const handleLogout = () => { logout(); navigate('/login') }

  const navLinks = user
    ? [{ to: '/', label: 'Menu', icon: <Utensils size={14} strokeWidth={2} /> }
      ,{ to: '/orders', label: 'My Orders', icon: <ClipboardList size={14} strokeWidth={2} /> }]
    : [{ to: '/login',    label: 'Login',   icon: <User size={14} strokeWidth={2} /> }
      ,{ to: '/register', label: 'Sign Up', icon: <Zap  size={14} strokeWidth={2} /> }]

  const isActive = (to) => location.pathname === to || (to !== '/' && location.pathname.startsWith(to))

  return (
    <>
      {/* ── Floating Pill Navbar ── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center"
        style={{ padding: '14px 16px 0', ...NAV_STYLE }}
      >
        <motion.nav
          initial={{ y: -80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={pillStyle(scrolled)}
          className="w-full max-w-5xl px-3 py-2 flex items-center justify-between transition-all duration-300"
        >
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0 pl-1">
            <motion.div
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
              transition={{ duration: 0.4 }}
              className="w-8 h-8 rounded-2xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, #ff4d00, #ff8c42)', boxShadow: '0 4px 12px rgba(255,77,0,0.35)' }}
            >
              <Utensils size={16} className="text-white" strokeWidth={2.5} />
            </motion.div>
            <span className="font-bold text-gray-900 text-base tracking-tight hidden sm:block">
              Quick<span style={{ color: '#ff4d00' }}>Bite</span>
            </span>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive(link.to)
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-black/[0.04]'
                  }`}
                  style={isActive(link.to) ? {
                    background: 'linear-gradient(135deg, #ff4d00, #ff8c42)',
                    boxShadow: '0 4px 14px rgba(255,77,0,0.3)',
                  } : {}}
                >
                  {link.icon}
                  {link.label}
                </motion.div>
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    location.pathname.startsWith('/admin')
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-black/[0.04]'
                  }`}
                  style={location.pathname.startsWith('/admin') ? {
                    background: 'linear-gradient(135deg, #ff4d00, #ff8c42)',
                    boxShadow: '0 4px 14px rgba(255,77,0,0.3)',
                  } : {}}
                >
                  <LayoutDashboard size={14} strokeWidth={2} /> Admin
                </motion.div>
              </Link>
            )}
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2 pr-1">
            {/* Cart */}
            {user && (
              <Link to="/cart">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: 'rgba(0,0,0,0.04)',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  <ShoppingCart size={17} className="text-gray-500" strokeWidth={2} />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        key={totalItems}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-0.5 -right-0.5 w-[17px] h-[17px] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                        style={{ background: '#ff4d00' }}
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            )}

            {/* Profile dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-full transition-all"
                  style={{
                    background: 'rgba(0,0,0,0.04)',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                    {user.profile_image_url
                      ? <img src={user.profile_image_url} className="w-full h-full object-cover" alt="avatar" />
                      : <div className="w-full h-full flex items-center justify-center text-[11px] font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #ff4d00, #ff8c42)' }}>
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                    }
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hidden sm:block pr-0.5">
                    {user.name?.split(' ')[0]}
                  </span>
                  <motion.div animate={{ rotate: dropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={13} className="text-gray-400" strokeWidth={2.5} />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.93 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.93 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-3 w-48 overflow-hidden"
                      style={{
                        borderRadius: 18,
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1.5px solid rgba(255,255,255,0.9)',
                        boxShadow: '0 16px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="p-1.5">
                        {[
                          { to: '/profile', icon: <User size={14} strokeWidth={2} />, label: 'Profile' },
                          { to: '/orders',  icon: <ClipboardList size={14} strokeWidth={2} />, label: 'My Orders' },
                        ].map(item => (
                          <Link key={item.to} to={item.to} onClick={() => setDropdown(false)}>
                            <motion.div
                              whileHover={{ backgroundColor: 'rgba(255,77,0,0.06)', x: 2 }}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 transition-colors cursor-pointer"
                            >
                              <span className="text-gray-400">{item.icon}</span>
                              {item.label}
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                      <div className="mx-3 border-t border-gray-100" />
                      <div className="p-1.5">
                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(239,68,68,0.06)', x: 2 }}
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 transition-colors"
                        >
                          <LogOut size={14} strokeWidth={2} /> Logout
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/register" className="hidden md:block">
                <motion.div
                  whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(255,77,0,0.4)' }}
                  whileTap={{ scale: 0.96 }}
                  className="px-4 py-2 rounded-full text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #ff4d00, #ff8c42)', boxShadow: '0 4px 14px rgba(255,77,0,0.3)' }}
                >
                  Get Started
                </motion.div>
              </Link>
            )}

            {/* Mobile hamburger */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-gray-600 transition-all"
              style={{ background: 'rgba(0,0,0,0.04)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)' }}
            >
              <AnimatePresence mode="wait">
                {mobileOpen
                  ? <motion.div key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X size={18} strokeWidth={2.5} />
                    </motion.div>
                  : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }}  animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu size={18} strokeWidth={2.5} />
                    </motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.nav>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)' }}
            />

            {/* Drawer pill */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="fixed top-20 left-4 right-4 z-40 md:hidden p-3"
              style={{
                borderRadius: 24,
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(24px)',
                border: '1.5px solid rgba(255,255,255,0.95)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {/* Links */}
              <div className="flex flex-col gap-1 mb-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link to={link.to}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                          isActive(link.to)
                            ? 'text-white'
                            : 'text-gray-600 hover:bg-black/[0.04]'
                        }`}
                        style={isActive(link.to) ? {
                          background: 'linear-gradient(135deg, #ff4d00, #ff8c42)',
                          boxShadow: '0 4px 14px rgba(255,77,0,0.3)',
                        } : {}}
                      >
                        {link.icon} {link.label}
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
                {user?.role === 'admin' && (
                  <Link to="/admin">
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold text-orange-500"
                    >
                      <LayoutDashboard size={15} /> Admin Dashboard
                    </motion.div>
                  </Link>
                )}
              </div>

              {/* Divider */}
              {user && <div className="border-t border-gray-100 mb-2" />}

              {/* Logout */}
              {user && (
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold text-red-500"
                >
                  <LogOut size={15} strokeWidth={2} /> Logout
                </motion.button>
              )}

              {/* Get started for guests */}
              {!user && (
                <>
                  <div className="border-t border-gray-100 mb-2" />
                  <Link to="/register">
                    <motion.div
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #ff4d00, #ff8c42)', boxShadow: '0 4px 14px rgba(255,77,0,0.3)' }}
                    >
                      <Zap size={15} strokeWidth={2.5} /> Get Started
                    </motion.div>
                  </Link>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
