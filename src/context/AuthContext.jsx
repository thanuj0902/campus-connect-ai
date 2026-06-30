import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, provider, isConfigured } from '../services/firebase'

const AuthContext = createContext(null)

function getMockUser() {
  const stored = localStorage.getItem('cc_mock_user')
  return stored ? JSON.parse(stored) : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (isConfigured ? null : getMockUser()))
  const [loading, setLoading] = useState(!getMockUser())
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isConfigured) {
      const mock = getMockUser()
      setUser(mock)
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    }, (err) => {
      setError(err.message)
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async () => {
    setError(null)
    if (!isConfigured) {
      const mockUser = {
        uid: 'mock-123',
        displayName: 'Demo User',
        email: 'demo@campusconnect.ai',
        photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
      }
      localStorage.setItem('cc_mock_user', JSON.stringify(mockUser))
      setUser(mockUser)
      return { ok: true }
    }
    try {
      await signInWithPopup(auth, provider)
      return { ok: true }
    } catch (e) {
      const msg = e.code === 'auth/popup-blocked'
        ? 'Popup was blocked by your browser. Please allow popups for this site.'
        : e.code === 'auth/unauthorized-domain'
        ? 'Sign-in is not available on this domain yet. Contact the developer to add it to Firebase authorized domains.'
        : e.message
      setError(msg)
      return { ok: false, error: msg }
    }
  }

  const logout = async () => {
    if (!isConfigured) {
      localStorage.removeItem('cc_mock_user')
      setUser(null)
      return
    }
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
