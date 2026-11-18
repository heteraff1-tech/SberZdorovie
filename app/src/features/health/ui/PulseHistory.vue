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
        <g
          class="pulse-history__band"
          v-for="band in bands"
          :key="band.phase"
          :class="`pulse-history__phase--${band.phase}`"
        >
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

<style scoped lang="scss">
.pulse-history {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: var(--spacing-4);
  border-radius: var(--border-radius-xl);
  background: var(--color-bg-surface);

  &__periods {
    display: flex;
    height: 36px;
    padding: var(--spacing-1);
    border-radius: var(--border-radius-s);
    background: var(--color-bg-page);
    button {
      font: 500 var(--text-footnote-size) / var(--text-footnote-line) var(--font-text);
      flex: 1;
      padding: 0;
      border: 0;
      border-radius: var(--border-radius-s);
      background: transparent;
      color: var(--color-fg-default);
      cursor: pointer;
      &[aria-pressed='true'] {
        background: var(--color-bg-surface);
      }
    }
  }
  h2 {
    font: 600 var(--heading-h4-size) / var(--heading-h4-line) var(--font-display);
    margin: 0;
  }
  &__plot {
    position: relative;
    height: 90px;
    margin-top: -4px;
  }
  &__chart {
    display: block;
    width: 100%;
    height: 90px;
    overflow: visible;
  }
  &__grid {
    fill: none;
    stroke: var(--color-border-default);
    stroke-width: 1;
  }
  &__labels {
    font: 400 var(--text-caption-size) / var(--text-caption-line) var(--font-text);
    fill: var(--color-neutral-default);
  }
  &__phase--rest {
    fill: var(--color-neutral-default);
    background: var(--color-neutral-default);
  }
  &__phase--stress {
    fill: var(--color-error-default);
    background: var(--color-error-default);
  }
  &__phase--activity {
    fill: var(--color-warning-default);
    background: var(--color-warning-default);
  }
  &__phase--coffee {
    fill: var(--color-blue);
    background: var(--color-blue);
  }
  &__band {
    fill-opacity: 0.12;
  }
  &__point {
    position: absolute;
    width: 20px;
    height: 20px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background: transparent;
    cursor: pointer;
    &::after {
      content: '';
      position: absolute;
      top: 7.25px;
      left: 7.25px;
      width: 5.5px;
      height: 5.5px;
      border: 1px solid var(--color-bg-page);
      border-radius: 50%;
      background: var(--color-error-default);
    }
    &[aria-pressed='true']::after {
      top: 5.5px;
      left: 5.5px;
      width: 9px;
      height: 9px;
      border: 1.5px solid var(--color-warning-default);
      background: var(--color-bg-page);
    }
  }
  &__annotation {
    font: 400 var(--text-caption-size) / var(--text-caption-line) var(--font-text);
    fill: var(--color-warning-default);
  }
  &__scrubber {
    stroke: var(--color-error-default);
    stroke-width: 1;
  }
  &__selection {
    font: 500 var(--text-footnote-size) / var(--text-footnote-line) var(--font-text);
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 30px;
    margin-top: -4px;
    padding: 0 9px;
    border-radius: var(--border-radius-s);
    background: var(--color-bg-surface);
    span:last-child {
      color: var(--color-neutral-default);
    }
  }
  &__legend {
    font: 400 var(--text-caption-size) / var(--text-caption-line) var(--font-text);
    display: flex;
    gap: 12px;
    margin-top: -8px;
    color: var(--color-neutral-default);
    span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
  }
}
</style>
