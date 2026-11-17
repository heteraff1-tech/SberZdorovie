import { ref } from 'vue';
import { assistantSuggestions } from '../config/suggestions';
import { useVoiceInput } from './useVoiceInput';

export function useAssistant() {
  const draft = ref('');
  const file = ref(null);
  const notice = ref('');
  const messages = ref([]);
  const historyOpen = ref(false);
  const focusRequest = ref(0);
  const voice = useVoiceInput(
    (text) => {
      draft.value = text;
    },
    (text) => {
      notice.value = text;
    },
  );

  function selectSuggestion(id) {
    const suggestion = assistantSuggestions.find((item) => item.id === id);
    if (!suggestion) return;
    compose(suggestion.prompt);
  }

  function compose(prompt) {
    draft.value = prompt;
    focusRequest.value += 1;
  }

  function attach(value) {
    file.value = value;
    notice.value = value ? `Прикреплён файл: ${value.name}` : '';
  }

  function send() {
    const text = draft.value.trim();
    if (!text && !file.value) return;
    messages.value.push({ text, file: file.value?.name });
    draft.value = '';
    file.value = null;
    notice.value = 'Сообщение сохранено в прототипе. ИИ-ответы пока не подключены.';
  }

  function closeHistory() {
    historyOpen.value = false;
  }
  function toggleHistory() {
    historyOpen.value = !historyOpen.value;
  }
  function deactivate() {
    closeHistory();
    voice.stop();
  }

  return {
    draft,
    file,
    notice,
    messages,
    historyOpen,
    focusRequest,
    listening: voice.listening,
    suggestions: assistantSuggestions,
    selectSuggestion,
    compose,
    attach,
    send,
    closeHistory,
    toggleHistory,
    deactivate,
    toggleVoice: voice.toggle,
  };
}
