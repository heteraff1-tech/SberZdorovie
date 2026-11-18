<template>
  <section class="pulse-insight" aria-label="Обсуждение пульса">
    <div class="pulse-insight__badge"><UiIcon name="assistant" /><span>ИИ помощник</span></div>
    <h2>Пульс покоя выше нормы в течение дня</h2>
    <p>Даже в покое (без учета тренировок и кофе) пульс держится выше вашей нормы</p>
    <p>Пример рекомендации на демонстрационных данных</p>
    <button type="button" @click="$emit('discuss')">Обсудить с терапевтом онлайн</button>
  </section>
</template>

<script setup>
import { UiIcon } from '@/shared/ui';
defineEmits(['discuss']);
</script>

<style scoped lang="scss">
.pulse-insight {
  padding: var(--spacing-4);
  border-radius: var(--border-radius-xl);
  background: var(--color-bg-surface);
  &__badge {
    font: 500 var(--text-label-size) / var(--text-label-line) var(--font-text);
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    span:not(.ui-icon) {
      background: var(--effect-assistant-badge);
      background-clip: text;
      color: transparent;
    }
  }
  h2 {
    font: 600 var(--heading-h4-size) / var(--heading-h4-line) var(--font-display);
    margin: var(--spacing-1) 0 var(--spacing-3);
  }
  p {
    font: 400 var(--text-small-size) / var(--text-small-line) var(--font-text);
    margin: 0 0 var(--spacing-3);
  }
  button {
    font: 500 var(--text-label-size) / var(--text-label-line) var(--font-text);
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--color-accent-default);
    cursor: pointer;
  }
}
</style>
