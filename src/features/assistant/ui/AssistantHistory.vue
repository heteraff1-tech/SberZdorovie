<template>
  <section class="assistant-history" role="region" aria-label="История сообщений">
    <h2 class="assistant-history__title">Ваши сообщения</h2>
    <p v-if="!messages.length" class="assistant-history__empty">
      Здесь появятся ваши сообщения помощнику.
    </p>
    <div v-for="(message, index) in messages" :key="index" class="assistant-history__message">
      <p>{{ message.text }}</p>
      <small v-if="message.file">{{ message.file }}</small>
    </div>
  </section>
</template>

<script setup>
defineProps({ messages: { type: Array, required: true } });
</script>

<style scoped lang="scss" src="@/assets/styles/features/assistant/assistant-history.scss"></style>
