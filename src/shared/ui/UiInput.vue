<template>
  <div
    class="ui-input"
    :class="{
      [`ui-input--${status}`]: status,
      'ui-input--filled': Boolean(modelValue),
      'ui-input--disabled': disabled,
      'ui-input--readonly': readonly,
    }"
  >
    <label v-if="label" :for="inputId" class="ui-input__label">{{ label }}</label>
    <div class="ui-input__control">
      <input
        :id="inputId"
        ref="element"
        v-bind="$attrs"
        class="ui-input__field"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="status === 'error' || undefined"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, useId } from 'vue';

defineOptions({ inheritAttrs: false });
const props = defineProps({
  id: String,
  modelValue: { type: String, default: '' },
  type: { type: String, default: 'text' },
  label: String,
  placeholder: String,
  status: { type: String, validator: (value) => ['error', 'warning', 'success'].includes(value) },
  disabled: Boolean,
  readonly: Boolean,
});
defineEmits(['update:modelValue']);
const generatedId = useId();
const inputId = computed(() => props.id || generatedId);
const element = ref(null);
defineExpose({ focus: () => element.value?.focus() });
</script>

<style scoped lang="scss" src="@/assets/styles/components/input.scss"></style>
