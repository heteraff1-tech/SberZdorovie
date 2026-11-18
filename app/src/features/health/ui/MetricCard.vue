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

<style scoped lang="scss">
.ui-metric-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 200px;
  padding: var(--spacing-4);
  border-radius: var(--border-radius-xl);
  background: var(--color-bg-surface);
  color: var(--color-fg-default);
  overflow: hidden;

  &__action {
    position: absolute;
    inset: 0;
    border: 0;
    border-radius: inherit;
    background: transparent;
    cursor: pointer;
    &:hover {
      background: var(--color-bg-page);
      opacity: 0.35;
    }
    &:focus-visible {
      outline-offset: -4px;
    }
  }

  &--compact {
    height: 175px;
  }
  &__heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-1);
    min-height: var(--text-label-line);
  }
  &__title {
    font: 500 var(--text-label-size) / var(--text-label-line) var(--font-text);
    margin: 0;
    white-space: nowrap;
  }
  &__subtitle {
    font: 500 var(--text-footnote-size) / var(--text-footnote-line) var(--font-text);
    margin: 0;
    color: var(--color-neutral-default);
  }
  &__body {
    margin-top: var(--spacing-3);
    flex: 1;
    min-height: 0;
  }
  &--compact &__heading {
    align-items: start;
  }
  &--compact &__body {
    margin-top: 0;
  }
}
</style>
