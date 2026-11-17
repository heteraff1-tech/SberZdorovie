<script setup>
defineProps({ label: { type: String, required: true }, centered: Boolean })
defineEmits(['select'])
</script>

<template>
  <button type="button" class="glass-card" :class="{ 'glass-card--centered': centered }" @click="$emit('select', label)">
    <span class="glass-card-label">{{ label }}</span><slot />
  </button>
</template>

<style scoped>
.glass-card { position: relative; display: flex; flex-direction: column; justify-content: space-between; align-items: start; width: 167px; height: 167px; padding: 15px 14px 15px 15px; border: 0; border-radius: 25px; background: rgb(255 255 255 / 5%); box-shadow: 0 4px 11px rgb(56 71 87 / 6%); backdrop-filter: blur(7px); text-align: left; color: black; cursor: pointer; transition: background 200ms, box-shadow 200ms; }
.glass-card::before { content: ''; position: absolute; inset: 0; border: 1.25px solid rgb(142 156 168 / 42%); border-radius: inherit; pointer-events: none; }
.glass-card::after { content: ''; position: absolute; inset: -1.25px; border: 1.25px solid transparent; border-radius: inherit; background: linear-gradient(130deg, transparent 15%, white 45%, white 65%, transparent 95%) border-box; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude; pointer-events: none; }
.glass-card:hover { background: rgb(255 255 255 / 18%); box-shadow: 0 5px 18px rgb(56 71 87 / 10%); }
.glass-card:active { background: rgb(255 255 255 / 35%); }
.glass-card--centered { justify-content: center; }
.glass-card-label { position: relative; white-space: pre-line; width: 138px; font: 500 18px / 21px var(--font-text); }
</style>
