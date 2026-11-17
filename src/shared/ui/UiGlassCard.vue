<template>
  <button
    type="button"
    class="glass-card"
    :class="{ 'glass-card--centered': centered }"
    @click="$emit('select', label)"
  >
    <span class="glass-card-label">{{ label }}</span><slot />
  </button>
</template>

<script setup>
defineProps({ label: { type: String, required: true }, centered: Boolean });
defineEmits(['select']);
</script>

<style scoped lang="scss" src="@/assets/styles/components/glass-card.scss"></style>
