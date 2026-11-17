<template>
  <UiMetricCard title="Глюкоза" subtitle="Метод: натощак" compact>
    <div class="glucose-card">
      <UiMetricValue :value="formattedValue" status="Высокий" tone="elevated" unit="ммоль/л" />
      <UiDotScale :value="fill" :animate="animate" label="Шкала глюкозы" />
      <p class="glucose-card__goal">Цель меньше {{ data.target }}</p>
    </div>
  </UiMetricCard>
</template>

<script setup>
import { UiMetricCard, UiMetricValue, UiDotScale } from '@/shared/ui';
import { useGlucoseScale } from '../model/useGlucoseScale';
const props = defineProps({
  data: { type: Object, required: true },
  animate: { type: Boolean, default: true },
});
const { formattedValue, fill } = useGlucoseScale(() => props.data);
</script>

<style scoped lang="scss" src="@/assets/styles/features/health/glucose-card.scss"></style>
