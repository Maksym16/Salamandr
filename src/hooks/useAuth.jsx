import { createContext, useContext, useState, useEffect } from 'react'
import { getMe, login as apiLogin } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      setLoading(false)
      return
    }
    getMe()
      .then(setAdmin)
      .catch(() => localStorage.removeItem('admin_token'))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const data = await apiLogin(email, password)
    localStorage.setItem('admin_token', data.token)
    setAdmin({ email: data.email })
  }

  function logout() {
    localStorage.removeItem('admin_token')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
