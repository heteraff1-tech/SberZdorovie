<script setup>
import { ref } from 'vue'
import { PhoneFrame } from '@/widgets/phone'
import { OnboardingPage } from '@/pages/onboarding'
import { HomePage } from '@/pages/home'

const initialAssistant = window.location.hash === '#assistant'
const home = ref(initialAssistant || window.location.hash === '#home')
</script>

<template>
  <main class="stage">
    <PhoneFrame :light="home">
      <HomePage v-if="home" :initial-assistant="initialAssistant" />
      <Transition name="onboarding-exit"><OnboardingPage v-if="!home" @complete="home = true" /></Transition>
    </PhoneFrame>
  </main>
</template>

<style scoped>
.stage {
  display: grid;
  place-items: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: var(--stage-gap);
}
.onboarding-exit-leave-active { z-index: 1; pointer-events: none; transition: opacity 950ms var(--ease-in-out), filter 950ms ease, transform 950ms var(--ease-in-out); }
.onboarding-exit-leave-to { opacity: 0; filter: blur(64px); transform: translateY(-40px) scale(1.12); }
@media (prefers-reduced-motion: reduce) { .onboarding-exit-leave-active { transition-duration: 1ms; } }
</style>
