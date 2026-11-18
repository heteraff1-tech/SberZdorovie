export const demoPulseValue = 99;
const demoDate = '2026-11-18';

export const demoPulseMeasurements = [
  ['03:35', 70, 'rest'],
  ['04:36', 104, 'coffee'],
  ['06:30', 92, 'rest'],
  ['07:20', 110, 'rest'],
  ['09:24', 90, 'rest'],
  ['10:24', 104, 'stress'],
  ['13:39', 100, 'stress'],
  ['14:20', 120, 'activity', 'Тренировка'],
  ['16:40', 67, 'stress'],
].map(([time, value, phase, label]) => ({
  recordedAt: new Date(`${demoDate}T${time}`).getTime(),
  value,
  phase,
  label,
  demo: true,
}));

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
