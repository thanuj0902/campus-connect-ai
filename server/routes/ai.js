import { Router } from 'express'
import multer from 'multer'

export const aiRouter = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

const GROQ_MODEL = 'mixtral-8x7b-32768'
const GEMINI_MODEL = 'gemini-2.0-flash'

function getApiKey() {
  return process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY
}

async function callAI(systemPrompt, userMessage, userKey, provider) {
  const apiKey = userKey || getApiKey()
  if (!apiKey || apiKey.startsWith('your-')) {
    return mockResponse(systemPrompt, userMessage)
  }

  const p = (provider || '').toLowerCase()

  try {
    if (p === 'openai') return await callOpenAI(apiKey, systemPrompt, userMessage)
    if (p === 'gemini') return await callGemini(apiKey, systemPrompt, userMessage)
    if (p === 'claude') return await callClaude(apiKey, systemPrompt, userMessage)
    return await callGroq(apiKey, systemPrompt, userMessage)
  } catch {
    return mockResponse(systemPrompt, userMessage)
  }
}

async function callOpenAI(apiKey, systemPrompt, userMessage) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 4096,
      temperature: 0.7
    })
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error: ${res.status} ${err}`)
  }
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || ''
  try {
    return JSON.parse(text.replace(/```json\s*|\s*```/g, ''))
  } catch {
    return { raw: text }
  }
}

async function callGroq(apiKey, systemPrompt, userMessage) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 4096,
      temperature: 0.7
    })
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq API error: ${res.status} ${err}`)
  }
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || ''
  try {
    return JSON.parse(text.replace(/```json\s*|\s*```/g, ''))
  } catch {
    return { raw: text }
  }
}

