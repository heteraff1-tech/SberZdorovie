<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { designAsset } from '@/shared/lib/design-asset'
const message = ref('')
const input = ref(null)
const attachment = ref(null)
const file = ref(null)
const notice = ref('')
const listening = ref(false)
let recognition
const emit = defineEmits(['send'])
function fill(value) { message.value = value.replaceAll('\n', ' '); input.value?.focus() }
defineExpose({ fill })
function send() {
  if (!message.value.trim() && !file.value) return
  emit('send', { text: message.value.trim(), file: file.value?.name })
  notice.value = 'Сообщение сохранено в прототипе. ИИ-ответы пока не подключены.'
  message.value = ''
  file.value = null
  attachment.value.value = ''
}
function attach(event) { file.value = event.target.files[0] ?? null; notice.value = file.value ? `Прикреплён файл: ${file.value.name}` : '' }
function dictate() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) { notice.value = 'Голосовой ввод недоступен в этом браузере. Введите сообщение текстом.'; return }
  if (listening.value) { recognition?.stop(); return }
  recognition = new SpeechRecognition()
  recognition.lang = 'ru-RU'
  recognition.onresult = event => { message.value = event.results[0][0].transcript }
  recognition.onend = () => { listening.value = false }
  recognition.onerror = () => { notice.value = 'Не удалось включить микрофон. Проверьте доступ в браузере.'; listening.value = false }
  try { recognition.start(); listening.value = true } catch { notice.value = 'Микрофон недоступен.' }
}
onBeforeUnmount(() => recognition?.abort())
</script>

<template>
  <div class="message-composer">
    <p v-if="notice" class="composer-notice" role="status">{{ notice }}</p>
    <form class="composer-form" @submit.prevent="send">
      <input ref="attachment" type="file" class="file-input" aria-label="Выбрать файл" tabindex="-1" @change="attach" />
      <button class="attachment-button" type="button" aria-label="Добавить вложение" @click="attachment.click()"><img :src="designAsset('img8')" alt="" /></button>
      <div class="message-field"><input ref="input" v-model="message" aria-label="Сообщение ИИ-помощнику" placeholder="Введите сообщение" autocomplete="off" />
        <button v-if="message.trim() || file" class="voice-button send-button" type="submit" aria-label="Отправить сообщение">↑</button>
        <button v-else class="voice-button" :class="{ 'is-listening': listening }" type="button" :aria-label="listening ? 'Остановить голосовой ввод' : 'Голосовой ввод'" :aria-pressed="listening" @click="dictate"><img :src="designAsset('imgGroup1')" alt="" /></button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.message-composer { position: absolute; left: 20px; right: 20px; bottom: 44px; }
.composer-form { display: flex; gap: 10px; height: 54px; }
.file-input { display: none; }
.attachment-button { width: 54px; height: 54px; border: 0; padding: 0; border-radius: 50%; background: transparent; cursor: pointer; }
.message-field { display: flex; align-items: center; justify-content: space-between; flex: 1; min-width: 0; height: 54px; padding: 0 5px 0 16px; background: var(--health-surface); border-radius: 27px; }
.message-field input { width: 100%; min-width: 0; padding: 0; border: 0; outline-offset: 5px; background: transparent; color: black; font: 400 17px / 21px var(--font-text); }
.message-field input::placeholder { color: black; opacity: 1; }
.voice-button { display: grid; place-items: center; width: 44px; height: 44px; padding: 0; flex-shrink: 0; background: transparent; border: 0; border-radius: 50%; cursor: pointer; color: black; }
.voice-button.is-listening { background: #c6eee2; }
.send-button { background: #27a482; color: white; font: 500 25px / 1 var(--font-text); }
.composer-notice { position: absolute; bottom: 60px; left: 0; right: 0; margin: 0; border-radius: 18px; padding: 12px 16px; background: var(--health-surface); color: var(--health-muted); font: 400 12px / 17px var(--font-text); }
</style>
