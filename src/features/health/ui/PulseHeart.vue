<template>
  <div
    class="pulse-heart"
    role="img"
    :aria-label="`Пульс ${value} ударов в минуту`"
    :style="{ '--pulse-wave-mask': `url('${waveUrl}')` }"
  >
    <img class="pulse-heart__heart" :src="assets.pulseHeart" width="402" height="150" alt="" />
    <img class="pulse-heart__wave" :src="assets.pulseWave" width="402" height="150" alt="" />
    <span class="pulse-heart__light" aria-hidden="true"></span>
    <strong class="pulse-heart__value" aria-hidden="true">{{ value }}</strong>
    <span class="pulse-heart__unit" aria-hidden="true">уд/мин</span>
  </div>
</template>

<script setup>
import { assets } from '@/shared/config/assets';
defineProps({ value: { type: Number, required: true } });
const waveUrl = new URL(assets.pulseWave, document.baseURI).href;
</script>

<style scoped lang="scss" src="@/assets/styles/features/health/pulse-heart.scss"></style>
