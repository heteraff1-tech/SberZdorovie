import { onScopeDispose, ref } from 'vue';

const storageKey = 'daybeat.pulse-measurements.v1';
export const pulseInputMax = 999;

/** Проверяет формат числового поля и сохранённого значения. */
function isPulseValue(value) {
  return Number.isInteger(value) && value > 0 && value <= pulseInputMax;
}

/** Читает актуальные записи в хронологическом порядке. */
function readMeasurements() {
  const saved = window.localStorage.getItem(storageKey);
  let entries;
  try {
    entries = JSON.parse(saved);
  } catch (error) {
    if (error instanceof SyntaxError) return [];
    throw error;
  }
  if (!Array.isArray(entries)) return [];
  return entries
    .filter(
      (entry) =>
        isPulseValue(entry?.value) &&
        Number.isFinite(entry.recordedAt) &&
        Number.isFinite(new Date(entry.recordedAt).getTime()),
    )
    .sort((first, second) => first.recordedAt - second.recordedAt);
}

/** Хранит введённые замеры в браузере и синхронизирует вкладки. */
export function usePulseMeasurements() {
  const measurements = ref([]);

  function refresh() {
    try {
      measurements.value = readMeasurements();
    } catch {
      measurements.value = [];
    }
  }

  function handleStorage(event) {
    if (event.key === storageKey || event.key === null) refresh();
  }

  /** Сохраняет новый замер с текущим временем. Возвращает ошибку для формы. */
  function savePulse(value) {
    if (!isPulseValue(value)) return `Введите целое число от 1 до ${pulseInputMax}.`;

    try {
      const recordedAt = Date.now();
      const entries = readMeasurements().filter((entry) => entry.recordedAt !== recordedAt);
      const updated = [...entries, { value, recordedAt }].sort(
        (first, second) => first.recordedAt - second.recordedAt,
      );
      window.localStorage.setItem(storageKey, JSON.stringify(updated));
      measurements.value = updated;
      return '';
    } catch {
      return 'Не удалось сохранить замер в браузере.';
    }
  }

  refresh();
  window.addEventListener('storage', handleStorage);
  onScopeDispose(() => window.removeEventListener('storage', handleStorage));

  return { measurements, savePulse };
}
