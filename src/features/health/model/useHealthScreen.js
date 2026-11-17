import { computed, onMounted, onScopeDispose, ref } from 'vue';
import { readMotionDuration } from '@/shared/lib/motion';

export function useHealthScreen(initialAssistant = false) {
  const ready = ref(false);
  const assistant = ref(initialAssistant);
  const chartsStarted = ref(false);
  const sheetOpen = computed(() => ready.value && !assistant.value);
  let frame;
  let chartTimer;

  function startCharts() {
    if (chartsStarted.value || chartTimer !== undefined) return;
    chartTimer = setTimeout(() => {
      chartsStarted.value = true;
      chartTimer = undefined;
    }, readMotionDuration('chart-delay'));
  }

  function openAssistant() {
    clearTimeout(chartTimer);
    chartTimer = undefined;
    assistant.value = true;
  }

  function closeAssistant() {
    assistant.value = false;
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

  return { ready, assistant, chartsStarted, sheetOpen, openAssistant, closeAssistant };
}
