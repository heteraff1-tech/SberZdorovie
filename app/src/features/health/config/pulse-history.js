export const demoPulseValue = 99;
const demoDate = '2026-11-18';

export const demoPulseMeasurements = [
  ['03:35', 70, 'В покое'],
  ['04:36', 104, 'Кофе'],
  ['06:30', 92, 'В покое'],
  ['07:20', 110, 'В покое'],
  ['09:24', 90, 'В покое'],
  ['10:24', 104, 'Стресс'],
  ['13:39', 100, 'Стресс'],
  ['14:20', 120, 'Тренировка'],
  ['16:40', 67, 'Стресс'],
].map(([time, value, label]) => ({
  recordedAt: new Date(`${demoDate}T${time}`).getTime(),
  value,
  label,
  demo: true,
}));

export const pulsePeriods = [
  { id: 'day', label: 'День', days: 1 },
  { id: 'week', label: 'Неделя', days: 7 },
  { id: 'month', label: 'Месяц', days: 30 },
  { id: 'year', label: 'Год', days: 365 },
];
