import { onMounted, onScopeDispose, ref } from 'vue';

/** Подбирает масштаб фиксированного макета под доступную ширину контейнера. */
export function useElementScale(element, widthToken) {
  const scale = ref(1);
  let observer;

  /** Пересчитывает масштаб после изменения размеров превью. */
  function update() {
    if (!element.value) return;
    const width = Number.parseFloat(getComputedStyle(element.value).getPropertyValue(widthToken));
    scale.value = element.value.getBoundingClientRect().width / width;
  }

  onMounted(() => {
    update();
    if ('ResizeObserver' in window) {
      observer = new ResizeObserver(update);
      observer.observe(element.value);
    } else {
      window.addEventListener('resize', update);
    }
  });
  onScopeDispose(() => {
    observer?.disconnect();
    window.removeEventListener('resize', update);
  });

  return scale;
}
