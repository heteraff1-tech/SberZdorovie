<script setup>
import { computed } from 'vue'
import { getSvg } from '@/shared/lib/asset'

const props = defineProps({
  phase: { type: String, required: true },
  fill: { type: Number, required: true },
  contact: { type: Number, required: true },
  filling: Boolean,
})

const mask = computed(() => {
  const level = props.fill * 100
  const edge = Math.min(level, 100 - level, 3)
  return { '--fill-level': `${level}%`, '--fill-edge': `${edge}%`, '--heart-contact': props.contact }
})
</script>

<template>
  <div class="mark" :data-phase="phase" :style="mask" aria-hidden="true">
    <div class="mark-arc">
      <img :src="getSvg('logo-muted')" width="100" height="87" alt="" />
      <img class="mark-color mark-fill" :src="getSvg('logo-color')" width="100" height="87" alt="" />
    </div>
    <div class="heart-glow">
      <div class="mark-heart" :data-contact="contact > .15" :data-filling="filling">
        <img :src="getSvg('logo-muted')" width="100" height="87" alt="" />
        <img class="mark-fill" :src="getSvg('logo-color')" width="100" height="87" alt="" />
      </div>
    </div>
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

.mark img, .mark-arc, .mark-heart, .heart-glow { position: absolute; inset: 0; }

/* Отделяем сердце от дуги, сохраняя исходные координаты маски заливки. */
.mark-arc { clip-path: path(evenodd, "M0 0H100V87H0Z M26 28H76V74H26Z"); }

.mark-heart {
  clip-path: inset(28px 24px 13px 26px);
  transform-origin: 51px 50px;
}

.heart-glow {
  filter: drop-shadow(0 0 12px rgb(195 0 49 / calc(.5 * var(--heart-contact))))
    brightness(calc(1 + .25 * var(--heart-contact)));
  transition: filter 120ms ease-out;
}

.mark-heart[data-contact="true"] { animation: heart-tap 360ms var(--ease-out); }
.mark-heart[data-filling="true"] { animation: heart-shake 145ms ease-in-out infinite; }

.mark-fill {
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
.mark[data-phase="connect"] .mark-fill { opacity: 0; }
.mark[data-phase="pull"] .mark-fill { transition: none; }
.mark[data-phase="done"] { transform: translateY(.78px) scale(1); }
@keyframes heart-tap {
  0%, 100% { transform: scale(1); }
  31% { transform: translateY(-2px) scale(1.14, .94); }
  63% { transform: translateY(1px) scale(.97, 1.05); }
}

@keyframes heart-shake {
  0%, 100% { transform: translate(-1.5px, 0) rotate(-3deg); }
  27% { transform: translate(1.7px, -1px) rotate(3deg) scale(1.06); }
  54% { transform: translate(-1.1px, 1px) rotate(-2deg) scale(1.02); }
  79% { transform: translate(1.3px, -.4px) rotate(2deg) scale(1.04); }
}

@media (prefers-reduced-motion: reduce) {
  .mark-heart:is([data-contact="true"], [data-filling="true"]) { animation: none; }
}
</style>
