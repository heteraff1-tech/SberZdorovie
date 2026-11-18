<template>
  <header
    class="assistant-header"
    :class="{ 'assistant-header--active': active, 'assistant-header--ready': ready }"
  >
    <template v-if="active">
      <span class="assistant-header__close" aria-hidden="true"><UiIcon name="close" /></span>
      <div class="assistant-header__label"><UiIcon name="assistant" /><span>ИИ помощник</span></div>
      <span class="assistant-header__history" aria-hidden="true"><UiIcon name="chat" /></span>
      <h1 class="assistant-header__greeting">
        <span>Привет, {{ name }}!</span><span>Чем могу помочь</span>
      </h1>
    </template>
    <template v-else>
      <button class="assistant-header__label" type="button" @click="$emit('open')">
        <UiIcon name="assistant" inverse /><span>ИИ помощник</span>
      </button>
      <button
        class="assistant-header__greeting"
        type="button"
        :aria-label="`Привет, ${name}! Открыть ИИ-помощника`"
        @click="$emit('open')"
      >
        <span>Привет, {{ name }}!</span><span>Чем могу помочь</span>
      </button>
    </template>
  </header>
</template>

<script setup>
import { UiIcon } from '@/shared/ui';
defineProps({ name: { type: String, required: true }, active: Boolean, ready: Boolean });
defineEmits(['open']);
</script>

<style scoped lang="scss">
.assistant-header {
  --motion-color: 800ms;
  --motion-label: 700ms;
  --motion-scene-filter: 1000ms;

  position: absolute;
  inset: 0;
  pointer-events: none;
  button {
    pointer-events: auto;
  }

  &__label {
    font: 500 var(--text-label-size) / var(--text-label-line) var(--font-text);
    position: absolute;
    top: 81px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--color-bg-page);
    white-space: nowrap;
    cursor: pointer;
    transition: color var(--motion-label);
  }
  &__close,
  &__history {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    position: absolute;
    z-index: 1;
    top: 64px;
  }
  &__close {
    left: var(--spacing-3);
  }
  &__history {
    right: var(--spacing-3);
  }
  &__greeting {
    position: absolute;
    left: 0;
    top: 122px;
    width: 100%;
    height: 52px;
    padding: 0;
    margin: 0;
    border: 0;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--color-bg-page);
    font-family: var(--font-display);
    font-weight: 600;
    font-size: var(--heading-h2-size);
    line-height: var(--heading-h2-line);
    cursor: pointer;
    transform-origin: center top;
    transition:
      top var(--motion-scene-filter) var(--ease-out),
      height var(--motion-scene-filter) var(--ease-out),
      font-size var(--motion-scene-filter) var(--ease-out),
      line-height var(--motion-scene-filter) var(--ease-out),
      transform var(--motion-scene-filter) var(--ease-out),
      color var(--motion-color),
      opacity var(--motion-color);
  }
  &--active &__label {
    top: 77px;
    color: var(--color-accent-default);
    cursor: default;
  }
  &--active &__greeting {
    top: 141px;
    height: 108px;
    font-size: 40px;
    line-height: 54px;
    color: var(--color-fg-default);
    cursor: default;
  }
  &:not(&--ready) &__greeting {
    opacity: 0;
    transform: translateY(var(--spacing-4));
  }
}

@media (prefers-reduced-motion: reduce) {
  .assistant-header {
    --motion-color: 1ms;
    --motion-label: 1ms;
    --motion-scene-filter: 1ms;
  }
}
</style>
