<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import BottomSheet from '@/shared/ui/BottomSheet.vue'
import { designAsset } from '@/shared/lib/design-asset'
import { getHomeMotionStyle, homeMotion } from '@/shared/config/home-motion'
import { healthData } from '@/entities/health/model/health-data'
import HealthDashboard from '@/widgets/health-dashboard/ui/HealthDashboard.vue'
import AssistantScene from '@/widgets/assistant/ui/AssistantScene.vue'
import MessageComposer from '@/widgets/assistant/ui/MessageComposer.vue'

const props = defineProps({ initialAssistant: Boolean, name: { type: String, default: 'Анна' } })
const ready = ref(false)
const assistant = ref(props.initialAssistant)
const chartsStarted = ref(false)
const composer = ref(null)
const openButton = ref(null)
const closeButton = ref(null)
const historyOpen = ref(false)
const messages = ref([])
const sheetOpen = computed(() => ready.value && !assistant.value)
let frame
let chartTimer

function startCharts() {
  if (chartsStarted.value || chartTimer) return
  chartTimer = setTimeout(() => {
    chartsStarted.value = true
    chartTimer = undefined
  }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : homeMotion.chartDelay)
}
async function openAssistant() {
  clearTimeout(chartTimer)
  chartTimer = undefined
  assistant.value = true
  historyOpen.value = false
  await nextTick()
  closeButton.value?.focus({ preventScroll: true })
}
async function closeAssistant() {
  assistant.value = false
  historyOpen.value = false
  startCharts()
  await nextTick()
  openButton.value?.focus({ preventScroll: true })
}
function handleEscape() {
  if (historyOpen.value) { historyOpen.value = false; return }
  if (assistant.value) closeAssistant()
}
onMounted(() => {
  frame = requestAnimationFrame(() => {
    ready.value = true
    if (!assistant.value) startCharts()
  })
})
onBeforeUnmount(() => { cancelAnimationFrame(frame); clearTimeout(chartTimer) })
</script>

<template>
  <section class="home-page" :class="{ 'is-ready': ready, 'is-assistant': assistant }" :style="getHomeMotionStyle()"
    :aria-label="assistant ? 'ИИ-помощник' : 'Главная — показатели здоровья'" @keydown.esc="handleEscape">
    <div class="home-background" aria-hidden="true"><img :src="designAsset('imgImage32')" width="402" height="874" alt="" /></div>
    <div class="home-background-tint" aria-hidden="true"></div>

    <header class="home-header">
      <button v-show="assistant" ref="closeButton" class="header-button close-assistant" type="button" aria-label="Вернуться к показателям здоровья" @click="closeAssistant"><img :src="designAsset('imgLucideX')" alt="" /></button>
      <button ref="openButton" class="assistant-label" type="button" :disabled="assistant" :aria-expanded="assistant" @click="openAssistant">
        <img :src="designAsset('imgLucideAstroid')" alt="" /><span>ИИ помощник</span>
      </button>
      <button v-show="assistant" class="header-button history-button" type="button" aria-label="История сообщений" :aria-expanded="historyOpen" @click="historyOpen = !historyOpen"><img :src="designAsset('imgGroup')" alt="" /></button>
      <button class="home-greeting" type="button" :disabled="assistant" :aria-label="`Привет, ${name}! Открыть ИИ-помощника`" @click="openAssistant">
        <span>Привет, {{ name }}!</span><span>Чем могу помочь</span>
      </button>
    </header>

    <AssistantScene :active="assistant && ready" @select="composer?.fill($event)" />
    <div class="composer-entry" :inert="!assistant"><MessageComposer ref="composer" @send="messages.push($event)" /></div>
    <div v-if="historyOpen" class="message-history" role="region" aria-label="История сообщений">
      <h2>Ваши сообщения</h2>
      <p v-if="!messages.length">Здесь появятся ваши сообщения помощнику.</p>
      <div v-for="(message, index) in messages" :key="index" class="history-message"><p>{{ message.text }}</p><small v-if="message.file">{{ message.file }}</small></div>
    </div>

    <BottomSheet :open="sheetOpen" label="Показатели здоровья" dismiss-label="Открыть ИИ-помощника — свернуть показатели" @dismiss="openAssistant"><HealthDashboard :data="healthData" :animate="chartsStarted" /></BottomSheet>
    <img class="home-indicator" :src="designAsset('imgHomeBarDefaultIOs')" alt="" aria-hidden="true" />
  </section>
