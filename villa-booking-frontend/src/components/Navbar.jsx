import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 text-2xl font-bold text-blue-600">
            <Link to="/">🏡 MyVilla</Link>
          </div>
          <div>
            <ul className="flex space-x-6 items-center text-gray-700 font-medium">
              <li>
                <Link to="/" className="hover:text-blue-600 transition duration-200">Home</Link>
              </li>
              <li>
                <Link to="/villas" className="hover:text-blue-600 transition duration-200">All Villas</Link>
              </li>
               <li>
                 <Link to="/wishlist" className="hover:text-blue-600 transition duration-200">Wishlist</Link>
               </li>

              {user?.role === 'admin' && (
                <li>
                  <Link to="/admin/dashboard" className="hover:text-blue-600 transition duration-200">Admin Dashboard</Link>
                </li>    
              )}

              {(user?.role === 'admin' || user?.role === 'user') && (
                <li>
                  <Link to="/myaccount" className="hover:text-blue-600 transition duration-200">My Account</Link>
                </li>
              )}

              {!user && (
                <>
                  <li>
                    <Link to="/register" className="hover:text-blue-600 transition duration-200">Register</Link>
                  </li>
                  <li>
                    <Link to="/login" className="hover:text-blue-600 transition duration-200">Sign In</Link>
                  </li>
                </>
              )}

              {user && (
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 transition duration-200"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}
