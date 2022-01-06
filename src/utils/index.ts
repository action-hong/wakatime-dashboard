export function formatTime(secs: number) {
  const hours = Math.floor(secs / 3600)
  const minutes = Math.floor((secs - (hours * 3600)) / 60)
  const seconds = Math.floor(secs - (hours * 3600) - (minutes * 60))
  return `${hours}h${minutes}m${seconds}s`
}
