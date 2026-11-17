<template>
  <div ref="frame" class="phone">
    <div class="case" :style="{ '--case-scale': scale }">
      <div class="rail" aria-hidden="true"></div>
      <div class="screen" :class="{ 'screen--light': light }">
        <slot />
        <div class="status" aria-hidden="true">
          <span>{{ light ? '9:41' : '15:07' }}</span>
          <div v-if="light" class="status-levels">
            <img
              v-for="asset in ['cellular', 'wifi', 'battery']"
              :key="asset"
              :src="assets[asset]"
              alt=""
            />
          </div>
          <img v-else :src="getSvg('status')" width="79" height="13" alt="" />
        </div>
        <div class="island" aria-hidden="true"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getSvg } from '@/shared/lib/asset';
import { assets } from '@/shared/config/assets';
import { useElementScale } from '@/shared/composables/useElementScale';

defineProps({ light: Boolean });
const frame = ref(null);
const scale = useElementScale(frame, '--preview-case-width');
</script>

<style scoped lang="scss" src="@/assets/styles/components/phone-frame.scss"></style>
