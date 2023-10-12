<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { TextInput, Textarea, TextInputLabel } from '@/components/Ui/Forms/TextInput';

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

  const hasLabel = computed(() => props.label !== undefined);
  const hasLegend = computed(() => props.legend !== undefined);
  const hasErrors = computed(() => props.errors !== undefined);
</script>

<template>
  <TextInput>
    <TextInputLabel class="block pb-2 caption text-gray-800" v-if="label"> {{ label }}{{ required ? '*' : '' }} </TextInputLabel>
    <div class="relative" :class="{ 'mt-1': hasLabel }">
      <div class="relative">
        <Textarea
          :class="[
            'w-full flex items-center px-4',
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
    <p class="text-right pt-3 caption text-red" v-if="hasErrors">
      {{ errors }}
    </p>
    <p class="text-align pt-3 caption text-gray-800" v-if="hasLegend">
      {{ legend }}
    </p>
  </TextInput>
</template>
