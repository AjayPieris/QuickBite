// src/pages/Login.jsx
// Split layout login: animated food illustration left, glass form right

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import PageTransition from '../components/PageTransition'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      })
      login(res.data.access_token)
      navigate('/menu')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password')
      // Trigger shake animation
      setShake(true)
      setTimeout(() => setShake(false), 600)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex">
        {/* ── Left Side: Animated Food Illustration ── */}
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] overflow-hidden">
          {/* Glowing orbs */}
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-[#f97316]/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#ea580c]/10 rounded-full blur-[100px]" />

          {/* Floating food emojis */}
          <div className="relative">
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="text-center"
            >
              <div className="text-8xl mb-6">🍽</div>
              <h2 className="text-3xl font-bold gradient-text mb-3">Welcome Back</h2>
              <p className="text-[#9ca3af] text-lg">Your next meal is just a click away</p>
            </motion.div>

            {/* Orbiting food icons */}
            {['🍕', '🍔', '🌮', '🍣', '🥤', '🍟'].map((emoji, i) => (
              <motion.span
                key={i}
                className="absolute text-3xl opacity-40"
                animate={{
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * 120, 0],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * 120, 0],
                }}
                transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
                style={{ top: '50%', left: '50%' }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </div>

        {/* ── Right Side: Login Form ── */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
          <motion.div
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <span className="text-5xl">🍽</span>
              <h1 className="text-2xl font-bold gradient-text mt-3">QuickBite</h1>
            </div>

            <div className="glass-strong rounded-3xl p-8 md:p-10">
              <h2 className="text-2xl font-bold text-white mb-1">Sign In</h2>
              <p className="text-[#9ca3af] text-sm mb-8">Enter your credentials to access your account</p>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field with floating label */}
                <div className="relative">
                  <input
                    id="login-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder=" "
                    className="peer w-full px-4 pt-6 pb-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-[#f97316] focus:ring-0 transition-all"
                  />
                  <label
                    htmlFor="login-email"
                    className="absolute left-4 top-2 text-[10px] font-medium text-[#9ca3af] peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#f97316] transition-all pointer-events-none"
                  >
                    Email Address
                  </label>
                </div>

                {/* Password Field */}
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    placeholder=" "
                    className="peer w-full px-4 pt-6 pb-2 pr-12 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-[#f97316] focus:ring-0 transition-all"
                  />
                  <label
                    htmlFor="login-password"
                    className="absolute left-4 top-2 text-[10px] font-medium text-[#9ca3af] peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#f97316] transition-all pointer-events-none"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9ca3af] hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    )}
                  </button>
                </div>

                {/* Remember me toggle */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setRemember(!remember)}
                      className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
                        remember ? 'bg-[#f97316]' : 'bg-white/10'
                      }`}
                    >
                      <motion.div
                        animate={{ x: remember ? 20 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md"
                      />
                    </div>
                    <span className="text-sm text-[#9ca3af]">Remember me</span>
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl btn-glow text-white font-semibold text-sm flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-60"
                >
                  {loading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    'Sign In'
                  )}
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 shimmer pointer-events-none" />
                </motion.button>
              </form>

              {/* Register link */}
              <p className="text-center text-sm text-[#9ca3af] mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#f97316] hover:text-[#fbbf24] font-semibold transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}