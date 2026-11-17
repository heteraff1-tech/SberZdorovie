<template>
  <div class="ui-metric-value">
    <strong class="ui-metric-value__number">{{ value }}</strong>
    <div v-if="unit || status" class="ui-metric-value__details">
      <span
        v-if="status"
        class="ui-metric-value__status"
        :class="`ui-metric-value__status--${tone}`"
        >{{ status }}</span
      >
      <small v-if="unit" class="ui-metric-value__unit">{{ unit }}</small>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: { type: [String, Number], required: true },
  unit: String,
  status: String,
  tone: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'positive', 'elevated', 'critical'].includes(value),
  },
});
</script>

<style scoped lang="scss" src="@/assets/styles/components/metric-value.scss"></style>
