<template>
  <article class="glass-card" :class="{ 'glass-card--centered': centered }">
    <span class="glass-card-label">{{ label }}</span><slot />
  </article>
</template>

<script setup>
defineProps({ label: { type: String, required: true }, centered: Boolean });
</script>

<style scoped lang="scss">
.glass-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  width: var(--glass-card-size, 167px);
  height: var(--glass-card-size, 167px);
  padding: var(--spacing-4) var(--spacing-3) var(--spacing-4) var(--spacing-4);
  border: 0;
  border-radius: var(--border-radius-xl);
  background: color-mix(in srgb, var(--color-bg-page) 5%, transparent);
  box-shadow: 0 4px 11px rgb(56 71 87 / 6.5%);
  backdrop-filter: blur(1.5px);
  text-align: left;
  color: var(--color-fg-default);
}
.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 1.25px solid transparent;
  border-radius: inherit;
  background: linear-gradient(
      135deg,
      rgb(142 156 168 / 42%),
      rgb(246 255 255 / 90%) 34%,
      rgb(255 255 255 / 94%) 67%,
      rgb(108 141 150 / 31%)
    )
    border-box;
  mask:
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}
.glass-card--centered {
  justify-content: center;
}
.glass-card-label {
  position: relative;
  white-space: pre-line;
  width: 138px;
  font: 500 var(--heading-h3-size) / var(--heading-h3-line) var(--font-system);
}
</style>
