import { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

function useMousePosition() {
  const pos = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const handler = (e) => { pos.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  return pos
}

function ParticleField() {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -20,
    })), [])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/20 dark:bg-primary/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 60 - 30, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const handleMouse = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`
  }, [])
  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)'
  }, [])
  return (
    <div ref={ref} onMouseMove={handleMouse} onMouseLeave={handleLeave} className={className} style={{ transition: 'transform 0.15s ease-out' }}>
      {children}
    </div>
  )
}

function RevealSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function AnimatedCounter({ end, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  useEffect(() => {
    if (!isInView) return
    const duration = 1500
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, end])
  const display = useMemo(() => {
    if (end >= 1000) return count.toLocaleString()
    return count
  }, [count, end])
  return <span ref={ref}>{display}{suffix}</span>
}

const features = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ), title: 'Resume Analysis', desc: 'Get an ATS score, find missing keywords, and fix weak points with AI feedback.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ), title: 'Career Roadmap', desc: 'Month-by-month learning plans with free resources tailored to your target role.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ), title: 'Mock Interviews', desc: 'Domain-specific Q&A with instant AI feedback and scoring for every answer.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ), title: 'Opportunity Matcher', desc: 'Discover internships and hackathons that match your exact skill set.',
    gradient: 'from-orange-500 to-red-500',
  },
]

const steps = [
  { num: '01', title: 'Upload Your Resume', desc: 'Upload your PDF resume for instant AI analysis and scoring.', color: 'from-violet-500 to-purple-500' },
  { num: '02', title: 'Choose Your Path', desc: 'Tell us your target role. Get a personalized learning roadmap.', color: 'from-cyan-500 to-blue-500' },
  { num: '03', title: 'Practice & Improve', desc: 'Mock interviews with real-time AI feedback on every answer.', color: 'from-emerald-500 to-teal-500' },
  { num: '04', title: 'Find Opportunities', desc: 'Get matched with internships and hackathons that fit your skills.', color: 'from-orange-500 to-red-500' },
]

const stats = [
  { end: 5000, label: 'Resumes Analyzed', gradient: 'from-violet-500 to-purple-500', suffix: '+' },
  { end: 10000, label: 'Interviews Practiced', gradient: 'from-cyan-500 to-blue-500', suffix: '+' },
  { end: 98, label: 'User Satisfaction', gradient: 'from-emerald-500 to-teal-500', suffix: '%' },
  { end: 50, label: 'Partner Colleges', gradient: 'from-orange-500 to-red-500', suffix: '+' },
]

export default function Landing() {
  const { user, error, login } = useAuth()
  const navigate = useNavigate()
  const mousePos = useMousePosition()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const handleLogin = async () => {
    const result = await login()
    if (result?.ok) navigate('/dashboard')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
  }

  return (
    <div className="overflow-hidden">
      {/* ───── Hero ───── */}
      <section ref={heroRef} className="relative overflow-hidden bg-grid min-h-[90vh] flex items-center">
        <motion.div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-transparent to-[var(--bg-surface)]" style={{ opacity: heroOpacity }} />
        <div className="absolute top-[-10%] left-[-5%] orb w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-accent/10 animate-float-slow dark:from-primary/30 dark:to-accent/15" />
        <div className="absolute bottom-[-15%] right-[-5%] orb w-[400px] h-[400px] bg-gradient-to-br from-accent/15 to-primary/10 animate-float-reverse dark:from-accent/20 dark:to-primary/15" />
        <div className="absolute top-[40%] right-[20%] orb w-[250px] h-[250px] bg-gradient-to-br from-amber-400/10 to-pink-400/10 animate-pulse-glow dark:from-amber-400/20 dark:to-pink-400/20" />
        <ParticleField />

        <motion.div className="relative max-w-7xl mx-auto px-4 pt-24 pb-20 text-center w-full" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div variants={itemVariants} initial="hidden" animate="visible" className="flex justify-center">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-primary/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              AI-Powered Career Co-Pilot
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} initial="hidden" animate="visible" className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Turn Your Academic Skills Into{' '}
            <span className="gradient-text">Job-Ready Profiles</span>
          </motion.h1>

          <motion.p variants={itemVariants} initial="hidden" animate="visible" className="text-[var(--text-muted)] text-lg sm:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
            70% of engineering students in India struggle to translate academic skills into job-ready profiles.
            CampusConnect AI bridges this gap with a free, AI-powered career co-pilot.
          </motion.p>

          <motion.div variants={itemVariants} initial="hidden" animate="visible" className="flex flex-wrap justify-center gap-4 mt-10">
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
          </motion.div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-danger text-sm bg-danger/10 px-4 py-2 rounded-lg inline-block backdrop-blur-sm">
              {error}
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* ───── Features ───── */}
      <section id="features" className="max-w-7xl mx-auto px-4 -mt-10 pb-24 relative z-10">
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} variants={itemVariants}>
              <TiltCard className="glass-card rounded-2xl p-6 group h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} text-white flex items-center justify-center mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-base mb-1.5 group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{f.desc}</p>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───── How It Works ───── */}
      <section className="bg-[var(--bg-card)] py-24 border-y border-[var(--border-color)] relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] orb w-[300px] h-[300px] bg-gradient-to-br from-primary/5 to-accent/5 animate-float dark:from-primary/10 dark:to-accent/10" />
        <div className="relative max-w-7xl mx-auto px-4">
          <RevealSection className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">Four Steps to Career Readiness</h2>
            <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto mt-3">
              Simple, guided steps to transform your career preparation.
            </p>
          </RevealSection>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <RevealSection key={s.num} delay={i * 0.1} className="relative text-center">
                <div className="relative inline-flex mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center text-xl font-bold shadow-xl shadow-black/5`}>
                    {s.num}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/10 to-transparent" />
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Stats ───── */}
      <section className="py-20 relative">
        <div className="absolute bottom-[-10%] right-[-5%] orb w-[400px] h-[400px] bg-gradient-to-br from-accent/8 to-primary/5 animate-float-slow dark:from-accent/15 dark:to-primary/10" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <RevealSection key={s.label} delay={i * 0.08}>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <span className={`text-4xl sm:text-5xl font-extrabold bg-gradient-to-br ${s.gradient} bg-clip-text text-transparent`}>
                    <AnimatedCounter end={s.end} suffix={s.suffix} />
                  </span>
                  <p className="text-[var(--text-muted)] text-sm mt-2 font-medium">{s.label}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Problem ───── */}
      <section className="py-20 relative">
        <RevealSection className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">The Problem We Solve</h2>
          <div className="glass-card rounded-2xl p-8 sm:p-10 text-left">
            <p className="text-[var(--text-muted)] text-lg sm:text-xl leading-relaxed">
              70% of engineering students in India struggle to translate their academic skills into job-ready
              profiles — they don't know what skills to build, how their resume compares to industry standards,
              or how to perform in interviews. Career guidance is either too generic (YouTube videos) or too
              expensive (paid mentors). <strong className="text-primary">CampusConnect AI bridges this gap</strong>{' '}
              with a free, AI-powered career co-pilot that gives personalized, real-time feedback.
            </p>
          </div>
        </RevealSection>
      </section>

      {/* ───── CTA ───── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-accent animate-gradient-shift opacity-95" />
        <div className="absolute inset-0 bg-grid-white" />
        <div className="absolute top-[-20%] left-[-10%] orb w-[400px] h-[400px] bg-white/10 animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] orb w-[400px] h-[400px] bg-white/10 animate-float-reverse" />
        <ParticleField />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <RevealSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Level Up Your Career?
            </h2>
          </RevealSection>
          <RevealSection delay={0.15}>
            <p className="text-white/80 text-lg mb-8">
              Start building your job-ready profile in minutes. It's completely free.
            </p>
          </RevealSection>
          <RevealSection delay={0.3}>
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
          </RevealSection>
        </div>
      </section>
    </div>
  )
}
