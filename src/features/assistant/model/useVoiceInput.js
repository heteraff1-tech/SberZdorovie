import { onScopeDispose, ref } from 'vue';

export function useVoiceInput(onTranscript, onNotice) {
  const listening = ref(false);
  let recognition;

  function stop() {
    recognition?.abort();
    listening.value = false;
  }

  function toggle() {
    if (listening.value) {
      stop();
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onNotice('Голосовой ввод недоступен в этом браузере. Введите сообщение текстом.');
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.onresult = (event) => onTranscript(event.results[0][0].transcript);
    recognition.onend = () => {
      listening.value = false;
    };
    recognition.onerror = () => {
      onNotice('Не удалось включить микрофон. Проверьте доступ в браузере.');
      listening.value = false;
    };
    try {
      recognition.start();
      listening.value = true;
    } catch {
      onNotice('Микрофон недоступен.');
    }
  }

  onScopeDispose(stop);
  return { listening, toggle, stop };
}
