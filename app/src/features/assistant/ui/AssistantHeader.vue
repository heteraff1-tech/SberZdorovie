<template>
  <header
    class="assistant-header"
    :class="{ 'assistant-header--active': active, 'assistant-header--ready': ready }"
  >
    <UiIconButton
      v-if="active"
      class="assistant-header__close"
      icon="close"
      label="Закрыть помощника"
      @click="$emit('close')"
    />
    <UiButton
      class="assistant-header__label"
      variant="quiet"
      :aria-disabled="active || undefined"
      @click="!active && $emit('open')"
    >
      <UiIcon name="assistant" :inverse="!active" /><span>ИИ помощник</span>
    </UiButton>
    <span v-if="active" class="assistant-header__history" aria-hidden="true"
      ><UiIcon name="chat"
    /></span>
    <h1 class="assistant-header__greeting">
      <span>Привет, {{ name }}!</span><span>Чем могу помочь</span>
      <UiButton
        v-if="!active"
        class="assistant-header__open"
        variant="quiet"
        :aria-label="`Привет, ${name}! Открыть ИИ-помощника`"
        @click="$emit('open')"
      />
    </h1>
  </header>
</template>

<script setup>
import { UiButton, UiIcon, UiIconButton } from '@/shared/ui';
defineProps({ name: { type: String, required: true }, active: Boolean, ready: Boolean });
defineEmits(['open', 'close']);
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
    top: 92px;
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
    min-height: 0;
    transition:
      color var(--motion-label),
      top var(--motion-label) var(--ease-out);
    &:hover:not(:disabled) {
      background: transparent;
    }
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
    top: 118px;
    width: 100%;
    height: 60px;
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
    font-size: 32px;
    line-height: var(--heading-h1-line);
    letter-spacing: -1.6px;
    cursor: pointer;
    transform-origin: center top;
    transition:
      top var(--motion-scene-filter) var(--ease-out),
      height var(--motion-scene-filter) var(--ease-out),
      font-size var(--motion-scene-filter) var(--ease-out),
      line-height var(--motion-scene-filter) var(--ease-out),
      letter-spacing var(--motion-scene-filter) var(--ease-out),
      transform var(--motion-scene-filter) var(--ease-out),
      color var(--motion-color),
      opacity var(--motion-color);
  }
  &__open {
    position: absolute;
    inset: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    &:hover:not(:disabled) {
      background: transparent;
    }
  }
  &--active &__label {
    top: 77px;
    cursor: default;

    span:not(.ui-icon) {
      background: var(--effect-assistant-badge);
      background-clip: text;
      color: transparent;
    }
  }
  &--active &__greeting {
    top: 141px;
    height: 108px;
    font-size: var(--display-metric-size);
    line-height: var(--display-metric-line);
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
