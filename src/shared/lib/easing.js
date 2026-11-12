export function easeBetween(start, end, value) {
  const part = Math.max(0, Math.min(1, (value - start) / (end - start)))
  return part * part * (3 - 2 * part)
}
