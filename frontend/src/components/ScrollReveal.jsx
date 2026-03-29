// src/components/ScrollReveal.jsx
// Wrapper that animates children when they come into viewport

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function ScrollReveal({
  children,
  direction = 'up',     // 'up', 'down', 'left', 'right'
  delay = 0,
  duration = 0.6,
  className = '',
  once = true,           // Only animate once
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-50px' })

  // Determine initial position based on direction
  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  }

  const offset = directionMap[direction] || directionMap.up

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
