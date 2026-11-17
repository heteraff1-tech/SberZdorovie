<template>
  <section
    class="home-page"
    :class="{
      'home-page--ready': ready,
      'home-page--assistant': assistant,
      'home-page--pulse': pulseOpen,
    }"
    :aria-label="assistant ? 'ИИ-помощник' : 'Главная — показатели здоровья'"
    @keydown.esc="handleEscape"
  >
    <div class="home-page__background" aria-hidden="true">
      <img :src="assets.background" width="402" height="874" alt="" />
    </div>
    <div class="home-page__tint" aria-hidden="true"></div>
    <AssistantHeader
      :name="name"
      :active="assistant"
      :ready="ready"
      :history-open="historyOpen"
      :inert="pulseOpen"
      @open="openAssistant"
      @close="closeAssistant"
      @history="toggleHistory"
    />
    <AssistantScene
      :active="assistant && ready"
      :suggestions="suggestions"
      @select="selectSuggestion"
    />
    <div class="home-page__composer" :inert="!assistant || pulseOpen">
      <AssistantComposer
        v-model="draft"
        :file="file"
        :notice="notice"
        :listening="listening"
        :focus-request="focusRequest"
        @attach="attach"
        @send="send"
        @voice="toggleVoice"
      />
    </div>
    <AssistantHistory v-if="historyOpen" :messages="messages" />
    <UiBottomSheet
      class="home-page__sheet"
      :open="sheetOpen"
      :expanded="pulseOpen"
      :label="pulseOpen ? 'Пульс' : 'Показатели здоровья'"
      dismiss-label="Открыть ИИ-помощника — свернуть показатели"
      @dismiss="openAssistant"
    >
      <div class="home-page__dashboard" :inert="pulseOpen" :aria-hidden="pulseOpen || undefined">
        <HealthDashboard :data="demoMetrics" :animate="chartsStarted" @open-pulse="showPulse" />
      </div>
      <PulsePage
        v-if="pulseOpen"
        :value="demoMetrics.pulse"
        @back="hidePulse"
        @discuss="discussPulse"
      />
    </UiBottomSheet>
    <UiTabBar
      class="home-page__navigation"
      :items="navigation"
      :model-value="assistant ? 'assistant' : 'health'"
      @update:model-value="navigate"
    />
    <img class="home-page__indicator" :src="assets.homeIndicator" alt="" aria-hidden="true" />
  </section>
</template>

<script setup>
import { nextTick, watch } from 'vue';
import { UiBottomSheet, UiTabBar } from '@/shared/ui';
import PulsePage from '@/pages/pulse/PulsePage.vue';
import { assets } from '@/shared/config/assets';
import { HealthDashboard, useHealthScreen, demoMetrics } from '@/features/health';
import {
  AssistantHeader,
  AssistantScene,
  AssistantComposer,
  AssistantHistory,
  useAssistant,
} from '@/features/assistant';

const props = defineProps({
  initialView: { type: String, default: 'home' },
  name: { type: String, default: 'Анна' },
});
const {
  ready,
  assistant,
  chartsStarted,
  sheetOpen,
  pulseOpen,
  openAssistant,
  closeAssistant,
  openPulse,
  closePulse,
} = useHealthScreen(props.initialView);
const navigation = [
  { id: 'health', label: 'Здоровье', icon: 'heart' },
  { id: 'assistant', label: 'Помощник', icon: 'sparkles' },
];
let pulseTrigger;
const {
  draft,
  file,
  notice,
  messages,
  historyOpen,
  focusRequest,
  listening,
  suggestions,
  selectSuggestion,
  compose,
  attach,
  send,
  closeHistory,
  toggleHistory,
  deactivate,
  toggleVoice,
} = useAssistant();

watch(assistant, deactivate);
function handleEscape() {
  if (pulseOpen.value) hidePulse();
  else if (historyOpen.value) closeHistory();
  else if (assistant.value) closeAssistant();
}

function showPulse(event) {
  pulseTrigger = event.currentTarget;
  openPulse();
}

async function hidePulse() {
  closePulse();
  await nextTick();
  pulseTrigger?.focus({ preventScroll: true });
}

function navigate(destination) {
  if (destination === 'assistant') openAssistant();
  else {
    closeAssistant();
    if (pulseOpen.value) hidePulse();
  }
}

function discussPulse() {
  openAssistant();
  compose('Пульс покоя выше нормы в течение дня. Хочу обсудить это с терапевтом.');
}
</script>

<style scoped lang="scss" src="@/assets/styles/pages/home.scss"></style>
