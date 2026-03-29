// src/components/OrderStatusBadge.jsx
export default function OrderStatusBadge({ status }) {
  // Different color for each status
  const colors = {
    pending:   'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready:     'bg-green-100 text-green-800',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}