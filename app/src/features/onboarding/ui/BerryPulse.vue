<template>
  <div
    ref="host"
    class="berry"
    :data-phase="phase"
    :data-ready="ready"
    :style="pulseStyle"
    aria-hidden="true"
  ></div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { getSvg } from '@/shared/lib/asset';
import { easeBetween } from '@/shared/lib/easing';
import { PulseShape } from '../lib/PulseShape';

const props = defineProps({
  phase: { type: String, required: true },
  pull: { type: Number, required: true },
  tension: { type: Number, required: true },
  merge: { type: Number, required: true },
});

const emit = defineEmits(['contact']);
const host = ref(null);
const ready = ref(false);
const request = new AbortController();
const pulseStyle = computed(() => {
  const { pull, merge, tension } = props;
  return {
    '--arrow-opacity': Math.max(0, 1 - pull * 5 - Math.max(0, tension) * 4 - merge * 5),
    '--arrow-fade': pull || merge || tension ? '0ms' : 'var(--motion-arrow-fade)',
    '--orbit-weight': (1 - pull) ** 2 * (1 - merge) * (1 - Math.abs(tension)),
  };
});
let shape;
let threadTips = [];

onMounted(async () => {
  try {
    const response = await fetch(getSvg('raspberry-pulse'), { signal: request.signal });
    if (!response.ok) throw new Error(`SVG: ${response.status}`);
    const document = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
    const svg = document.documentElement;
    if (!host.value || svg.localName !== 'svg') return;

    // Один SVG остаётся в DOM на всех этапах жеста.
    host.value.append(svg);
    shape = new PulseShape(svg);
    threadTips = svg.querySelectorAll('g[id="pulse-strands"] > path:not(.pulse-stream)');
    ready.value = true;
  } catch (error) {
    if (error.name !== 'AbortError') console.error(error);
  }
});

onUnmounted(() => request.abort());

watchEffect(() => {
  if (!ready.value) return;
  shape.draw(props.pull, props.merge);
  emit(
    'contact',
    props.phase === 'pull' && props.pull > 0 && props.merge === 0 ? readContact() : 0,
  );
});

/** Оценивает близость нитей к сердцу для локального свечения логотипа. */
function readContact() {
  let nearest = 1.16;
  for (const thread of threadTips) {
    const start = thread.getAttribute('d')?.match(/^M\s*([-\d.]+)[ ,]+([-\d.]+)/i);
    if (!start) continue;

    // Граница сердца в системе координат SVG пульса.
    const distance = Math.hypot((Number(start[1]) - 63.5) / 22, (Number(start[2]) - 353) / 21);
    if (distance < 0.86) return 1;
    nearest = Math.min(nearest, distance);
  }
  return 1 - easeBetween(0.86, 1.16, nearest);
}
</script>

<style scoped lang="scss">
.berry {
  position: absolute;
  left: 139px;
  top: 348px;
  width: 124px;
  height: 360px;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--motion-action) var(--ease-out);
}

.berry[data-ready='true']:is([data-phase='connect'], [data-phase='pull'], [data-phase='done']) {
  opacity: 1;
}

.berry :deep(svg) {
  display: block;
  overflow: visible;
}
.berry :deep(#pulse-body) {
  filter: none;
  transition: filter var(--motion-action) var(--ease-in-out);
}
.berry[data-phase='connect'] :deep(#pulse-body) {
  filter: grayscale(1) brightness(1.42);
}
.berry:is([data-phase='blank'], [data-phase='intro'], [data-phase='welcome']) :deep(svg) {
  transform-origin: 62px 300px;
  transform: translateY(18px) scale(0.7);
}
.berry :deep(svg) {
  transition: transform var(--motion-action) var(--ease-out);
}
.berry[data-phase='connect'] :deep(svg) {
  transform: translateY(-2px);
}

.berry :deep(#pulse-arrows) {
  opacity: 0;
  transition: opacity var(--arrow-fade) ease-out;
}
.berry[data-phase='pull'] :deep(#pulse-arrows) {
  opacity: var(--arrow-opacity);
}
.berry[data-phase='pull'] :deep(#pulse-arrows path) {
  animation: arrow-light var(--motion-arrows) ease-in-out infinite;
  animation-delay: calc(var(--arrow-index) * var(--motion-arrow-step));
}

.berry :deep(.pulse-stream) {
  stroke: #ffd1df;
  stroke-width: 0.85;
  stroke-dasharray: 8 92;
}

.berry :deep(.pulse-rear) {
  fill: none;
  stroke: url(#pulse-rear-light);
  stroke-width: 0.78;
  stroke-linecap: round;
}

.berry :deep(.pulse-rear-glow) {
  stroke-width: 2.5;
}

.berry :deep(.pulse-rim) {
  stroke: url(#pulse-rim-light);
}

.berry :deep(.pulse-light) {
  fill: none;
  stroke: #fc8aaa;
  stroke-width: 0.66;
  stroke-linecap: round;
  stroke-dasharray: 17 83;
  opacity: 0;
}
.berry[data-phase='pull'] :deep(.pulse-light) {
  opacity: calc(0.33 * var(--orbit-weight) + 0.25 * var(--rim-depth, 0));
  animation: ring-light var(--motion-orbit) linear infinite;
}
.berry[data-phase='pull'] :deep(#pulse-inner .pulse-light) {
  animation-direction: reverse;
}
.berry[data-phase='pull'] :deep(:is(#pulse-outer, #pulse-inner) > g) {
  transform-box: fill-box;
  transform-origin: center;
  animation: ring-turn var(--motion-orbit) var(--ease-in-out) infinite;
}
.berry[data-phase='pull'] :deep(#pulse-inner > g) {
  animation-direction: reverse;
}

@keyframes ring-light {
  to {
    stroke-dashoffset: -100;
  }
}
@keyframes ring-turn {
  0%,
  100% {
    transform: rotate(calc(-13deg * var(--orbit-weight))) scaleX(1);
  }
  50% {
    transform: rotate(calc(13deg * var(--orbit-weight)))
      scaleX(calc(1 - 0.044 * var(--orbit-weight)));
  }
}
@keyframes arrow-light {
  0%,
  44%,
  100% {
    stroke-opacity: 0.35;
  }
  16% {
    stroke-opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .berry[data-phase='pull'] :deep(#pulse-arrows path),
  .berry[data-phase='pull'] :deep(.pulse-light),
  .berry[data-phase='pull'] :deep(:is(#pulse-outer, #pulse-inner) > g) {
    animation: none;
  }
}
</style>
