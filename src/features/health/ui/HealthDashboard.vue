<template>
  <div class="health-dashboard">
    <PressureCard :data="data.pressure" :animate="animate" />
    <div class="health-dashboard-pair">
      <PulseCard :value="data.pulse" :animate="animate" /><GlucoseCard
        :data="data.glucose"
        :animate="animate"
      />
    </div>
    <WeightCard :data="data.weight" :animate="animate" />
  </div>
</template>

<script setup>
import PressureCard from './PressureCard.vue';
import PulseCard from './PulseCard.vue';
import GlucoseCard from './GlucoseCard.vue';
import WeightCard from './WeightCard.vue';
defineProps({ data: { type: Object, required: true }, animate: Boolean });
</script>

<style scoped lang="scss" src="@/assets/styles/features/health/health-dashboard.scss"></style>
