import { useState } from 'react'
import opportunities from '../data/opportunities'
import EmptyState from '../components/EmptyState'

export default function Opportunities() {
  const [skills, setSkills] = useState('')
  const [matches, setMatches] = useState([])
  const [searched, setSearched] = useState(false)

  const handleMatch = () => {
    const userSkills = skills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    if (userSkills.length === 0) return
    const scored = opportunities.map((opp) => {
      const oppSkills = opp.skills.map((s) => s.toLowerCase())
      const overlap = userSkills.filter((s) => oppSkills.includes(s)).length
      return { ...opp, score: overlap }
    })
    scored.sort((a, b) => b.score - a.score)
    setMatches(scored.filter((m) => m.score > 0).slice(0, 5))
    setSearched(true)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Opportunity Matcher</h1>
        <p className="text-text-muted text-lg mb-8">Discover internships and hackathons that match your skill set.</p>
      </div>

      <div className="card p-6 mb-8 fade-in fade-in-delay-1">
        <label className="block text-sm font-medium mb-1.5 text-text-muted">Your Skills</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleMatch()}
            placeholder="e.g. React, Python, Docker, SQL"
            className="input-field flex-1"
          />
          <button onClick={handleMatch} disabled={!skills.trim()} className="btn-primary whitespace-nowrap">
            Find Matches
          </button>
        </div>
      </div>

      {!searched && (
        <EmptyState
          icon={<svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>}
          title="Enter your skills"
          description="Type your skills above and we'll find the best internships and hackathons for you."
        />
      )}

      {searched && matches.length === 0 && (
        <EmptyState
          icon={<svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>}
          title="No matches found"
          description="Try adding more skills to find relevant opportunities."
        />
      )}

      {matches.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-in">
          {matches.map((opp, i) => (
            <a
              key={opp.id}
              href={opp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-hover p-5 fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="badge bg-primary/10 text-primary border border-primary/20">{opp.type}</span>
                {opp.score > 0 && (
                  <span className="text-xs font-bold text-success bg-success/10 px-2.5 py-0.5 rounded-full">
                    {opp.score} match{opp.score > 1 ? 'es' : ''}
                  </span>
                )}
              </div>
              <h3 className="font-semibold mb-1">{opp.title}</h3>
              <p className="text-xs text-text-muted mb-3">Deadline: {opp.deadline}</p>
              <div className="flex flex-wrap gap-1.5">
                {opp.skills.map((skill) => (
                  <span key={skill} className="tag">{skill}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
