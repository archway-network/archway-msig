<script>
  export default {
    inheritAttrs: false,
  };
</script>

<script setup>
  import { computed } from 'vue';
  import { Input, TextInput, TextInputLabel } from '@/components/Ui/Forms/TextInput';
  import ErrorMessage from '@/components/Ui/Forms/ErrorMessage.vue';

  const props = defineProps({
    label: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    icon: { type: Object, default: undefined },
    legend: { type: String, default: undefined },
    errors: { type: String, default: undefined },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    modelValue: { type: String, default: '' },
    externalCssClass: { type: String, default: '' },
  });

  defineEmits(['update:modelValue']);

  const attr = useAttrs();

  const hasIcon = computed(() => props.icon !== undefined);
  const hasLegend = computed(() => props.legend !== undefined);
</script>

<template>
  <TextInput class="space-y-3">
    <TextInputLabel class="label" v-if="label"> {{ label }}{{ required ? '*' : '' }} </TextInputLabel>
    <div class="relative">
      <div class="relative">
        <Input
          type="text"
          :class="[
            'w-full h-12 flex items-center pl-4',
            { 'pr-10': hasIcon, 'pr-4': !hasIcon },
            'text-sm text-gray-800 placeholder-shown:text-sm placeholder-shown:text-gray-800',
            'border border-gray-warm rounded-lg',
            'focus:ring-0 focus:border-gray-400 focus-visible:outline-none',
          ]"
          :value="modelValue"
          :placeholder="placeholder"
          :required="required"
          :disabled="disabled"
          v-bind="attr"
          @input="$emit('update:modelValue', $event.target.value)"
        />
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4" v-if="hasIcon">
          <component :is="icon" class="w-4 h-4 text-gray-800" aria-hidden="true" />
        </div>
      </div>
    </div>
    <ErrorMessage :errors="errors" />
    <p class="text-align small text-gray" v-if="hasLegend">
      {{ legend }}
    </p>
  </TextInput>
</template>
