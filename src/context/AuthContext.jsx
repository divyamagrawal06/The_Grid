import { useEffect, useState, createContext, useContext } from 'react'
import { authApi, clearToken, persistToken } from '../lib/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [bootstrapping, setBootstrapping] = useState(true)

  useEffect(() => {
    let mounted = true

    async function bootstrapSession() {
      const token = localStorage.getItem('grid_token')
      if (!token) {
        setBootstrapping(false)
        return
      }

      try {
        const data = await authApi.me()
        if (mounted) {
          setUser(data.user)
        }
      } catch {
        clearToken()
      } finally {
        if (mounted) {
          setBootstrapping(false)
        }
      }
    }

    bootstrapSession()
    return () => {
      mounted = false
    }
  }, [])

  const login = ({ token, user: userData }) => {
    persistToken(token)
    setUser(userData)
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, bootstrapping }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}