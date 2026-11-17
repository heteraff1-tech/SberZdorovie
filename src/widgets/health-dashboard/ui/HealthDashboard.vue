<script setup>
import PressureCard from '@/entities/health/ui/PressureCard.vue'
import PulseCard from '@/entities/health/ui/PulseCard.vue'
import GlucoseCard from '@/entities/health/ui/GlucoseCard.vue'
import WeightCard from '@/entities/health/ui/WeightCard.vue'
defineProps({ data: { type: Object, required: true }, animate: Boolean })
</script>

<template>
  <div class="health-dashboard">
    <PressureCard :data="data.pressure" :animate="animate" />
    <div class="health-dashboard-pair"><PulseCard :value="data.pulse" :animate="animate" /><GlucoseCard :value="data.glucose" :animate="animate" /></div>
    <WeightCard :data="data.weight" :animate="animate" />
  </div>
</template>

<style scoped>
.health-dashboard { display: grid; gap: 4px; }
.health-dashboard-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; }
</style>
