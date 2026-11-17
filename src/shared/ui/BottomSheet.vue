<script setup>
import { onBeforeUnmount, ref } from 'vue'

const props = defineProps({ open: Boolean, label: { type: String, default: 'Панель' }, dismissLabel: { type: String, default: 'Свернуть панель' } })
const emit = defineEmits(['dismiss'])
const drag = ref(0)
const dragging = ref(false)
let origin = 0
let started = 0
let pointer
let moved = false

function start(event) {
  if (!props.open || (event.pointerType === 'mouse' && event.button !== 0)) return
  origin = event.clientY
  started = performance.now()
  pointer = event.pointerId
  moved = false
  dragging.value = true
  event.currentTarget.setPointerCapture(pointer)
}
function move(event) {
  if (!dragging.value || event.pointerId !== pointer) return
  const scale = event.currentTarget.getBoundingClientRect().width / event.currentTarget.offsetWidth
  drag.value = Math.max(0, (event.clientY - origin) / scale)
  if (Math.abs(event.clientY - origin) > 6 * scale) moved = true
}
function release(event, cancelled = false) {
  if (!dragging.value || event.pointerId !== pointer) return
  const speed = drag.value / Math.max(1, performance.now() - started)
  const dismiss = !cancelled && (drag.value > 110 || (drag.value > 28 && speed > .6))
  dragging.value = false
  drag.value = 0
  pointer = undefined
  if (dismiss) emit('dismiss')
}
function click(event) {
  // A captured pointer can synthesize a click even after a drag. Keyboard clicks have detail 0.
  if (event.detail > 0 && moved) return
  emit('dismiss')
}
onBeforeUnmount(() => { pointer = undefined })
</script>

<template>
  <section class="bottom-sheet" :class="{ 'is-open': open, 'is-dragging': dragging }"
    :style="{ '--sheet-drag': `${drag}px` }" :inert="!open" :aria-label="label">
    <button class="sheet-handle" type="button" :aria-label="dismissLabel"
      @click="click" @keydown.down.prevent="emit('dismiss')"
      @pointerdown="start" @pointermove="move" @pointerup="release"
      @pointercancel="release($event, true)" @lostpointercapture="release($event, true)">
      <span aria-hidden="true"></span>
    </button>
    <div class="sheet-content"><slot /></div>
  </section>
</template>

<style scoped>
.bottom-sheet { position: absolute; z-index: 3; inset: 232px 0 auto; height: 642px; border-radius: 32px 32px 0 0; background: white; box-shadow: 0 -4px 4px rgb(34 138 113 / 15%); transform: translateY(660px); transition: transform var(--motion-sheet) var(--ease-out); }
.bottom-sheet.is-open { transform: translateY(var(--sheet-drag)); }
.bottom-sheet.is-dragging { transition: none; }
.sheet-handle { position: absolute; top: 0; width: 100%; height: 24px; display: grid; place-items: start center; padding: 4px 0 0; border: 0; background: transparent; cursor: grab; touch-action: none; }
.sheet-handle:active { cursor: grabbing; }
.sheet-handle span { width: 34px; height: 4px; background: rgb(0 0 0 / 30%); border-radius: 3px; }
.sheet-content { padding: 24px 24px 35px; height: 100%; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; }
.sheet-content::-webkit-scrollbar { display: none; }
@media (prefers-reduced-motion: reduce) { .bottom-sheet { transition-duration: 1ms; } }
</style>
