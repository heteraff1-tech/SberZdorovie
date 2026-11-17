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
  shape.draw(props.pull, props.merge, props.tension);
  emit(
    'contact',
    props.phase === 'pull' && props.pull > 0 && props.merge === 0 ? readContact() : 0,
  );
});

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

<style scoped lang="scss" src="@/assets/styles/features/onboarding/berry-pulse.scss"></style>
