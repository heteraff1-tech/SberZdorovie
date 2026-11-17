<script setup>
import MetricCard from '@/shared/ui/MetricCard.vue'
import { designAsset } from '@/shared/lib/design-asset'
import dots from '@/shared/config/glucose-dots.json'
defineProps({ value: { type: String, required: true }, animate: Boolean })
</script>

<template>
  <MetricCard title="Глюкоза" subtitle="Метод: натощак" compact :class="{ 'chart-ready': animate }">
    <div class="glucose-content">
      <div class="glucose-value"><strong class="metric-value">{{ value }}</strong><small>ммоль/л</small></div>
      <div class="glucose-grid" role="img" aria-label="Шкала глюкозы">
        <span v-for="(dot, index) in dots" :key="dot" :style="{ '--dot-delay': `${(index % 32) * 21}ms` }"><img :src="designAsset(dot)" alt="" /></span>
      </div>
      <p class="glucose-goal">Цель меньше 5,5</p>
    </div>
  </MetricCard>
</template>

<style scoped>
.glucose-content { padding-top: 12.87px; }
.glucose-value { display: flex; align-items: end; gap: 4px; height: 56px; }
.glucose-value strong { letter-spacing: -1.8px; }
small { height: 23px; color: var(--health-muted); font: 500 12px / 15px var(--font-text); }
.glucose-grid { display: grid; grid-template-columns: repeat(32, minmax(0, 1fr)); grid-template-rows: repeat(4, minmax(0, 1fr)); gap: 1px; height: 18.131px; border-radius: 32px; overflow: hidden; margin-top: 4px; }
.glucose-grid span { position: relative; opacity: 0; }
.glucose-grid img { position: absolute; top: 0; left: 0; }
.glucose-goal { font: 400 10px / 13px var(--font-text); color: #27a482; margin: 4px 0 0; }
.chart-ready .glucose-grid span { animation: show-dot 550ms var(--ease-out) var(--dot-delay) both; }
@keyframes show-dot { from { opacity: 0; transform: scale(.2); } to { opacity: 1; transform: scale(1); } }
@media (prefers-reduced-motion: reduce) { .glucose-grid span { opacity: 1; animation: none !important; } }
</style>
