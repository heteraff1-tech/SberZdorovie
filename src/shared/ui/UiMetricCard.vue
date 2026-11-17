<template>
  <article
    class="ui-metric-card"
    :class="{ 'ui-metric-card--compact': compact }"
    :aria-label="title"
  >
    <header class="ui-metric-card__heading">
      <div>
        <h2 class="ui-metric-card__title">{{ title }}</h2>
        <p v-if="subtitle" class="ui-metric-card__subtitle">{{ subtitle }}</p>
      </div>
      <slot name="legend" />
    </header>
    <div class="ui-metric-card__body"><slot /></div>
    <button
      v-if="actionLabel"
      class="ui-metric-card__action"
      type="button"
      :aria-label="actionLabel"
      @click="$emit('select', $event)"
    ></button>
  </article>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: String,
  compact: Boolean,
  actionLabel: String,
});
defineEmits(['select']);
</script>

<style scoped lang="scss" src="@/assets/styles/components/metric-card.scss"></style>
