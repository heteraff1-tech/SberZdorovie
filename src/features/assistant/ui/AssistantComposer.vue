<template>
  <div class="assistant-composer">
    <p v-if="notice" class="assistant-composer__notice" role="status">{{ notice }}</p>
    <form class="assistant-composer__form" @submit.prevent="$emit('send')">
      <input
        ref="attachment"
        type="file"
        class="assistant-composer__file"
        aria-label="Выбрать файл"
        tabindex="-1"
        @change="attach"
      />
      <button
        class="assistant-composer__attachment"
        type="button"
        aria-label="Добавить вложение"
        @click="attachment.click()"
      >
        <UiIcon name="attachment" />
      </button>
      <UiInput
        ref="input"
        class="assistant-composer__input"
        :model-value="modelValue"
        aria-label="Сообщение ИИ-помощнику"
        placeholder="Введите сообщение"
        autocomplete="off"
        @update:model-value="$emit('update:modelValue', $event)"
      >
        <template #action>
          <UiButton
            v-if="modelValue.trim() || file"
            class="assistant-composer__send"
            size="icon"
            type="submit"
            aria-label="Отправить сообщение"
            >↑</UiButton
          >
          <UiIconButton
            v-else
            icon="microphone"
            :label="listening ? 'Остановить голосовой ввод' : 'Голосовой ввод'"
            :aria-pressed="listening"
            @click="$emit('voice')"
          />
        </template>
      </UiInput>
    </form>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
import { UiButton, UiIcon, UiIconButton, UiInput } from '@/shared/ui';

const props = defineProps({
  modelValue: { type: String, default: '' },
  file: Object,
  notice: String,
  listening: Boolean,
  focusRequest: Number,
});
const emit = defineEmits(['update:modelValue', 'attach', 'send', 'voice']);
const input = ref(null);
const attachment = ref(null);
function attach(event) {
  emit('attach', event.target.files[0] ?? null);
  event.target.value = '';
}
watch(
  () => props.focusRequest,
  async () => {
    await nextTick();
    input.value?.focus();
  },
);
</script>

<style scoped lang="scss" src="@/assets/styles/features/assistant/assistant-composer.scss"></style>
