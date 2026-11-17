<script setup>
import MetricCard from '@/shared/ui/MetricCard.vue'
import { designAsset } from '@/shared/lib/design-asset'
defineProps({ data: { type: Object, required: true }, animate: Boolean })
</script>

<template>
  <MetricCard title="Артериальное давление" :class="{ 'chart-ready': animate }">
    <template #legend>
      <div class="pressure-legend" aria-hidden="true">
        <span><img :src="designAsset('img9')" alt="" />Верхнее</span>
        <span><img :src="designAsset('img10')" alt="" />Нижнее</span>
      </div>
    </template>
    <div class="pressure-value"><strong class="metric-value">{{ data.systolic }} / {{ data.diastolic }}</strong>
      <div class="pressure-note"><span>Повышенный результат</span><small>В среднем</small></div>
    </div>
    <div class="pressure-chart" role="img" aria-label="Артериальное давление за неделю: верхнее и нижнее. В понедельник нет данных.">
      <div class="pressure-axis" aria-hidden="true"><span v-for="n in [120, 80, 40, 0]" :key="n">{{ n }}</span></div>
      <div class="pressure-grid" aria-hidden="true"><i v-for="n in 4" :key="n"></i></div>
      <div class="pressure-days" aria-hidden="true">
        <div v-for="(day, index) in data.days" :key="day.day" class="pressure-day">
          <div class="pressure-bars"><i v-if="day.upper !== null" :style="{ height: `${day.upper}px`, '--bar-delay': `${index * 75}ms` }"></i><i v-if="day.lower !== null" :style="{ height: `${day.lower}px`, '--bar-delay': `${index * 75 + 60}ms` }"></i></div>
          <span>{{ day.day }}</span>
        </div>
      </div>
    </div>
  </MetricCard>
</template>

<style scoped>
.pressure-legend { display: flex; gap: 9px; font: 510 10px / 13px var(--font-status); color: #435369; }
.pressure-legend span { display: flex; align-items: center; gap: 4px; }
.pressure-legend span:first-child { width: 53px; }
.pressure-legend span:last-child { width: 51px; }
.pressure-value { display: flex; align-items: center; gap: 4px; height: 56px; white-space: nowrap; }
.pressure-note { display: flex; flex-direction: column; font: 500 10px / 13px var(--font-text); color: #f19225; }
.pressure-note small { font: inherit; line-height: 15px; color: var(--health-muted); }
.pressure-chart { position: relative; height: 76px; margin-top: 4px; }
.pressure-axis { position: absolute; top: 8px; left: 0; width: 19px; color: #76849d; font: 500 10px / 10px var(--font-text); display: grid; gap: 5px; text-align: right; }
.pressure-grid { position: absolute; top: 12.5px; left: 26px; right: 0; display: grid; gap: 14px; }
.pressure-grid i { height: 1px; background: #e7e9f5; }
.pressure-days { position: absolute; inset: 0 0 0 26px; display: grid; grid-template-columns: repeat(7, 1fr); }
.pressure-day { display: flex; flex-direction: column; align-items: center; gap: 5px; color: #76849d; font: 400 10px / 13px var(--font-text); }
.pressure-bars { display: flex; align-items: end; gap: 3px; width: 23px; height: 58px; }
.pressure-bars i { width: 10px; border-radius: 60px 60px 0 0; background: #27a482; transform: scaleY(0); transform-origin: bottom; }
.pressure-bars i + i { background: #6d86a6; }
.chart-ready .pressure-bars i { animation: grow-bar var(--motion-chart) var(--ease-out) var(--bar-delay) both; }
@keyframes grow-bar { to { transform: scaleY(1); } }
@media (prefers-reduced-motion: reduce) { .pressure-bars i { transform: none; animation: none !important; } }
</style>
