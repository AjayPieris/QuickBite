import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.access_token)  // Save token, fetch user
      navigate('/')
    } catch {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back 👋</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input className="w-full border rounded-lg p-3" placeholder="Email"
          value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input className="w-full border rounded-lg p-3" type="password" placeholder="Password"
          value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600">
          Login
        </button>
        <p className="text-center text-sm text-gray-500">
          No account? <Link to="/register" className="text-orange-500">Register</Link>
        </p>
      </form>
    </div>
  )
}