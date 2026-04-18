// src/pages/Landing.jsx
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

// Floating food particle
function Particle({ emoji, style }) {
  return (
    <div
      className="absolute select-none pointer-events-none text-3xl opacity-20"
      style={{ ...style, animation: `float ${style.duration} ease-in-out ${style.delay} infinite` }}
    >
      {emoji}
    </div>
  )
}

// Animated counter
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

// Typewriter effect
function Typewriter({ words }) {
  const [idx, setIdx]   = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[idx]
    const speed = deleting ? 60 : 100

    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setTimeout(() => setDeleting(true), 1800)
        return
      }
      if (deleting && text === '') {
        setDeleting(false)
        setIdx(i => (i + 1) % words.length)
        return
      }
      setText(prev => deleting ? prev.slice(0, -1) : word.slice(0, prev.length + 1))
    }, speed)
    return () => clearTimeout(timer)
  }, [text, deleting, idx, words])

  return (
    <span className="text-flame-gradient">
      {text}
      <span className="inline-block w-0.5 h-[1em] bg-flame ml-0.5 animate-pulse align-middle" />
    </span>
  )
}

const PARTICLES = [
  { emoji: '🍕', style: { top: '15%', left: '5%',  duration: '7s',  delay: '0s' } },
  { emoji: '🍔', style: { top: '30%', left: '88%', duration: '9s',  delay: '1s' } },
  { emoji: '🌮', style: { top: '60%', left: '3%',  duration: '8s',  delay: '2s' } },
  { emoji: '🍜', style: { top: '75%', left: '92%', duration: '6s',  delay: '0.5s' } },
  { emoji: '🍣', style: { top: '10%', left: '70%', duration: '10s', delay: '1.5s' } },
  { emoji: '🥗', style: { top: '45%', left: '95%', duration: '7s',  delay: '3s' } },
  { emoji: '🍱', style: { top: '85%', left: '15%', duration: '8s',  delay: '2.5s' } },
  { emoji: '🧆', style: { top: '20%', left: '45%', duration: '11s', delay: '4s' } },
]

const FEATURES = [
  { icon: '⚡', title: 'Pre-Order Ahead', desc: 'Skip the queue by ordering up to 2 hours before pickup' },
  { icon: '🔥', title: 'Daily Fresh Menu', desc: 'New items added every morning, always hot and fresh' },
  { icon: '📍', title: 'Live Order Tracking', desc: 'Know exactly when your order is ready — never wait blind' },
  { icon: '🤖', title: 'AI Powered', desc: 'Smart recommendations and busy hour predictions' },
]

export default function Landing() {
  const featuresRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' })
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const startDemo = () => {
    localStorage.setItem('qb_token', 'demo_token')
    setUser({ id: 999, name: 'Demo User', role: 'user' })
    navigate('/')
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-flame/5 via-transparent to-transparent" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,77,0,0.06) 0%, transparent 70%)' }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full border border-flame/15 text-sm text-ash mb-8 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-flame animate-pulse" />
            Now accepting pre-orders for today
          </motion.div>

          {/* Headline */}
          <h1 className="font-display font-800 text-5xl md:text-7xl lg:text-8xl text-snow leading-[1.05] tracking-tight mb-4">
            Order Ahead.
            <br />
            <span className="text-flame-gradient">Skip the Queue.</span>
          </h1>

          {/* Typewriter */}
          <p className="text-xl md:text-2xl text-ash font-body mt-6 mb-10 h-8">
            <Typewriter words={['Fresh meals, fast.', 'Zero waiting.', 'Your canteen, reimagined.']} />
          </p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button onClick={startDemo} className="btn-flame text-base px-8 py-4 animate-pulse-glow">
              Let's Go →
            </button>
            <Link to="/login" className="btn-outline text-base px-8 py-4">
              Sign In
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ash text-xs"
        >
          <span>Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-ash/50 to-transparent animate-bounce" />
        </motion.div>
      </section>

      {/* ── Stats ticker ── */}
      <section className="py-10 overflow-hidden border-y border-black/5 bg-surface/50">
        <div className="flex gap-16 animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...Array(2)].map((_, r) => (
            <div key={r} className="flex gap-16">
              {[
                { label: 'Meals per day', value: 500, suffix: '+' },
                { label: 'Avg. wait time', value: 2, suffix: ' min' },
                { label: 'Satisfaction rate', value: 98, suffix: '%' },
                { label: 'Menu items', value: 40, suffix: '+' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center gap-3">
                  <span className="font-display font-700 text-2xl text-snow">
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-ash text-sm">{stat.label}</span>
                  <span className="text-black/5 mx-4">|</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section ref={featuresRef} className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-700 text-4xl md:text-5xl text-snow mb-4">
            Why <span className="text-flame-gradient">QuickBite?</span>
          </h2>
          <p className="text-ash text-lg max-w-xl mx-auto">Everything you need for a seamless canteen experience</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
              className="glass rounded-2xl p-6 border border-black/5 hover:border-flame/10 transition-all cursor-default"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-display font-600 text-snow text-base mb-2">{f.title}</h3>
              <p className="text-ash text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 border border-flame/10 relative overflow-hidden"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.04)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-flame/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <p className="text-5xl mb-6">🍽</p>
            <h2 className="font-display font-700 text-3xl md:text-4xl text-snow mb-4">
              Ready to eat better?
            </h2>
            <p className="text-ash mb-8">Join thousands of students who pre-order daily</p>
            <button onClick={startDemo} className="btn-flame text-base px-10 py-4 inline-block">
              Explore Demo Menu
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 py-8 px-6 text-center text-mist text-sm bg-surface">
        © {new Date().getFullYear()} QuickBite · Canteen Pre-Order System
      </footer>
    </div>
  )
}
