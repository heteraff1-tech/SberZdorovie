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
    <div class="pulse-history__body">
      <div class="pulse-history__measurements">
        <h2>{{ data.range[0] }}–{{ data.range[1] }} уд/мин</h2>
        <div class="pulse-history__plot">
          <svg
            class="pulse-history__chart"
            viewBox="0 0 322 66"
            preserveAspectRatio="none"
            role="img"
            aria-label="История разовых замеров пульса"
          >
            <g class="pulse-history__grid">
              <path
                v-for="value in [40, 80, 120]"
                :key="value"
                :d="`M30 ${47 - (value - 40) / 2}H318`"
              />
              <path v-for="tick in ticks" :key="tick.x" :d="`M${tick.x} 6V47`" />
            </g>
            <g class="pulse-history__labels">
              <text
                v-for="value in [40, 80, 120]"
                :key="value"
                x="23"
                :y="51 - (value - 40) / 2"
                text-anchor="end"
              >
                {{ value }}
              </text>
              <text
                v-for="(tick, index) in ticks"
                :key="tick.x"
                :x="tick.x"
                y="63"
                :text-anchor="index === 0 ? 'start' : index === 4 ? 'end' : 'middle'"
              >
                {{ tick.label }}
              </text>
            </g>
            <path class="pulse-history__scrubber" :d="`M${selected.x} 6V47`" />
          </svg>
          <button
            v-for="(point, index) in points"
            :key="point.time"
            type="button"
            class="pulse-history__point"
            :class="[
              `pulse-history__phase--${point.phase}`,
              { 'pulse-history__point--latest': index === points.length - 1 },
            ]"
            :style="{ left: `${(point.x / 322) * 100}%`, top: `${point.y}px` }"
            :aria-label="`${point.time} — ${point.value} уд/мин`"
            :aria-pressed="selectedTime === point.time"
            @click="selectedTime = point.time"
          ></button>
        </div>
      </div>
      <div class="pulse-history__details">
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
      </div>
    </div>
  </section>
</template>

<script setup>
import { toRef } from 'vue';
import { pulsePeriods, pulsePhases } from '../config/pulse-history';
import { usePulseHistory } from '../model/usePulseHistory';
const props = defineProps({ data: { type: Object, required: true } });
const { period, selectedTime, points, selected, ticks } = usePulseHistory(toRef(props, 'data'));
</script>

<style scoped lang="scss">
.pulse-history {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-xl);
  background: var(--color-bg-surface);

  &__body,
  &__measurements {
    display: grid;
    gap: var(--spacing-3);
  }
  &__details {
    display: grid;
    gap: var(--spacing-2);
  }
  &__periods {
    display: flex;
    width: 318px;
    max-width: 100%;
    height: 36px;
    padding: calc(var(--spacing-3) / 4);
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
    height: 66px;
  }
  &__chart {
    display: block;
    width: 100%;
    height: 100%;
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
    --phase-color: var(--color-neutral-default);
  }
  &__phase--stress {
    --phase-color: var(--color-error-default);
  }
  &__phase--activity {
    --phase-color: var(--color-warning-default);
  }
  &__phase--coffee {
    --phase-color: var(--color-blue);
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
      top: 7px;
      left: 7px;
      width: 6px;
      height: 6px;
      border: 1px solid var(--color-bg-page);
      border-radius: 50%;
      background: var(--phase-color);
    }
    &--latest::after {
      top: 7.25px;
      left: 7.25px;
      width: 5.5px;
      height: 5.5px;
      border-color: var(--phase-color);
      background: var(--color-bg-page);
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
  &__scrubber {
    stroke: var(--color-error-default);
    stroke-width: 1;
  }
  &__selection {
    font: 500 var(--text-label-size) / var(--text-label-line) var(--font-text);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-2) var(--spacing-3);
    border-radius: var(--border-radius-s);
    background: var(--color-bg-page);
    span:last-child {
      color: var(--color-neutral-default);
    }
  }
  &__legend {
    font: 400 var(--text-caption-size) / var(--text-caption-line) var(--font-text);
    display: flex;
    gap: var(--spacing-3);
    color: var(--color-neutral-default);
    span {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
    }
    i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--phase-color);
    }
  }
}
</style>
