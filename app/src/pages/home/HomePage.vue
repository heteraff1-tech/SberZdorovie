<template>
  <section
    ref="screen"
    class="home-page"
    tabindex="-1"
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
      :inert="pulseOpen"
      @open="showAssistant"
      @close="hideAssistant"
    />
    <AssistantScene :active="assistant && ready" />
    <div class="home-page__composer" :inert="!assistant || pulseOpen"><AssistantComposer /></div>
    <UiBottomSheet
      class="home-page__sheet"
      :open="sheetOpen"
      :expanded="pulseOpen"
      :label="pulseOpen ? 'Пульс' : 'Показатели здоровья'"
      dismiss-label="Открыть ИИ-помощника — свернуть показатели"
      @dismiss="showAssistant"
    >
      <div class="home-page__dashboard" :inert="pulseOpen" :aria-hidden="pulseOpen || undefined">
        <HealthDashboard
          :data="demoMetrics"
          :pulse="latestPulse"
          :demo-pulse="!pulseMeasurements.length"
          :animate="chartsStarted"
          @open-pulse="showPulse"
        />
      </div>
      <PulseOverview
        v-if="pulseOpen"
        :value="averagePulse"
        :measurements="pulseHistory"
        :demo="!pulseMeasurements.length"
        @back="hidePulse"
        @discuss="showAssistant"
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
import { computed, nextTick, ref, watch } from 'vue';
import { UiBottomSheet, UiTabBar } from '@/shared/ui';
import { assets } from '@/shared/config/assets';
import {
  HealthDashboard,
  PulseOverview,
  useHealthScreen,
  demoMetrics,
  demoPulseMeasurements,
  demoPulseValue,
} from '@/features/health';
import { AssistantHeader, AssistantScene, AssistantComposer } from '@/features/assistant';

const props = defineProps({
  initialView: { type: String, default: 'home' },
  name: { type: String, default: 'Анна' },
  pulseMeasurements: { type: Array, default: () => [] },
});
const emit = defineEmits(['health-ready']);
const latestPulse = computed(() => props.pulseMeasurements.at(-1)?.value ?? demoPulseValue);
const averagePulse = computed(() => {
  const entries = props.pulseMeasurements;
  if (!entries.length) return demoPulseValue;
  return Math.round(entries.reduce((sum, entry) => sum + entry.value, 0) / entries.length);
});
const pulseHistory = computed(() =>
  [...demoPulseMeasurements, ...props.pulseMeasurements].sort(
    (first, second) => first.recordedAt - second.recordedAt,
  ),
);
const screen = ref(null);
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
} = useHealthScreen(props.initialView, screen);
watch(sheetOpen, (open) => {
  if (open) emit('health-ready');
});
const navigation = [
  { id: 'health', label: 'Здоровье', icon: 'heart' },
  { id: 'assistant', label: 'Помощник', icon: 'sparkles' },
];
let pulseTrigger;

/** Открывает помощника и сохраняет работу Escape. */
async function showAssistant() {
  openAssistant();
  await nextTick();
  screen.value?.focus({ preventScroll: true });
}

/** Возвращает показатели и переносит фокус с исчезающего крестика на экран. */
function hideAssistant() {
  closeAssistant();
  screen.value?.focus({ preventScroll: true });
}

/** Закрывает текущий вложенный экран по Escape. */
function handleEscape() {
  if (pulseOpen.value) hidePulse();
  else if (assistant.value) hideAssistant();
}

/** Запоминает карточку, чтобы вернуть на неё фокус после обзора. */
function showPulse(event) {
  pulseTrigger = event.currentTarget;
  openPulse();
}

/** Сворачивает обзор пульса и возвращает фокус на исходную карточку. */
async function hidePulse() {
  closePulse();
  await nextTick();
  pulseTrigger?.focus({ preventScroll: true });
}

/** Переключает раздел через нижнюю навигацию. */
function navigate(destination) {
  if (destination === 'assistant') showAssistant();
  else if (pulseOpen.value) hidePulse();
  else hideAssistant();
}
</script>

<style scoped lang="scss">
.home-page {
  --motion-chart-delay: 600ms;
  --motion-composer: 800ms;
  --motion-composer-delay: 400ms;
  --motion-composer-opacity: 500ms;
  --motion-dissolve: 1250ms;

  font: 500 var(--text-label-size) / var(--text-label-line) var(--font-text);
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: var(--color-bg-page);
  color: var(--color-fg-default);

  &__background {
    position: absolute;
    inset: 0;
    opacity: 1;
    filter: blur(0);
    transform: scale(1);
    transition:
      filter var(--motion-dissolve) var(--ease-dissolve),
      opacity var(--motion-dissolve) var(--ease-dissolve-opacity),
      transform var(--motion-dissolve) ease;
    img {
      object-fit: cover;
    }
  }
  &__tint {
    position: absolute;
    inset: 0;
    background: color-mix(in srgb, var(--effect-background-tint) 1%, transparent);
    backdrop-filter: blur(10px);
    opacity: 1;
    transition: opacity var(--motion-dissolve);
  }
  &__composer {
    position: absolute;
    inset: auto var(--spacing-5) 97px;
    pointer-events: none;
    opacity: 0;
    transform: translateY(45px);
    transition:
      opacity var(--motion-composer-opacity),
      transform var(--motion-composer) var(--ease-out);
  }
  &__sheet {
    --sheet-height: 642px;
  }
  &__dashboard {
    transition: opacity var(--motion-ui);
  }
  &--pulse &__dashboard {
    position: absolute;
    inset: 24px;
    opacity: 0;
    visibility: hidden;
  }
  &__navigation {
    position: absolute;
    z-index: 5;
    left: 50%;
    bottom: 21px;
    transform: translateX(-50%);
  }
  &__indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 5;
    pointer-events: none;
  }

  &--assistant &__background {
    filter: blur(150px);
    opacity: 0;
    transform: scale(1.32);
  }
  &--assistant &__tint {
    opacity: 0;
  }
  &--assistant &__composer {
    pointer-events: auto;
    opacity: 1;
    transform: translateY(0);
    transition-delay: var(--motion-composer-delay);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-page {
    --motion-chart-delay: 1ms;
    --motion-composer: 1ms;
    --motion-composer-delay: 1ms;
    --motion-composer-opacity: 1ms;
    --motion-dissolve: 1ms;
  }
}
</style>
