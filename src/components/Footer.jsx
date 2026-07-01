import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--bg-card)]/50 backdrop-blur-sm" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg">
            <span className="w-7 h-7 gradient-accent rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md">
              C
            </span>
            <span className="gradient-text">CampusConnect AI</span>
          </Link>
          <p className="text-[var(--text-muted)] text-sm">
            &copy; {new Date().getFullYear()} CampusConnect AI &mdash; Built for engineering students
          </p>
        </div>
      </div>
    </footer>
  )
}
