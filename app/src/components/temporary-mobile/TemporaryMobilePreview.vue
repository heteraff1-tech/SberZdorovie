<template>
  <div class="mobile-preview" :class="{ 'mobile-preview--light': light }">
    <div ref="viewport" class="mobile-preview__viewport">
      <div class="screen mobile-preview__surface" :style="surfaceStyle"><slot /></div>
    </div>
    <div v-if="!fullscreen" class="mobile-preview__controls">
      <UiButton v-if="supported" size="sm" variant="secondary" @click="enterFullscreen"
        >На весь экран</UiButton
      >
      <p v-if="message" role="status">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { UiButton } from '@/shared/ui';
import { useMobilePreview } from './useMobilePreview';

defineProps({ light: Boolean });
const viewport = ref(null);
const { surfaceStyle, fullscreen, supported, message, enterFullscreen } =
  useMobilePreview(viewport);
</script>

<style scoped lang="scss">
// Весь временный адаптер изолирован здесь; обычный PhonePreview не изменяется.
.mobile-preview {
  --preview-screen-width: 402px;
  --preview-screen-radius: 0px;

  display: grid;
  grid-template-rows: minmax(0, 1fr);
  width: 100%;
  height: 100dvh;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom)
    env(safe-area-inset-left);
  background: var(--effect-onboarding-bg);
  &--light {
    background: var(--color-bg-page);
  }
  &__viewport {
    position: relative;
    min-height: 0;
    overflow: hidden;
  }
  &__surface {
    position: absolute;
    inset: 0 auto auto 0;
    width: var(--preview-screen-width);
    height: var(--preview-screen-height);
    overflow: clip;
    isolation: isolate;
    transform: scale(var(--mobile-scale));
    transform-origin: top left;
  }
  &__controls {
    position: fixed;
    z-index: 20;
    top: calc(env(safe-area-inset-top) + var(--spacing-2));
    right: calc(env(safe-area-inset-right) + var(--spacing-2));
    max-width: calc(100% - var(--spacing-4));
    text-align: right;
    p {
      margin: var(--spacing-2) 0 0;
      padding: var(--padding-s);
      border-radius: var(--border-radius-m);
      background: var(--color-bg-page);
      color: var(--color-fg-default);
      font: 400 var(--text-small-size) / var(--text-small-line) var(--font-text);
    }
  }
  .mobile-preview__surface {
    // На низком viewport прокручивается содержимое шторы, а заголовок остаётся свободным.
    :deep(.home-page__sheet:not(.ui-bottom-sheet--expanded)) {
      --sheet-height: min(642px, calc(100% - 232px));
      .ui-bottom-sheet__content {
        padding-bottom: calc(var(--spacing-10) * 2);
      }
    }
    :deep(.assistant-scene) {
      transform: scale(var(--mobile-scene-scale));
      transform-origin: 50% 0;
    }
    :deep(.home-page__indicator) {
      display: none;
    }
    :deep(.onboarding .action) {
      top: auto;
      bottom: var(--spacing-10);
    }
    :deep(.onboarding[data-phase='connect'] .action) {
      bottom: calc(var(--spacing-9) * 2);
    }
  }
}
</style>
