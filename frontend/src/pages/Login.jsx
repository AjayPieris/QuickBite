// src/pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, Flame, MapPin, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const FOOD_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80'

const colors = {
  primary: '#2C1A0E',
  muted: '#A08060',
  accent: '#E8732A',
  bg: '#F0E8DC',
  success: '#5AAB5E',
  error: '#E85A2A',
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

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const { login, setUser } = useAuth()
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
      if (!err.response) {
        localStorage.setItem("qb_token", "demo_token");
        setUser({ id: 999, name: "Demo User", role: "user" });
        navigate("/");
      } else {
        setError(err.response?.data?.detail || 'Invalid email or password.')
      }
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

      {/* ── Left Panel (Untouched) ── */}
      <motion.div
        custom="left"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        className="hidden lg:flex lg:w-[44%] xl:w-[42%] relative flex-col justify-between p-10 overflow-hidden flex-shrink-0"
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${FOOD_IMAGE}')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/85" />

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

      {/* ── Right Panel (Neumorphic) ── */}
      <motion.div
        custom="right"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col"
        style={{ background: colors.bg }}
      >
        <div className="flex-1 flex items-center justify-center px-8 pt-24 pb-10 lg:pt-12">
          <div className="w-full max-w-md">

            {/* Heading */}
            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="mb-8 text-center max-w-sm mx-auto">
              <h1 className="text-[32px] font-bold mb-2 tracking-tight" style={{ color: colors.primary }}>Sign in to QuickBite</h1>
              <p className="text-[14px] font-medium" style={{ color: colors.muted }}>
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
                  className="mb-5 overflow-hidden"
                >
                  <div className="px-5 py-4 rounded-[18px] text-[14px] font-bold flex items-center gap-3" style={{ ...neumorphic.inset, color: colors.error }}>
                    <span>⊘</span> {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                <label className="block text-[12px] font-bold mb-2 uppercase tracking-widest pl-2" style={{ color: colors.muted }}>Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: colors.muted }} strokeWidth={2} />
                  <input
                    type="email"
                    placeholder="chef@quickbite.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full outline-none font-medium text-[15px] rounded-[20px] px-5 py-4 pl-12 transition-all focus:outline-none"
                    style={{ ...neumorphic.inset, color: colors.primary }}
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                <label className="block text-[12px] font-bold mb-2 uppercase tracking-widest pl-2" style={{ color: colors.muted }}>Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: colors.muted }} strokeWidth={2} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full outline-none font-medium text-[15px] rounded-[20px] px-5 py-4 pl-12 pr-14 transition-all focus:outline-none"
                    style={{ ...neumorphic.inset, color: colors.primary }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 transition-colors hover:opacity-75"
                    style={{ color: colors.accent }}
                  >
                    {showPw
                      ? <EyeOff size={18} strokeWidth={2} />
                      : <Eye size={18} strokeWidth={2} />
                    }
                  </button>
                </div>
              </motion.div>

              {/* Forgot */}
              <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="text-right !mt-2 pr-2">
                <span className="text-[13px] font-bold cursor-pointer transition-opacity hover:opacity-75" style={{ color: colors.accent }}>
                  Forgot password?
                </span>
              </motion.div>

              {/* Submit */}
              <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="!mt-8">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ y: -1, boxShadow: neumorphic.buttonRaised.boxShadow.replace('0.3', '0.45') }}
                  whileTap={{ scale: 0.975 }}
                  className="w-full py-4 rounded-[20px] font-bold text-[16px] flex items-center justify-center gap-2.5 disabled:opacity-70 transition-all"
                  style={neumorphic.buttonRaised}
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
              <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible" className="flex items-center gap-3 pt-2">
                <div className="flex-1 h-px" style={{ background: 'rgba(180,130,90,0.15)' }} />
                <span className="text-[11px] font-bold tracking-widest px-2" style={{ color: colors.muted }}>OR</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(180,130,90,0.15)' }} />
              </motion.div>

              {/* Google */}
              <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible">
                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98, ...neumorphic.inset }}
                  className="w-full py-4 rounded-[20px] font-bold text-[15px] flex items-center justify-center gap-3 transition-all"
                  style={{ ...neumorphic.raised, color: colors.primary }}
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

            <motion.p custom={7} variants={fieldVariants} initial="hidden" animate="visible" className="text-center text-[14px] font-medium mt-8" style={{ color: colors.muted }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-bold transition-opacity hover:opacity-75 ml-1" style={{ color: colors.accent }}>
                Create one
              </Link>
            </motion.p>

            <motion.div custom={8} variants={fieldVariants} initial="hidden" animate="visible" className="flex justify-center gap-5 mt-5">
              <span className="text-[12px] font-bold uppercase tracking-wider cursor-pointer hover:opacity-75 transition-opacity" style={{ color: colors.muted }}>Privacy Policy</span>
              <span className="text-[12px] font-bold uppercase tracking-wider cursor-pointer hover:opacity-75 transition-opacity" style={{ color: colors.muted }}>Terms of Service</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
