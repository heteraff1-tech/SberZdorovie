<script setup>
import { computed, onMounted, onUnmounted, reactive } from 'vue'
import { BeatLogo, BerryPulse } from '@/entities/beat'
import { PullGesture } from '@/features/pulse-pull'
import { getMotionStyle } from '@/shared/config/motion'
import { getSvg } from '@/shared/lib/asset'
import { easeBetween } from '@/shared/lib/easing'
import { OnboardingFlow } from '../model/OnboardingFlow'
import './onboarding.css'

const state = reactive({ phase: 'blank', curtain: 'off', pull: 0, tension: 0, merge: 0, finishing: false })
const flow = new OnboardingFlow(state, () => matchMedia('(prefers-reduced-motion: reduce)').matches)
const gesture = new PullGesture()
const timing = getMotionStyle()

const glow = computed(() => {
  if (state.phase === 'welcome' || state.phase === 'done') return 1
  return state.phase === 'pull' ? fill.value : 0
})
const showAction = computed(() => ['welcome', 'connect'].includes(state.phase))
const canPull = computed(() => flow.canPull)
const fill = computed(() => state.phase === 'pull' ? easeBetween(.32, .96, state.merge) : 1)

onMounted(() => flow.start())
onUnmounted(() => flow.dispose())

function startPull(event) {
  if (!flow.canPull) return
  const surface = event.currentTarget
  const scale = surface.getBoundingClientRect().height / surface.offsetHeight
  if (!gesture.start(event, scale, state.pull)) return

  flow.grab()
  surface.setPointerCapture(event.pointerId)
}

function movePull(event) {
  const sample = gesture.move(event)
  if (sample) flow.setPull(sample.progress, sample.speed)
}

function endPull(event, cancelled = false) {
  const result = gesture.end(event, cancelled)
  if (!result) return

  if (cancelled) {
    flow.release()
    return
  }

  if (result.complete) flow.finish(result.speed)
  else flow.release()
}

function cancelPull(event) {
  endPull(event, true)
}
</script>

<template>
  <section class="onboarding" :data-phase="state.phase" :style="timing" aria-label="Daybeat">
    <img class="glow glow-intro" :src="getSvg('glow-intro')" width="946" height="946" alt="" />
    <img
      class="glow glow-final"
      :src="getSvg('glow-final')"
      width="946"
      height="1067"
      alt=""
      :style="{ opacity: glow }"
    />
    <BerryPulse :phase="state.phase" :pull="state.pull" :tension="state.tension" :merge="state.merge" />
    <BeatLogo :phase="state.phase" :fill="fill" />
    <p class="brand" aria-hidden="true">Daybeat</p>

    <div class="welcome" :aria-hidden="state.phase !== 'welcome'">
      <h1>More than aworkout log.</h1>
      <p>See your progress, rediscover your beast<br />moments, and celebrate how far you’ve come.</p>
    </div>

    <button
      v-show="showAction"
      type="button"
      class="action"
      :disabled="state.curtain !== 'off'"
      :aria-label="state.phase === 'connect' ? 'Connect Apple Health' : 'Continue'"
      @click="flow.advance()"
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
      @pointercancel="cancelPull"
      @lostpointercapture="cancelPull"
      @keydown.up.prevent="flow.finish()"
      @keydown.enter.prevent="flow.finish()"
      @keydown.space.prevent="flow.finish()"
    ></div>
    <div class="curtain" :data-state="state.curtain" aria-hidden="true"></div>
  </section>
</template>
