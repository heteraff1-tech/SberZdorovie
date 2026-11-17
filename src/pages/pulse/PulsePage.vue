<template>
  <section class="pulse-page" aria-label="Пульс — обзор">
    <header class="pulse-page__header">
      <UiIconButton
        ref="back"
        class="pulse-page__back"
        icon="chevron"
        label="Вернуться к показателям здоровья"
        @click="$emit('back')"
      />
      <h1>Пульс</h1>
    </header>
    <PulseHeart :value="value" />
    <p class="pulse-page__status">У вас повышенный пульс</p>
    <div class="pulse-page__actions">
      <UiButton variant="secondary" pill disabled><UiIcon name="camera" />Замер по камере</UiButton>
      <UiButton variant="secondary" pill disabled><UiIcon name="plus" />Добавить замер</UiButton>
    </div>
    <div class="pulse-page__widgets">
      <PulseInsight @discuss="$emit('discuss')" />
      <PulseHistory :data="pulseHistory" />
      <div class="pulse-page__report">
        <UiIcon name="file" /><span class="pulse-page__report-label">Отчёт для врача</span
        ><UiIcon name="chevron" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { UiButton, UiIcon, UiIconButton } from '@/shared/ui';
import { PulseHeart, PulseHistory, PulseInsight, pulseHistory } from '@/features/health';
defineProps({ value: { type: Number, required: true } });
defineEmits(['back', 'discuss']);
const back = ref(null);
onMounted(() => back.value?.focus({ preventScroll: true }));
</script>

<style scoped lang="scss" src="@/assets/styles/pages/pulse.scss"></style>
