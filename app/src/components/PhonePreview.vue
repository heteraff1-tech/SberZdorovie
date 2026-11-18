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

<style scoped lang="scss">
.phone {
  // Фиксированная геометрия устройства из макета, только для превью.
  --preview-case-width: 434px;
  --preview-case-height: 906px;
  --preview-case-ratio: 0.4790286976;
  --preview-screen-width: 402px;
  --preview-screen-height: 874px;
  --preview-screen-radius: 52px;
  --preview-gap: var(--spacing-3);

  position: relative;
  width: min(
    var(--preview-case-width),
    calc(100vw - 2 * var(--preview-gap)),
    calc((100vh - 2 * var(--preview-gap)) * var(--preview-case-ratio))
  );
  width: min(
    var(--preview-case-width),
    calc(100vw - 2 * var(--preview-gap)),
    calc((100dvh - 2 * var(--preview-gap)) * var(--preview-case-ratio))
  );
  aspect-ratio: var(--preview-case-ratio);
}

.case {
  position: absolute;
  width: var(--preview-case-width);
  height: var(--preview-case-height);
  border-radius: 68px;
  transform: scale(var(--case-scale));
  transform-origin: top left;
  background: linear-gradient(
    145deg,
    #818187,
    #303034 13%,
    #77777e 31%,
    #252529 64%,
    #55555a 89%,
    #19191c
  );
  box-shadow:
    0 20px 68px rgb(0 0 0 / 44%),
    inset 0 0 0 1px #77777c;
}

.case::before {
  content: '';
  position: absolute;
  inset: 4px;
  border: 1px solid #48484d;
  border-radius: 64px;
  background: #0c0b0e;
  box-shadow: inset 0 0 0 3px #18171a;
}

.rail,
.rail::before,
.rail::after {
  position: absolute;
  width: 3px;
  border-radius: 3px;
  background: linear-gradient(90deg, #39393e, #77777c);
}

.rail {
  top: 179px;
  left: -2px;
  height: 28px;
}
.rail::before {
  content: '';
  top: 49px;
  left: 0;
  height: 61px;
}
.rail::after {
  content: '';
  top: 121px;
  left: 0;
  height: 61px;
}

.case::after {
  content: '';
  position: absolute;
  right: -2px;
  top: 248px;
  width: 3px;
  height: 89px;
  border-radius: 3px;
  background: linear-gradient(90deg, #74747a, #37373d);
}

.screen {
  position: absolute;
  inset: 16px;
  width: var(--preview-screen-width);
  height: var(--preview-screen-height);
  overflow: clip;
  isolation: isolate;
  border-radius: var(--preview-screen-radius);
  background: #050006;
}

.status {
  position: absolute;
  z-index: 6;
  top: 0;
  inset-inline: 0;
  height: 56px;
  pointer-events: none;
  color: rgb(255 255 255 / 86%);
  font: 400 var(--text-body-size) / var(--text-body-line) var(--font-text);
}

.status span {
  position: absolute;
  top: 18.34px;
  left: 70.56px;
  transform: translateX(-50%);
}
.status img {
  position: absolute;
  top: 22px;
  left: 291.3px;
}
.screen--light .status {
  color: var(--color-fg-default);
}
.screen--light .status span {
  top: 23.34px;
  left: 73px;
}
.status-levels {
  position: absolute;
  top: 26px;
  left: 288px;
  display: flex;
  align-items: center;
  gap: 7px;
}
.status .status-levels img {
  position: static;
}

.island {
  position: absolute;
  z-index: 4;
  pointer-events: none;
  width: 112px;
  height: 30px;
  top: 13px;
  left: 145px;
  border-radius: 20px;
  background: #020203;
}

.island::after {
  content: '';
  position: absolute;
  top: 11px;
  right: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle at 55% 45%, #1c1925, #09080d 42%, #050507 65%);
}
</style>
