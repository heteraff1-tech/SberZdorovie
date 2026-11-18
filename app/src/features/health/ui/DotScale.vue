<template>
  <div
    class="ui-dot-scale"
    :class="{ 'ui-dot-scale--animated': animate }"
    :style="{ '--scale-columns': columns, '--scale-rows': rows }"
    role="img"
    :aria-label="label"
  >
    <span
      v-for="index in columns * rows"
      :key="index"
      class="ui-dot-scale__dot"
      :class="{ 'ui-dot-scale__dot--active': (index - 1) % columns < activeColumns }"
      :style="{ '--dot-index': (index - 1) % columns }"
    ></span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  value: { type: Number, required: true },
  columns: { type: Number, default: 32 },
  rows: { type: Number, default: 4 },
  label: { type: String, required: true },
  animate: { type: Boolean, default: true },
});
const activeColumns = computed(() =>
  Math.round(Math.max(0, Math.min(1, props.value)) * props.columns),
);
</script>

<style scoped lang="scss">
.ui-dot-scale {
  --motion-dot: 550ms;
  --motion-dot-step: 21ms;

  width: 100%;
  max-width: calc(var(--scale-columns) * var(--spacing-1) + (var(--scale-columns) - 1) * 1px);
  display: grid;
  grid-template-columns: repeat(var(--scale-columns), minmax(0, 1fr));
  grid-template-rows: repeat(var(--scale-rows), minmax(0, 1fr));
  gap: 1px;
  height: 18px;
  border-radius: var(--border-radius-full);
  overflow: hidden;

  &__dot {
    width: 100%;
    aspect-ratio: 1;
    align-self: center;
    border-radius: var(--border-radius-full);
    background: color-mix(in srgb, var(--color-neutral-default) 25%, transparent);
    opacity: 0;
  }
  &__dot--active {
    background: var(--color-accent-default);
  }
  &--animated &__dot {
    animation: show-dot var(--motion-dot) var(--ease-out)
      calc(var(--dot-index) * var(--motion-dot-step)) both;
  }
}
@keyframes show-dot {
  from {
    opacity: 0;
    transform: scale(0.2);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ui-dot-scale--animated .ui-dot-scale__dot {
    opacity: 1;
    animation: none;
  }

  .ui-dot-scale {
    --motion-dot: 1ms;
    --motion-dot-step: 1ms;
  }
}
</style>
