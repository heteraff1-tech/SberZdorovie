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

<style scoped lang="scss" src="@/assets/styles/components/tab-bar.scss"></style>
