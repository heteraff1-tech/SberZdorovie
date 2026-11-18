<template>
  <MetricCard title="Вес" :class="{ 'chart-ready': animate }">
    <MetricValue :value="data.value" status="Отлично" unit="Кг" tone="positive" />
    <div
      class="weight-chart"
      role="img"
      :aria-label="`Вес за неделю: ${data.days.map((d) => `${d.day} ${d.value} кг`).join(', ')}`"
    >
      <div class="weight-lines" aria-hidden="true">
        <i v-for="day in data.days" :key="day.day"></i>
      </div>
      <svg class="weight-drawing" viewBox="0 0 318 58" width="318" height="58" aria-hidden="true">
        <defs>
          <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--color-accent-default)" stop-opacity=".32" />
            <stop offset="100%" stop-color="var(--color-accent-default)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path :d="chart.area" :fill="`url(#${gradientId})`" />
        <path class="weight-line" :d="chart.line" fill="none" />
      </svg>
      <div
        v-for="(day, index) in chart.points"
        :key="day.day"
        class="weight-point"
        :class="{ 'is-first': index === 0, 'is-last': index === 6 }"
        :style="{ left: `${day.x}px`, top: `${day.y}px`, '--point-index': index }"
        aria-hidden="true"
      >
        <i class="weight-point__dot"></i><span>{{ day.value }}</span>
      </div>
      <div class="weight-days" aria-hidden="true">
        <span v-for="day in data.days" :key="day.day">{{ day.day }}</span>
      </div>
    </div>
  </MetricCard>
</template>

<script setup>
import { computed, useId } from 'vue';
import MetricCard from './MetricCard.vue';
import MetricValue from './MetricValue.vue';
import { buildWeightChart } from '../model/weightChart';
const props = defineProps({
  data: { type: Object, required: true },
  animate: { type: Boolean, default: true },
});
const chart = computed(() => buildWeightChart(props.data.days, { width: 318, padding: 0 }));
const gradientId = useId();
</script>

<style scoped lang="scss">
.weight-chart {
  --motion-point: 400ms;
  --motion-point-delay: 200ms;
  --motion-point-step: 150ms;
  --motion-weight: 1300ms;
  --motion-weight-delay: 180ms;

  position: relative;
  height: 76px;
  width: 318px;
  max-width: 100%;
  margin-top: var(--spacing-1);
}
.weight-lines {
  position: absolute;
  height: 58px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
}
.weight-lines i {
  width: 1px;
  height: 58px;
  background: var(--color-border-default);
}
.weight-drawing {
  position: absolute;
  inset: 0;
  clip-path: inset(0 100% 0 0);
}
.weight-line {
  stroke: var(--color-accent-default);
  stroke-width: 1;
}
.weight-point {
  position: absolute;
  opacity: 0;
  font: 500 var(--text-footnote-size) / var(--text-footnote-line) var(--font-text);
  color: var(--color-neutral-default);
}
.weight-point__dot {
  width: 4px;
  height: 4px;
  border-radius: var(--border-radius-full);
  background: var(--color-accent-default);
  position: absolute;
  left: -2px;
  top: -2px;
}
.weight-point span {
  position: absolute;
  left: 0;
  top: -18px;
  white-space: nowrap;
}
.weight-point:not(.is-first) span {
  transform: translateX(-50%);
}
.weight-point.is-last {
  color: var(--color-neutral-default);
}
.weight-point.is-last .weight-point__dot {
  width: 6px;
  height: 6px;
  border: 1px solid var(--color-accent-default);
  background: var(--color-bg-page);
  left: -3px;
  top: -3px;
}
.weight-point.is-last span {
  transform: translateX(-100%);
}
.weight-days {
  position: absolute;
  top: 63px;
  inset-inline: 0;
  display: flex;
  justify-content: space-between;
  color: var(--color-neutral-default);
  font: 400 var(--text-caption-size) / var(--text-caption-line) var(--font-text);
}
.weight-days span {
  width: 15px;
}
.chart-ready .weight-drawing {
  animation: draw-weight var(--motion-weight) var(--ease-in-out) var(--motion-weight-delay) both;
}
.chart-ready .weight-point {
  animation: show-point var(--motion-point) ease
    calc(var(--point-index) * var(--motion-point-step) + var(--motion-point-delay)) both;
}
@keyframes draw-weight {
  to {
    clip-path: inset(0 -1px 0 0);
  }
}
@keyframes show-point {
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chart-ready .weight-drawing {
    clip-path: none;
    animation: none;
  }
  .chart-ready .weight-point {
    opacity: 1;
    animation: none;
  }

  .weight-chart {
    --motion-point: 1ms;
    --motion-point-delay: 1ms;
    --motion-point-step: 1ms;
    --motion-weight: 1ms;
    --motion-weight-delay: 1ms;
  }
}
</style>
