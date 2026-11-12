<script setup>
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { getSvg } from '@/shared/lib/asset'
import { PulseShape } from '../model/PulseShape'

const props = defineProps({
  phase: { type: String, required: true },
  pull: { type: Number, required: true },
  merge: { type: Number, required: true },
})

const host = ref(null)
const ready = ref(false)
const request = new AbortController()
let shape

onMounted(async () => {
  try {
    const response = await fetch(getSvg('raspberry-pulse'), { signal: request.signal })
    if (!response.ok) throw new Error(`SVG: ${response.status}`)
    const document = new DOMParser().parseFromString(await response.text(), 'image/svg+xml')
    const svg = document.documentElement
    if (!host.value || svg.localName !== 'svg') return

    // Один SVG остаётся в DOM на всех этапах жеста.
    host.value.append(svg)
    shape = new PulseShape(svg)
    ready.value = true
  } catch (error) {
    if (error.name !== 'AbortError') console.error(error)
  }
})

onUnmounted(() => request.abort())

watchEffect(() => {
  if (ready.value) shape.draw(props.pull, props.merge)
})
</script>

<template>
  <div
    ref="host"
    class="berry"
    :data-phase="phase"
    :data-ready="ready"
    :style="{ '--arrow-opacity': Math.max(0, 1 - pull * 2.8 - merge * 5), '--orbit-weight': (1 - pull) ** 2 * (1 - merge) }"
    aria-hidden="true"
  ></div>
</template>

<style>
.berry {
  position: absolute;
  left: 139px;
  top: 348px;
  width: 124px;
  height: 360px;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--action-time) var(--ease-out);
}

.berry[data-ready="true"]:is([data-phase="connect"], [data-phase="pull"], [data-phase="done"]) { opacity: 1; }

.berry > svg { display: block; overflow: visible; }
.berry #pulse-body {
  filter: none;
  transition: filter var(--action-time) var(--ease-in-out);
}
.berry[data-phase="connect"] #pulse-body { filter: grayscale(1) brightness(1.42); }
.berry:is([data-phase="blank"], [data-phase="intro"], [data-phase="welcome"]) > svg {
  transform-origin: 62px 300px;
  transform: translateY(18px) scale(.7);
}
.berry > svg { transition: transform var(--action-time) var(--ease-out); }
.berry[data-phase="connect"] > svg { transform: translateY(-2px); }

.berry #pulse-arrows { opacity: 0; transition: opacity 160ms ease-out; }
.berry[data-phase="pull"] #pulse-arrows { opacity: var(--arrow-opacity); }
.berry[data-phase="pull"] #pulse-arrows path {
  animation: arrow-light var(--arrow-time) ease-in-out infinite;
  animation-delay: calc(var(--arrow-index) * var(--arrow-step));
}

.berry .pulse-stream {
  stroke: #ffd1df;
  stroke-width: .85;
  stroke-dasharray: 8 92;
}

.berry .pulse-light {
  fill: none;
  stroke: #fc8aaa;
  stroke-width: .66;
  stroke-linecap: round;
  stroke-dasharray: 17 83;
  opacity: 0;
}
.berry[data-phase="pull"] .pulse-light {
  opacity: calc(.33 * var(--orbit-weight));
  animation: ring-light var(--orbit-time) linear infinite;
}
.berry[data-phase="pull"] #pulse-inner .pulse-light { animation-direction: reverse; }
.berry[data-phase="pull"] :is(#pulse-outer, #pulse-inner) > g {
  transform-box: fill-box;
  transform-origin: center;
  animation: ring-turn var(--orbit-time) var(--ease-in-out) infinite;
}
.berry[data-phase="pull"] #pulse-inner > g { animation-direction: reverse; }

@keyframes ring-light { to { stroke-dashoffset: -100; } }
@keyframes ring-turn {
  0%, 100% { transform: rotate(calc(-13deg * var(--orbit-weight))) scaleX(1); }
  50% { transform: rotate(calc(13deg * var(--orbit-weight))) scaleX(calc(1 - .044 * var(--orbit-weight))); }
}
@keyframes arrow-light {
  0%, 44%, 100% { stroke-opacity: .35; }
  16% { stroke-opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .berry, .berry > svg, .berry #pulse-body { transition-duration: 1ms; }
  .berry[data-phase="pull"] #pulse-arrows path,
  .berry[data-phase="pull"] .pulse-light,
  .berry[data-phase="pull"] :is(#pulse-outer, #pulse-inner) > g { animation: none; }
}
</style>
