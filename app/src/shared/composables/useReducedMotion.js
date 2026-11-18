import { onScopeDispose, ref } from 'vue';

/** Отслеживает системное предпочтение уменьшенного движения. */
export function useReducedMotion() {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reducedMotion = ref(media.matches);
  const update = () => {
    reducedMotion.value = media.matches;
  };

  media.addEventListener('change', update);
  onScopeDispose(() => media.removeEventListener('change', update));

  return reducedMotion;
}
