export default function ScoreGauge({ score, label }) {
  const getColor = (s) => {
    if (s >= 80) return 'text-success'
    if (s >= 50) return 'text-warning'
    return 'text-danger'
  }
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" className="transform -rotate-90">
        <circle cx="70" cy="70" r="54" fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="70" cy="70" r="54"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={getColor(score)}
        />
      </svg>
      <div className="absolute mt-10">
        <span className={`text-3xl font-bold ${getColor(score)}`}>{score}</span>
        <span className="text-text-muted text-sm">/100</span>
      </div>
      {label && <p className="text-text-muted text-sm mt-12">{label}</p>}
    </div>
  )
}
