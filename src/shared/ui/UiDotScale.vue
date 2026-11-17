<template>
  <div
    class="ui-dot-scale"
    :class="{ 'ui-dot-scale--animated': animate }"
    :style="{ '--scale-columns': columns, '--scale-rows': rows }"
    role="img"
    :aria-label="label"
  >
    <span
      v-for="index in columns * rows"
      :key="index"
      class="ui-dot-scale__dot"
      :class="{ 'ui-dot-scale__dot--active': (index - 1) % columns < activeColumns }"
      :style="{ '--dot-index': (index - 1) % columns }"
    ></span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  value: { type: Number, required: true },
  columns: { type: Number, default: 32 },
  rows: { type: Number, default: 4 },
  label: { type: String, required: true },
  animate: { type: Boolean, default: true },
});
const activeColumns = computed(() =>
  Math.round(Math.max(0, Math.min(1, props.value)) * props.columns),
);
</script>

<style scoped lang="scss" src="@/assets/styles/components/dot-scale.scss"></style>
