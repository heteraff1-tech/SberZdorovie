<template>
  <section ref="screen" class="onboarding" :data-phase="state.phase" aria-label="Daybeat">
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
import { ref } from 'vue';
import BeatLogo from './BeatLogo.vue';
import BerryPulse from './BerryPulse.vue';
import { getSvg } from '@/shared/lib/asset';
import { useOnboardingFlow } from '../model/useOnboardingFlow';

const emit = defineEmits(['complete']);
const screen = ref(null);
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
} = useOnboardingFlow(() => emit('complete'), screen);
</script>

<style scoped lang="scss">
.onboarding {
  --motion-action: 440ms;
  --motion-afterglow: 1120ms;
  --motion-arrow-step: 130ms;
  --motion-arrow-fade: 160ms;
  --motion-arrows: 1680ms;
  --motion-blank: 120ms;
  --motion-contact: 120ms;
  --motion-copy: 1000ms;
  --motion-curtain: 180ms;
  --motion-curtain-hold: 1000ms;
  --motion-heart-shake: 145ms;
  --motion-heart-tap: 360ms;
  --motion-intro: 1000ms;
  --motion-intro-hold: 500ms;
  --motion-merge: 780ms;
  --motion-onboarding-hold: 1800ms;
  --motion-orbit: 5200ms;
  --motion-stagger: 100ms;
  --motion-wave: 1950ms;
  --onboarding-text-size: 18px;
  --onboarding-text-line: 23px;
  --onboarding-copy-size: 16px;
  --onboarding-copy-line: 20px;
  --onboarding-action-height: 56px;

  color: rgb(255 255 255 / 90%);
  :focus-visible {
    outline-color: #fca8c9;
  }
  position: absolute;
  inset: 0;
  /* Штора перекрывает иконки статус-бара, когда закрыта. */
  user-select: none;
  -webkit-user-select: none;
  font: 500 var(--onboarding-text-size) / var(--onboarding-text-line) var(--font-text);
  background: #050006;
}

.onboarding .glow {
  position: absolute;
  left: -272px;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--motion-copy) var(--ease-reveal);
}
.glow-intro {
  top: -86px;
}
.glow-final {
  top: -116px;
}
.onboarding[data-phase='intro'] .glow-intro {
  opacity: 1;
  transition-duration: var(--motion-intro);
}
.onboarding:is([data-phase='pull'], [data-phase='done']) .glow-final {
  transition: none;
}

.onboarding .brand {
  position: absolute;
  inset-inline: 0;
  top: 444px;
  margin: 0;
  opacity: 0;
  text-align: center;
  pointer-events: none;
  filter: blur(4px);
  transform: translateY(5px) scale(0.96);
  transition:
    opacity var(--motion-copy) var(--ease-reveal),
    filter var(--motion-copy) var(--ease-reveal),
    transform var(--motion-copy) var(--ease-reveal);
}

.onboarding[data-phase='intro'] .brand {
  opacity: 1;
  filter: blur(0);
  transform: translateY(0) scale(1);
  transition-delay: var(--motion-stagger);
  transition-duration: calc(var(--motion-intro) - var(--motion-stagger));
}

.onboarding:is(
    [data-phase='welcome'],
    [data-phase='connect'],
    [data-phase='pull'],
    [data-phase='done']
  )
  .brand {
  transform: translateY(-82px) scale(0.333);
  filter: blur(2px);
}

.onboarding .welcome {
  pointer-events: none;
}
.welcome h1,
.welcome p {
  position: absolute;
  margin: 0;
  text-align: center;
  opacity: 0;
  filter: blur(5px);
  transition:
    opacity var(--motion-copy) var(--ease-reveal),
    transform var(--motion-copy) var(--ease-reveal),
    filter var(--motion-copy) var(--ease-reveal);
}
.welcome h1 {
  left: 20px;
  right: 20px;
  top: 395px;
  font: 500 var(--onboarding-text-size) / var(--onboarding-text-line) var(--font-text);
  transform: translateY(69.25px) scale(0.5);
}
.welcome p {
  left: 27px;
  right: 27px;
  top: 433px;
  font: 400 var(--onboarding-copy-size) / var(--onboarding-copy-line) var(--font-display);
  transform: translateY(42px) scale(0.5);
}

.onboarding[data-phase='welcome'] .welcome :is(h1, p) {
  opacity: 1;
  filter: blur(0);
  transform: translateY(0) scale(1);
}

