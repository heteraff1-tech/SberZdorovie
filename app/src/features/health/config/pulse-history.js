// Presentation measurements and daily aggregate from the Figma pulse overview.
// Dates are fixed demo data; no device or medical service is queried.
export const pulseHistory = {
  date: '2026-11-18',
  range: [43, 120],
  measurements: [
    { time: '03:30', value: 70, phase: 'rest' },
    { time: '04:30', value: 104, phase: 'rest' },
    { time: '06:30', value: 90, phase: 'stress' },
    { time: '07:20', value: 112, phase: 'rest' },
    { time: '09:20', value: 90, phase: 'rest' },
    { time: '10:20', value: 105, phase: 'stress' },
    { time: '13:40', value: 102, phase: 'stress' },
    { time: '14:20', value: 120, phase: 'activity', label: 'Тренировка' },
    { time: '16:40', value: 67, phase: 'rest' },
  ],
  phases: [
    { from: '02:46', to: '04:22', phase: 'coffee' },
    { from: '06:30', to: '08:06', phase: 'rest' },
    { from: '10:06', to: '11:39', phase: 'stress' },
    { from: '13:36', to: '15:12', phase: 'activity' },
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
