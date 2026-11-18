import { computed, ref, toValue } from 'vue';
import { pulsePeriods } from '../config/pulse-history';

const timeFormat = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
const dateTimeFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

/** Фильтрует записи по местным календарным дням и рассчитывает геометрию графика. */
export function usePulseHistory(source) {
  const period = ref('day');
  const selectedAt = ref(null);
  const interval = computed(() => {
    const measurements = toValue(source);
    const days = pulsePeriods.find((item) => item.id === period.value).days;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    start.setDate(start.getDate() - days + 1);
    return { measurements, start: start.getTime(), end: end.getTime() };
  });
  const visible = computed(() => {
    const { measurements, start, end } = interval.value;
    return measurements.filter(({ recordedAt }) => recordedAt >= start && recordedAt < end);
  });
  const range = computed(() => {
    if (!visible.value.length) return null;
    let min = Infinity;
    let max = -Infinity;
    for (const { value } of visible.value) {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
    return { min, max };
  });
  const axis = computed(() => {
    const min = Math.min(40, Math.floor((range.value?.min ?? 40) / 20) * 20);
    const max = Math.max(120, Math.ceil((range.value?.max ?? 120) / 20) * 20);
    return [min, (min + max) / 2, max].map((value) => ({
      value,
      y: 47 - ((value - min) / (max - min)) * 40,
    }));
  });
  const points = computed(() => {
    const { start, end } = interval.value;
    const [{ value: min }, , { value: max }] = axis.value;
    const formatter = period.value === 'day' ? timeFormat : dateTimeFormat;
    return visible.value.map((point) => ({
      ...point,
      time: formatter.format(point.recordedAt),
      x: 30 + ((point.recordedAt - start) / (end - start)) * 288,
      y: 47 - ((point.value - min) / (max - min)) * 40,
    }));
  });
  const selected = computed(
    () =>
      points.value.find((point) => point.recordedAt === selectedAt.value) ?? points.value.at(-1),
  );
  const ticks = computed(() => {
    const { start, end } = interval.value;
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      ...(period.value === 'year' ? { month: 'short' } : { day: 'numeric', month: 'short' }),
    });
    return Array.from({ length: 5 }, (_, index) => {
      const time = start + ((end - start) * index) / 4;
      const label =
        period.value === 'day'
          ? index === 4
            ? '24:00'
            : timeFormat.format(time)
          : formatter.format(Math.min(time, end - 1));
      return { label, x: 30 + index * 72 };
    });
  });
  return { period, selectedAt, points, selected, ticks, range, axis };
}
