// src/components/Navbar.jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-orange-500 text-white px-6 py-3 flex justify-between items-center shadow">
      <Link to="/" className="text-xl font-bold">🍽 QuickBite</Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/cart">🛒 Cart</Link>
            <Link to="/orders">My Orders</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <Link to="/profile" className="flex items-center gap-2">
              {/* Show profile image or a placeholder */}
              {user.profile_image_url
                ? <img src={user.profile_image_url} className="w-8 h-8 rounded-full object-cover" />
                : <div className="w-8 h-8 rounded-full bg-white text-orange-500 flex items-center justify-center font-bold">
                    {user.name[0]}
                  </div>
              }
              <span>{user.name}</span>
            </Link>
            <button onClick={logout} className="bg-white text-orange-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}