import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { setToken as saveToken } from '../lib/api'

interface User {
  id: string
  email: string
  username: string
}

interface AuthContextType {
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  function login(token: string, user: User) {
    saveToken(token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  function logout() {
    saveToken(null)
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}