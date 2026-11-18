<template>
  <nav class="ui-tab-bar" :aria-label="label">
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      :aria-current="modelValue === item.id ? 'page' : undefined"
      @click="$emit('update:modelValue', item.id)"
    >
      <UiIcon :name="item.icon" /><span>{{ item.label }}</span>
    </button>
  </nav>
</template>

<script setup>
import UiIcon from './UiIcon.vue';
defineProps({
  items: { type: Array, required: true },
  modelValue: String,
  label: { type: String, default: 'Основная навигация' },
});
defineEmits(['update:modelValue']);
</script>

<style scoped lang="scss">
.ui-tab-bar {
  position: relative;
  display: flex;
  width: 188px;
  height: 62px;
  padding: var(--spacing-1);
  border-radius: var(--border-radius-full);
  background: linear-gradient(
    color-mix(in srgb, var(--color-bg-surface) 45%, transparent),
    color-mix(in srgb, var(--color-bg-surface) 85%, transparent)
  );
  backdrop-filter: blur(6px);
  box-shadow:
    inset 0 1px 4px color-mix(in srgb, var(--color-bg-page) 90%, transparent),
    inset 0 -1px 4px color-mix(in srgb, var(--color-fg-default) 8%, transparent),
    0 8px 15px rgb(0 0 0 / 2%);

  // Градиентная кромка не меняет внутреннюю ширину двух вкладок.
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid transparent;
    border-radius: inherit;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-bg-page) 90%, transparent),
        color-mix(in srgb, var(--color-fg-default) 25%, transparent)
      )
      border-box;
    mask:
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }

  button {
    font: 600 10px / 12px var(--font-system);
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 0.5px;
    padding: 6px 0 0;
    border: 0;
    border-radius: var(--border-radius-full);
    background: transparent;
    color: var(--color-fg-default);
    cursor: pointer;
    &:hover {
      background: var(--color-bg-page);
    }
    &:focus-visible {
      outline-offset: 0;
    }
  }
}
</style>
