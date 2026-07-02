import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'

export default function Navbar() {
  const { user, login, loginWithEmail, register, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const { addToast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogin = async () => {
    const result = await login()
    if (result?.ok) {
      addToast('Signed in successfully!', 'success')
      navigate('/dashboard')
    }
  }
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const isLanding = location.pathname === '/'

  return (
    <nav className="sticky top-0 z-50">
      <div className="absolute inset-0 glass-strong" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl">
            <span className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/20">
              C
            </span>
            <span className="gradient-text">CampusConnect AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {!isLanding && (
              <Link to="/dashboard" className="text-[var(--text-muted)] hover:text-primary transition-colors text-sm font-medium">
                Dashboard
              </Link>
            )}
            {user && (
              <Link to="/profile" className="text-[var(--text-muted)] hover:text-primary transition-colors text-sm font-medium">
                Profile
              </Link>
            )}
            <button
              onClick={toggle}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-primary hover:bg-primary/5 transition-all"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2.5 text-sm text-[var(--text-muted)] hover:text-primary transition-colors group">
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-8 h-8 rounded-full ring-2 ring-transparent group-hover:ring-primary/30 transition-all"
                    onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="%236366f1"/><text x="16" y="21" text-anchor="middle" fill="white" font-size="14" font-family="sans-serif">?</text></svg>' }}
                  />
                  <span className="font-medium">{user.displayName}</span>
                </Link>
                <button onClick={() => { logout(); addToast('Signed out', 'info') }} className="text-sm text-[var(--text-muted)] hover:text-danger transition-colors font-medium">
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={handleLogin} className="btn-primary text-sm">
                  Sign in with Google
                </button>
                <button onClick={() => { setShowAuthForm(true); setAuthMode('signup'); setAuthError('') }} className="btn-secondary text-sm">
                  Sign Up
                </button>
                <button onClick={() => { setShowAuthForm(true); setAuthMode('login'); setAuthError('') }} className="text-sm text-[var(--text-muted)] hover:text-primary transition-colors font-medium">
                  Log In
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-1">
            <button onClick={toggle} className="p-2 rounded-xl text-[var(--text-muted)] hover:text-primary transition-all" aria-label="Toggle dark mode">
              {dark ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <button
              className="relative z-10 p-2 text-[var(--text-muted)] hover:text-primary"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? (
                  <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                ) : (
                  <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                )}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="md:hidden relative glass-card rounded-2xl mt-2 p-4 flex flex-col gap-3 border border-white/30 shadow-xl"
            >
              {!isLanding && (
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-[var(--text-muted)] hover:text-primary py-2 text-sm font-medium">
                  Dashboard
                </Link>
              )}
              {user && (
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-[var(--text-muted)] hover:text-primary py-2 text-sm font-medium">
                  Profile
                </Link>
              )}
              {user ? (
                <>
                  <div className="flex items-center gap-3 py-2 border-b border-[var(--border-color)]">
                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="%236366f1"/><text x="16" y="21" text-anchor="middle" fill="white" font-size="14" font-family="sans-serif">?</text></svg>' }} />
                    <div>
                      <p className="text-sm font-medium">{user.displayName}</p>
                      <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={() => { logout(); addToast('Signed out', 'info'); setMenuOpen(false) }} className="text-left text-sm text-[var(--text-muted)] hover:text-danger py-1">Sign out</button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <button onClick={async () => { await handleLogin(); setMenuOpen(false) }} className="btn-primary text-sm text-center">Sign in with Google</button>
                  <button onClick={() => { setShowAuthForm(true); setAuthMode('signup'); setMenuOpen(false) }} className="btn-secondary text-sm text-center">Sign Up</button>
                  <button onClick={() => { setShowAuthForm(true); setAuthMode('login'); setMenuOpen(false) }} className="text-sm text-[var(--text-muted)] hover:text-primary py-1">Log In</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAuthForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAuthForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="glass-card rounded-2xl p-6 w-full max-w-sm mx-4 border border-white/30"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-1">{authMode === 'login' ? 'Log In' : 'Create Account'}</h2>
              <p className="text-sm text-[var(--text-muted)] mb-5">
                {authMode === 'login' ? 'Sign in with your email' : 'Create a new account'}
              </p>

              {authMode === 'signup' && (
                <input type="text" placeholder="Your name" value={authName} onChange={(e) => setAuthName(e.target.value)} className="input-field mb-3" />
              )}
              <input type="email" placeholder="Email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="input-field mb-3" />
              <input type="password" placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="input-field mb-4" />

              {authError && <div className="bg-red-50 border border-red-200 text-danger rounded-xl p-3 mb-4 text-sm">{authError}</div>}

              <button
                onClick={async () => {
                  setAuthLoading(true)
                  setAuthError('')
                  const fn = authMode === 'login' ? loginWithEmail : register
                  const args = authMode === 'signup' ? [authEmail, authPassword, authName] : [authEmail, authPassword]
                  const result = await fn(...args)
                  setAuthLoading(false)
                  if (result?.ok) {
                    addToast(authMode === 'login' ? 'Logged in successfully!' : 'Account created!', 'success')
                    setShowAuthForm(false)
                    setAuthEmail('')
                    setAuthPassword('')
                    setAuthName('')
                    navigate('/dashboard')
                  } else {
                    setAuthError(result?.error || 'Something went wrong')
                  }
                }}
                disabled={!authEmail || !authPassword || authLoading}
                className="btn-primary w-full mb-3"
              >
                {authLoading ? 'Please wait...' : authMode === 'login' ? 'Log In' : 'Create Account'}
              </button>

              <p className="text-sm text-center text-[var(--text-muted)]">
                {authMode === 'login' ? (
                  <>Don't have an account? <button onClick={() => { setAuthMode('signup'); setAuthError('') }} className="text-primary font-medium hover:underline">Sign up</button></>
                ) : (
                  <>Already have an account? <button onClick={() => { setAuthMode('login'); setAuthError('') }} className="text-primary font-medium hover:underline">Sign in</button></>
                )}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
