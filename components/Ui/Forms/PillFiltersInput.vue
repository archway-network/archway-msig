<script lang="ts" setup>
  import { useAttrs, type PropType } from 'vue';
  import { FilterButton, FiltersInput } from '@/components/Ui/Forms/FiltersInput';

  import type { Filter } from '@/types';

  defineProps({
    filters: { type: Array as PropType<Filter[]>, required: true },
    modelValue: { type: [String, Number, Boolean], default: undefined },
  });

  const attrs = useAttrs();
</script>

<template>
  <FiltersInput as="div" v-bind="attrs" class="flex items-center space-x-2">
    <FilterButton
      :class="[
        'h-[48px] px-6 inline-flex items-center justify-center whitespace-nowrap rounded-lg',
        'text-base leading-none hover:no-underline',
        {
        'text-black bg-transparent hover:text-black': modelValue !== filter.id,
        'bg-white text-black drop-shadow-button]': modelValue == filter.id as string,
        }
      ]"
      :value="filter"
      v-for="filter in filters"
    >
      {{ filter.label }}
    </FilterButton>
  </FiltersInput>
</template>
