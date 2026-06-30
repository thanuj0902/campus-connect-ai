export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-14 px-4 fade-in">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-text-muted max-w-md mx-auto mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  )
}
