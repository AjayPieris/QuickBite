// src/components/Navbar.jsx
// Fixed navbar with scroll blur, mobile menu, profile dropdown

import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { totalItems, cartPulse } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  // Track scroll for glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setTimeout(() => {
      setMobileOpen(false)
      setProfileOpen(false)
    }, 0)
  }, [location])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Don't show navbar on login/register pages
  const hideNavbar = ['/login', '/register'].includes(location.pathname)
  if (hideNavbar) return null

  const navLinks = user
    ? [
        { to: '/menu', label: 'Menu', icon: '🍽' },
        { to: '/orders', label: 'Orders', icon: '📦' },
        ...(user.role === 'admin' ? [{ to: '/admin', label: 'Dashboard', icon: '📊' }] : []),
      ]
    : [{ to: '/welcome', label: 'Home', icon: '🏠' }]

  const isActive = (path) => location.pathname === path

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a0a0a]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <Link to={user ? '/menu' : '/welcome'} className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/20">
                <span className="text-base">🍽</span>
              </div>
              <span className="text-lg font-bold gradient-text tracking-tight hidden sm:block">
                QuickBite
              </span>
            </Link>

            {/* Center Nav Links (Desktop) */}
            <div className="hidden md:flex items-center">
              <div className="flex items-center gap-1 bg-white/[0.03] rounded-2xl p-1.5 border border-white/[0.06]">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-5 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 ${
                      isActive(link.to)
                        ? 'text-white'
                        : 'text-[#777] hover:text-white'
                    }`}
                  >
                    {isActive(link.to) && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white/[0.08] rounded-xl border border-white/[0.08]"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <span className="text-sm">{link.icon}</span>
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 shrink-0">

              {/* Cart */}
              {user && (
                <Link
                  to="/cart"
                  className="relative w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-all"
                >
                  <motion.div animate={cartPulse ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.35 }}>
                    <svg className="w-[18px] h-[18px] text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </motion.div>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[#f97316] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-[#f97316]/30"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </Link>
              )}

              {/* Profile / Auth */}
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2.5 h-10 pl-1.5 pr-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center text-xs font-bold overflow-hidden">
                      {user.profile_image_url ? (
                        <img src={user.profile_image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white">{user.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-[13px] text-[#ccc] font-medium max-w-[80px] truncate">{user.name?.split(' ')[0]}</span>
                    <svg className={`w-3.5 h-3.5 text-[#666] transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-60 bg-[#161616] rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/[0.06]">
                          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                          <p className="text-[11px] text-[#666] truncate">{user.email}</p>
                        </div>
                        <div className="p-1.5">
                          <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[#999] hover:text-white hover:bg-white/[0.05] transition-all">
                            <span className="text-sm">👤</span> Profile
                          </Link>
                          <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[#999] hover:text-white hover:bg-white/[0.05] transition-all">
                            <span className="text-sm">📋</span> My Orders
                          </Link>
                          <div className="my-1 border-t border-white/[0.05]" />
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.06] transition-all">
                            <span className="text-sm">🚪</span> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="px-4 py-2 text-[13px] font-medium text-[#999] hover:text-white rounded-xl transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register" className="px-5 py-2.5 text-[13px] font-semibold text-white bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-xl shadow-lg shadow-[#f97316]/20 hover:shadow-[#f97316]/40 transition-all">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center"
              >
                <div className="w-4 h-4 flex flex-col justify-center gap-[5px]">
                  <motion.span animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="block w-full h-[1.5px] bg-white rounded-full origin-center" />
                  <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-full h-[1.5px] bg-white rounded-full" />
                  <motion.span animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="block w-full h-[1.5px] bg-white rounded-full origin-center" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a]/98 backdrop-blur-3xl md:hidden flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div key={link.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link to={link.to} className={`text-3xl font-semibold ${isActive(link.to) ? 'gradient-text' : 'text-[#666] hover:text-white'} transition-colors`}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {user && (
                <>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Link to="/profile" className="text-3xl font-semibold text-[#666] hover:text-white transition-colors">Profile</Link>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <button onClick={handleLogout} className="text-3xl font-semibold text-red-400/70 hover:text-red-400 transition-colors">Logout</button>
                  </motion.div>
                </>
              )}
              {!user && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col items-center gap-4 mt-4">
                  <Link to="/login" className="text-3xl font-semibold text-[#666] hover:text-white transition-colors">Sign In</Link>
                  <Link to="/register" className="px-8 py-3.5 text-lg font-semibold text-white bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-2xl">Get Started</Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {profileOpen && <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />}
    </>
  )
}