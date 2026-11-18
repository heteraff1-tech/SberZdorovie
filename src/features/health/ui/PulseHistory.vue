<template>
  <section class="pulse-history" aria-label="История пульса">
    <div class="pulse-history__periods" role="group" aria-label="Период истории">
      <button
        v-for="item in pulsePeriods"
        :key="item.id"
        type="button"
        :aria-pressed="period === item.id"
        @click="period = item.id"
      >
        {{ item.label }}
      </button>
    </div>
    <h2>{{ data.range[0] }}–{{ data.range[1] }} уд/мин</h2>
    <div class="pulse-history__plot">
      <svg
        class="pulse-history__chart"
        viewBox="0 0 318 90"
        preserveAspectRatio="none"
        role="img"
        aria-label="Разовые замеры пульса и периоды активности"
      >
        <g v-for="band in bands" :key="band.phase" :class="`pulse-history__phase--${band.phase}`">
          <rect :x="band.x" y="30" :width="band.width" height="41" />
        </g>
        <g class="pulse-history__grid">
          <path
            v-for="value in [40, 80, 120]"
            :key="value"
            :d="`M30 ${71 - (value - 40) / 2}H318`"
          />
          <path v-for="tick in ticks" :key="tick.x" :d="`M${tick.x} 30V71`" />
        </g>
        <g class="pulse-history__labels">
          <text
            v-for="value in [40, 80, 120]"
            :key="value"
            x="23"
            :y="75 - (value - 40) / 2"
            text-anchor="end"
          >
            {{ value }}
          </text>
          <text
            v-for="(tick, index) in ticks"
            :key="tick.x"
            :x="tick.x"
            y="89"
            :text-anchor="index === 0 ? 'start' : index === 4 ? 'end' : 'middle'"
          >
            {{ tick.label }}
          </text>
        </g>
        <path class="pulse-history__scrubber" :d="`M${selected.x} 25V71`" />
        <g v-if="period === 'day'" class="pulse-history__annotation">
          <image :href="assets.activity" x="162" y="4" width="14" height="14" />
          <text x="180" y="16">Тренировка</text>
        </g>
      </svg>
      <button
        v-for="point in points"
        :key="point.time"
        type="button"
        class="pulse-history__point"
        :style="{ left: `${(point.x / 318) * 100}%`, top: `${point.y}px` }"
        :aria-label="`${point.time} — ${point.value} уд/мин`"
        :aria-pressed="selectedTime === point.time"
        @click="selectedTime = point.time"
      ></button>
    </div>
    <div class="pulse-history__selection" aria-live="polite">
      <span>{{ selected.time }} · {{ selected.value }} уд/мин</span>
      <span>{{
        selected.label || pulsePhases.find((item) => item.id === selected.phase)?.label
      }}</span>
    </div>
    <div class="pulse-history__legend" aria-hidden="true">
      <span v-for="phase in pulsePhases" :key="phase.id"
        ><i :class="`pulse-history__phase--${phase.id}`"></i>{{ phase.label }}</span
      >
    </div>
  </section>
</template>

<script setup>
import { toRef } from 'vue';
import { assets } from '@/shared/config/assets';
import { pulsePeriods, pulsePhases } from '../config/pulse-history';
import { usePulseHistory } from '../model/usePulseHistory';
const props = defineProps({ data: { type: Object, required: true } });
const { period, selectedTime, points, bands, selected, ticks } = usePulseHistory(
  toRef(props, 'data'),
);
</script>

<style scoped lang="scss" src="@/assets/styles/features/health/pulse-history.scss"></style>
