<template>
  <UiMetricCard title="Вес" :class="{ 'chart-ready': animate }">
    <UiMetricValue :value="data.value" status="Отлично" unit="Кг" tone="positive" />
    <div
      class="weight-chart"
      role="img"
      :aria-label="`Вес за неделю: ${data.days.map((d) => `${d.day} ${d.value} кг`).join(', ')}`"
    >
      <div class="weight-lines" aria-hidden="true">
        <i v-for="day in data.days" :key="day.day"></i>
      </div>
      <svg class="weight-drawing" viewBox="0 0 333 58" width="333" height="58" aria-hidden="true">
        <defs>
          <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--chart-weight)" stop-opacity=".32" />
            <stop offset="100%" stop-color="var(--chart-weight)" stop-opacity="0" />
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
        <img :src="index === 6 ? assets.weightPointCurrent : assets.weightPoint" alt="" /><span>{{
          day.value
        }}</span>
      </div>
      <div class="weight-days" aria-hidden="true">
        <span v-for="day in data.days" :key="day.day">{{ day.day }}</span>
      </div>
    </div>
  </UiMetricCard>
</template>

<script setup>
import { computed, useId } from 'vue';
import { UiMetricCard, UiMetricValue } from '@/shared/ui';
import { buildWeightChart } from '../model/weightChart';
import { assets } from '@/shared/config/assets';
const props = defineProps({
  data: { type: Object, required: true },
  animate: { type: Boolean, default: true },
});
const chart = computed(() => buildWeightChart(props.data.days));
const gradientId = useId();
</script>

<style scoped lang="scss" src="@/assets/styles/features/health/weight-card.scss"></style>
