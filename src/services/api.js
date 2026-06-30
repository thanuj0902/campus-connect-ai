const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function fetchFromClaude(endpoint, body) {
  const res = await fetch(`${API_BASE}/claude/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed with status ${res.status}`)
  }
  return res.json()
}

export async function uploadResume(file, targetRole) {
  const formData = new FormData()
  formData.append('resume', file)
  formData.append('targetRole', targetRole)
  const res = await fetch(`${API_BASE}/claude/upload-resume`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Upload failed with status ${res.status}`)
  }
  return res.json()
}

export function analyzeResume(text, targetRole) {
  return fetchFromClaude('analyze-resume', { text, targetRole })
}

export function generateRoadmap(currentSkills, targetRole, experienceLevel) {
  return fetchFromClaude('generate-roadmap', { currentSkills, targetRole, experienceLevel })
}

export function generateInterviewQuestions(domain) {
  return fetchFromClaude('generate-questions', { domain })
}

export function submitInterviewAnswer(question, answer, domain) {
  return fetchFromClaude('evaluate-answer', { question, answer, domain })
}
