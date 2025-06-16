import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import '../assets/css/Navbar.css'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
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

        {user?.role === 'admin' && (
          <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
        )}

        {user?.role === 'user' && (
          <li><Link to="/myaccount">My Account</Link></li>
        )}

        {!user && (
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}

        {user && (
          <li>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}