</template>

<style>
.home-page {
  --focus: #27a482;
  color-scheme: light;
  position: absolute; inset: 0; overflow: hidden; background: white; color: black;
  font: 400 14px / 1.3 var(--font-text);
}
.home-background { position: absolute; inset: 0; opacity: 1; filter: blur(10px); transform: scale(1.06); transition: filter var(--motion-dissolve) cubic-bezier(.4, 0, .2, 1), opacity var(--motion-dissolve) cubic-bezier(.55, 0, .7, 1), transform var(--motion-dissolve) ease; }
.home-background img { object-fit: cover; }
.home-background-tint { position: absolute; inset: 0; background: rgb(0 0 0 / 8%); transition: opacity var(--motion-dissolve) ease; }
.is-assistant .home-background { filter: blur(150px); opacity: 0; transform: scale(1.32); }
.is-assistant .home-background-tint { opacity: 0; }
.home-header { position: absolute; inset: 0; pointer-events: none; }
.home-header button { pointer-events: auto; }
.assistant-label { position: absolute; top: 77px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 3px; padding: 0; border: 0; background: transparent; color: white; white-space: nowrap; font: 400 14px / 18px var(--font-text); cursor: pointer; transition: color 700ms ease; }
.assistant-label img { filter: brightness(0) invert(1); transition: filter 700ms ease; }
.is-assistant .assistant-label { color: #2fbfbd; cursor: default; }
.is-assistant .assistant-label img { filter: none; }
.header-button { position: absolute; z-index: 1; top: 64px; display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 50%; color: black; background: transparent; cursor: pointer; }
.close-assistant { left: 14px; }
.history-button { right: 14px; }
.home-greeting { position: absolute; left: 0; top: 106px; width: 402px; height: 81px; padding: 0; margin: 0; border: 0; background: transparent; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; font: 600 32px / 40.5px var(--font-copy); cursor: pointer; transform-origin: center top; transition: top 1000ms var(--ease-out), transform 1000ms var(--ease-out), color 800ms ease; }
.is-assistant .home-greeting { top: 154px; transform: scale(1.25); color: black; cursor: default; }
.composer-entry { position: absolute; inset: 0; pointer-events: none; opacity: 0; transform: translateY(45px); transition: opacity 500ms ease, transform 800ms var(--ease-out); }
.composer-entry .message-composer { pointer-events: auto; }
.is-assistant .composer-entry { opacity: 1; transform: translateY(0); transition-delay: 400ms; }
.home-indicator { position: absolute; bottom: 0; left: 0; z-index: 5; pointer-events: none; }
.message-history { position: absolute; z-index: 2; top: 115px; left: 20px; right: 20px; max-height: 600px; overflow-y: auto; padding: 20px; border-radius: 24px; background: rgb(255 255 255 / 96%); box-shadow: 0 10px 40px #14382c24; }
.message-history h2 { margin: 0 0 12px; font: 500 18px / 24px var(--font-text); }
.message-history p { margin: 0; }
.history-message { margin-top: 10px; padding: 12px; border-radius: 16px; background: var(--health-surface); overflow-wrap: anywhere; }
.home-page:not(.is-ready) .home-greeting { opacity: 0; transform: translateY(20px); }
@media (prefers-reduced-motion: reduce) {
  .home-page { --motion-dissolve: 1ms !important; --motion-sheet: 1ms !important; }
  .home-background, .home-background-tint, .home-greeting, .assistant-label, .composer-entry { transition-duration: 1ms !important; transition-delay: 0ms !important; }
}
</style>
