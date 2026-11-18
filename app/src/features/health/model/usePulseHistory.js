import { computed, ref, toValue } from 'vue';
import { pulsePeriods } from '../config/pulse-history';

// Переводит HH:MM в число минут от начала дня.
const minutes = (time) => time.split(':').reduce((hours, value) => hours * 60 + Number(value), 0);

/** Готовит геометрию истории, выбранный замер и подписи периода. */
export function usePulseHistory(source) {
  const period = ref('day');
  const selectedTime = ref('14:20');
  const data = computed(() => toValue(source));
  const days = computed(() => pulsePeriods.find((item) => item.id === period.value).days);
  // Горизонтальная координата учитывает выбранный период.
  const getX = (time) => 30 + ((days.value - 1 + minutes(time) / 1440) / days.value) * 288;
  // Диапазон 40–120 уд/мин переводится в вертикальную шкалу графика.
  const getY = (value) => 71 - ((value - 40) / 80) * 40;
  const points = computed(() =>
    data.value.measurements.map((point) => ({
      ...point,
      x: getX(point.time),
      y: getY(point.value),
    })),
  );
  const selected = computed(
    () => points.value.find((point) => point.time === selectedTime.value) || points.value[0],
  );
  const ticks = computed(() => {
    const end = Date.parse(`${data.value.date}T00:00:00Z`) + 86400000;
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'UTC',
      ...(period.value === 'year' ? { month: 'short' } : { day: 'numeric', month: 'short' }),
    });
    const labels =
      period.value === 'day'
        ? ['00:00', '06:00', '12:00', '18:00', '24:00']
        : Array.from({ length: 5 }, (_, i) =>
            formatter.format(end - days.value * 86400000 * (1 - i / 4)),
          );
    return labels.map((label, i) => ({ label, x: 30 + i * 72 }));
  });
  return { period, selectedTime, points, selected, ticks };
}
