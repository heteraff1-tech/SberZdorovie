<script setup>
import { PhoneFrame } from '@/widgets/phone'
import { OnboardingPage } from '@/pages/onboarding'
</script>

<template>
  <main class="stage">
    <PhoneFrame>
      <OnboardingPage />
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
</style>
