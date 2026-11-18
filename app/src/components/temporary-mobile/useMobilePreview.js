import { computed, onMounted, onScopeDispose, ref } from 'vue';

/** Измеряет доступную область телефона и управляет только временным fullscreen-превью. */
export function useMobilePreview(viewport) {
  const width = 402;
  const scale = ref(1);
  const height = ref(874);
  const fullscreen = ref(Boolean(document.fullscreenElement));
  const message = ref('');
  const supported = Boolean(
    document.fullscreenEnabled && document.documentElement.requestFullscreen,
  );
  let observer;
  const surfaceStyle = computed(() => ({
    '--mobile-scale': scale.value,
    '--preview-screen-height': `${height.value}px`,
    '--mobile-scene-scale': Math.max(0.1, Math.min(1, (height.value - 436) / 389)),
  }));

  /** Сохраняет ширину макета; высота подстраивается под адресную строку и ориентацию. */
  function measure() {
    if (!viewport.value) return;
    const bounds = viewport.value.getBoundingClientRect();
    scale.value = bounds.width > 0 ? bounds.width / width : 1;
    height.value = bounds.height / scale.value;
  }

  /** Вход доступен только по нажатию: браузер сам управляет системными панелями. */
  async function enterFullscreen() {
    message.value = '';
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      message.value = 'Полный экран недоступен. Попробуйте открыть ссылку в Chrome.';
    }
  }

  /** Обновляет кнопку после выхода системной кнопкой «Назад». */
  function updateFullscreen() {
    fullscreen.value = Boolean(document.fullscreenElement);
    measure();
  }

  onMounted(() => {
    measure();
    observer = new ResizeObserver(measure);
    observer.observe(viewport.value);
    document.addEventListener('fullscreenchange', updateFullscreen);
  });
  onScopeDispose(() => {
    observer?.disconnect();
    document.removeEventListener('fullscreenchange', updateFullscreen);
  });

  return { surfaceStyle, fullscreen, supported, message, enterFullscreen };
}
