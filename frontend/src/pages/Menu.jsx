import { useEffect, useState } from 'react'
import api from '../api/axios'
import FoodCard from '../components/FoodCard'

export default function Menu() {
  const [items, setItems] = useState([])
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'))

  useEffect(() => {
    api.get('/menu').then(res => setItems(res.data))
  }, [])

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id)
    const updated = existing
      ? cart.map(c => c.id === item.id ? {...c, qty: c.qty + 1} : c)
      : [...cart, {...item, qty: 1}]
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Today's Menu</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(item => <FoodCard key={item.id} item={item} onAddToCart={addToCart} />)}
      </div>
    </div>
  )
}