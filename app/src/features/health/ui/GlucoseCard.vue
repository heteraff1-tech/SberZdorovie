<template>
  <MetricCard title="Глюкоза" subtitle="Метод: натощак" compact>
    <div class="glucose-card">
      <MetricValue :value="formattedValue" status="Высокий" tone="elevated" unit="ммоль/л" />
      <DotScale :value="fill" :animate="animate" label="Шкала глюкозы" />
      <p class="glucose-card__goal">Цель меньше {{ data.target }}</p>
    </div>
  </MetricCard>
</template>

<script setup>
import MetricCard from './MetricCard.vue';
import MetricValue from './MetricValue.vue';
import DotScale from './DotScale.vue';
import { useGlucoseScale } from '../model/useGlucoseScale';
const props = defineProps({
  data: { type: Object, required: true },
  animate: { type: Boolean, default: true },
});
const { formattedValue, fill } = useGlucoseScale(() => props.data);
</script>

<style scoped lang="scss">
.glucose-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--spacing-1);
  height: 100%;

  &__goal {
    font: 400 var(--text-caption-size) / var(--text-caption-line) var(--font-text);
    margin: 0;
    color: var(--color-success-default);
  }
}
</style>
