// src/components/Navbar.jsx
// Fixed navbar: transparent → blur+dark on scroll, mobile hamburger menu

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

  // Hide navbar on landing page hero (show after scroll)
  const isLanding = location.pathname === '/welcome'

  // Listen for scroll to change navbar style
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setProfileOpen(false)
  }, [location])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Navigation links based on user role
  const navLinks = user ? [
    { to: '/menu', label: 'Menu' },
    { to: '/orders', label: 'Orders' },
    ...(user.role === 'admin' ? [{ to: '/admin', label: 'Dashboard' }] : []),
  ] : [
    { to: '/welcome', label: 'Home' },
  ]

  // Check if link is active
  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* ── Main Navbar ── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* ── Logo ── */}
            <Link to={user ? '/menu' : '/welcome'} className="flex items-center gap-2 group">
              <span className="text-2xl">🍽</span>
              <span className="text-xl font-bold gradient-text group-hover:opacity-80 transition-opacity">
                QuickBite
              </span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                    isActive(link.to)
                      ? 'text-[#f97316]'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {link.label}
                  {/* Active indicator underline */}
                  {isActive(link.to) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[#f97316] to-[#fbbf24] rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* ── Right Side Actions ── */}
            <div className="flex items-center gap-3">

              {/* Cart Button */}
              {user && (
                <Link to="/cart" className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
                  <motion.div
                    animate={cartPulse ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <svg className="w-6 h-6 text-[#9ca3af] hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </motion.div>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-[#f97316] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </Link>
              )}

              {/* Profile Dropdown (Desktop) */}
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center text-sm font-bold overflow-hidden ring-2 ring-[#f97316]/30">
                      {user.profile_image_url ? (
                        <img src={user.profile_image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <svg className={`w-4 h-4 text-[#9ca3af] transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 glass rounded-xl overflow-hidden shadow-2xl"
                      >
                        <div className="p-3 border-b border-white/5">
                          <p className="text-sm font-semibold text-white">{user.name}</p>
                          <p className="text-xs text-[#9ca3af]">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#9ca3af] hover:text-white hover:bg-white/5 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                            Profile
                          </Link>
                          <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#9ca3af] hover:text-white hover:bg-white/5 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 0 0 2.25 2.25h.75" /></svg>
                            My Orders
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-[#9ca3af] hover:text-white transition-colors rounded-lg">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-glow px-5 py-2 text-sm font-semibold text-white rounded-xl">
                    Get Started
                  </Link>
                </div>
              )}

              {/* ── Mobile Hamburger ── */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
                  <motion.span
                    animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                    className="block w-full h-0.5 bg-white rounded-full origin-center"
                  />
                  <motion.span
                    animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="block w-full h-0.5 bg-white rounded-full"
                  />
                  <motion.span
                    animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                    className="block w-full h-0.5 bg-white rounded-full origin-center"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Full-Screen Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className={`text-2xl font-semibold transition-colors ${
                      isActive(link.to) ? 'gradient-text' : 'text-[#9ca3af] hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {user ? (
                <>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Link to="/profile" className="text-2xl font-semibold text-[#9ca3af] hover:text-white transition-colors">
                      Profile
                    </Link>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <button onClick={handleLogout} className="text-2xl font-semibold text-red-400 hover:text-red-300 transition-colors">
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Link to="/login" className="text-2xl font-semibold text-[#9ca3af] hover:text-white transition-colors">
                      Sign In
                    </Link>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Link to="/register" className="btn-glow px-8 py-3 text-lg font-semibold text-white rounded-xl">
                      Get Started
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close profile dropdown */}
      {profileOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
      )}
    </>
  )
}