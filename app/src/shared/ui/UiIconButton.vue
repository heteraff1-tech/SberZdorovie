<template>
  <UiButton
    ref="button"
    variant="quiet"
    size="icon"
    :aria-label="label"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <UiIcon :name="icon" :inverse="inverse" />
  </UiButton>
</template>

<script setup>
import { ref } from 'vue';
import UiButton from './UiButton.vue';
import UiIcon from './UiIcon.vue';

defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  disabled: Boolean,
  inverse: Boolean,
});
defineEmits(['click']);
const button = ref(null);
/** Передаёт фокус на нативную кнопку для клавиатурной навигации. */
function focus(options) {
  button.value?.focus(options);
}

defineExpose({ focus });
</script>
