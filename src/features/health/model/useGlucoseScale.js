import { computed } from 'vue';

const format = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function useGlucoseScale(data) {
  const formattedValue = computed(() => format.format(data().value));
  const fill = computed(() => (data().scaleMax > 0 ? data().value / data().scaleMax : 0));
  return { formattedValue, fill };
}
