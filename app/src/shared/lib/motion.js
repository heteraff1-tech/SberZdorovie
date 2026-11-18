/** Возвращает длительность в миллисекундах из CSS конкретного экрана. */
export function readMotionDuration(name, element = document.documentElement) {
  const value = getComputedStyle(element).getPropertyValue(`--motion-${name}`).trim();
  const milliseconds = value.endsWith('ms')
    ? Number.parseFloat(value)
    : Number.parseFloat(value) * 1000;

  if (!Number.isFinite(milliseconds)) {
    throw new Error(`Unknown motion token: --motion-${name}`);
  }

  return milliseconds;
}
