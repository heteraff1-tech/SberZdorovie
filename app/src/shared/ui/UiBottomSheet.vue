<template>
  <section
    class="ui-bottom-sheet"
    :class="{
      'ui-bottom-sheet--open': open,
      'ui-bottom-sheet--dragging': dragging,
      'ui-bottom-sheet--expanded': expanded,
    }"
    :style="{ '--sheet-drag': `${drag}px` }"
    :inert="!open"
    :aria-label="label"
  >
    <button
      v-show="!expanded"
      class="ui-bottom-sheet__handle"
      type="button"
      :aria-label="dismissLabel"
      @click="click"
      @keydown.down.prevent="$emit('dismiss')"
      @pointerdown="start"
      @pointermove="move"
      @pointerup="release"
      @pointercancel="release($event, true)"
      @lostpointercapture="release($event, true)"
    >
      <span aria-hidden="true"></span>
    </button>
    <div class="ui-bottom-sheet__content"><slot /></div>
  </section>
</template>

<script setup>
import { toRef } from 'vue';
import { useSwipeDismiss } from '@/shared/composables/useSwipeDismiss';

const props = defineProps({
  open: Boolean,
  expanded: Boolean,
  label: { type: String, default: 'Панель' },
  dismissLabel: { type: String, default: 'Свернуть панель' },
});
const emit = defineEmits(['dismiss']);
const { drag, dragging, start, move, release, click } = useSwipeDismiss(toRef(props, 'open'), () =>
  emit('dismiss'),
);
</script>

<style scoped lang="scss">
.ui-bottom-sheet {
  --motion-sheet: 820ms;

  position: absolute;
  z-index: 3;
  inset: auto 0 0;
  height: var(--sheet-height, auto);
  max-height: 100%;
  border-radius: var(--border-radius-xxl) var(--border-radius-xxl) 0 0;
  background: var(--color-bg-page);
  box-shadow: 0 -4px 4px rgb(34 138 113 / 15%);
  transform: translateY(calc(100% + var(--spacing-4)));
  transition:
    transform var(--motion-sheet) var(--ease-out),
    height var(--motion-sheet) var(--ease-out),
    border-radius var(--motion-sheet) var(--ease-out);

  &--expanded {
    height: 100%;
    border-radius: 0;
  }
  &--expanded &__content {
    padding: 0;
    overflow: hidden;
  }

  &--open {
    transform: translateY(var(--sheet-drag));
  }
  &--dragging {
    transition: none;
  }
  &__handle {
    position: absolute;
    top: 0;
    display: grid;
    place-items: start center;
    width: 100%;
    height: var(--spacing-6);
    padding: var(--spacing-1) 0 0;
    border: 0;
    background: transparent;
    cursor: grab;
    touch-action: none;
    &:active {
      cursor: grabbing;
    }
    span {
      width: 34px;
      height: var(--spacing-1);
      border-radius: var(--border-radius-xs);
      background: var(--color-fg-default);
    }
  }
  &__content {
    height: 100%;
    padding: var(--spacing-6) var(--spacing-6) 35px;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .ui-bottom-sheet {
    --motion-sheet: 1ms;
  }
}
</style>
