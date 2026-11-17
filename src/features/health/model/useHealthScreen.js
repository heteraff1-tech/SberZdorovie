import { computed, onMounted, onScopeDispose, ref } from 'vue';
import { readMotionDuration } from '@/shared/lib/motion';

export function useHealthScreen(initialView = 'home') {
  const ready = ref(false);
  const view = ref(initialView);
  const assistant = computed(() => view.value === 'assistant');
  const chartsStarted = ref(false);
  const pulseOpen = computed(() => view.value === 'pulse');
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
    view.value = 'assistant';
  }

  function closeAssistant() {
    view.value = 'home';
    startCharts();
  }

  function openPulse() {
    view.value = 'pulse';
  }

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