async function callGemini(apiKey, systemPrompt, userMessage) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        signal: controller.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
          generationConfig: { maxOutputTokens: 4096, temperature: 0.7 },
        }),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Gemini API error: ${res.status} ${err}`)
    }

    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    try {
      return JSON.parse(text.replace(/```json\s*|\s*```/g, ''))
    } catch {
      return { raw: text }
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function callClaude(apiKey, systemPrompt, userMessage) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      signal: controller.signal,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
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
      return JSON.parse(text.replace(/```json\s*|\s*```/g, ''))
    } catch {
      return { raw: text }
    }
  } finally {
    clearTimeout(timeout)
  }
}

aiRouter.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const targetRole = req.body.targetRole
    if (!targetRole) return res.status(400).json({ error: 'Missing target role' })

    const { PDFParse } = await import('pdf-parse')
    const pdf = new PDFParse(new Uint8Array(req.file.buffer))
    await pdf.load()
    const pdfResult = await pdf.getText()
    const text = pdfResult.text.slice(0, 8000)
    pdf.destroy()

    const userKey = req.headers['x-api-key']
    const provider = req.headers['x-api-provider']
    const result = await callAI(
      'You are an expert ATS resume analyzer. Analyze the resume and return JSON with: atsScore (0-100), missingKeywords (array), weakPoints (array), suggestions (array). Be specific and actionable.',
      `Resume:\n${text}\n\nTarget Role: ${targetRole}`,
      userKey, provider
    )
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

aiRouter.post('/analyze-resume', async (req, res) => {
  try {
    const { text, targetRole } = req.body
    if (!text || !targetRole) return res.status(400).json({ error: 'Missing resume text or target role' })
    const truncated = text.slice(0, 8000)
    const userKey = req.headers['x-api-key']
    const provider = req.headers['x-api-provider']
    const result = await callAI(
      'You are an expert ATS resume analyzer. Analyze the resume and return JSON with: atsScore (0-100), missingKeywords (array), weakPoints (array), suggestions (array). Be specific and actionable.',
      `Resume:\n${truncated}\n\nTarget Role: ${targetRole}`,
      userKey, provider
    )
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

aiRouter.post('/generate-roadmap', async (req, res) => {
  try {
    const { currentSkills, targetRole, experienceLevel } = req.body
    if (!currentSkills || !targetRole) return res.status(400).json({ error: 'Missing skills or target role' })
    const userKey = req.headers['x-api-key']
    const provider = req.headers['x-api-provider']
    const result = await callAI(
      'You are a career roadmap generator. Return JSON with: { targetRole: string, months: array of { title, duration, items[] } }. Include specific free resources and project ideas.',
      `Current skills: ${currentSkills.join(', ')}\nTarget role: ${targetRole}\nExperience: ${experienceLevel}`,
      userKey, provider
    )
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

aiRouter.post('/generate-questions', async (req, res) => {
  try {
    const { domain } = req.body
    if (!domain) return res.status(400).json({ error: 'Missing domain' })
    const userKey = req.headers['x-api-key']
    const provider = req.headers['x-api-provider']
    const result = await callAI(
      'You are a technical interviewer. Generate 5 interview questions for the given domain. Return JSON: { questions: string[] }',
      `Domain: ${domain}`,
      userKey, provider
    )
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

aiRouter.post('/evaluate-answer', async (req, res) => {
  try {
    const { question, answer, domain } = req.body
    if (!question || !answer) return res.status(400).json({ error: 'Missing question or answer' })
    const userKey = req.headers['x-api-key']
    const provider = req.headers['x-api-provider']
    const result = await callAI(
      'You are an interview coach. Evaluate the answer and return JSON: { score (0-100), feedback (string), idealAnswer (string) }',
      `Domain: ${domain}\nQuestion: ${question}\nAnswer: ${answer}`,
      userKey, provider
    )
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

const MOCK_KEYWORDS_BY_ROLE = {
  'frontend': ['React', 'TypeScript', 'REST APIs', 'State Management', 'Unit Testing', 'Responsive Design', 'Webpack/Vite', 'CI/CD'],
  'backend': ['Node.js/Python/Java', 'Database Design', 'API Design', 'Authentication', 'Testing', 'Docker', 'CI/CD', 'Cloud Services'],
  'full stack': ['React', 'Node.js', 'Database Design', 'TypeScript', 'REST APIs', 'Docker', 'Testing', 'CI/CD'],
  'data scientist': ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization', 'Feature Engineering', 'Deep Learning', 'A/B Testing'],
  'machine learning': ['Python', 'TensorFlow/PyTorch', 'MLOps', 'Feature Engineering', 'Model Deployment', 'Deep Learning', 'SQL', 'Statistics'],
  'devops': ['Docker', 'Kubernetes', 'CI/CD', 'Cloud (AWS/GCP/Azure)', 'Terraform', 'Monitoring', 'Linux', 'GitOps'],
  'software engineer': ['System Design', 'Data Structures & Algorithms', 'Testing', 'CI/CD', 'Database Design', 'Cloud Services', 'REST APIs', 'Clean Architecture'],
  'ai engineer': ['Python', 'LLMs', 'RAG', 'Vector Databases', 'MLOps', 'Prompt Engineering', 'Deep Learning', 'API Development'],
}

const MOCK_MONTHLY_ITEMS = [
  [{ title: 'Foundations & Fundamentals', duration: 'Month 1', items: ['Complete core online courses', 'Build a portfolio site', 'Master version control (Git)'] },
   { title: 'Skill Building', duration: 'Month 2-3', items: ['Deep dive into domain-specific technologies', 'Build 2-3 mini projects', 'Contribute to open source'] },
   { title: 'Project & Portfolio', duration: 'Month 4-5', items: ['Build a capstone project', 'Write 3 technical blog posts', 'Create a polished resume'] },
   { title: 'Interview Prep', duration: 'Month 6', items: ['Practice 50+ LeetCode problems', 'Mock interviews', 'Apply to target companies'] }],
  [{ title: 'Core Skills Refresh', duration: 'Month 1', items: ['Review fundamentals', 'Set up development environment', 'Join relevant communities'] },
   { title: 'Specialization', duration: 'Month 2-3', items: ['Master framework/tools for your domain', 'Complete a certification', 'Build a real-world project'] },
   { title: 'Advanced Projects', duration: 'Month 4-5', items: ['Complex capstone with modern stack', 'Write case studies', 'Network at meetups'] },
   { title: 'Career Launch', duration: 'Month 6', items: ['Polish LinkedIn & resume', 'Targeted job applications', 'Interview practice'] }],
]

const MOCK_INTERVIEW_QUESTIONS = {
  'web development': [
    'Explain the critical rendering path in the browser.',
    'How do you optimize a React application for performance?',
    'Describe the differences between cookies, localStorage, and sessionStorage.',
    'What is the event loop in JavaScript and how does it work?',
    'Explain CSS specificity and when to use !important.',
  ],
  'data science': [
    'Explain the bias-variance tradeoff in machine learning.',
    'How do you handle imbalanced datasets?',
    'Describe the difference between L1 and L2 regularization.',
    'What is the Central Limit Theorem and why is it important?',
    'Explain how a Random Forest algorithm works.',
  ],
  'machine learning': [
    'Explain gradient descent and its variants.',
    'What is the difference between bagging and boosting?',
    'Describe the Transformer architecture.',
    'How do you prevent overfitting in neural networks?',
    'Explain the concept of attention in deep learning.',
  ],
  'backend': [
    'Design a URL shortening service. What are the key considerations?',
    'Explain database indexing and when to use it.',
    'Compare SQL and NoSQL databases with use cases.',
    'How would you handle rate limiting in a distributed system?',
    'Describe the CAP theorem and its trade-offs.',
  ],
  'default': [
    'Describe a challenging technical problem you solved and your approach.',
    'How do you stay updated with the latest technologies?',
    'Explain a project you built from scratch and the architecture decisions you made.',
    'How do you handle technical disagreements in a team?',
    'What is your approach to testing code?',
  ],
}

function extractRole(message) {
  const lower = message.toLowerCase()
  const roles = Object.keys(MOCK_KEYWORDS_BY_ROLE)
  for (const role of roles) {
    if (lower.includes(role)) return role
  }
  return 'software engineer'
}

function extractDomain(message) {
  const lower = message.toLowerCase()
  const domains = Object.keys(MOCK_INTERVIEW_QUESTIONS)
  for (const domain of domains) {
    if (lower.includes(domain)) return domain
  }
  return 'default'
}

function mockResponse(system, message) {
  const s = system.toLowerCase()
  const role = extractRole(message)

  if (s.includes('resume')) {
    const keywords = MOCK_KEYWORDS_BY_ROLE[role] || MOCK_KEYWORDS_BY_ROLE['software engineer']
    const shuffled = [...keywords].sort(() => Math.random() - 0.5)
    const missingCount = Math.floor(Math.random() * 3) + 3
    return {
      atsScore: Math.floor(Math.random() * 35) + 45,
      missingKeywords: shuffled.slice(0, missingCount),
      weakPoints: [
        `Your experience section doesn't highlight ${keywords[0]} skills relevant to ${role} roles`,
        `Bullet points lack quantifiable metrics — use numbers to show impact`,
        `Consider adding a projects section to demonstrate practical experience`,
      ],
      suggestions: [
        `Add ${keywords[0]} and ${keywords[1]} to your skills section with proficiency levels`,
        `Rewrite bullet points using the STAR method with concrete numbers`,
        `Create a GitHub portfolio showcasing projects that use ${keywords.slice(0, 2).join(' and ')}`,
      ],
    }
  }

  if (s.includes('roadmap')) {
    const months = MOCK_MONTHLY_ITEMS[Math.floor(Math.random() * MOCK_MONTHLY_ITEMS.length)]
    const title = role.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    return {
      targetRole: title,
      months: months.map(m => ({
        title: m.title,
        duration: m.duration,
        items: m.items,
      })),
    }
  }

  if (s.includes('evaluate')) {
    const words = message.split(/\s+/).length
    const detail = words > 30 ? Math.floor(Math.random() * 15) + 70 : Math.floor(Math.random() * 20) + 50
    return {
      score: detail,
      feedback: detail > 70
        ? 'Strong answer with good technical depth. Try adding a real-world example or alternative approach for even better impact.'
        : 'Good start! Consider adding more specific technical details, code examples, or real-world scenarios to strengthen your answer.',
      idealAnswer: `A strong answer would include specific technical details (e.g., libraries, tools, patterns), a real-world example, mention trade-offs or alternatives considered, and show depth of understanding beyond surface-level concepts.`,
    }
  }

  if (s.includes('interview')) {
    const questions = MOCK_INTERVIEW_QUESTIONS[extractDomain(message)] || MOCK_INTERVIEW_QUESTIONS['default']
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    return { questions: shuffled.slice(0, 5) }
  }

  return { message: `Mock response based on: ${message.slice(0, 50)}` }
}
