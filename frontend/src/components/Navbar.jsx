// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const [scrolled, setScrolled]     = useState(false)
  const [dropdown, setDropdown]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location    = useLocation()
  const navigate    = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = user
    ? [{ to: '/', label: 'Menu' }, { to: '/orders', label: 'My Orders' }]
    : [{ to: '/login', label: 'Login' }, { to: '/register', label: 'Sign Up' }]

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-black/5 py-3' : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-flame to-ember flex items-center justify-center text-lg shadow-lg shadow-flame/30 group-hover:shadow-flame/50 transition-shadow">
              🍽
            </div>
            <span className="font-display font-700 text-xl text-snow tracking-tight">
              Quick<span className="text-flame-gradient">Bite</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg font-body text-sm transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'text-flame bg-flame/10'
                    : 'text-mist hover:text-ink hover:bg-black/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg font-body text-sm transition-all duration-200 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-flame bg-flame/10'
                    : 'text-mist hover:text-ink hover:bg-black/5'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart icon */}
            {user && (
              <Link to="/cart" className="relative p-2 rounded-xl hover:bg-black/5 transition-colors group">
                <svg className="w-5 h-5 text-mist group-hover:text-ink transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-flame text-white text-[10px] font-display font-700 rounded-full flex items-center justify-center min-w-[18px] px-1"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            )}

            {/* Profile dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full glass-light hover:border-black/10 transition-all shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-flame/40">
                    {user.profile_image_url
                      ? <img src={user.profile_image_url} className="w-full h-full object-cover" alt="profile" />
                      : <div className="w-full h-full bg-gradient-to-br from-flame to-ember flex items-center justify-center text-sm font-display font-700 text-white">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                    }
                  </div>
                  <span className="text-sm text-snow font-body hidden sm:block">{user.name?.split(' ')[0]}</span>
                  <svg className={`w-3.5 h-3.5 text-ash transition-transform ${dropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 glass rounded-xl border border-black/5 shadow-2xl overflow-hidden"
                    >
                      {[
                        { to: '/profile', icon: '👤', label: 'Profile' },
                        { to: '/orders', icon: '🧾', label: 'My Orders' },
                      ].map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-mist hover:text-ink hover:bg-black/5 transition-colors"
                          onClick={() => setDropdown(false)}
                        >
                          <span>{item.icon}</span> {item.label}
                        </Link>
                      ))}
                      <div className="border-t border-black/5" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <span>🚪</span> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/register" className="btn-flame text-sm py-2.5 px-5 hidden md:block">
                Get Started
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
            >
              <div className={`w-5 space-y-1 transition-all ${mobileOpen ? 'opacity-0' : ''}`}>
                <span className="block h-0.5 bg-ink rounded" />
                <span className="block h-0.5 bg-ink rounded" />
                <span className="block h-0.5 bg-ink rounded w-3/4" />
              </div>
              {mobileOpen && (
                <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 glass md:hidden flex flex-col pt-24 px-6 pb-8"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={link.to}
                    className="block px-5 py-4 rounded-xl text-lg font-display text-snow hover:bg-black/5 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {user?.role === 'admin' && (
                <Link to="/admin" className="block px-5 py-4 rounded-xl text-lg font-display text-flame">
                  Admin Dashboard
                </Link>
              )}
            </div>
            {user && (
              <button
                onClick={handleLogout}
                className="mt-auto btn-outline w-full text-center text-red-400 border-red-400/30"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
