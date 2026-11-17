<template>
  <UiMetricCard title="Артериальное давление" :class="{ 'chart-ready': animate }">
    <template #legend>
      <div class="pressure-legend" aria-hidden="true">
        <span><i class="pressure-legend__upper"></i>Верхнее</span>
        <span><i class="pressure-legend__lower"></i>Нижнее</span>
      </div>
    </template>
    <UiMetricValue
      :value="`${data.systolic} / ${data.diastolic}`"
      status="Повышенный результат"
      unit="В среднем"
      tone="elevated"
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
  </UiMetricCard>
</template>

<script setup>
import { UiMetricCard, UiMetricValue } from '@/shared/ui';
defineProps({ data: { type: Object, required: true }, animate: { type: Boolean, default: true } });
</script>

<style scoped lang="scss" src="@/assets/styles/features/health/pressure-card.scss"></style>
