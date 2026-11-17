<template>
  <main class="design-system-page">
    <header class="design-system-page__header">
      <h1>Health · Дизайн-система</h1>
      <p>Те же токены и Ui-компоненты, которые используются в приложении.</p>
      <a href="#home">Открыть главную</a>
    </header>

    <section
      v-for="theme in ['light', 'dark']"
      :key="theme"
      :data-theme="theme"
      class="design-system-page__theme"
      :aria-label="`${theme} компоненты`"
    >
      <h2>{{ theme === 'light' ? 'Светлая тема' : 'Тёмная тема' }}</h2>
      <div class="design-system-page__swatches" aria-label="Семантические цвета">
        <span
          v-for="role in colorRoles"
          :key="role"
          :style="{ background: `var(--${role})` }"
          :title="role"
        ></span>
      </div>
      <div class="design-system-page__buttons">
        <UiButton>Основная</UiButton>
        <UiButton variant="secondary">Вторичная</UiButton>
        <UiButton variant="quiet">Тихая</UiButton>
        <UiButton variant="destructive">Удалить</UiButton>
        <UiButton disabled>Недоступна</UiButton>
        <UiButton loading>Загрузка…</UiButton>
        <UiIconButton icon="chat" label="Пример иконки" />
      </div>
      <div class="design-system-page__fields">
        <UiInput v-model="examples[theme]" label="Сообщение" placeholder="Введите сообщение" />
        <UiInput model-value="Пример ошибки" label="Ошибка" status="error" />
        <UiInput model-value="Недоступное поле" label="Недоступно" disabled />
      </div>
      <div class="design-system-page__cards">
        <UiMetricCard title="Показатель" subtitle="Независимый компонент">
          <UiMetricValue value="76" unit="Кг" status="Отличный результат" tone="positive" />
          <UiDotScale :value="0.56" label="Пример шкалы" />
        </UiMetricCard>
        <UiGlassCard label="Быстрое действие"><UiIcon name="assistant" /></UiGlassCard>
      </div>
      <div class="design-system-page__typography">
        <p class="heading-h1">Heading H1</p>
        <p class="heading-h2">Heading H2</p>
        <p class="text-body">Body — основной текст</p>
        <p class="text-label">Label — подпись контрола</p>
        <p class="text-caption">Caption — подпись графика</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive } from 'vue';
import {
  UiButton,
  UiIconButton,
  UiInput,
  UiIcon,
  UiMetricCard,
  UiMetricValue,
  UiDotScale,
  UiGlassCard,
} from '@/shared/ui';

const examples = reactive({ light: '', dark: '' });
const colorRoles = [
  'background-surface2',
  'foreground-default',
  'accent-default',
  'success-default',
  'warning-default',
  'error-default',
  'info-default',
];
</script>

<style scoped lang="scss" src="@/assets/styles/pages/design-system.scss"></style>
