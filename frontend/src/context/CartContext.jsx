// src/context/CartContext.jsx
// Global cart state, persisted to localStorage

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('qb_cart') || '[]')
    } catch { return [] }
  })

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('qb_cart', JSON.stringify(cart))
  }, [cart])

  const addItem = (item) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === item.id)
      if (exists) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const removeItem = (id) => setCart(prev => prev.filter(c => c.id !== id))

  const updateQty = (id, qty) => {
    if (qty < 1) return removeItem(id)
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c))
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0)
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
