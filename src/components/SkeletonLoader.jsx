const widths = [75, 90, 65, 80, 70, 85]

export default function SkeletonLoader({ lines = 3 }) {
  return (
    <div className="animate-pulse space-y-3 p-4">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${widths[i % widths.length]}%` }} />
      ))}
    </div>
  )
}
