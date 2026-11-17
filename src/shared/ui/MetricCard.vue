<script setup>
defineProps({ title: { type: String, required: true }, subtitle: String, compact: Boolean })
</script>

<template>
  <article class="metric-card" :class="{ 'metric-card--compact': compact }" :aria-label="title">
    <header class="metric-heading">
      <div><h2>{{ title }}</h2><p v-if="subtitle">{{ subtitle }}</p></div>
      <slot name="legend" />
    </header>
    <div class="metric-body"><slot /></div>
  </article>
</template>

<style scoped>
.metric-card { min-width: 0; height: 200px; padding: 18px; border-radius: 28px; background: var(--health-surface); overflow: hidden; }
.metric-card--compact { height: 175px; }
.metric-heading { display: flex; justify-content: space-between; align-items: center; height: 16px; gap: 4px; }
.metric-card--compact .metric-heading { height: auto; align-items: start; }
h2, p { margin: 0; }
h2 { font: 500 14px / 16px var(--font-text); white-space: nowrap; }
p { color: var(--health-muted); font: 500 12px / 15px var(--font-text); }
.metric-body { margin-top: 12px; }
.metric-card--compact .metric-body { margin-top: 0; }
</style>
