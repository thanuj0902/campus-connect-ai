# CampusConnect AI

AI-powered career co-pilot for engineering students. Get personalized resume feedback, career roadmaps, interview practice, and opportunity matching — all powered by AI.

## Problem

70% of engineering students in India struggle to translate their academic skills into job-ready profiles. Career guidance is either too generic (YouTube) or too expensive (paid mentors). CampusConnect AI bridges this gap with a free, AI-powered tool.

## Features

- **AI Resume Analyzer** — Upload a PDF resume, get an ATS score, missing keywords, weak points, and actionable suggestions
- **Career Roadmap Generator** — Generate month-by-month learning plans with free resources based on your target role
- **AI Mock Interview** — Practice domain-specific interviews (Web Dev, AI/ML, Data Science, etc.) with real-time AI feedback
- **Opportunity Matcher** — Discover internships and hackathons that match your skill set

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **AI:** Google Gemini API (free tier) or Anthropic Claude API
- **Auth:** Firebase Authentication (Google Sign-in)
- **Database:** Firebase Firestore
- **PDF parsing:** pdf-parse

## Project Structure

```
campus-connect-ai/
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components (7 pages)
│   ├── services/     # API client & Firebase config
│   ├── context/      # Auth context
│   └── data/         # Sample opportunity data
├── server/
│   ├── index.js      # Express server
│   └── routes/       # Claude API proxy routes
├── .env              # Frontend env vars (Firebase)
└── vite.config.js    # Vite config with Tailwind + proxy
```

## Getting Started

### Prerequisites

- Node.js 18+
- Anthropic Claude API key
- Firebase project (for auth — optional, app works without it)

### Installation

```bash
# Clone the repo
git clone https://github.com/thanuj0902/campus-connect-ai.git
cd campus-connect-ai

# Install frontend dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..
```

### Configuration

1. Copy `.env` and add your Firebase credentials:
```
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
# VITE_API_URL=https://campus-connect-ai-8ls3.onrender.com/api  # for production only
```

2. Create `server/.env` with your API key (free option recommended):
```
GEMINI_API_KEY=your-gemini-api-key
# ANTHROPIC_API_KEY=sk-ant-...  # Claude alternative
PORT=3001
```

Get a free Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

### Run Locally

```bash
# Terminal 1 — Backend
cd server && npm start

# Terminal 2 — Frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Live URLs

- **Frontend:** [campus-connect-ai-zeta.vercel.app](https://campus-connect-ai-zeta.vercel.app)
- **Backend API:** [campus-connect-ai-8ls3.onrender.com](https://campus-connect-ai-8ls3.onrender.com)
- **Git Repo:** [github.com/thanuj0902/campus-connect-ai](https://github.com/thanuj0902/campus-connect-ai)

## Deployment

- **Frontend:** Deploy to Vercel (points to `dist/` folder)
- **Backend:** Deploy to Render (points to `server/` folder)
- Set the same environment variables in your hosting dashboard

## License

MIT
