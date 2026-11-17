<script setup>
import { ref } from 'vue'
import { designAsset } from '@/shared/lib/design-asset'
import GlassCard from './GlassCard.vue'
defineProps({ active: Boolean })
defineEmits(['select'])
const scene = ref(null)
// CSS interpolates the low-amplitude pointer offset; entry motion stays on separate wrappers.
function parallax(event) {
  if (event.pointerType === 'touch' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const box = event.currentTarget.getBoundingClientRect()
  scene.value.style.setProperty('--parallax-x', (event.clientX - box.left) / box.width - .5)
  scene.value.style.setProperty('--parallax-y', (event.clientY - box.top) / box.height - .5)
}
function reset() {
  scene.value.style.setProperty('--parallax-x', 0)
  scene.value.style.setProperty('--parallax-y', 0)
}
</script>

<template>
  <div ref="scene" class="assistant-scene" :class="{ 'is-active': active }" :inert="!active" @pointermove="parallax" @pointerleave="reset">
    <div class="scene-entry portrait-entry"><div class="scene-depth portrait-depth"><img class="assistant-portrait" :src="designAsset('img')" alt="" width="122" height="122" /></div></div>
    <div class="scene-entry turquoise-entry"><div class="scene-depth turquoise-depth">
      <div class="turquoise-base"></div>
      <img v-for="asset in ['img1', 'img2', 'img3']" :key="asset" class="turquoise-light" :src="designAsset(asset)" alt="" />
    </div></div>
    <div class="scene-entry analysis-entry"><div class="scene-depth analysis-depth"><GlassCard :label="'Помоги\nрасшифровать\nанализы'" @select="$emit('select', $event)">
      <span class="analysis-icons" aria-hidden="true"><img v-for="asset in ['img4', 'img5', 'img6', 'img7']" :key="asset" :src="designAsset(asset)" alt="" /></span>
    </GlassCard></div></div>
    <div class="scene-entry doctor-entry"><div class="scene-depth doctor-depth"><GlassCard :label="'Записаться\nк врачу'" centered @select="$emit('select', $event)" /></div></div>
  </div>
</template>

<style scoped>
.assistant-scene { position: absolute; inset: 256px 0 180px; perspective: 1000px; --parallax-x: 0; --parallax-y: 0; }
.scene-entry { position: absolute; opacity: 0; filter: blur(8px); transform: translate3d(var(--entry-x), var(--entry-y), var(--entry-z)); transition: transform 1100ms var(--ease-out), opacity 700ms ease, filter 1000ms ease; transition-delay: 0ms; }
.is-active .scene-entry { opacity: 1; filter: blur(0); transform: translate3d(0, 0, 0); transition-delay: var(--entry-delay); }
.scene-depth { transition: transform 650ms var(--ease-out); transform: translate3d(calc(var(--parallax-x) * var(--depth)), calc(var(--parallax-y) * var(--depth)), 0); }
.portrait-entry { left: 256px; top: 31px; width: 122px; height: 122px; --entry-x: 45px; --entry-y: 90px; --entry-z: -240px; --entry-delay: 190ms; }
.portrait-depth { --depth: 10px; }
.assistant-portrait { border-radius: 50%; object-fit: cover; }
.turquoise-entry { left: 110px; top: 92px; width: 267px; height: 264px; --entry-x: 60px; --entry-y: 140px; --entry-z: -140px; --entry-delay: 270ms; }
.turquoise-depth { position: relative; width: 267px; height: 264px; --depth: 22px; }
.turquoise-base { position: absolute; left: 15.5px; top: 15.5px; width: 236px; height: 233px; border-radius: 34px; transform: rotate(8deg); box-shadow: 0 10px 22px 1px rgb(33 182 183 / 17%); background: linear-gradient(135.366deg, #aaf7bc 0%, #57dcab 30%, #19bba7 52%, #1cb7c3 78%, #3ac4d1 100%); }
.turquoise-light { position: absolute; top: 0; left: 0; pointer-events: none; }
.analysis-entry { left: 24px; top: 22px; --entry-x: -55px; --entry-y: 70px; --entry-z: 70px; --entry-delay: 360ms; }
.analysis-depth { --depth: 30px; }
.analysis-icons { display: flex; gap: 9px; }
.doctor-entry { left: 24px; top: 218px; --entry-x: -35px; --entry-y: 130px; --entry-z: 100px; --entry-delay: 460ms; }
.doctor-depth { --depth: 40px; }
@media (prefers-reduced-motion: reduce) { .scene-entry { transition-duration: 1ms !important; transition-delay: 0ms !important; transform: none; filter: none; } .scene-depth { transform: none; } }
</style>
