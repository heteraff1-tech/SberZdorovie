<template>
  <component
    :is="href ? 'a' : 'button'"
    ref="element"
    class="ui-button"
    :class="[
      `ui-button--${variant}`,
      `ui-button--${size}`,
      { 'ui-button--loading': loading, 'ui-button--pill': pill },
    ]"
    :href="disabled || loading ? undefined : href"
    :type="href ? undefined : type"
    :disabled="href ? undefined : disabled || loading"
    :aria-disabled="href && (disabled || loading) ? true : undefined"
    :aria-busy="loading || undefined"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  type: { type: String, default: 'button' },
  href: { type: String, default: undefined },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'quiet'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'icon'].includes(value),
  },
  disabled: Boolean,
  pill: Boolean,
  loading: Boolean,
});
const emit = defineEmits(['click']);
const element = ref(null);

/** Заблокированная ссылка не открывает адрес и не испускает действие. */
function handleClick(event) {
  if (props.disabled || props.loading) {
    event.preventDefault();
    return;
  }
  emit('click', event);
}
/** Передаёт фокус на нативную кнопку для клавиатурной навигации. */
function focus(options) {
  element.value?.focus(options);
}

defineExpose({ focus });
</script>

<style scoped lang="scss">
.ui-button {
  font: 500 var(--text-label-size) / var(--text-label-line) var(--font-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-1);
  padding: 0 var(--spacing-3);
  border: 1px solid transparent;
  border-radius: var(--border-radius-xl);
  cursor: pointer;
  transition: opacity var(--motion-ui);
  white-space: nowrap;
  text-decoration: none;
  &--sm {
    min-height: var(--spacing-7);
  }
  &--md {
    min-height: var(--size-44);
  }
  &--lg {
    min-height: var(--size-56);
    padding-inline: var(--padding-l);
  }
  &--icon {
    width: var(--size-44);
    height: var(--size-44);
    padding: 0;
    border-radius: var(--border-radius-full);
  }
  &--pill {
    padding-inline: var(--spacing-3);
    gap: var(--spacing-1);
    border-radius: var(--border-radius-full);
  }
  &--primary {
    background: var(--color-accent-default);
    color: var(--color-bg-page);
  }
  &--secondary {
    background: var(--color-bg-surface);
    color: var(--color-fg-default);
  }
  &--quiet {
    background: var(--color-bg-page);
    color: var(--color-fg-default);
  }
  &--primary:hover:not(:disabled) {
    background: var(--color-accent-hover);
  }
  &--primary:active:not(:disabled) {
    background: var(--color-accent-soft);
  }
  &--secondary:hover:not(:disabled) {
    background: var(--color-bg-surface);
  }
  &--secondary:active:not(:disabled) {
    background: var(--color-bg-surface);
  }
  &--quiet:hover:not(:disabled) {
    background: var(--color-bg-page);
  }
  &:disabled {
    background: var(--color-bg-surface);
    color: var(--color-neutral-muted);
    cursor: default;
  }
  &--quiet:disabled {
    background: var(--color-bg-page);
  }
  &[aria-disabled='true'] {
    cursor: default;
  }
  &--loading {
    cursor: progress;
  }
  &[aria-pressed='true']:not(:disabled) {
    border-color: var(--color-accent-default);
  }
}
</style>
