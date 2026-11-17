<template>
  <section
    class="home-page"
    :class="{ 'home-page--ready': ready, 'home-page--assistant': assistant }"
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
      @open="openAssistant"
      @close="closeAssistant"
      @history="toggleHistory"
    />
    <AssistantScene
      :active="assistant && ready"
      :suggestions="suggestions"
      @select="selectSuggestion"
    />
    <div class="home-page__composer" :inert="!assistant">
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
      label="Показатели здоровья"
      dismiss-label="Открыть ИИ-помощника — свернуть показатели"
      @dismiss="openAssistant"
    >
      <HealthDashboard :data="demoMetrics" :animate="chartsStarted" />
    </UiBottomSheet>
    <img class="home-page__indicator" :src="assets.homeIndicator" alt="" aria-hidden="true" />
  </section>
</template>

<script setup>
import { watch } from 'vue';
import { UiBottomSheet } from '@/shared/ui';
import { assets } from '@/shared/config/assets';
import { HealthDashboard, useHealthScreen, demoMetrics } from '@/features/health';
import {
  AssistantHeader,
  AssistantScene,
  AssistantComposer,
  AssistantHistory,
  useAssistant,
} from '@/features/assistant';

const props = defineProps({ initialAssistant: Boolean, name: { type: String, default: 'Анна' } });
const { ready, assistant, chartsStarted, sheetOpen, openAssistant, closeAssistant } =
  useHealthScreen(props.initialAssistant);
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
  attach,
  send,
  closeHistory,
  toggleHistory,
  deactivate,
  toggleVoice,
} = useAssistant();

watch(assistant, deactivate);
function handleEscape() {
  if (historyOpen.value) closeHistory();
  else if (assistant.value) closeAssistant();
}
</script>

<style scoped lang="scss" src="@/assets/styles/pages/home.scss"></style>
