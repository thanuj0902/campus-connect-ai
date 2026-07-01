import { useAuth } from '../context/AuthContext'
import EmptyState from '../components/EmptyState'

export default function Profile() {
  const { user, login } = useAuth()

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <EmptyState
          icon={<svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
          title="Not signed in"
          description="Sign in with Google to view your profile."
          action={
            <button onClick={login} className="btn-primary">Sign In</button>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 fade-in">
      <div className="glass-card rounded-2xl p-8 text-center">
        <img src={user.photoURL} alt="" className="w-20 h-20 rounded-full mx-auto mb-4 ring-4 ring-primary/20 shadow-lg" onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><circle cx="40" cy="40" r="40" fill="%236366f1"/><text x="40" y="52" text-anchor="middle" fill="white" font-size="32" font-family="sans-serif">?</text></svg>' }} />
        <h1 className="text-2xl font-bold">{user.displayName}</h1>
        <p className="text-text-muted">{user.email}</p>
      </div>

      <div className="glass-card rounded-2xl p-6 mt-6">
        <h2 className="font-semibold text-lg mb-3">Skill Summary</h2>
        <p className="text-sm text-text-muted leading-relaxed">
          Your analyzed skills from resume uploads will appear here. Start by using the{' '}
          <a href="/resume-analyzer" className="text-primary font-medium hover:underline">Resume Analyzer</a>{' '}
          to build your skill profile.
        </p>
      </div>
    </div>
  )
}
