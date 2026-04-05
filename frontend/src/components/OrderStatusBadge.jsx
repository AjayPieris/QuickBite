// src/components/OrderStatusBadge.jsx
import { motion } from 'framer-motion'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   cls: 'badge-pending',   dot: 'bg-gold',    icon: '⏳' },
  preparing: { label: 'Preparing', cls: 'badge-preparing', dot: 'bg-blue-400', icon: '👨‍🍳' },
  ready:     { label: 'Ready',     cls: 'badge-ready',     dot: 'bg-emerald-400', icon: '✅' },
}

export default function OrderStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display font-600 border ${config.cls}`}>
      <span className="relative flex h-2 w-2">
        {status === 'pending' && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ping-orange ${config.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      {config.label}
    </span>
  )
}
