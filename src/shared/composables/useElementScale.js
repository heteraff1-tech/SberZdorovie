import { onMounted, onScopeDispose, ref } from 'vue';

export function useElementScale(element, widthToken) {
  const scale = ref(1);
  let observer;

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
