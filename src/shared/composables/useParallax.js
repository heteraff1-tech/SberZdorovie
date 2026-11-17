import { computed, reactive, watch } from 'vue';
import { useReducedMotion } from './useReducedMotion';

export function useParallax() {
  const position = reactive({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();
  const style = computed(() => ({ '--parallax-x': position.x, '--parallax-y': position.y }));

  function reset() {
    position.x = 0;
    position.y = 0;
  }

  function move(event) {
    if (event.pointerType === 'touch' || reducedMotion.value) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    position.x = (event.clientX - bounds.left) / bounds.width - 0.5;
    position.y = (event.clientY - bounds.top) / bounds.height - 0.5;
  }

  watch(reducedMotion, reset);
  return { style, move, reset };
}
