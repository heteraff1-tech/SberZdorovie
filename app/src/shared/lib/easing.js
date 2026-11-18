/** Плавно переводит значение из диапазона start/end в прогресс от 0 до 1. */
export function easeBetween(start, end, value) {
  const part = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return part * part * (3 - 2 * part);
}
