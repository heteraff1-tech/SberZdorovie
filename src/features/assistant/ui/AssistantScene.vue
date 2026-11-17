<template>
  <div
    class="assistant-scene"
    :style="style"
    :class="{ 'is-active': active }"
    :inert="!active"
    @pointermove="move"
    @pointerleave="reset"
  >
    <div class="scene-entry portrait-entry">
      <div class="scene-depth portrait-depth">
        <img class="assistant-portrait" :src="assets.portrait" alt="" width="122" height="122" />
      </div>
    </div>
    <div class="scene-entry turquoise-entry">
      <div class="scene-depth turquoise-depth">
        <div class="turquoise-base"></div>
        <img
          v-for="asset in ['artworkDiffuse', 'artworkSoft', 'artworkDiagonal']"
          :key="asset"
          class="turquoise-light"
          :src="assets[asset]"
          alt=""
        />
      </div>
    </div>
    <div
      v-for="suggestion in suggestions"
      :key="suggestion.id"
      class="scene-entry"
      :class="suggestion.centered ? 'doctor-entry' : 'analysis-entry'"
    >
      <div class="scene-depth" :class="suggestion.centered ? 'doctor-depth' : 'analysis-depth'">
        <UiGlassCard
          :label="suggestion.label"
          :centered="suggestion.centered"
          @select="$emit('select', suggestion.id)"
        >
          <span v-if="suggestion.icons" class="analysis-icons" aria-hidden="true"
            ><UiIcon v-for="icon in suggestion.icons" :key="icon" :name="icon"
          /></span>
        </UiGlassCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { assets } from '@/shared/config/assets';
import { UiGlassCard, UiIcon } from '@/shared/ui';
import { useParallax } from '@/shared/composables/useParallax';

defineProps({ active: Boolean, suggestions: { type: Array, required: true } });
defineEmits(['select']);
const { style, move, reset } = useParallax();
</script>

<style scoped lang="scss" src="@/assets/styles/features/assistant/assistant-scene.scss"></style>
