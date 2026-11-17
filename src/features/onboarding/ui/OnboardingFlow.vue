<template>
  <section class="onboarding" :data-phase="state.phase" aria-label="Daybeat">
    <img class="glow glow-intro" :src="getSvg('glow-intro')" width="946" height="946" alt="" />
    <img
      class="glow glow-final"
      :src="getSvg('glow-final')"
      width="946"
      height="1067"
      alt=""
      :style="{ opacity: state.phase === 'welcome' ? 1 : 0 }"
    />
    <div v-if="showWave" class="light-wave" aria-hidden="true">
      <img class="light-afterglow" :src="getSvg('glow-final')" width="946" height="1067" alt="" />
      <span class="light-front"></span>
    </div>
    <BerryPulse
      :phase="state.phase"
      :pull="state.pull"
      :tension="state.tension"
      :merge="state.merge"
      @contact="contact = $event"
    />
    <BeatLogo :phase="state.phase" :fill="fill" :contact="contact" :filling="isFilling" />
    <p class="brand" aria-hidden="true">Daybeat</p>

    <div class="welcome" :aria-hidden="state.phase !== 'welcome'">
      <h1>More than aworkout log.</h1>
      <p>
        See your progress, rediscover your beast<br />moments, and celebrate how far you’ve come.
      </p>
    </div>

    <button
      v-show="showAction"
      type="button"
      class="action"
      :disabled="state.curtain !== 'off'"
      :aria-label="state.phase === 'connect' ? 'Connect Apple Health' : 'Continue'"
      @click="advance()"
    >
      <span aria-hidden="true">Continue</span>
      <span aria-hidden="true">Connect Apple Health</span>
    </button>

    <div
      v-if="state.phase === 'pull'"
      class="gesture"
      role="button"
      :tabindex="canPull ? 0 : -1"
      :aria-disabled="!canPull"
      aria-label="Swipe up to connect Apple Health"
      @pointerdown="startPull"
      @pointermove="movePull"
      @pointerup="endPull"
      @pointercancel="endPull($event, true)"
      @lostpointercapture="endPull($event, true)"
      @keydown.up.prevent="finish()"
      @keydown.enter.prevent="finish()"
      @keydown.space.prevent="finish()"
    ></div>
    <div class="curtain" :data-state="state.curtain" aria-hidden="true"></div>
  </section>
</template>

<script setup>
import BeatLogo from './BeatLogo.vue';
import BerryPulse from './BerryPulse.vue';
import { getSvg } from '@/shared/lib/asset';
import { useOnboardingFlow } from '../model/useOnboardingFlow';

const emit = defineEmits(['complete']);
const {
  state,
  contact,
  showAction,
  canPull,
  fill,
  isFilling,
  showWave,
  startPull,
  movePull,
  endPull,
  advance,
  finish,
} = useOnboardingFlow(() => emit('complete'));
</script>

<style scoped lang="scss" src="@/assets/styles/features/onboarding/onboarding-flow.scss"></style>
