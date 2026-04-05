// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'

import Landing       from './pages/Landing'
import Login         from './pages/Login'
import Register      from './pages/Register'
import Menu          from './pages/Menu'
import Cart          from './pages/Cart'
import Checkout      from './pages/Checkout'
import OrderHistory  from './pages/OrderHistory'
import Profile       from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'

/* Route guard — redirects to /login if not authenticated */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-flame border-t-transparent animate-spin" />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

/* Admin-only route */
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user?.role === 'admin' ? children : <Navigate to="/" replace />
}

/* Public route — if already logged in, skip to home */
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return !user ? children : <Navigate to="/" replace />
}

function AppRoutes() {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public pages */}
          <Route path="/welcome" element={<Landing />} />
          <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected pages */}
          <Route path="/"        element={<PrivateRoute><Menu /></PrivateRoute>} />
          <Route path="/cart"    element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/orders"  element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Admin pages */}
          <Route path="/admin"   element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* Catch-all: if logged in → home, else → landing */}
          <Route path="*" element={user ? <Navigate to="/" replace /> : <Navigate to="/welcome" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
