import { computed, Ref, ComputedRef } from 'vue';

import { Filter, ValidatorsFilterTypes, ValidatorsFilterType } from '@/types';

export const useValidatorsFilters = (
  isAuthenticated: ComputedRef<boolean>
): {
  filters: ComputedRef<Filter[]>;
  selectedFilter: Ref<ValidatorsFilterType | undefined>;
} => {
  const selectedFilter = ref<ValidatorsFilterType>();

  const filters = computed(() => {
    const filters = [];

    if (isAuthenticated.value) {
      filters.push({ id: ValidatorsFilterTypes.DELEGATED, label: 'My Delegates' });
    }
    filters.push({ id: ValidatorsFilterTypes.ACTIVE, label: 'Active' });
    filters.push({ id: ValidatorsFilterTypes.ALL, label: 'All' });

    return filters;
  });

  return {
    filters,
    selectedFilter,
  };
};
