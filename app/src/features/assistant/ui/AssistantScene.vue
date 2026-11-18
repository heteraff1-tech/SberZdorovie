<template>
  <div class="assistant-scene" :class="{ 'is-active': active }" :aria-hidden="!active">
    <div class="scene-entry portrait-entry">
      <img class="assistant-portrait" :src="assets.portrait" alt="" width="122" height="122" />
    </div>
    <div class="scene-entry turquoise-entry">
      <img class="turquoise-artwork" :src="assets.artwork" width="313" height="310" alt="" />
    </div>
    <div
      v-for="suggestion in assistantSuggestions"
      :key="suggestion.id"
      class="scene-entry"
      :class="suggestion.centered ? 'doctor-entry' : 'analysis-entry'"
    >
      <SuggestionCard :label="suggestion.label" :centered="suggestion.centered">
        <span v-if="suggestion.icons" class="analysis-icons" aria-hidden="true">
          <UiIcon v-for="icon in suggestion.icons" :key="icon" :name="icon" />
        </span>
      </SuggestionCard>
    </div>
  </div>
</template>

<script setup>
import { assets } from '@/shared/config/assets';
import { UiIcon } from '@/shared/ui';
import { assistantSuggestions } from '../config/suggestions';
import SuggestionCard from './SuggestionCard.vue';
defineProps({ active: Boolean });
</script>

<style scoped lang="scss">
.assistant-scene {
  --motion-analysis-delay: 360ms;
  --motion-artwork-delay: 270ms;
  --motion-doctor-delay: 460ms;
  --motion-portrait-delay: 190ms;
  --motion-scene: 1100ms;
  --motion-scene-filter: 1000ms;
  --motion-scene-opacity: 700ms;

  position: absolute;
  inset: 256px 0 180px;
  perspective: 1000px;
}
.scene-entry {
  position: absolute;
  opacity: 0;
  filter: blur(8px);
  transform: translate3d(var(--entry-x), var(--entry-y), var(--entry-z));
  transition:
    transform var(--motion-scene) var(--ease-out),
    opacity var(--motion-scene-opacity) ease,
    filter var(--motion-scene-filter) ease;
  transition-delay: 0ms;
}
.is-active .scene-entry {
  opacity: 1;
  filter: blur(0);
  transform: translate3d(0, 0, 0);
  transition-delay: var(--entry-delay);
}
.portrait-entry {
  left: 256px;
  top: 31px;
  width: 122px;
  height: 122px;
  --entry-x: 45px;
  --entry-y: 90px;
  --entry-z: -240px;
  --entry-delay: var(--motion-portrait-delay);
}
.assistant-portrait {
  border-radius: 50%;
  object-fit: cover;
}
.turquoise-entry {
  left: 87px;
  top: 79px;
  width: 313px;
  height: 310px;
  --entry-x: 60px;
  --entry-y: 140px;
  --entry-z: -140px;
  --entry-delay: var(--motion-artwork-delay);
}
.analysis-entry {
  left: 24px;
  top: 22px;
  --entry-x: -55px;
  --entry-y: 70px;
  --entry-z: 70px;
  --entry-delay: var(--motion-analysis-delay);
}
.analysis-icons {
  display: flex;
  gap: var(--spacing-2);
}
.doctor-entry {
  left: 24px;
  top: 218px;
  --entry-x: -35px;
  --entry-y: 130px;
  --entry-z: 100px;
  --entry-delay: var(--motion-doctor-delay);
}

@media (prefers-reduced-motion: reduce) {
  .assistant-scene .scene-entry {
    transition-duration: 1ms;
    transition-delay: 0ms;
    transform: none;
    filter: none;
  }

  .assistant-scene {
    --motion-analysis-delay: 1ms;
    --motion-artwork-delay: 1ms;
    --motion-doctor-delay: 1ms;
    --motion-portrait-delay: 1ms;
    --motion-scene: 1ms;
    --motion-scene-filter: 1ms;
    --motion-scene-opacity: 1ms;
  }
}
</style>
