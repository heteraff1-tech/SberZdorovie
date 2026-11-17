<template>
  <section class="pulse-insight" aria-label="Рекомендация ИИ">
    <div class="pulse-insight__badge"><UiIcon name="assistant" />ИИ помощник</div>
    <h2>Пульс покоя выше нормы в течение дня</h2>
    <p>Даже в покое (без учета тренировок и кофе) пульс держится выше вашей нормы</p>
    <button type="button" @click="$emit('discuss')">Обсудить с терапевтом онлайн</button>
  </section>
</template>

<script setup>
import { UiIcon } from '@/shared/ui';
defineEmits(['discuss']);
</script>

<style scoped lang="scss" src="@/assets/styles/features/health/pulse-insight.scss"></style>
