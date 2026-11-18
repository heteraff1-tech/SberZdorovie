<template>
  <section class="pulse-overview" aria-label="Пульс — обзор">
    <header class="pulse-overview__header">
      <UiIconButton
        ref="back"
        class="pulse-overview__back"
        icon="chevron"
        label="Вернуться к показателям здоровья"
        @click="$emit('back')"
      />
      <h1>Пульс</h1>
    </header>
    <PulseHeart :value="value" />
    <p class="pulse-overview__status">У вас повышенный пульс</p>
    <div class="pulse-overview__actions">
      <UiButton variant="secondary" pill disabled><UiIcon name="camera" />Замер по камере</UiButton>
      <UiButton variant="secondary" pill disabled><UiIcon name="plus" />Добавить замер</UiButton>
    </div>
    <div class="pulse-overview__widgets">
      <PulseInsight @discuss="$emit('discuss')" />
      <PulseHistory :data="pulseHistory" />
      <div class="pulse-overview__report">
        <UiIcon name="file" /><span class="pulse-overview__report-label">Отчёт для врача</span
        ><UiIcon name="chevron" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { UiButton, UiIcon, UiIconButton } from '@/shared/ui';
import PulseHeart from './PulseHeart.vue';
import PulseHistory from './PulseHistory.vue';
import PulseInsight from './PulseInsight.vue';
import { pulseHistory } from '../config/pulse-history';
defineProps({ value: { type: Number, required: true } });
defineEmits(['back', 'discuss']);
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
  padding: 55px 0 100px;
  background: var(--color-bg-page);
  &::-webkit-scrollbar {
    display: none;
  }
  &__header {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 44px;
    margin-bottom: 20px;
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
    font: 400 var(--text-small-size) / var(--text-small-line) var(--font-text);
    text-align: center;
    margin: 8px 0 13px;
    color: var(--color-warning-default);
  }
  &__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    margin: 0 24px 24px;
  }
  &__widgets {
    display: grid;
    gap: 4px;
    padding: 0 24px;
  }
  &__report {
    font: 500 var(--text-label-size) / var(--text-label-line) var(--font-text);
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 16px 18px;
    border-radius: var(--border-radius-xl);
    background: var(--color-bg-surface);
    &-label {
      flex: 1;
    }
  }
}
</style>
