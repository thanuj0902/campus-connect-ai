import { useState } from 'react'
import { uploadResume, analyzeResume } from '../services/api'
import { saveResult } from '../services/history'
import LoadingSpinner from '../components/LoadingSpinner'
import ScoreGauge from '../components/ScoreGauge'
import EmptyState from '../components/EmptyState'

const SAMPLE_RESUME = `Experienced web developer with 3+ years building responsive applications.
- Built an e-commerce platform using React, Node.js, and PostgreSQL serving 10k+ users
- Reduced page load time by 40% through code splitting and lazy loading
- Led a team of 4 developers to deliver a SaaS product in 3 months
- Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes`

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null)
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleUpload = async () => {
    if (!file || !targetRole) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await uploadResume(file, targetRole)
      setResult(data)
      saveResult('resume', { targetRole, atsScore: data.atsScore })
    } catch (e) {
      setError(e.message || 'Failed to analyze resume.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    setTargetRole('Full Stack Developer')
    try {
      const data = await analyzeResume(SAMPLE_RESUME, 'Full Stack Developer')
      setResult(data)
      saveResult('resume', { targetRole: 'Full Stack Developer', atsScore: data.atsScore })
    } catch (e) {
      setError(e.message || 'Demo failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (!result) return
    const text = [
      `CampusConnect AI - Resume Analysis Report`,
      `Target Role: ${targetRole}`,
      `ATS Score: ${result.atsScore}/100`,
      ``,
      `Missing Keywords:`,
      ...(result.missingKeywords || []).map(k => `  - ${k}`),
      ``,
      `Areas to Improve:`,
      ...(result.weakPoints || []).map(p => `  - ${p}`),
      ``,
      `Suggestions:`,
      ...(result.suggestions || []).map(s => `  - ${s}`),
    ].join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `resume-analysis-${Date.now()}.txt`
    a.click()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">AI Resume Analyzer</h1>
        <p className="text-text-muted text-lg mb-8">Upload your PDF resume and get instant AI-powered feedback.</p>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-8 fade-in fade-in-delay-1">
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-text-muted">Upload Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="input-field file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-text-muted">Target Role</label>
            <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="select-field">
              <option value="">Select a role...</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Machine Learning Engineer">Machine Learning Engineer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="AI Engineer">AI Engineer</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleUpload} disabled={!file || !targetRole || loading} className="btn-primary">
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
          <button onClick={handleDemo} disabled={loading} className="btn-secondary">
            Try Demo
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner size="lg" />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-danger rounded-xl p-4 mb-6 text-sm fade-in">{error}</div>
      )}

      {!loading && !result && !error && (
        <EmptyState
          icon={<svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
          title="No resume analyzed yet"
          description="Upload a PDF resume or click 'Try Demo' to see it in action."
        />
      )}

      {result && (
        <div className="space-y-5 fade-in">
          <div className="glass-card rounded-2xl p-6 flex flex-col items-center">
            <ScoreGauge score={result.atsScore} label="ATS Score" />
            <button onClick={handleExport} className="mt-4 text-sm text-primary hover:underline font-medium">
              Download Report
            </button>
          </div>

          {result.missingKeywords?.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-3">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw) => (
                  <span key={kw} className="badge bg-warning/10 text-warning border border-warning/20">{kw}</span>
                ))}
              </div>
            </div>
          )}

          {result.weakPoints?.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-3">Areas to Improve</h3>
              <ul className="space-y-3">
                {result.weakPoints.map((p, i) => (
                  <li key={i} className="flex gap-3 text-sm text-text-muted">
                    <span className="w-5 h-5 rounded-full bg-danger/10 text-danger flex items-center justify-center text-xs shrink-0 mt-0.5">!</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions?.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-3">Suggestions</h3>
              <ul className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-text-muted">
                    <span className="w-5 h-5 rounded-full bg-success/10 text-success flex items-center justify-center text-xs shrink-0 mt-0.5">&#10003;</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
