import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastProvider } from './context/ToastContext'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import RoadmapGenerator from './pages/RoadmapGenerator'
import MockInterview from './pages/MockInterview'
import Opportunities from './pages/Opportunities'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="theme-transition">
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen flex flex-col theme-transition">
          <Navbar />
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<AnimatedPage><Landing /></AnimatedPage>} />
                <Route path="/dashboard" element={<AnimatedPage><ProtectedRoute><Dashboard /></ProtectedRoute></AnimatedPage>} />
                <Route path="/resume-analyzer" element={<AnimatedPage><ProtectedRoute><ResumeAnalyzer /></ProtectedRoute></AnimatedPage>} />
                <Route path="/roadmap" element={<AnimatedPage><ProtectedRoute><RoadmapGenerator /></ProtectedRoute></AnimatedPage>} />
                <Route path="/mock-interview" element={<AnimatedPage><ProtectedRoute><MockInterview /></ProtectedRoute></AnimatedPage>} />
                <Route path="/opportunities" element={<AnimatedPage><ProtectedRoute><Opportunities /></ProtectedRoute></AnimatedPage>} />
                <Route path="/profile" element={<AnimatedPage><ProtectedRoute><Profile /></ProtectedRoute></AnimatedPage>} />
                <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </ErrorBoundary>
  )
}
