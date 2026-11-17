<template>
  <button
    ref="element"
    class="ui-button"
    :class="[
      `ui-button--${variant}`,
      `ui-button--${size}`,
      { 'ui-button--loading': loading, 'ui-button--pill': pill },
    ]"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  type: { type: String, default: 'button' },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'quiet', 'destructive'].includes(value),
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
defineEmits(['click']);
const element = ref(null);
defineExpose({ focus: (options) => element.value?.focus(options) });
</script>

<style scoped lang="scss" src="@/assets/styles/components/button.scss"></style>
