<template>
  <header
    class="assistant-header"
    :class="{ 'assistant-header--active': active, 'assistant-header--ready': ready }"
  >
    <UiIconButton
      v-show="active"
      ref="closeButton"
      class="assistant-header__close"
      icon="close"
      label="Вернуться к показателям здоровья"
      @click="$emit('close')"
    />
    <button
      ref="openButton"
      class="assistant-header__label"
      type="button"
      :disabled="active"
      :aria-expanded="active"
      @click="$emit('open')"
    >
      <UiIcon name="assistant" :inverse="!active" /><span>ИИ помощник</span>
    </button>
    <UiIconButton
      v-show="active"
      class="assistant-header__history"
      icon="chat"
      label="История сообщений"
      :aria-expanded="historyOpen"
      @click="$emit('history')"
    />
    <button
      class="assistant-header__greeting"
      type="button"
      :disabled="active"
      :aria-label="`Привет, ${name}! Открыть ИИ-помощника`"
      @click="$emit('open')"
    >
      <span>Привет, {{ name }}!</span><span>Чем могу помочь</span>
    </button>
  </header>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
import { UiIcon, UiIconButton } from '@/shared/ui';

const props = defineProps({
  name: { type: String, required: true },
  active: Boolean,
  ready: Boolean,
  historyOpen: Boolean,
});
defineEmits(['open', 'close', 'history']);
const openButton = ref(null);
const closeButton = ref(null);
watch(
  () => props.active,
  async (active) => {
    await nextTick();
    (active ? closeButton : openButton).value?.focus({ preventScroll: true });
  },
);
</script>

<style scoped lang="scss" src="@/assets/styles/features/assistant/assistant-header.scss"></style>
