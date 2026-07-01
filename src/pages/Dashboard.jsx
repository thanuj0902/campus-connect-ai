import { useAuth } from '../context/AuthContext'
import ModuleCard from '../components/ModuleCard'

const modules = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: 'AI Resume Analyzer',
    description: 'Upload your resume and get an ATS score, keyword gaps, and tailored suggestions.',
    path: '/resume-analyzer',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Career Roadmap',
    description: 'Generate a month-by-month learning plan based on your skills and target role.',
    path: '/roadmap',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'AI Mock Interview',
    description: 'Practice with domain-specific questions and receive instant AI feedback.',
    path: '/mock-interview',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Opportunity Matcher',
    description: 'Discover internships and hackathons that match your skill set.',
    path: '/opportunities',
    gradient: 'from-orange-500 to-red-500',
  },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="glass-card rounded-2xl p-8 mb-10 fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Welcome back, <span className="gradient-text">{user?.displayName?.split(' ')[0] || 'Student'}</span>
        </h1>
        <p className="text-text-muted mt-2 text-lg">Pick a tool to level up your career prep.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {modules.map((m, i) => (
          <ModuleCard key={m.title} {...m} index={i} />
        ))}
      </div>
    </div>
  )
}
