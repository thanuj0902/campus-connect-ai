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

const stats = [
  { value: '5,000+', label: 'Resumes Analyzed', gradient: 'from-violet-500 to-purple-500' },
  { value: '10,000+', label: 'Interviews Practiced', gradient: 'from-cyan-500 to-blue-500' },
  { value: '98%', label: 'User Satisfaction', gradient: 'from-emerald-500 to-teal-500' },
  { value: '50+', label: 'Partner Colleges', gradient: 'from-orange-500 to-red-500' },
]

export default function Landing() {
  const { user, error, login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    const result = await login()
    if (result?.ok) navigate('/dashboard')
  }

  return (
    <div className="overflow-hidden">
      {/* ───── Hero ───── */}
      <section className="relative overflow-hidden bg-grid min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-transparent to-surface" />
        <div className="absolute top-[-10%] left-[-5%] orb w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-accent/10 animate-float-slow" />
        <div className="absolute bottom-[-15%] right-[-5%] orb w-[400px] h-[400px] bg-gradient-to-br from-accent/15 to-primary/10 animate-float-reverse" />
        <div className="absolute top-[40%] right-[20%] orb w-[250px] h-[250px] bg-gradient-to-br from-amber-400/10 to-pink-400/10 animate-pulse-glow" />

        <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-20 text-center w-full">
          <div className="fade-in">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-primary/20 backdrop-blur-sm">
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

          <div className="fade-in fade-in-delay-3 flex flex-wrap justify-center gap-4 mt-10">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-primary/20">
                Go to Dashboard &rarr;
              </Link>
            ) : (
              <button onClick={handleLogin} className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-primary/20">
                Get Started Free &rarr;
              </button>
            )}
            <a href="#features" className="btn-secondary text-base px-8 py-3.5">
              Explore Features
            </a>
          </div>

          {error && (
            <p className="mt-4 text-danger text-sm bg-danger/10 px-4 py-2 rounded-lg inline-block backdrop-blur-sm">{error}</p>
          )}
        </div>
      </section>

      {/* ───── Features ───── */}
      <section id="features" className="max-w-7xl mx-auto px-4 -mt-10 pb-24 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card rounded-2xl p-6 fade-in-up group"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} text-white flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-base mb-1.5 group-hover:text-primary transition-colors">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section className="bg-white py-24 border-y border-border relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] orb w-[300px] h-[300px] bg-gradient-to-br from-primary/5 to-accent/5 animate-float" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">Four Steps to Career Readiness</h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto mt-3">
              Simple, guided steps to transform your career preparation.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="relative inline-flex mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                    ['from-violet-500 to-purple-500','from-cyan-500 to-blue-500','from-emerald-500 to-teal-500','from-orange-500 to-red-500'][i]
                  } text-white flex items-center justify-center text-xl font-bold shadow-xl shadow-black/5`}>
                    {s.num}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/10 to-transparent" />
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Stats ───── */}
      <section className="py-20 relative">
        <div className="absolute bottom-[-10%] right-[-5%] orb w-[400px] h-[400px] bg-gradient-to-br from-accent/8 to-primary/5 animate-float-slow" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={s.label} className="glass-card rounded-2xl p-8 text-center fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className={`text-4xl sm:text-5xl font-extrabold bg-gradient-to-br ${s.gradient} bg-clip-text text-transparent`}>
                  {s.value}
                </span>
                <p className="text-text-muted text-sm mt-2 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Problem ───── */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 text-center fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">The Problem We Solve</h2>
          <div className="glass-card rounded-2xl p-8 sm:p-10 text-left">
            <p className="text-text-muted text-lg sm:text-xl leading-relaxed">
              70% of engineering students in India struggle to translate their academic skills into job-ready
              profiles — they don't know what skills to build, how their resume compares to industry standards,
              or how to perform in interviews. Career guidance is either too generic (YouTube videos) or too
              expensive (paid mentors). <strong className="text-primary">CampusConnect AI bridges this gap</strong>{' '}
              with a free, AI-powered career co-pilot that gives personalized, real-time feedback.
            </p>
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-accent animate-gradient-shift opacity-95" />
        <div className="absolute inset-0 bg-grid-white" />
        <div className="absolute top-[-20%] left-[-10%] orb w-[400px] h-[400px] bg-white/10 animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] orb w-[400px] h-[400px] bg-white/10 animate-float-reverse" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 fade-in-up">
            Ready to Level Up Your Career?
          </h2>
          <p className="text-white/80 text-lg mb-8 fade-in-up fade-in-delay-1">
            Start building your job-ready profile in minutes. It's completely free.
          </p>
          <div className="fade-in-up fade-in-delay-2">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-block bg-white text-primary px-8 py-3.5 rounded-xl font-semibold hover:shadow-2xl hover:shadow-white/25 transition-all hover:-translate-y-0.5"
              >
                Go to Dashboard &rarr;
              </Link>
            ) : (
              <button
                onClick={handleLogin}
                className="inline-block bg-white text-primary px-8 py-3.5 rounded-xl font-semibold hover:shadow-2xl hover:shadow-white/25 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Get Started Free &rarr;
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
