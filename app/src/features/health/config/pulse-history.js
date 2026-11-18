// Presentation measurements and daily aggregate from the Figma pulse overview.
// Dates are fixed demo data; no device or medical service is queried.
export const pulseHistory = {
  date: '2026-11-18',
  range: [43, 120],
  measurements: [
    { time: '03:35', value: 70, phase: 'rest' },
    { time: '04:36', value: 104, phase: 'coffee' },
    { time: '06:30', value: 92, phase: 'rest' },
    { time: '07:20', value: 110, phase: 'rest' },
    { time: '09:24', value: 90, phase: 'rest' },
    { time: '10:24', value: 104, phase: 'stress' },
    { time: '13:39', value: 100, phase: 'stress' },
    { time: '14:20', value: 120, phase: 'activity', label: 'Тренировка' },
    { time: '16:40', value: 67, phase: 'stress' },
  ],
};
export const pulsePeriods = [
  { id: 'day', label: 'День', days: 1 },
  { id: 'week', label: 'Неделя', days: 7 },
  { id: 'month', label: 'Месяц', days: 30 },
  { id: 'year', label: 'Год', days: 365 },
];
export const pulsePhases = [
  { id: 'rest', label: 'В покое' },
  { id: 'stress', label: 'Стресс' },
  { id: 'activity', label: 'Активность' },
  { id: 'coffee', label: 'Кофе' },
];
