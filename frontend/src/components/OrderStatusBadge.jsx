// src/components/OrderStatusBadge.jsx
// Color-coded status badge with animated indicators

import { motion } from 'framer-motion'

export default function OrderStatusBadge({ status }) {
  const config = {
    pending: {
      label: 'Pending',
      className: 'badge-pending',
      icon: (
        // Pulsing yellow dot
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500" />
        </span>
      ),
    },
    preparing: {
      label: 'Preparing',
      className: 'badge-preparing',
      icon: (
        // Spinning blue icon
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
        </motion.svg>
      ),
    },
    ready: {
      label: 'Ready',
      className: 'badge-ready',
      icon: (
        // Green checkmark with glow
        <motion.svg
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-3.5 h-3.5 drop-shadow-[0_0_4px_rgba(34,197,94,0.6)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </motion.svg>
      ),
    },
  }

  const { label, className, icon } = config[status] || config.pending

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
      {icon}
      {label}
    </span>
  )
}