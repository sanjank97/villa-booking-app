// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)
      } catch (err) {
        console.error('Invalid token')
        localStorage.removeItem('token')
        setUser(null)
      }
    }
  }, [])

  const login = (token) => {
    localStorage.setItem('token', token)
    const decoded = jwtDecode(token)
    setUser(decoded)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
