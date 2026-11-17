<template>
  <section
    class="ui-bottom-sheet"
    :class="{ 'ui-bottom-sheet--open': open, 'ui-bottom-sheet--dragging': dragging }"
    :style="{ '--sheet-drag': `${drag}px` }"
    :inert="!open"
    :aria-label="label"
  >
    <button
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
  label: { type: String, default: 'Панель' },
  dismissLabel: { type: String, default: 'Свернуть панель' },
});
const emit = defineEmits(['dismiss']);
const { drag, dragging, start, move, release, click } = useSwipeDismiss(toRef(props, 'open'), () =>
  emit('dismiss'),
);
</script>

<style scoped lang="scss" src="@/assets/styles/components/bottom-sheet.scss"></style>
