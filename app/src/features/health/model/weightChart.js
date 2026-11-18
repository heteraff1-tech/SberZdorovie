/** Строит SVG-линию, заливку и точки веса из числовых измерений. */
export function buildWeightChart(
  days,
  { width = 333, height = 58, min = 74.6, max = 78.2, padding = 7.5 } = {},
) {
  const values = days.map((day) => Number(String(day.value).replace(',', '.')));
  if (max <= min || values.some((value) => !Number.isFinite(value)))
    return { points: [], line: '', area: '' };

  const points = days.map((day, index) => ({
    ...day,
    x: padding + (index * (width - padding * 2)) / Math.max(1, days.length - 1),
    y: Math.max(0, Math.min(height, ((max - values[index]) / (max - min)) * height)),
  }));
  const line = points.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');
  const area = points.length
    ? `${line} L ${points.at(-1).x} ${height} L ${points[0].x} ${height} Z`
    : '';
  return { points, line, area };
}
