import { computed, onMounted, onScopeDispose, ref } from 'vue';
import { readMotionDuration } from '@/shared/lib/motion';

/** Хранит открытый экран, состояние шторы и однократный запуск графиков. */
export function useHealthScreen(initialView = 'home', screen) {
  const ready = ref(false);
  const view = ref(initialView);
  const assistant = computed(() => view.value === 'assistant');
  const chartsStarted = ref(false);
  const pulseOpen = computed(() => view.value === 'pulse');
  const sheetOpen = computed(() => ready.value && !assistant.value);
  let frame;
  let chartTimer;

  /** Запускает графики после раскрытия шторы, не повторяя готовую анимацию. */
  function startCharts() {
    if (chartsStarted.value || chartTimer !== undefined) return;
    chartTimer = setTimeout(
      () => {
        chartsStarted.value = true;
        chartTimer = undefined;
      },
      readMotionDuration('chart-delay', screen.value),
    );
  }

  /** Убирает панель показателей и открывает помощника. */
  function openAssistant() {
    clearTimeout(chartTimer);
    chartTimer = undefined;
    view.value = 'assistant';
  }

  /** Возвращает показатели и возобновляет отложенный старт графиков. */
  function closeAssistant() {
    view.value = 'home';
    startCharts();
  }

  /** Раскрывает текущую штору до полного экрана обзора пульса. */
  function openPulse() {
    view.value = 'pulse';
  }

  /** Возвращает обычную высоту шторы, сохраняя состояние графиков. */
  function closePulse() {
    view.value = 'home';
    startCharts();
  }

  onMounted(() => {
    frame = requestAnimationFrame(() => {
      ready.value = true;
      if (!assistant.value) startCharts();
    });
  });
  onScopeDispose(() => {
    cancelAnimationFrame(frame);
    clearTimeout(chartTimer);
  });

  return {
    ready,
    assistant,
    chartsStarted,
    sheetOpen,
    pulseOpen,
    openAssistant,
    closeAssistant,
    openPulse,
    closePulse,
  };
}
