import { ref } from 'vue';

// A reusable pointer gesture. It does not know which feature owns the panel.
/** Отдаёт обработчики свайпа вниз; действие закрытия передаётся снаружи. */
export function useSwipeDismiss(open, onDismiss) {
  const drag = ref(0);
  const dragging = ref(false);
  let pointer;
  let origin;
  let started;
  let moved = false;

  /** Захватывает указатель и запоминает начало жеста. */
  function start(event) {
    if (!open.value || (event.pointerType === 'mouse' && event.button !== 0)) return;
    origin = event.clientY;
    started = event.timeStamp;
    pointer = event.pointerId;
    moved = false;
    dragging.value = true;
    event.currentTarget.setPointerCapture(pointer);
  }

  /** Переводит смещение указателя в координаты исходного макета. */
  function move(event) {
    if (!dragging.value || event.pointerId !== pointer) return;
    const surface = event.currentTarget;
    const scale = surface.getBoundingClientRect().width / surface.offsetWidth;
    drag.value = Math.max(0, (event.clientY - origin) / scale);
    if (Math.abs(event.clientY - origin) > 6 * scale) moved = true;
  }

  /** Закрывает панель при длинном или быстром свайпе, иначе возвращает её. */
  function release(event, cancelled = false) {
    if (!dragging.value || event.pointerId !== pointer) return;
    const speed = drag.value / Math.max(1, event.timeStamp - started);
    const dismiss = !cancelled && (drag.value > 110 || (drag.value > 28 && speed > 0.6));
    dragging.value = false;
    drag.value = 0;
    pointer = undefined;
    if (dismiss) onDismiss();
  }

  /** Отличает обычное нажатие от служебного click после перетаскивания. */
  function click(event) {
    // Pointer capture also sends a click after a drag; keyboard clicks have detail 0.
    if (event.detail > 0 && moved) return;
    onDismiss();
  }

  return { drag, dragging, start, move, release, click };
}
