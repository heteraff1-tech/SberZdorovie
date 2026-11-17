<script setup>
import MetricCard from '@/shared/ui/MetricCard.vue'
import { designAsset } from '@/shared/lib/design-asset'
defineProps({ value: { type: Number, required: true }, animate: Boolean })
</script>

<template>
  <MetricCard title="Пульс" compact :class="{ 'chart-ready': animate }">
    <div class="pulse-content">
      <div class="pulse-value"><strong class="metric-value">{{ value }}</strong><small>удара</small></div>
      <div class="pulse-wave" role="img" aria-label="График пульса">
        <img class="pulse-background" :src="designAsset('img11')" alt="" />
        <img class="pulse-foreground" :src="designAsset('img12')" alt="" />
      </div>
    </div>
  </MetricCard>
</template>

<style scoped>
.pulse-content { padding-top: 30.42px; }
.pulse-value { height: 56px; display: flex; align-items: end; gap: 4px; }
.pulse-value strong { letter-spacing: -1.8px; }
small { height: 26px; font: 500 10px / 15px var(--font-text); color: var(--health-muted); }
.pulse-wave { position: relative; height: 36.58px; clip-path: inset(0 100% 0 0); }
.pulse-background { position: absolute; left: -.2px; top: 8.77px; }
.pulse-foreground { position: absolute; left: -.22px; top: -.2px; }
.chart-ready .pulse-wave { animation: draw-pulse 1400ms var(--ease-in-out) 150ms both; }
@keyframes draw-pulse { to { clip-path: inset(0 -1px 0 -1px); } }
@media (prefers-reduced-motion: reduce) { .pulse-wave { clip-path: none; animation: none !important; } }
</style>
