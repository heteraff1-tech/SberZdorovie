<template>
  <MetricCard
    class="pressure-card"
    title="Артериальное давление"
    :class="{ 'chart-ready': animate }"
  >
    <template #legend>
      <div class="pressure-legend" aria-hidden="true">
        <span><i class="pressure-legend__upper"></i>Верхнее</span>
        <span><i class="pressure-legend__lower"></i>Нижнее</span>
      </div>
    </template>
    <MetricValue
      :value="`${data.systolic} / ${data.diastolic}`"
      status="Отлично"
      unit="Среднее за 7 дней"
      tone="positive"
    />
    <div
      class="pressure-chart"
      role="img"
      aria-label="Артериальное давление за неделю: верхнее и нижнее. В понедельник нет данных."
    >
      <div class="pressure-axis" aria-hidden="true">
        <span v-for="n in [120, 80, 40, 0]" :key="n">{{ n }}</span>
      </div>
      <div class="pressure-grid" aria-hidden="true"><i v-for="n in 4" :key="n"></i></div>
      <div class="pressure-days" aria-hidden="true">
        <div v-for="(day, index) in data.days" :key="day.day" class="pressure-day">
          <div class="pressure-bars">
            <i
              v-if="day.upper !== null"
              :style="{ height: `${day.upper}px`, '--bar-index': index, '--bar-offset': '0ms' }"
            ></i
            ><i
              v-if="day.lower !== null"
              :style="{
                height: `${day.lower}px`,
                '--bar-index': index,
                '--bar-offset': 'var(--motion-bar-offset)',
              }"
            ></i>
          </div>
          <span>{{ day.day }}</span>
        </div>
      </div>
    </div>
  </MetricCard>
</template>

<script setup>
import MetricCard from './MetricCard.vue';
import MetricValue from './MetricValue.vue';
defineProps({ data: { type: Object, required: true }, animate: { type: Boolean, default: true } });
</script>

<style scoped lang="scss">
.pressure-card {
  --motion-bar-offset: 60ms;
  --motion-bar-step: 75ms;
  --motion-chart: 1100ms;
}

.pressure-legend {
  display: flex;
  gap: var(--spacing-2);
  font: 400 var(--text-caption-size) / var(--text-caption-line) var(--font-text);
  color: var(--color-neutral-default);
}
.pressure-legend span {
  display: flex;
  align-items: center;
  gap: 4px;
}
.pressure-legend span:first-child {
  width: 53px;
}
.pressure-legend span:last-child {
  width: 51px;
}
.pressure-chart {
  position: relative;
  height: 76px;
  margin-top: 4px;
}
.pressure-axis {
  position: absolute;
  top: 8px;
  left: 0;
  width: 19px;
  color: var(--color-neutral-default);
  font: 400 var(--text-caption-size) / var(--text-caption-line) var(--font-text);
  display: grid;
  gap: var(--spacing-1);
  text-align: right;
}
.pressure-grid {
  position: absolute;
  top: 12.5px;
  left: 26px;
  right: 0;
  display: grid;
  gap: var(--spacing-4);
}
.pressure-grid i {
  height: 1px;
  background: var(--color-border-default);
}
.pressure-days {
  position: absolute;
  inset: 0 0 0 26px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.pressure-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-1);
  color: var(--color-neutral-default);
  font: 400 var(--text-caption-size) / var(--text-caption-line) var(--font-text);
}
.pressure-bars {
  display: flex;
  align-items: end;
  gap: var(--spacing-1);
  width: 23px;
  height: 58px;
}
.pressure-bars i {
  width: 10px;
  border-radius: var(--border-radius-full) var(--border-radius-full) 0 0;
  background: var(--color-accent-default);
  transform: scaleY(0);
  transform-origin: bottom;
}
.pressure-bars i + i {
  background: var(--color-blue);
}
.chart-ready .pressure-bars i {
  animation: grow-bar var(--motion-chart) var(--ease-out)
    calc(var(--bar-index) * var(--motion-bar-step) + var(--bar-offset)) both;
}
@keyframes grow-bar {
  to {
    transform: scaleY(1);
  }
}

.pressure-legend i {
  width: 6px;
  height: 6px;
  border-radius: var(--border-radius-full);
  flex-shrink: 0;
}
.pressure-legend__upper {
  background: var(--color-accent-default);
}
.pressure-legend__lower {
  background: var(--color-blue);
}

@media (prefers-reduced-motion: reduce) {
  .chart-ready .pressure-bars i {
    transform: none;
    animation: none;
  }

  .pressure-card {
    --motion-bar-offset: 0ms;
    --motion-bar-step: 1ms;
    --motion-chart: 1ms;
  }
}
</style>
