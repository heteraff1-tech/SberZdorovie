<script setup>
import { getSvg } from '@/shared/lib/asset'

defineProps({
  phase: { type: String, required: true },
  color: { type: Number, required: true },
})
</script>

<template>
  <div class="mark" :data-phase="phase" aria-hidden="true">
    <img :src="getSvg('logo-muted')" width="100" height="87" alt="" />
    <img :src="getSvg('logo-color')" width="100" height="87" alt="" :style="{ opacity: color }" />
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
  transform-origin: center;
  transition: transform var(--copy-time) var(--ease-out), opacity var(--copy-time) var(--ease-out);
}

.mark img { position: absolute; inset: 0; transition: opacity var(--action-time) var(--ease-in-out); }
.mark[data-phase="blank"] { opacity: 0; transform: translateY(32.5px) scale(.2376); }
.mark[data-phase="intro"] { animation: mark-in var(--intro-time) var(--ease-out) both; transform: translateY(22.77px); }
.mark[data-phase="welcome"] { transform: translateY(-.23px) scale(.5); }
.mark[data-phase="pull"] img { transition: none; }
.mark[data-phase="done"] { transform: translateY(.78px); }

@keyframes mark-in {
  0% { opacity: 0; transform: translateY(32.5px) scale(.2376); filter: blur(2px); }
  47% { opacity: .96; transform: translateY(32.97px) scale(.6653); filter: blur(.6px); }
  100% { opacity: 1; transform: translateY(22.77px); filter: blur(0); }
}

@media (prefers-reduced-motion: reduce) {
  .mark, .mark img { transition-duration: 1ms; }
  .mark[data-phase="intro"] { animation-duration: 1ms; }
}
</style>
