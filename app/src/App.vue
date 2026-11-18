<template>
  <main class="app-stage" :class="{ 'app-stage--mobile': mobilePreview }">
    <div class="app-stage__layout" :class="{ 'app-stage__layout--with-entry': showPulseEntry }">
      <component :is="mobilePreview ? TemporaryMobilePreview : PhonePreview" :light="home">
        <HomePage
          v-if="home"
          :key="hash"
          :initial-view="initialView"
          :pulse-measurements="measurements"
          :save-pulse="savePulse"
          @dashboard-ready="dashboardVisited = true"
        />
        <Transition name="onboarding-exit" @after-leave="onboardingExit = false">
          <OnboardingPage v-if="!home" @complete="finishOnboarding" />
        </Transition>
      </component>
      <PulseEntry v-if="showPulseEntry" :save="savePulse" />
    </div>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import PhonePreview from '@/components/PhonePreview.vue';
import TemporaryMobilePreview from '@/components/temporary-mobile/TemporaryMobilePreview.vue';
import { PulseEntry, usePulseMeasurements } from '@/features/health';
import HomePage from '@/pages/home/HomePage.vue';
import OnboardingPage from '@/pages/onboarding/OnboardingPage.vue';
import { useLocationHash } from '@/shared/composables/useLocationHash';

const hash = useLocationHash();
// Временный режим включается только явным ?mobile=1 перед hash экрана.
const mobilePreview = new URLSearchParams(window.location.search).get('mobile') === '1';
const views = { '#home': 'home', '#assistant': 'assistant', '#pulse': 'pulse' };
const initialView = computed(() => views[hash.value] || 'home');
const home = ref(Boolean(views[hash.value]));
const dashboardVisited = ref(false);
const onboardingExit = ref(false);
const { measurements, savePulse } = usePulseMeasurements();
const showPulseEntry = computed(
  () => !mobilePreview && home.value && dashboardVisited.value && !onboardingExit.value,
);

/** Завершает онбординг и оставляет адрес главной для перезагрузки страницы. */
function finishOnboarding() {
  onboardingExit.value = true;
  home.value = true;
  window.history.replaceState(window.history.state, '', '#home');
}

// Прямой адрес открывает нужный экран без повторного онбординга.
watch(hash, () => {
  home.value = Boolean(views[hash.value]);
  if (!home.value) dashboardVisited.value = false;
});
</script>

<style scoped lang="scss">
.app-stage {
  --motion-exit: 950ms;

  display: grid;
  place-items: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: var(--spacing-3);
  background: #101013;
  &__layout {
    display: grid;
    justify-items: center;
    align-items: center;
    gap: var(--spacing-5);
    width: 100%;
  }
  &--mobile {
    display: block;
    padding: 0;
  }
}
@media (min-width: 760px) {
  .app-stage__layout--with-entry {
    grid-template-columns: auto minmax(0, 280px);
    justify-content: center;
  }
}
.onboarding-exit-leave-active {
  z-index: 1;
  pointer-events: none;
  transition:
    opacity var(--motion-exit) var(--ease-in-out),
    filter var(--motion-exit),
    transform var(--motion-exit) var(--ease-in-out);
}
.onboarding-exit-leave-to {
  opacity: 0;
  filter: blur(64px);
  transform: translateY(-40px) scale(1.12);
}

@media (prefers-reduced-motion: reduce) {
  .app-stage {
    --motion-exit: 1ms;
  }
}
</style>
