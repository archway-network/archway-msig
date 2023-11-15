<script setup lang="ts" generic="TValue extends string | number | boolean | object | null | undefined">
  import { ListboxOption } from '@headlessui/vue';

  const props = defineProps<{
    value: TValue;
    disabled?: boolean;
  }>();
</script>

<template>
  <ListboxOption v-slot="{ active, selected }" :disabled="disabled" :value="props.value">
    <li
      :class="{
        '!bg-gray-200': active,
        'bg-gray-100': selected,
        'text-gray-400': disabled && !selected,
        'pointer-events-none': disabled,
      }"
      class="relative cursor-pointer rounded-lg flex space-x-4 p-2"
    >
      <span class="font-medium" v-bind="{ active, selected }">
        <slot />
      </span>
    </li>
  </ListboxOption>
</template>
