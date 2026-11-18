<template>
  <div class="assistant-composer" aria-label="Сообщение ИИ-помощнику">
    <span class="assistant-composer__attachment" aria-hidden="true"
      ><span class="assistant-composer__plus"></span
    ></span>
    <div class="assistant-composer__field">
      <span>Введите сообщение</span>
      <UiIcon name="microphone" />
    </div>
  </div>
</template>

<script setup>
import { UiIcon } from '@/shared/ui';
</script>

<style scoped lang="scss">
.assistant-composer {
  display: flex;
  gap: var(--spacing-2);
  height: var(--size-56);
  &__attachment {
    display: grid;
    place-items: center;
    flex: 0 0 var(--size-56);
    border-radius: var(--border-radius-full);
    background: var(--color-bg-surface);
  }
  &__plus {
    position: relative;
    width: 20px;
    height: 20px;
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 9px;
      left: 0;
      width: 20px;
      height: 2px;
      background: currentColor;
    }
    &::after {
      transform: rotate(90deg);
    }
  }
  &__field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    min-width: 0;
    padding-inline: var(--padding-m);
    border-radius: var(--border-radius-full);
    background: var(--color-bg-surface);
    color: var(--color-fg-default);
    font: 400 var(--text-body-size) / var(--text-body-line) var(--font-text);
  }
}
</style>
