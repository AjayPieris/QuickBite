// src/context/CartContext.jsx
// Global cart state stored in localStorage for persistence

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  // Load cart from localStorage on first render
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('quickbite_cart')
    return saved ? JSON.parse(saved) : []
  })

  // Pulse state for floating cart button animation
  const [cartPulse, setCartPulse] = useState(false)

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quickbite_cart', JSON.stringify(cart))
  }, [cart])

  // Add item to cart (or increase quantity if already exists)
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    // Trigger pulse animation
    setCartPulse(true)
    setTimeout(() => setCartPulse(false), 600)
  }

  // Remove item from cart entirely
  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId))
  }

  // Update quantity for a specific item
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart(prev =>
      prev.map(i => (i.id === itemId ? { ...i, quantity } : i))
    )
  }

  // Clear entire cart
  const clearCart = () => setCart([])

  // Calculate total items count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity,
      clearCart, totalItems, totalPrice, cartPulse
    }}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
