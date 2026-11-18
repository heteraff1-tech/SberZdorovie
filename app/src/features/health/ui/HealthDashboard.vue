<template>
  <div class="health-dashboard">
    <PressureCard :data="data.pressure" :animate="animate" />
    <div class="health-dashboard-pair">
      <PulseCard
        :value="data.pulse"
        :animate="animate"
        @select="$emit('open-pulse', $event)"
      /><GlucoseCard :data="data.glucose" :animate="animate" />
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
defineEmits(['open-pulse']);
</script>

<style scoped lang="scss">
.health-dashboard {
  display: grid;
  gap: 4px;
}
.health-dashboard-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px;
}
</style>
