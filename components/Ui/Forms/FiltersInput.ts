import { defineComponent, inject, provide, ref, InjectionKey, PropType, Ref } from 'vue';
import { omit, render } from '@/utils';

import type { Filter } from '@/types';

interface StateDefinition {
  filters: Ref<Filter[]>;
  selectFilter(filter: Filter): void;
  registerFilter(filter: Filter): void;
  unregisterFilter(filter: Filter): void;
}

const FiltersInputContext = Symbol('FiltersInputContext') as InjectionKey<StateDefinition>;

const useFiltersInputContext = (component: string) => {
  const context = inject(FiltersInputContext);

  if (!context) {
    throw new Error(`<${component} /> is missing a parent <FiltersInput /> component.`);
  }

  return context;
};

export const FiltersInput = defineComponent({
  name: 'FiltersInput',

  props: {
    as: { type: String, default: 'div' },
    modelValue: { type: [String, Number, Boolean], default: undefined },
  },

  emits: { 'update:modelValue': (_value: any) => true },

  setup(props, { slots, attrs, emit }) {
    const filters = ref<StateDefinition['filters']['value']>([]);
    const selected = computed(() => props.modelValue);

    provide(FiltersInputContext, {
      filters,
      selectFilter: (filter: Filter) => {
        emit('update:modelValue', filter.id);
      },
      registerFilter: (filter: Filter) => {
        if (!filters.value.includes(filter)) filters.value.push(filter);
      },
      unregisterFilter: (filter: Filter) => {
        let idx = filters.value.indexOf(filter);
        if (idx !== -1) filters.value.splice(idx, 1);
      },
    });

    const scoped = { selected: selected.value };

    const passThroughProps = omit(props, ['modelValue', 'onUpdate:modelValue']);

    return () => {
      return render({ name: 'FiltersInput', props: { ...passThroughProps }, slots, scoped, attrs });
    };
  },
});

export const FilterButton = defineComponent({
  name: 'FilterButton',

  props: {
    as: { type: String, default: 'button' },
    value: { type: Object as PropType<Filter>, required: true },
  },

  setup(props, { slots, attrs }) {
    const context = useFiltersInputContext('FilterButton');

    onMounted(() => context.registerFilter(props.value));
    onUnmounted(() => context.unregisterFilter(props.value));

    const passThroughProps = omit(props, ['value']);

    const propsWeControl = {
      onClick: () => {
        context.selectFilter(props.value);
      },
    };

    return () => {
      return render({ name: 'FilterButton', props: { ...passThroughProps, ...propsWeControl }, slots, attrs });
    };
  },
});
