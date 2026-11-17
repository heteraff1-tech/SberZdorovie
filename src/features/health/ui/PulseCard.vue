<template>
  <UiMetricCard title="Пульс" compact>
    <div class="pulse-card" :class="{ 'pulse-card--animated': animate }">
      <UiMetricValue :value="value" unit="удара" />
      <div class="pulse-card__wave" role="img" aria-label="График пульса">
        <img class="pulse-card__background" :src="assets.pulseBackground" alt="" />
        <img class="pulse-card__foreground" :src="assets.pulseForeground" alt="" />
      </div>
    </div>
  </UiMetricCard>
</template>

<script setup>
import { UiMetricCard, UiMetricValue } from '@/shared/ui';
import { assets } from '@/shared/config/assets';
defineProps({ value: { type: Number, required: true }, animate: { type: Boolean, default: true } });
</script>

<style scoped lang="scss" src="@/assets/styles/features/health/pulse-card.scss"></style>
