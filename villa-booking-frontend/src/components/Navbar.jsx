import { Link, useNavigate } from 'react-router-dom'
import '../assets/css/Navbar.css'
import { jwtDecode } from 'jwt-decode'

import { useEffect, useState } from 'react'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)
      } catch (err) {
        console.error('Invalid token:', err)
        localStorage.removeItem('token')
        setUser(null)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">🏡 MyVilla</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/villas">All Villas</Link></li>

        {/* Role-based Dashboard */}
        {user?.role === 'admin' && (
          <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
        )}

        {user?.role === 'user' && (
          <li><Link to="/myaccount">My Account</Link></li>
        )}

        {/* Show Register/Login if NOT logged in */}
        {!user && (
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}

        {/* Show Logout if logged in */}
        {user && (
          <li>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'red',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}
