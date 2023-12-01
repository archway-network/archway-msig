<script lang="ts" setup>
  import { useAttrs, PropType } from 'vue';
  import { FilterButton, FiltersInput } from '@/components/Ui/Forms/FiltersInput';

  import { Filter } from '@/types';

  const props = defineProps({
    filters: { type: Array as PropType<Filter[]>, required: true },
    modelValue: { type: [String, Number, Boolean], default: undefined },
    defaultValue: { type: [String, Number, Boolean], default: undefined },
  });

  const attrs = useAttrs();

  const selected = computed(() => {
    if (!props.modelValue) return props.defaultValue;
    return props.modelValue;
  });
</script>

<template>
  <FiltersInput as="div" v-bind="attrs" class="h-12 flex items-center space-x-2 border border-gray-warm rounded-lg px-1 py-1">
    <FilterButton
      class="h-full px-6 transition duration-400 ease-in-out"
      :class="{
        'text-gray': selected !== filter.id,
        'text-orange bg-white shadow-[0px_15px_54px_rgba(0,0,0,0.06)]': selected == filter.id as string,
      }"
      :value="filter"
      v-for="filter in filters"
    >
      {{ filter.label }}
    </FilterButton>
  </FiltersInput>
</template>
