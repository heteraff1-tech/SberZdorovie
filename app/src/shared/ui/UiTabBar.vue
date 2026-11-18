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
  display: flex;
  width: 190px;
  height: 64px;
  padding: var(--spacing-1) var(--spacing-3);
  border: 1px solid color-mix(in srgb, var(--color-fg-default) 15%, transparent);
  border-radius: var(--border-radius-full);
  background: color-mix(in srgb, var(--color-bg-surface) 65%, transparent);
  backdrop-filter: blur(14px);
  box-shadow:
    inset 0 1px 4px var(--color-bg-page),
    0 5px 16px color-mix(in srgb, var(--color-fg-default) 4%, transparent);

  button {
    font: 400 var(--text-caption-size) / var(--text-caption-line) var(--font-text);
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    padding: 0;
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
