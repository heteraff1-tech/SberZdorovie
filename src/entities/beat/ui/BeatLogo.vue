<script setup>
import { computed } from 'vue'
import { getSvg } from '@/shared/lib/asset'

const props = defineProps({
  phase: { type: String, required: true },
  fill: { type: Number, required: true },
})

const mask = computed(() => {
  const level = props.fill * 100
  const edge = Math.min(level, 100 - level, 3)
  return { '--fill-level': `${level}%`, '--fill-edge': `${edge}%` }
})
</script>

<template>
  <div class="mark" :data-phase="phase" aria-hidden="true">
    <img :src="getSvg('logo-muted')" width="100" height="87" alt="" />
    <img class="mark-color" :src="getSvg('logo-color')" width="100" height="87" alt="" :style="mask" />
  </div>
</template>

<style scoped>
.mark {
  position: absolute;
  top: 303.73px;
  left: 151.5px;
  width: 100px;
  height: 87px;
  pointer-events: none;
  opacity: 1;
  filter: blur(0);
  transform: translateY(0) scale(1);
  transition: transform var(--copy-time) var(--ease-reveal), opacity var(--copy-time) var(--ease-reveal),
    filter var(--copy-time) var(--ease-reveal);
}

.mark img { position: absolute; inset: 0; }

.mark-color {
  mask-image: linear-gradient(to top,
    #000 calc(var(--fill-level) - var(--fill-edge)),
    transparent calc(var(--fill-level) + var(--fill-edge)));
  transition: opacity var(--action-time) var(--ease-in-out);
}

.mark[data-phase="blank"] {
  opacity: 0;
  filter: blur(11px);
  transform: translateY(32.5px) scale(.2376);
}

.mark[data-phase="intro"] {
  transform: translateY(22.77px) scale(1);
  transition-duration: var(--intro-time);
}

.mark[data-phase="welcome"] { transform: translateY(-.23px) scale(.5); }
.mark[data-phase="connect"] .mark-color { opacity: 0; }
.mark[data-phase="pull"] .mark-color { transition: none; }
.mark[data-phase="done"] { transform: translateY(.78px) scale(1); }
</style>
