// src/context/AuthContext.jsx
// Provides user state + login/logout to the whole app

import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // On first load: check if token exists and fetch user profile
  useEffect(() => {
    const token = localStorage.getItem('qb_token')
    if (token) {
      api.get('/users/me')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('qb_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (token) => {
    localStorage.setItem('qb_token', token)
    const res = await api.get('/users/me')
    setUser(res.data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('qb_token')
    localStorage.removeItem('qb_cart')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
