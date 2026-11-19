/** Возвращает подпись показателя пульса для интерфейса прототипа. */
export function pulseStatus(value, demo = false) {
  if (value > 100) return { label: 'Высокий', tone: 'elevated' };
  if (demo) return { label: 'Повышенный', tone: 'elevated' };
  return { label: '', tone: 'default' };
}

/** Применяет категории AHA к отображаемым значениям давления. */
export function pressureStatus({ systolic, diastolic }) {
  if (systolic >= 130 || diastolic >= 80) return { label: 'Высокое', tone: 'critical' };
  if (systolic >= 120) return { label: 'Повышенное', tone: 'elevated' };
  return { label: '', tone: 'default' };
}
