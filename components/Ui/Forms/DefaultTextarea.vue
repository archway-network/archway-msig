<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import { TextInput, Textarea, TextInputLabel } from '@/components/Ui/Forms/TextInput';
  import ErrorMessage from '@/components/Ui/Forms/ErrorMessage.vue';

  const props = defineProps({
    modelValue: { type: String, default: '' },
    label: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    legend: { type: String, default: undefined },
    errors: { type: String, default: undefined },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    rows: { type: String, default: '4' },
  });

  defineEmits(['update:modelValue']);

  const attr = useAttrs();
</script>

<template>
  <TextInput class="space-y-3">
    <TextInputLabel class="label" v-if="label || $slots.label">
      <slot name="label"> {{ label }}{{ required ? '*' : '' }} </slot>
    </TextInputLabel>
    <div class="relative">
      <div class="relative">
        <Textarea
          :class="[
            'w-full flex items-center px-4 min-h-[2.5rem] max-h-[24rem]',
            'text-sm text-gray-800 placeholder-shown:text-sm placeholder-shown:text-gray-800',
            'border border-gray-warm rounded-lg',
            'focus:ring-0 focus:border-gray-400 focus-visible:outline-none',
          ]"
          :rows="rows"
          :value="modelValue"
          :placeholder="placeholder"
          :required="required"
          :disabled="disabled"
          v-bind="attr"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      </div>
    </div>
    <ErrorMessage :errors="errors" />
    <p v-if="legend" class="text-align caption text-gray-800">
      {{ legend }}
    </p>
  </TextInput>
</template>
