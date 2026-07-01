import { useState } from 'react'
import { generateRoadmap } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

export default function RoadmapGenerator() {
  const [skills, setSkills] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [experience, setExperience] = useState('beginner')
  const [loading, setLoading] = useState(false)
  const [roadmap, setRoadmap] = useState(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!skills || !targetRole) return
    setLoading(true)
    setError('')
    setRoadmap(null)
    try {
      const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean)
      const data = await generateRoadmap(skillsList, targetRole, experience)
      setRoadmap(data)
    } catch (e) {
      setError(e.message || 'Failed to generate roadmap.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Career Roadmap Generator</h1>
        <p className="text-text-muted text-lg mb-8">Get a personalized month-by-month learning plan for your dream role.</p>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-8 fade-in fade-in-delay-1">
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5 text-text-muted">Current Skills</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. JavaScript, Python, React"
              className="input-field"
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
          <div>
            <label className="block text-sm font-medium mb-1.5 text-text-muted">Experience Level</label>
            <select value={experience} onChange={(e) => setExperience(e.target.value)} className="select-field">
              <option value="beginner">Beginner (1st-2nd year)</option>
              <option value="intermediate">Intermediate (2nd-3rd year)</option>
              <option value="advanced">Advanced (3rd-4th year)</option>
            </select>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={!skills || !targetRole || loading} className="btn-primary">
          {loading ? 'Generating...' : 'Generate Roadmap'}
        </button>
      </div>

      {loading && <LoadingSpinner size="lg" />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-danger rounded-xl p-4 mb-6 text-sm fade-in">{error}</div>
      )}

      {!loading && !roadmap && !error && (
        <EmptyState
          icon={<svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
          title="No roadmap yet"
          description="Enter your current skills and target role to generate a personalized learning plan."
        />
      )}

      {roadmap?.months && (
        <div className="space-y-3 fade-in">
          <h2 className="text-xl font-bold mb-4">
            Your <span className="gradient-text">{roadmap.targetRole}</span> Roadmap
          </h2>
          <div className="relative pl-8 before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-primary/30 before:to-accent/30">
            {roadmap.months.map((month, idx) => (
              <details key={idx} className="glass-card rounded-2xl mb-3 group open:border-primary/30 open:shadow-md transition-all overflow-hidden">
                <summary className="p-4 font-semibold cursor-pointer list-none flex items-center gap-3 hover:text-primary transition-colors">
                  <span className="w-8 h-8 gradient-primary text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-md">
                    {idx + 1}
                  </span>
                  <span>{month.title}</span>
                  <span className="ml-auto text-xs text-text-muted bg-surface-alt px-2.5 py-1 rounded-full">{month.duration}</span>
                  <svg className="w-4 h-4 text-text-muted group-open:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                </summary>
                <div className="px-4 pb-4 pl-14 space-y-2">
                  {month.items?.map((item, i) => (
                    <p key={i} className="text-sm text-text-muted flex gap-2">
                      <span className="text-primary shrink-0">&#9702;</span>
                      {item}
                    </p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
