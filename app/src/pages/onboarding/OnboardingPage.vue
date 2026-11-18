<template>
  <OnboardingFlow @complete="$emit('complete')" />
</template>

<script setup>
import { OnboardingFlow } from '@/features/onboarding';
defineEmits(['complete']);
</script>
