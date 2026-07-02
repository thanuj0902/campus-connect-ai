export function saveResult(type, data) {
  const stored = JSON.parse(localStorage.getItem('cc_history') || '[]')
  stored.unshift({ type, data, date: new Date().toISOString() })
  localStorage.setItem('cc_history', JSON.stringify(stored.slice(0, 20)))
}

export function getHistory() {
  return JSON.parse(localStorage.getItem('cc_history') || '[]')
}

export function clearHistory() {
  localStorage.removeItem('cc_history')
}