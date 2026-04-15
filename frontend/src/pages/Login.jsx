// src/pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, Flame, MapPin, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const FOOD_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data.access_token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const panelVariants = {
    hidden: (dir) => ({ opacity: 0, x: dir === 'left' ? -60 : 60 }),
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  const fieldVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.3 + i * 0.08, duration: 0.45, ease: 'easeOut' } }),
  }

  const FEATURES = [
    { icon: <Zap size={16} className="text-white" strokeWidth={2.5} />, label: 'Skip the queue' },
    { icon: <Flame size={16} className="text-white" strokeWidth={2.5} />, label: 'Fresh daily menu' },
    { icon: <MapPin size={16} className="text-white" strokeWidth={2.5} />, label: 'Live order tracking' },
  ]

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Left Panel ── */}
      <motion.div
        custom="left"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        className="hidden lg:flex lg:w-[44%] xl:w-[42%] relative flex-col justify-between p-10 overflow-hidden flex-shrink-0"
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${FOOD_IMAGE}')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/85" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 flex items-center gap-2.5"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff4d00, #ff8c42)' }}>
            <LogIn size={18} className="text-white" strokeWidth={2.5} />
          </div>
          
        </motion.div>

        {/* Hero text & features */}
        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-3"
          >
            Welcome<br />back, chef.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/65 text-sm leading-relaxed mb-8 max-w-xs"
          >
            Your daily meals are just a few clicks away. Log in and start ordering.
          </motion.p>

          {FEATURES.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.12 }}
              className="flex items-center gap-3 mb-3"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,77,0,0.3)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,100,20,0.4)' }}
              >
                {item.icon}
              </div>
              <span className="text-white/80 text-sm font-medium">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Right Panel ── */}
      <motion.div
        custom="right"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 bg-white flex flex-col"
      >
        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 pt-24 pb-10 lg:pt-12">
          <div className="w-full max-w-md">

            {/* Heading */}
            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Sign in to QuickBite</h1>
              <p className="text-sm font-medium" style={{ color: '#ea580c' }}>
                Enter your credentials to access your account.
              </p>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 border border-red-100 flex items-center gap-2"
                >
                  <span className="text-red-400">⊘</span> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" strokeWidth={2} />
                  <input
                    type="email"
                    placeholder="chef@quickbite.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="auth-input pl-11"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" strokeWidth={2} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="auth-input pl-11 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    {showPw
                      ? <EyeOff size={16} strokeWidth={2} />
                      : <Eye size={16} strokeWidth={2} />
                    }
                  </button>
                </div>
              </motion.div>

              {/* Forgot */}
              <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="text-right !mt-1">
                <span className="text-xs font-semibold cursor-pointer hover:opacity-70 transition-opacity" style={{ color: '#ea580c' }}>
                  Forgot password?
                </span>
              </motion.div>

              {/* Submit */}
              <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="!mt-5">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.015, boxShadow: '0 10px 32px rgba(194,65,12,0.35)' }}
                  whileTap={{ scale: 0.975 }}
                  className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2.5 disabled:opacity-70"
                  style={{ background: 'linear-gradient(135deg, #c2410c, #ea580c, #fb923c)', fontFamily: "'Outfit',sans-serif" }}
                >
                  {loading ? (
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <>Sign In <ArrowRight size={18} strokeWidth={2.5} /></>
                  )}
                </motion.button>
              </motion.div>

              {/* OR */}
              <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible" className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-300 font-semibold tracking-wider">OR</span>
                <div className="flex-1 h-px bg-gray-100" />
              </motion.div>

              {/* Google */}
              <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible">
                <motion.button
                  type="button"
                  whileHover={{ backgroundColor: '#f9fafb', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-2xl border border-gray-150 text-gray-600 font-semibold text-sm flex items-center justify-center gap-3 bg-white transition-all"
                  style={{ border: '1.5px solid #f0f0f0' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </motion.button>
              </motion.div>
            </form>

            {/* Sign up link */}
            <motion.p custom={7} variants={fieldVariants} initial="hidden" animate="visible" className="text-center text-sm text-gray-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold hover:opacity-75 transition-opacity" style={{ color: '#ea580c' }}>
                Create one
              </Link>
            </motion.p>

            <motion.div custom={8} variants={fieldVariants} initial="hidden" animate="visible" className="flex justify-center gap-4 mt-4">
              <span className="text-xs text-gray-300 hover:text-gray-500 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="text-xs text-gray-300 hover:text-gray-500 cursor-pointer transition-colors">Terms of Service</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
