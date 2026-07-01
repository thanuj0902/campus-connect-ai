<div align="center">
  <br/>
  <h1>🚀 CampusConnect AI</h1>
  <p><strong>AI-Powered Career Co-Pilot for Engineering Students</strong></p>
  <br/>
  <p>
    <a href="https://campus-connect-ai-zeta.vercel.app">🌐 Live Demo</a>
    &nbsp;·&nbsp;
    <a href="#-features">Features</a>
    &nbsp;·&nbsp;
    <a href="#-tech-stack">Tech Stack</a>
    &nbsp;·&nbsp;
    <a href="#-quick-start">Quick Start</a>
  </p>
  <br/>
</div>

---

## 💡 The Problem

**70% of engineering students in India** struggle to translate their academic skills into job-ready profiles. Career guidance is either too generic (YouTube tutorials) or too expensive (paid mentors). Students don't know:

- What skills to build for their target role
- How their resume compares to industry standards
- How to perform in technical interviews
- Where to find relevant internships and hackathons

**CampusConnect AI solves all of this** — it's a free, all-in-one career co-pilot powered by Google Gemini AI.

---

## ✨ Features

| Feature | What it does |
|---|---|
| **📄 AI Resume Analyzer** | Upload your PDF resume → get an ATS score, missing keywords, weak points, and actionable suggestions |
| **🗺️ Career Roadmap Generator** | Generate a personalized month-by-month learning plan with free resources based on your target role |
| **🎤 AI Mock Interview** | Practice domain-specific interviews (Web Dev, AI/ML, Data Science, etc.) with real-time AI scoring and feedback |
| **🎯 Opportunity Matcher** | Discover internships and hackathons that match your exact skill set |

### Bonus features
- 🌙 **Dark mode** — toggle in the navbar, respects system preference
- ✨ **Animated UI** — page transitions, 3D tilt cards, scroll reveals, floating particles
- 🔒 **Works without setup** — mock auth mode for instant testing
- 📱 **Fully responsive** — desktop, tablet, and mobile

---

## 🛠️ Tech Stack

```
Frontend   →  React 19 + Vite + Tailwind CSS v4 + Framer Motion
Backend    →  Node.js + Express
AI Engine  →  Google Gemini 2.0 Flash (free tier)
Auth       →  Firebase Authentication (Google + Email/Password)
Hosting    →  Vercel (frontend) + Render (backend)
```

---

## 📸 Screenshots

> Visit the **[live demo](https://campus-connect-ai-zeta.vercel.app)** to see it in action.

| Landing | Dashboard | Dark Mode |
|---|---|---|
| Animated hero with orbs & particles | Glass card grid with 3D tilt | Full dark theme |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- (Optional) [Gemini API key](https://aistudio.google.com/apikey) — free, no credit card

### 1. Clone & install
```bash
git clone https://github.com/thanuj0902/campus-connect-ai.git
cd campus-connect-ai
npm install
cd server && npm install && cd ..
```

### 2. Add API key (optional — app works without it)
Create `server/.env`:
```
GEMINI_API_KEY=your-key-here
PORT=3001
```
Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

### 3. Run
```bash
# Terminal 1 — backend
cd server && npm start

# Terminal 2 — frontend
npm run dev
```

Open **http://localhost:5173** — no Firebase setup needed, mock auth works out of the box.

---

## 🌐 Live Deployment

| Service | URL |
|---|---|
| **Frontend** | [campus-connect-ai-zeta.vercel.app](https://campus-connect-ai-zeta.vercel.app) |
| **Backend API** | [campus-connect-ai-8ls3.onrender.com](https://campus-connect-ai-8ls3.onrender.com) |
| **GitHub** | [thanuj0902/campus-connect-ai](https://github.com/thanuj0902/campus-connect-ai) |

---

## 📁 Project Structure

```
campus-connect-ai/
├── src/
│   ├── components/     # Reusable UI (Navbar, Footer, Cards, etc.)
│   ├── context/        # Auth, Theme, Toast providers
│   ├── pages/          # 7 page components
│   ├── services/       # API client + Firebase config
│   └── data/           # Sample opportunities
├── server/
│   ├── index.js        # Express entry
│   └── routes/ai.js    # Gemini proxy + mock responses
├── .env                # Firebase config
└── vite.config.js      # + Tailwind v4
```

---

## 🏆 Why CampusConnect AI?

Students using this app can:
1. **Fix their resume** in 30 seconds with AI-powered ATS analysis
2. **Get a curated learning roadmap** tailored to their dream role
3. **Practice interviews** with instant feedback — no partner needed
4. **Discover opportunities** that match their actual skills

All free, all in one place, with a modern UI that judges love.

---

<div align="center">
  <p>Built with ❤️ for engineering students</p>
  <p>
    <a href="https://campus-connect-ai-zeta.vercel.app">🌐 Live Demo</a>
    &nbsp;·&nbsp;
    <a href="https://github.com/thanuj0902/campus-connect-ai">📦 GitHub</a>
  </p>
</div>
