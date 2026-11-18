<template>
  <main class="app-stage">
    <PhonePreview :light="home">
      <HomePage v-if="home" :key="hash" :initial-view="initialView" />
      <Transition name="onboarding-exit">
        <OnboardingPage v-if="!home" @complete="home = true" />
      </Transition>
    </PhonePreview>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import PhonePreview from '@/components/PhonePreview.vue';
import HomePage from '@/pages/home/HomePage.vue';
import OnboardingPage from '@/pages/onboarding/OnboardingPage.vue';
import { useLocationHash } from '@/shared/composables/useLocationHash';

const hash = useLocationHash();
const views = { '#home': 'home', '#assistant': 'assistant', '#pulse': 'pulse' };
const initialView = computed(() => views[hash.value] || 'home');
const home = ref(Boolean(views[hash.value]));

// Прямой адрес открывает нужный экран без повторного онбординга.
watch(hash, () => {
  home.value = Boolean(views[hash.value]);
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
