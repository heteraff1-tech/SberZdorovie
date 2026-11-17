<template>
  <span
    class="ui-icon"
    :class="{ 'ui-icon--image': icon.multicolor, 'ui-icon--inverse': inverse }"
    :style="iconStyle"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="!label || undefined"
  >
    <img v-if="icon.multicolor" :src="icon.src" alt="" />
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { icons } from '@/shared/config/icons';

const props = defineProps({
  name: { type: String, required: true, validator: (value) => value in icons },
  label: { type: String, default: '' },
  inverse: Boolean,
});
const icon = computed(() => icons[props.name]);
const sourceUrl = computed(() => new URL(icon.value.src, document.baseURI).href);
const iconStyle = computed(() => ({
  '--icon-source': `url("${sourceUrl.value}")`,
  '--icon-width': `${icon.value.width}px`,
  '--icon-height': `${icon.value.height}px`,
}));
</script>

<style scoped lang="scss" src="@/assets/styles/components/icon.scss"></style>
