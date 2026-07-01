import { useState, useRef, useEffect } from 'react'
import { generateInterviewQuestions, submitInterviewAnswer } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

export default function MockInterview() {
  const [domain, setDomain] = useState('')
  const [stage, setStage] = useState('setup')
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answer, setAnswer] = useState('')
  const [chat, setChat] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const chatEnd = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' })
    return () => clearTimeout(timeoutRef.current)
  }, [chat])

  const startInterview = async () => {
    if (!domain) return
    setLoading(true)
    setError('')
    try {
      const data = await generateInterviewQuestions(domain)
      const qs = data.questions || []
      setQuestions(qs)
      setChat([{ role: 'ai', text: qs[0] || 'Tell me about yourself.' }])
      setStage('interview')
      setCurrentQ(0)
      setResults([])
    } catch (e) {
      setError(e.message || 'Failed to generate questions.')
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!answer.trim()) return
    const q = questions[currentQ]
    setChat((prev) => [...prev, { role: 'user', text: answer }])
    setLoading(true)
    try {
      const data = await submitInterviewAnswer(q, answer, domain)
      setChat((prev) => [
        ...prev,
        { role: 'ai', text: data.feedback || 'Good effort!' },
        ...(data.idealAnswer ? [{ role: 'ai', type: 'ideal', text: `Ideal answer: ${data.idealAnswer}` }] : []),
      ])
      setResults((prev) => [...prev, { question: q, score: data.score || 0 }])
      setAnswer('')
      const next = currentQ + 1
      if (next < questions.length) {
        setCurrentQ(next)
        timeoutRef.current = setTimeout(() => setChat((prev) => [...prev, { role: 'ai', text: questions[next] }]), 300)
      } else {
        timeoutRef.current = setTimeout(() => setStage('completed'), 500)
      }
    } catch (e) {
      setError(e.message || 'Failed to evaluate answer.')
    } finally {
      setLoading(false)
    }
  }

  const totalScore = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
    : 0

  if (stage === 'setup') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">AI Mock Interview</h1>
          <p className="text-text-muted text-lg mb-8">Practice domain-specific interviews with real-time AI feedback.</p>
        </div>
        <div className="card p-6 fade-in fade-in-delay-1">
          <label className="block text-sm font-medium mb-1.5 text-text-muted">Choose Domain</label>
          <select value={domain} onChange={(e) => setDomain(e.target.value)} className="select-field mb-5">
            <option value="">Select a domain...</option>
            <option value="Web Development">Web Development</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Data Science">Data Science</option>
            <option value="DevOps">DevOps</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>
          <button onClick={startInterview} disabled={!domain || loading} className="btn-primary">
            {loading ? 'Loading...' : 'Start Interview'}
          </button>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-danger rounded-xl p-4 mt-4 text-sm fade-in">{error}</div>}
      </div>
    )
  }

  if (loading && chat.length === 0) return <LoadingSpinner size="lg" />

  if (stage === 'completed') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 fade-in">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 className="text-2xl font-bold mb-1">Interview Complete!</h2>
          <p className="text-text-muted mb-6">Here's how you performed.</p>
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-6xl font-extrabold gradient-text">{totalScore}</span>
            <span className="text-text-muted text-lg">/ 100</span>
          </div>
          <div className="text-left space-y-4">
            <h3 className="font-semibold text-lg">Question Breakdown</h3>
            <div className="space-y-3">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-alt">
                  <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                    r.score >= 70 ? 'bg-success/10 text-success' :
                    r.score >= 40 ? 'bg-warning/10 text-warning' :
                    'bg-danger/10 text-danger'
                  }`}>
                    {r.score}
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-medium">Q{i + 1}</p>
                    <p className="text-xs text-text-muted line-clamp-1">{r.question}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setStage('setup')} className="btn-primary mt-8">
            Practice Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">AI Mock Interview</h1>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 bg-surface-alt rounded-full h-2">
            <div className="h-2 gradient-primary rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
          </div>
          <span className="text-sm text-text-muted font-medium shrink-0">{currentQ + 1} / {questions.length}</span>
        </div>
      </div>

      <div className="card p-5 mb-4 h-96 overflow-y-auto fade-in fade-in-delay-1 space-y-3">
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`} style={{ animationDelay: '0.05s' }}>
            <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'gradient-primary text-white rounded-br-md'
                : (msg.type === 'ideal' || msg.text.startsWith('Ideal answer'))
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 rounded-bl-md'
                  : 'bg-surface-alt text-text rounded-bl-md'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEnd} />
      </div>

      <div className="flex gap-2 fade-in">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
          placeholder="Type your answer..."
          className="input-field flex-1"
        />
        <button onClick={submitAnswer} disabled={!answer.trim() || loading} className="btn-primary whitespace-nowrap">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ...
            </span>
          ) : 'Send'}
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-danger rounded-xl p-4 mt-4 text-sm fade-in">{error}</div>}
    </div>
  )
}
