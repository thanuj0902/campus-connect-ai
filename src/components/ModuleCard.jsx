import { Link } from 'react-router-dom'

export default function ModuleCard({ icon, title, description, path, gradient, index = 0 }) {
  return (
    <Link
      to={path}
      className="glass-card rounded-2xl p-6 fade-in-up group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}>
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-1.5 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-[var(--text-muted)] text-sm leading-relaxed">{description}</p>
    </Link>
  )
}
