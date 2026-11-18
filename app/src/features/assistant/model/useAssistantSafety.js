import { computed, ref } from 'vue';
import { healthcareSuggestions } from '../config/suggestions';
import { getAssistantResponse } from './healthcareGuardrail';

/** Хранит только выбранный сценарий HC-001; не обрабатывает свободный медицинский ввод. */
export function useAssistantSafety() {
  const selected = ref(null);
  const response = computed(() => getAssistantResponse(selected.value?.symptoms));

  /** Выбирает существующий вариант из конфигурации, не доверяя произвольному ID. */
  function select(id) {
    selected.value = healthcareSuggestions.find((item) => item.id === id) ?? null;
  }

  /** Возвращает выбор симптомов без сохранения истории сообщений. */
  function reset() {
    selected.value = null;
  }

  return { response, select, reset };
}
