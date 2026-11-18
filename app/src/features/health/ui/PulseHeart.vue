<template>
  <div
    class="pulse-heart"
    role="img"
    :aria-label="`Пульс ${value} ударов в минуту`"
    :style="{ '--pulse-wave-mask': `url('${waveUrl}')` }"
  >
    <img class="pulse-heart__heart" :src="assets.pulseHeart" width="402" height="150" alt="" />
    <img class="pulse-heart__wave" :src="assets.pulseWave" width="402" height="150" alt="" />
    <span class="pulse-heart__light" aria-hidden="true"></span>
    <strong class="pulse-heart__value" aria-hidden="true">{{ value }}</strong>
    <span class="pulse-heart__unit" aria-hidden="true">уд/мин</span>
  </div>
</template>

<script setup>
import { assets } from '@/shared/config/assets';
defineProps({ value: { type: Number, required: true } });
const waveUrl = new URL(assets.pulseWave, document.baseURI).href;
</script>

<style scoped lang="scss">
.pulse-heart {
  --motion-heartbeat: 2000ms;

  position: relative;
  width: 100%;
  height: 150px;
  isolation: isolate;

  &__heart,
  &__wave,
  &__light {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  &__heart {
    transform-origin: 50% 50%;
    animation: heartbeat var(--motion-heartbeat) linear infinite;
  }
  &__light {
    -webkit-mask: var(--pulse-wave-mask) center / 100% 100% no-repeat;
    mask: var(--pulse-wave-mask) center / 100% 100% no-repeat;
    background: linear-gradient(
        90deg,
        transparent,
        var(--color-bg-page) 45%,
        var(--color-bg-page) 55%,
        transparent
      )
      no-repeat;
    background-size: 44px 100%;
    filter: drop-shadow(0 0 3px var(--color-bg-page));
    animation: pulse-light var(--motion-heartbeat) linear infinite;
  }
  &__value {
    font: 600 var(--display-metric-size) / var(--display-metric-line) var(--font-display);
    letter-spacing: -1.6px;
    position: absolute;
    top: 37px;
    left: 0;
    width: 100%;
    text-align: center;
    color: var(--color-bg-page);
  }
  &__unit {
    font: 400 var(--text-small-size) / var(--text-small-line) var(--font-text);
    position: absolute;
    top: 81px;
    left: 0;
    width: 100%;
    text-align: center;
    color: var(--color-bg-page);
  }
}

// The light reaches the centre at 45% of the same two-second clock.
@keyframes pulse-light {
  0% {
    background-position: -44px 0;
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  90%,
  100% {
    background-position: 402px 0;
    opacity: 0;
  }
}
@keyframes heartbeat {
  0%,
  42%,
  59%,
  100% {
    transform: scale(1);
  }
  46% {
    transform: scale(1.045);
  }
  50% {
    transform: scale(0.99);
  }
  54% {
    transform: scale(1.015);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pulse-heart__heart,
  .pulse-heart__light {
    animation: none;
  }
  .pulse-heart__light {
    display: none;
  }

  .pulse-heart {
    --motion-heartbeat: 1ms;
  }
}
</style>
