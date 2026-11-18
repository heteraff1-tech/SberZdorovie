<template>
  <AssistantScene :active="active && !response" />
  <section
    v-if="active"
    class="assistant-safety"
    :class="{ 'assistant-safety--open': response }"
    aria-label="Медицинский сценарий"
  >
    <template v-if="!response">
      <UiButton
        v-for="item in healthcareSuggestions"
        :key="item.id"
        ref="choices"
        class="assistant-safety__choice"
        variant="secondary"
        @click="chooseSymptoms(item.id)"
        >{{ item.label }}</UiButton
      >
    </template>
    <article v-else class="assistant-safety__warning" role="alert" :data-rule="response.ruleId">
      <h2 ref="warningHeading" tabindex="-1">{{ response.title }}</h2>
      <p>{{ response.disclaimer }}</p>
      <p>{{ response.message }}</p>
      <p>{{ response.urgent }}</p>
      <UiButton :href="response.action.href">{{ response.action.label }}</UiButton>
      <p class="assistant-safety__contact">{{ response.contact }}</p>
      <UiButton variant="quiet" @click="returnToSymptoms">Вернуться к выбору симптомов</UiButton>
    </article>
  </section>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import { UiButton } from '@/shared/ui';
import { healthcareSuggestions } from '../config/suggestions';
import { useAssistantSafety } from '../model/useAssistantSafety';
import AssistantScene from './AssistantScene.vue';

defineProps({ active: Boolean });
const { response, select, reset } = useAssistantSafety();
const warningHeading = ref(null);
const choices = ref([]);

/** После смены содержимого переносит фокус на предупреждение, сохраняя Escape. */
async function chooseSymptoms(id) {
  select(id);
  await nextTick();
  warningHeading.value?.focus({ preventScroll: true });
}

/** Возвращает фокус на доступный выбор симптомов после закрытия предупреждения. */
async function returnToSymptoms() {
  reset();
  await nextTick();
  choices.value[0]?.focus({ preventScroll: true });
}
</script>

<style scoped lang="scss">
.assistant-safety {
  position: absolute;
  z-index: 2;
  inset: auto var(--spacing-6) calc(var(--spacing-10) * 3);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-2);
  &__choice {
    white-space: normal;
    font: 500 var(--text-footnote-size) / var(--text-footnote-line) var(--font-text);
  }
  &--open {
    top: calc(var(--spacing-10) * 4.5);
    display: block;
    overflow-y: auto;
    scrollbar-width: thin;
  }
  &__warning {
    display: grid;
    gap: var(--spacing-3);
    padding: var(--padding-m);
    border: 1px solid var(--color-warning-default);
    border-radius: var(--border-radius-xl);
    background: var(--color-bg-page);
    color: var(--color-fg-default);
    font: 400 var(--text-small-size) / var(--text-small-line) var(--font-text);
    h2 {
      margin: 0;
      font: 600 var(--heading-h3-size) / var(--heading-h3-line) var(--font-display);
    }
    p {
      margin: 0;
    }
  }
  &__contact {
    color: var(--color-neutral-default);
  }
}
</style>
