<template>
  <MetricCard title="Пульс" compact action-label="Открыть пульс" @select="$emit('select', $event)">
    <div class="pulse-card" :class="{ 'pulse-card--animated': animate }">
      <MetricValue :value="value" unit="уд/мин" status="Повышенный" tone="elevated" />
      <div class="pulse-card__wave" role="img" aria-label="График пульса">
        <img class="pulse-card__background" :src="assets.pulseBackground" alt="" />
        <img class="pulse-card__foreground" :src="assets.pulseForeground" alt="" />
      </div>
    </div>
  </MetricCard>
</template>

<script setup>
import MetricCard from './MetricCard.vue';
import MetricValue from './MetricValue.vue';
import { assets } from '@/shared/config/assets';
defineProps({ value: { type: Number, required: true }, animate: { type: Boolean, default: true } });
defineEmits(['select']);
</script>

<style scoped lang="scss">
.pulse-card {
  --motion-pulse: 1400ms;
  --motion-pulse-delay: 150ms;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;

  &__wave {
    position: relative;
    height: 36.58px;
    clip-path: inset(0 100% 0 0);
  }
  &__background {
    position: absolute;
    left: -0.2px;
    top: 8.77px;
  }
  &__foreground {
    position: absolute;
    left: -0.22px;
    top: -0.2px;
  }
  &--animated &__wave {
    animation: draw-pulse var(--motion-pulse) var(--ease-in-out) var(--motion-pulse-delay) both;
  }
}
@keyframes draw-pulse {
  to {
    clip-path: inset(0 -1px 0 -1px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pulse-card--animated .pulse-card__wave {
    clip-path: none;
    animation: none;
  }

  .pulse-card {
    --motion-pulse: 1ms;
    --motion-pulse-delay: 1ms;
  }
}
</style>
