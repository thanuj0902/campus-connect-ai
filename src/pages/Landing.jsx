import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: 'Resume Analysis',
    desc: 'Get an ATS score, find missing keywords, and fix weak points with AI feedback.',
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
    desc: 'Month-by-month learning plans with free resources tailored to your target role.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Mock Interviews',
    desc: 'Domain-specific Q&A with instant AI feedback and scoring for every answer.',
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
    desc: 'Discover internships and hackathons that match your exact skill set.',
    gradient: 'from-orange-500 to-red-500',
  },
]

const steps = [
  { num: '01', title: 'Upload Your Resume', desc: 'Upload your PDF resume for instant AI analysis and scoring.' },
  { num: '02', title: 'Choose Your Path', desc: 'Tell us your target role. Get a personalized learning roadmap.' },
  { num: '03', title: 'Practice & Improve', desc: 'Mock interviews with real-time AI feedback on every answer.' },
  { num: '04', title: 'Find Opportunities', desc: 'Get matched with internships and hackathons that fit your skills.' },
]

export default function Landing() {
  const { user, error, login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    const result = await login()
    if (result?.ok) navigate('/dashboard')
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-20 text-center">
          <div className="fade-in">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              AI-Powered Career Co-Pilot
            </span>
          </div>
          <h1 className="fade-in fade-in-delay-1 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Turn Your Academic Skills Into{' '}
            <span className="gradient-text">Job-Ready Profiles</span>
          </h1>
          <p className="fade-in fade-in-delay-2 text-text-muted text-lg sm:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
            70% of engineering students in India struggle to translate academic skills into job-ready profiles.
            CampusConnect AI bridges this gap with a free, AI-powered career co-pilot.
          </p>
          <div className="fade-in fade-in-delay-3 flex justify-center gap-4 mt-10">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-base px-8 py-3.5">
                Go to Dashboard &rarr;
              </Link>
            ) : (
              <button onClick={handleLogin} className="btn-primary text-base px-8 py-3.5">
                Get Started Free &rarr;
              </button>
            )}
          </div>
          {error && (
            <p className="mt-4 text-danger text-sm bg-danger/10 px-4 py-2 rounded-lg inline-block">{error}</p>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-8 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card card-hover p-6 fade-in"
              style={{ animationDelay: `${(i + 1) * 0.15}s` }}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} text-white flex items-center justify-center mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-base mb-1.5">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto">
              Four simple steps to transform your career readiness.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="text-5xl font-black gradient-text opacity-20 mb-4">{s.num}</div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/20 to-transparent" />
                )}
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">The Problem We Solve</h2>
          <p className="text-text-muted text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
            70% of engineering students in India struggle to translate their academic skills into job-ready
            profiles — they don't know what skills to build, how their resume compares to industry standards,
            or how to perform in interviews. Career guidance is either too generic (YouTube videos) or too
            expensive (paid mentors). <strong className="text-primary">CampusConnect AI bridges this gap</strong>{' '}
            with a free, AI-powered career co-pilot that gives personalized, real-time feedback.
          </p>
        </div>
      </section>

      <section className="gradient-accent py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Level Up Your Career?</h2>
          <p className="text-white/80 text-lg mb-8">Start building your job-ready profile in minutes. It's free.</p>
          {user ? (
            <Link to="/dashboard" className="inline-block bg-white text-primary px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:shadow-white/20 transition-all">
              Go to Dashboard &rarr;
            </Link>
          ) : (
            <button onClick={handleLogin} className="inline-block bg-white text-primary px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:shadow-white/20 transition-all cursor-pointer">
              Get Started Free &rarr;
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
