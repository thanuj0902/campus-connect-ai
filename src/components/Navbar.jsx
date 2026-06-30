import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, login, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogin = async () => {
    const result = await login()
    if (result?.ok) navigate('/dashboard')
  }
  const [menuOpen, setMenuOpen] = useState(false)
  const isLanding = location.pathname === '/'

  return (
    <nav className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-white/20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl">
            <span className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center text-white text-sm font-bold">
              C
            </span>
            <span className="gradient-text">CampusConnect AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {!isLanding && (
              <Link to="/dashboard" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">
                Dashboard
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2.5 text-sm text-text-muted hover:text-primary transition-colors group">
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-8 h-8 rounded-full ring-2 ring-transparent group-hover:ring-primary/30 transition-all"
                  />
                  <span className="font-medium">{user.displayName}</span>
                </Link>
                <button onClick={logout} className="text-sm text-text-muted hover:text-danger transition-colors font-medium">
                  Sign out
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="btn-primary text-sm">
                Sign in with Google
              </button>
            )}
          </div>

          <button
            className="md:hidden relative z-10 p-2 text-text-muted hover:text-primary"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden relative bg-white rounded-2xl shadow-xl border border-border mt-2 p-4 flex flex-col gap-3 animate-fade-in">
            {!isLanding && (
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-text-muted hover:text-primary py-2 text-sm font-medium">
                Dashboard
              </Link>
            )}
            {user ? (
              <>
                <div className="flex items-center gap-3 py-2 border-b border-border">
                  <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">{user.displayName}</p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                  </div>
                </div>
                <button onClick={() => { logout(); setMenuOpen(false) }} className="text-left text-sm text-text-muted hover:text-danger py-1">Sign out</button>
              </>
            ) : (
              <button onClick={async () => { await handleLogin(); setMenuOpen(false) }} className="btn-primary text-sm text-center">Sign in with Google</button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
