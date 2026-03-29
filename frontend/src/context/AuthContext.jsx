// src/context/AuthContext.jsx
// Global state for who is logged in

import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load, check if there's a saved token and fetch the user
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/users/me')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (token) => {
    localStorage.setItem('token', token)
    // Fetch user info after login
    api.get('/users/me').then(res => setUser(res.data))
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)