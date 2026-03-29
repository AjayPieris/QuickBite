// src/pages/Landing.jsx
// Full-screen hero with floating food particles, typewriter, stats counter, feature cards

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import ScrollReveal from '../components/ScrollReveal'

// ── Floating Food Particles ──
function FloatingParticles() {
  const emojis = ['🍕', '🍔', '🌮', '🍜', '🍣', '🍩', '🥤', '🍟', '🧁', '🌯']
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length],
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 8 + Math.random() * 8,
    size: 20 + Math.random() * 20,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute opacity-20"
          style={{
            left: `${p.left}%`,
            bottom: '-40px',
            fontSize: `${p.size}px`,
            animation: `particle-rise ${p.duration}s linear ${p.delay}s infinite`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}

// ── Animated Counter ──
function AnimatedCounter({ end, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const step = end / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, end, duration])

  return (
    <span ref={ref} className="gradient-text text-4xl md:text-5xl font-black">
      {count}{suffix}
    </span>
  )
}

// ── Typewriter Effect ──
function Typewriter() {
  const phrases = ['Fresh meals', 'Fast pickup', 'Zero waiting', 'Hot & ready']
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIndex]
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) {
          setCharIndex(charIndex + 1)
        } else {
          setTimeout(() => setDeleting(true), 1500)
        }
      } else {
        if (charIndex > 0) {
          setCharIndex(charIndex - 1)
        } else {
          setDeleting(false)
          setPhraseIndex((phraseIndex + 1) % phrases.length)
        }
      }
    }, deleting ? 40 : 80)
    return () => clearTimeout(timeout)
  }, [charIndex, deleting, phraseIndex])

  return (
    <span className="text-[#f97316]">
      {phrases[phraseIndex].substring(0, charIndex)}
      <span className="inline-block w-0.5 h-6 md:h-8 bg-[#f97316] ml-1 align-middle" style={{ animation: 'blink 1s infinite' }} />
    </span>
  )
}

export default function Landing() {
  // Feature cards data
  const features = [
    { icon: '⚡', title: 'Lightning Fast', desc: 'Order in seconds, pick up in minutes. No more standing in long queues.' },
    { icon: '📱', title: 'Mobile Friendly', desc: 'Order from anywhere on campus with our responsive web app.' },
    { icon: '🔔', title: 'Real-time Updates', desc: 'Get notified instantly when your order is ready for pickup.' },
    { icon: '🤖', title: 'AI Insights', desc: 'Smart analytics help the canteen optimize prep times and menus.' },
    { icon: '🔒', title: 'Secure Payments', desc: 'Your data is protected with enterprise-grade security.' },
    { icon: '📊', title: 'Order History', desc: 'Track all your past orders and reorder your favorites easily.' },
  ]

  return (
    <PageTransition>
      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f97316]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ea580c]/8 rounded-full blur-[120px] pointer-events-none" />

        {/* Floating food emoji particles */}
        <FloatingParticles />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-sm text-[#9ca3af]">Canteen is open now</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-6">
              <span className="text-white">Order Ahead.</span>
              <br />
              <span className="gradient-text">Skip the Queue.</span>
            </h1>

            {/* Typewriter subtitle */}
            <p className="text-xl md:text-2xl text-[#9ca3af] mb-10 h-10">
              <Typewriter />
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-glow px-8 py-4 rounded-2xl text-white font-bold text-lg flex items-center gap-2"
                >
                  Order Now
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-glass px-8 py-4 rounded-2xl text-white font-semibold text-lg"
                >
                  View Menu
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <a href="#stats" className="flex flex-col items-center gap-2 text-[#9ca3af] hover:text-white transition-colors">
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <svg className="w-5 h-5 animate-bounce-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS SECTION
      ══════════════════════════════════════════ */}
      <section id="stats" className="py-20 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { end: 500, suffix: '+', label: 'Meals Served Daily' },
              { end: 2, suffix: ' min', label: 'Average Wait Time' },
              { end: 98, suffix: '%', label: 'Satisfaction Rate' },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="glass rounded-2xl p-8 text-center card-hover">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                  <p className="text-[#9ca3af] mt-3 text-sm font-medium">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════ */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Why <span className="gradient-text">QuickBite</span>?
              </h2>
              <p className="text-[#9ca3af] text-lg max-w-2xl mx-auto">
                Everything you need for a seamless canteen experience, powered by modern technology.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="glass rounded-2xl p-6 card-hover h-full">
                  <span className="text-4xl mb-4 block">{feature.icon}</span>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-[#9ca3af] text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════════ */}
      <section className="py-20 px-4">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center glass rounded-3xl p-12 md:p-16 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ea580c]/10 rounded-full blur-[80px] pointer-events-none" />

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 relative z-10">
              Ready to skip the queue?
            </h2>
            <p className="text-[#9ca3af] text-lg mb-8 relative z-10">
              Join hundreds of students who order ahead every day.
            </p>
            <Link to="/register" className="relative z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-glow px-10 py-4 rounded-2xl text-white font-bold text-lg"
              >
                Get Started — It's Free
              </motion.button>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍽</span>
            <span className="font-bold gradient-text">QuickBite</span>
          </div>
          <p className="text-[#9ca3af] text-sm">© 2026 QuickBite. Built with ❤️ for hungry students.</p>
        </div>
      </footer>
    </PageTransition>
  )
}
