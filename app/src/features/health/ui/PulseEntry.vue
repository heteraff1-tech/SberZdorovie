<template>
  <aside
    class="pulse-entry"
    :class="{ 'pulse-entry--compact': compact }"
    aria-label="Ручной ввод пульса"
  >
    <h2 v-if="!compact">Добавить замер пульса</h2>
    <form @submit.prevent="submit">
      <label :for="valueId">Пульс, уд/мин</label>
      <input
        :id="valueId"
        v-model.number="value"
        type="number"
        inputmode="numeric"
        min="1"
        :max="pulseInputMax"
        step="1"
        required
        @input="message = ''"
      />
      <label :for="timeId">Дата и время замера</label>
      <input
        :id="timeId"
        v-model="localTime"
        type="datetime-local"
        :aria-describedby="hintId"
        @input="message = ''"
      />
      <p :id="hintId">Если оставить поле пустым, используем текущее время.</p>
      <UiButton type="submit">Сохранить замер</UiButton>
      <UiButton variant="quiet" @click="resetMeasurements">Сбросить замеры</UiButton>
      <p role="status">{{ message }}</p>
    </form>
  </aside>
</template>

<script setup>
import { ref, useId } from 'vue';
import { UiButton } from '@/shared/ui';
import { pulseInputMax } from '../model/usePulseMeasurements';

const props = defineProps({
  save: { type: Function, required: true },
  reset: { type: Function, required: true },
  compact: Boolean,
});
const valueId = useId();
const timeId = useId();
const hintId = useId();
const value = ref('');
const localTime = ref('');
const message = ref('');

function submit() {
  const error = props.save(value.value, localTime.value);
  message.value = error || `Сохранено: ${value.value} уд/мин`;
  if (!error) {
    value.value = '';
    localTime.value = '';
  }
}

function resetMeasurements() {
  if (!window.confirm('Удалить все ручные замеры пульса и восстановить демо-данные?')) return;
  const error = props.reset();
  message.value = error || 'Ручные замеры сброшены';
  if (!error) {
    value.value = '';
    localTime.value = '';
  }
}
</script>

<style scoped lang="scss">
.pulse-entry {
  box-sizing: border-box;
  width: min(100%, 280px);
  padding: var(--spacing-5);
  border-radius: var(--border-radius-xl);
  background: var(--color-bg-surface);
  color: var(--color-fg-default);
  font: 500 var(--text-label-size) / var(--text-label-line) var(--font-text);

  &--compact {
    width: 100%;
  }
  h2 {
    margin: 0 0 var(--spacing-4);
    font: 600 var(--heading-h4-size) / var(--heading-h4-line) var(--font-display);
  }
  form {
    display: grid;
    gap: var(--spacing-2);
  }
  input {
    width: 100%;
    min-height: var(--size-44);
    padding: 0 var(--spacing-3);
    border: 1px solid var(--color-border-default);
    border-radius: var(--border-radius-s);
    background: var(--color-bg-page);
    color: inherit;
    font: inherit;
  }
  p {
    margin: 0;
    color: var(--color-neutral-default);
    &:empty {
      display: none;
    }
  }
}
</style>
