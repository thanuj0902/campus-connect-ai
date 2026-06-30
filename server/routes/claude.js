import { createRequire } from 'module'
import { Router } from 'express'
import multer from 'multer'

const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')

export const claudeRouter = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

const CLAUDE_API = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

function isMockMode() {
  return !process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-anthropic-api-key'
}

async function callClaude(systemPrompt, userMessage) {
  if (isMockMode()) return mockResponse(systemPrompt, userMessage)

  const res = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error: ${res.status} ${err}`)
  }

  const data = await res.json()
  const text = data.content?.[0]?.text || ''
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text }
  }
}

claudeRouter.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const targetRole = req.body.targetRole
    if (!targetRole) return res.status(400).json({ error: 'Missing target role' })

    const pdfData = await pdfParse(req.file.buffer)
    const text = pdfData.text.slice(0, 8000)

    const result = await callClaude(
      'You are an expert ATS resume analyzer. Analyze the resume and return JSON with: atsScore (0-100), missingKeywords (array), weakPoints (array), suggestions (array). Be specific and actionable.',
      `Resume:\n${text}\n\nTarget Role: ${targetRole}`
    )
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

claudeRouter.post('/analyze-resume', async (req, res) => {
  try {
    const { text, targetRole } = req.body
    if (!text || !targetRole) return res.status(400).json({ error: 'Missing resume text or target role' })
    const truncated = text.slice(0, 8000)
    const result = await callClaude(
      'You are an expert ATS resume analyzer. Analyze the resume and return JSON with: atsScore (0-100), missingKeywords (array), weakPoints (array), suggestions (array). Be specific and actionable.',
      `Resume:\n${truncated}\n\nTarget Role: ${targetRole}`
    )
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

claudeRouter.post('/generate-roadmap', async (req, res) => {
  try {
    const { currentSkills, targetRole, experienceLevel } = req.body
    if (!currentSkills || !targetRole) return res.status(400).json({ error: 'Missing skills or target role' })
    const result = await callClaude(
      'You are a career roadmap generator. Return JSON with: { targetRole: string, months: array of { title, duration, items[] } }. Include specific free resources and project ideas.',
      `Current skills: ${currentSkills.join(', ')}\nTarget role: ${targetRole}\nExperience: ${experienceLevel}`
    )
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

claudeRouter.post('/generate-questions', async (req, res) => {
  try {
    const { domain } = req.body
    if (!domain) return res.status(400).json({ error: 'Missing domain' })
    const result = await callClaude(
      'You are a technical interviewer. Generate 5 interview questions for the given domain. Return JSON: { questions: string[] }',
      `Domain: ${domain}`
    )
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

claudeRouter.post('/evaluate-answer', async (req, res) => {
  try {
    const { question, answer, domain } = req.body
    if (!question || !answer) return res.status(400).json({ error: 'Missing question or answer' })
    const result = await callClaude(
      'You are an interview coach. Evaluate the answer and return JSON: { score (0-100), feedback (string), idealAnswer (string) }',
      `Domain: ${domain}\nQuestion: ${question}\nAnswer: ${answer}`
    )
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

function mockResponse(system, message) {
  if (system.includes('resume')) {
    return {
      atsScore: Math.floor(Math.random() * 40) + 55,
      missingKeywords: ['React', 'TypeScript', 'REST APIs', 'CI/CD'],
      weakPoints: [
        'Bullet points are too generic — quantify achievements with numbers',
        'Missing a professional summary section',
        'Skills section lists technologies without proficiency levels',
      ],
      suggestions: [
        'Add a strong summary highlighting your key technologies',
        'Use action verbs and quantify results (e.g., "Improved performance by 30%")',
        'Include relevant coursework projects if you have limited work experience',
      ],
    }
  }
  if (system.includes('roadmap')) {
    return {
      targetRole: 'Software Engineer',
      months: [
        { title: 'Foundations & Fundamentals', duration: 'Month 1-2', items: ['Master core DS&A', 'Build 2-3 mini projects', 'Start portfolio website'] },
        { title: 'Specialization Deep Dive', duration: 'Month 3-4', items: ['Learn framework/libraries for your domain', 'Contribute to open source', 'Complete a certification'] },
        { title: 'Project Building', duration: 'Month 5-6', items: ['Build a capstone project', 'Write technical blog posts', 'Prepare for interviews'] },
      ],
    }
  }
  if (system.includes('interview questions')) {
    return {
      questions: [
        'Explain the difference between REST and GraphQL.',
        'How does the Virtual DOM work in React?',
        'Describe the event loop in JavaScript.',
        'What is the difference between SQL and NoSQL databases?',
        'How would you design a URL shortening service?',
      ],
    }
  }
  if (system.includes('evaluate')) {
    return {
      score: Math.floor(Math.random() * 40) + 55,
      feedback: 'Good answer! Consider adding more specific examples and technical depth.',
      idealAnswer: 'A strong answer would include specific technical details, real-world examples, and show depth of understanding.',
    }
  }
  return { message: 'Mock response' }
}
