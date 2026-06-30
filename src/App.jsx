import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import RoadmapGenerator from './pages/RoadmapGenerator'
import MockInterview from './pages/MockInterview'
import Opportunities from './pages/Opportunities'
import Profile from './pages/Profile'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute><RoadmapGenerator /></ProtectedRoute>} />
          <Route path="/mock-interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
          <Route path="/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
