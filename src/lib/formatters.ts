/**
 * Format duration in seconds to human-readable time
 * @param seconds - Duration in seconds
 * @param style - 'short' for "5m 20s", 'long' for "5h 20m", 'time' for "5:20"
 */
export function formatDuration(
  seconds: number,
  style: 'short' | 'long' | 'time' = 'short'
): string {
  if (seconds === 0) return style === 'time' ? '0:00' : '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (style === 'time') {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  if (style === 'long') {
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  // style === 'short'
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Format time in seconds to MM:SS format
 * @param seconds - Time in seconds
 */
export function formatTime(seconds: number): string {
  return formatDuration(seconds, 'time');
}
