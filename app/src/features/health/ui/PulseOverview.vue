<template>
  <section class="pulse-overview" aria-label="Пульс — обзор">
    <header class="pulse-overview__header">
      <UiIconButton
        ref="back"
        class="pulse-overview__back"
        icon="back"
        label="Вернуться к показателям здоровья"
        @click="$emit('back')"
      />
      <h1>Пульс</h1>
    </header>
    <PulseHeart :value="value" />
    <p v-if="status.label" class="pulse-overview__status">
      {{ demo ? 'У вас повышенный пульс' : `${status.label} пульс` }}
    </p>
    <div class="pulse-overview__actions">
      <UiButton variant="secondary" pill disabled><UiIcon name="camera" />Замер по камере</UiButton>
      <UiButton variant="secondary" pill disabled><UiIcon name="plus" />Добавить замер</UiButton>
    </div>
    <div class="pulse-overview__widgets">
      <PulseInsight @discuss="$emit('discuss')" />
      <PulseHistory :measurements="measurements" />
      <div class="pulse-overview__report">
        <UiIcon name="file" /><span class="pulse-overview__report-label">Отчёт для врача</span
        ><UiIcon name="chevron" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { UiButton, UiIcon, UiIconButton } from '@/shared/ui';
import { pulseStatus } from '../model/measurementStatus';
import PulseHeart from './PulseHeart.vue';
import PulseHistory from './PulseHistory.vue';
import PulseInsight from './PulseInsight.vue';
const props = defineProps({
  value: { type: Number, default: null },
  measurements: { type: Array, required: true },
  demo: Boolean,
});
defineEmits(['back', 'discuss']);
const status = computed(() => pulseStatus(props.value, props.demo));
const back = ref(null);
// При раскрытии шторы первым доступным действием становится возврат.
onMounted(() => back.value?.focus({ preventScroll: true }));
</script>

<style scoped lang="scss">
.pulse-overview {
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  padding-bottom: calc(var(--spacing-9) * 2);
  background: var(--color-bg-page);
  &::-webkit-scrollbar {
    display: none;
  }
  &__header {
    position: sticky;
    z-index: 1;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(var(--spacing-10) + 43px);
    padding-top: var(--spacing-10);
    margin-bottom: var(--spacing-5);
    background: var(--color-bg-page);
    h1 {
      font: 600 var(--heading-h1-size) / var(--heading-h1-line) var(--font-display);
      margin: 0;
    }
  }
  &__back {
    position: absolute;
    left: 14px;
    transform: rotate(180deg);
  }
  &__status {
    font: 600 var(--heading-h4-size) / var(--heading-h4-line) var(--font-display);
    text-align: center;
    margin: var(--spacing-2) 0 0;
    color: var(--color-warning-default);
  }
  &__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-1);
    margin: var(--spacing-3) var(--spacing-6) calc(var(--spacing-6) - var(--spacing-1) / 2);
    .ui-button:disabled {
      color: var(--color-fg-default);
    }
  }
  &__widgets {
    display: grid;
    gap: var(--spacing-1);
    padding: 0 var(--spacing-6);
  }
  &__report {
    font: 500 var(--text-label-size) / var(--text-label-line) var(--font-text);
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    padding: var(--spacing-4);
    border-radius: var(--border-radius-xl);
    background: var(--color-bg-surface);
    &-label {
      flex: 1;
    }
  }
}
</style>
