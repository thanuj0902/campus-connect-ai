import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { claudeRouter } from './routes/claude.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.use('/api/claude', claudeRouter)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
