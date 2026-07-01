import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="text-8xl sm:text-9xl font-extrabold gradient-text mb-4">404</div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Page not found</h1>
        <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary text-base px-8 py-3.5 inline-block">
          Go Home &rarr;
        </Link>
      </motion.div>
    </div>
  )
}
