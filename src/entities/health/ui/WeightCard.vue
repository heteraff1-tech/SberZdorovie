<script setup>
import MetricCard from '@/shared/ui/MetricCard.vue'
import { designAsset } from '@/shared/lib/design-asset'
defineProps({ data: { type: Object, required: true }, animate: Boolean })
</script>

<template>
  <MetricCard title="Вес" :class="{ 'chart-ready': animate }">
    <div class="weight-value"><strong class="metric-value">{{ data.value }}</strong><div><span>Отличный результат</span><small>Кг</small></div></div>
    <div class="weight-chart" role="img" :aria-label="`Вес за неделю: ${data.days.map(d => `${d.day} ${d.value} кг`).join(', ')}`">
      <div class="weight-lines" aria-hidden="true"><i v-for="day in data.days" :key="day.day"></i></div>
      <div class="weight-drawing" aria-hidden="true">
        <img class="weight-area" :src="designAsset('img13')" alt="" />
        <img class="weight-line" :src="designAsset('img14')" alt="" />
      </div>
      <div v-for="(day, index) in data.days" :key="day.day" class="weight-point" :class="{ 'is-first': index === 0, 'is-last': index === 6 }" :style="{ left: `${day.x}px`, top: `${day.y}px`, '--point-delay': `${index * 150 + 200}ms` }" aria-hidden="true">
        <img :src="designAsset(index === 6 ? 'img16' : 'img15')" alt="" /><span>{{ day.value }}</span>
      </div>
      <div class="weight-days" aria-hidden="true"><span v-for="day in data.days" :key="day.day">{{ day.day }}</span></div>
    </div>
  </MetricCard>
</template>

<style scoped>
.weight-value { display: flex; align-items: end; gap: 8px; height: 56px; }
.weight-value > div { height: 39px; display: flex; flex-direction: column; font: 500 10px / 13px var(--font-text); }
.weight-value small { color: var(--health-muted); font: inherit; line-height: 15px; }
.weight-chart { position: relative; height: 76px; width: 333px; margin-top: 4px; margin-left: -7.5px; }
.weight-lines { position: absolute; height: 58px; left: 7.5px; right: 7.5px; display: flex; justify-content: space-between; }
.weight-lines i { width: 1px; height: 58px; background: #e7e9f5; }
.weight-drawing { position: absolute; inset: 0; clip-path: inset(0 100% 0 0); }
.weight-area { position: absolute; left: 7.5px; top: 18px; }
.weight-line { position: absolute; left: 7.5px; top: 17.5px; }
.weight-point { position: absolute; opacity: 0; font: 510 10px / 12px var(--font-status); color: #455665; }
.weight-point img { position: absolute; left: -2px; top: -2px; }
.weight-point span { position: absolute; left: 0; top: -18px; white-space: nowrap; }
.weight-point:not(.is-first) span { transform: translateX(-50%); }
.weight-point.is-last { color: #156851; }
.weight-point.is-last img { left: -3px; top: -3px; }
.weight-point.is-last span { transform: translateX(-100%); }
.weight-days { position: absolute; top: 63px; inset-inline: 0; display: flex; justify-content: space-between; color: #76849d; font: 400 10px / 13px var(--font-text); }
.weight-days span { width: 15px; }
.chart-ready .weight-drawing { animation: draw-weight 1300ms var(--ease-in-out) 180ms both; }
.chart-ready .weight-point { animation: show-point 400ms ease var(--point-delay) both; }
@keyframes draw-weight { to { clip-path: inset(0 -1px 0 0); } }
@keyframes show-point { to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .weight-drawing { clip-path: none; animation: none !important; } .weight-point { opacity: 1; animation: none !important; } }
</style>
