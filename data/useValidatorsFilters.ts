import { computed, type Ref, type ComputedRef } from 'vue';

import { type Filter, ValidatorsFilterTypes, type ValidatorsFilterType } from '@/types';

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
