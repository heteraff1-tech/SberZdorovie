<template>
  <DesignSystemPage v-if="designSystem" />
  <main v-else class="app-stage">
    <UiPhoneFrame :light="home">
      <HomePage v-if="home" :key="hash" :initial-assistant="initialAssistant" />
      <Transition name="onboarding-exit">
        <OnboardingPage v-if="!home" @complete="home = true" />
      </Transition>
    </UiPhoneFrame>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { UiPhoneFrame } from '@/shared/ui';
import HomePage from '@/pages/home/HomePage.vue';
import OnboardingPage from '@/pages/onboarding/OnboardingPage.vue';
import DesignSystemPage from '@/pages/design-system/DesignSystemPage.vue';
import { useLocationHash } from '@/shared/composables/useLocationHash';

const hash = useLocationHash();
const designSystem = computed(() => hash.value === '#design-system');
const initialAssistant = computed(() => hash.value === '#assistant');
const home = ref(initialAssistant.value || hash.value === '#home');
watch(hash, () => {
  home.value = initialAssistant.value || hash.value === '#home';
});
</script>

<style scoped lang="scss" src="@/assets/styles/app.scss"></style>
