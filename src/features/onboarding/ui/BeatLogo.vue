<template>
  <div class="mark" :data-phase="phase" :style="mask" aria-hidden="true">
    <div class="mark-arc">
      <img :src="getSvg('logo-muted')" width="100" height="87" alt="" />
      <img
        class="mark-color mark-fill"
        :src="getSvg('logo-color')"
        width="100"
        height="87"
        alt=""
      />
    </div>
    <div class="heart-glow">
      <div class="mark-heart" :data-contact="contact > 0.15" :data-filling="filling">
        <img :src="getSvg('logo-muted')" width="100" height="87" alt="" />
        <img class="mark-fill" :src="getSvg('logo-color')" width="100" height="87" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getSvg } from '@/shared/lib/asset';

const props = defineProps({
  phase: { type: String, required: true },
  fill: { type: Number, required: true },
  contact: { type: Number, required: true },
  filling: Boolean,
});

const mask = computed(() => {
  const level = props.fill * 100;
  const edge = Math.min(level, 100 - level, 3);
  return {
    '--fill-level': `${level}%`,
    '--fill-edge': `${edge}%`,
    '--heart-contact': props.contact,
  };
});
</script>

<style scoped lang="scss" src="@/assets/styles/features/onboarding/beat-logo.scss"></style>
