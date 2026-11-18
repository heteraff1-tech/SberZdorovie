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

<style scoped lang="scss">
.ui-metric-value {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  min-height: var(--display-metric-line);
  white-space: nowrap;

  &__number {
    font: 600 var(--display-metric-size) / var(--display-metric-line) var(--font-display);
    letter-spacing: -1.6px;
    color: var(--color-fg-default);
  }
  &__details {
    display: flex;
    flex-direction: column;
  }
  &__status {
    font: 400 var(--text-caption-size) / var(--text-caption-line) var(--font-text);
    color: var(--color-fg-default);
  }
  &__unit {
    font: 500 var(--text-footnote-size) / var(--text-footnote-line) var(--font-text);
    color: var(--color-neutral-default);
  }
  &__status--positive {
    color: var(--color-success-default);
  }
  &__status--elevated {
    color: var(--color-warning-on-container);
  }
  &__status--critical {
    color: var(--color-error-on-container);
  }
}
</style>