.onboarding[data-phase='welcome'] .welcome p {
  /* Оба текста заканчивают движение в один кадр. */
  transition-duration: calc(var(--motion-copy) - var(--motion-stagger));
  transition-delay: var(--motion-stagger);
}

.onboarding:is([data-phase='connect'], [data-phase='pull'], [data-phase='done'])
  .welcome
  :is(h1, p) {
  transform: translateY(-18px) scale(0.94);
}

.onboarding .action {
  position: absolute;
  left: 20px;
  top: 758px;
  width: 362px;
  height: var(--onboarding-action-height);
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: var(--border-radius-full);
  color: rgb(255 255 255 / 90%);
  background: #c60053;
  cursor: pointer;
  transition:
    left var(--motion-action) var(--ease-out),
    width var(--motion-action) var(--ease-out),
    top var(--motion-action) var(--ease-out);
}
.action span {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  white-space: nowrap;
  transition: transform var(--motion-action) var(--ease-out);
}
.action span + span {
  transform: translateY(66px);
}
.onboarding[data-phase='connect'] .action {
  left: 58px;
  top: 720px;
  width: 289px;
}
.onboarding[data-phase='connect'] .action span:first-child {
  transform: translateY(-66px);
}
.onboarding[data-phase='connect'] .action span + span {
  transform: translateY(0);
}

.gesture {
  position: absolute;
  z-index: 1;
  inset: 0;
  touch-action: none;
  cursor: grab;
  -webkit-tap-highlight-color: transparent;
}
.gesture:active {
  cursor: grabbing;
}
.gesture[aria-disabled='true'] {
  cursor: default;
}
.gesture:focus-visible {
  outline-offset: -10px;
  border-radius: var(--preview-screen-radius);
}

.curtain {
  position: absolute;
  z-index: 3;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background: #020003;
  transition: opacity var(--motion-curtain) var(--ease-in-out);
}
.curtain[data-state='closed'] {
  opacity: 1;
  pointer-events: auto;
}
.curtain[data-state='opening'] {
  pointer-events: auto;
}

.light-wave {
  position: absolute;
  inset: 0;
  overflow: clip;
  pointer-events: none;
}

.light-front {
  position: absolute;
  left: 202px;
  top: 354px;
  width: 1340px;
  height: 1340px;
  translate: -50% -50%;
  background: radial-gradient(
    closest-side,
    transparent 26%,
    rgb(195 0 49 / 0.035) 37%,
    rgb(195 0 49 / 0.12) 50%,
    rgb(195 0 49 / 0.27) 61%,
    rgb(195 0 49 / 0.41) 72%,
    rgb(195 0 49 / 0.34) 81%,
    rgb(195 0 49 / 0.16) 89%,
    rgb(195 0 49 / 0.04) 96%,
    transparent 100%
  );
  mask-image: conic-gradient(from 26deg, #000, #000b 24%, #000 57%, #000c 79%, #000);
  animation: screen-wave var(--motion-wave) cubic-bezier(0.34, 0.18, 0.38, 1) both;
}

.light-afterglow {
  position: absolute;
  left: -272px;
  top: -116px;
  animation: afterglow-in var(--motion-afterglow) var(--ease-reveal) calc(var(--motion-wave) / 2)
    both;
}

@keyframes screen-wave {
  0% {
    transform: rotate(-13deg) scale(0.05);
    opacity: 0;
  }
  25% {
    opacity: 0.9;
  }
  68% {
    opacity: 1;
  }
  100% {
    transform: rotate(-13deg) scale(1.37, 1.24);
    opacity: 0;
  }
}

@keyframes afterglow-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .light-front {
    display: none;
  }
  .light-afterglow {
    animation-delay: 0ms;
  }

  .onboarding {
    --motion-action: 1ms;
    --motion-afterglow: 1ms;
    --motion-arrow-step: 1ms;
    --motion-arrow-fade: 0ms;
    --motion-arrows: 0ms;
    --motion-blank: 1ms;
    --motion-contact: 1ms;
    --motion-copy: 1ms;
    --motion-curtain: 1ms;
    --motion-curtain-hold: 1ms;
    --motion-heart-shake: 1ms;
    --motion-heart-tap: 1ms;
    --motion-intro: 1ms;
    --motion-intro-hold: 1ms;
    --motion-merge: 1ms;
    --motion-onboarding-hold: 1ms;
    --motion-orbit: 0ms;
    --motion-stagger: 0ms;
    --motion-wave: 1ms;
  }
}
</style>
