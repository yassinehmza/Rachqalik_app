import { createContext, useContext, useState } from 'react'
import { MOCK_USER, MOCK_PREMIUM_USER, MOCK_ADMIN } from '../data/mockData'

const AuthContext = createContext(null)

const STORAGE_KEY = 'rachqalik_user'

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  const login = ({ email }) => {
    let u
    if (email === 'admin@rachqalik.ma' || email === 'admin@example.com') {
      u = { ...MOCK_ADMIN }
    } else if (email === 'sara@example.com') {
      u = { ...MOCK_PREMIUM_USER }
    } else {
      u = { ...MOCK_USER }
    }
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const upgradePlan = () =>
    setUser((u) => {
      const next = { ...u, plan: 'premium' }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })

  const updateProfile = (updates) =>
    setUser((u) => {
      const next = { ...u, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })

  const trialDaysLeft = user
    ? Math.max(0, 15 - Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000))
    : 0

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        upgradePlan,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isPremium: user?.plan === 'premium',
        trialDaysLeft,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
