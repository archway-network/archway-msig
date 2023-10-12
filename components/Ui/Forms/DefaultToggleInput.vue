<script setup>
  import { computed } from 'vue';
  import { Switch } from '@headlessui/vue';

  import Label from './Label.vue';

  const props = defineProps({
    modelValue: { type: [Boolean], default: false },
    label: { type: String, default: null },
    legend: { type: String, default: null },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  });

  const emit = defineEmits(['update:model-value']);

  const enabled = computed(() => props.modelValue);

  const onSwitch = enabled => {
    emit('update:model-value', enabled);
  };
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <Label :label="label" :required="required" />
      <Switch
        :model-value="modelValue"
        :class="[
          enabled ? 'bg-black/75' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2',
        ]"
        :disabled="disabled"
        @update:model-value="onSwitch"
      >
        <span class="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          :class="[
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          ]"
        />
      </Switch>
    </div>
    <p class="text-align pt-3 small text-gray" v-if="!!legend">
      {{ legend }}
    </p>
  </div>
</template>
