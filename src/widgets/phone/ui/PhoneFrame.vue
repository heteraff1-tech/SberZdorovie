<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { getSvg } from '@/shared/lib/asset'

const size = { width: 434, height: 906 }
const frame = ref(null)
const scale = ref(1)
let observer

onMounted(() => {
  // Масштабируется весь корпус вместе с экраном 402 × 874.
  function fitPhone() {
    scale.value = frame.value.getBoundingClientRect().width / size.width
  }

  fitPhone()
  observer = new ResizeObserver(fitPhone)
  observer.observe(frame.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div
    ref="frame"
    class="phone"
    :style="{ '--case-width': `${size.width}px`, '--case-height': `${size.height}px`, '--case-ratio': size.width / size.height }"
  >
    <div class="case" :style="{ '--case-scale': scale }">
      <div class="rail" aria-hidden="true"></div>
      <div class="screen">
        <slot />
        <div class="status" aria-hidden="true">
          <span>15:07</span>
          <img :src="getSvg('status')" width="79" height="13" alt="" />
        </div>
        <div class="island" aria-hidden="true"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phone {
  position: relative;
  width: min(var(--case-width), calc(100vw - 2 * var(--stage-gap)), calc((100dvh - 2 * var(--stage-gap)) * var(--case-ratio)));
  aspect-ratio: var(--case-ratio);
}

.case {
  position: absolute;
  width: var(--case-width);
  height: var(--case-height);
  border-radius: 68px;
  transform: scale(var(--case-scale));
  transform-origin: top left;
  background: linear-gradient(145deg, #818187, #303034 13%, #77777e 31%, #252529 64%, #55555a 89%, #19191c);
  box-shadow: 0 20px 68px rgb(0 0 0 / 44%), inset 0 0 0 1px #77777c;
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

.rail, .rail::before, .rail::after {
  position: absolute;
  width: 3px;
  border-radius: 3px;
  background: linear-gradient(90deg, #39393e, #77777c);
}

.rail { top: 179px; left: -2px; height: 28px; }
.rail::before { content: ''; top: 49px; left: 0; height: 61px; }
.rail::after { content: ''; top: 121px; left: 0; height: 61px; }

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
  width: var(--screen-width);
  height: var(--screen-height);
  overflow: hidden;
  isolation: isolate;
  border-radius: var(--screen-radius);
  background: var(--ink);
}

.status {
  position: absolute;
  z-index: 2;
  top: 0;
  inset-inline: 0;
  height: 56px;
  pointer-events: none;
  color: var(--status);
  font: 590 17px / 22px var(--font-status);
}

.status span { position: absolute; top: 18.34px; left: 70.56px; transform: translateX(-50%); }
.status img { position: absolute; top: 22px; left: 291.3px; }

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
