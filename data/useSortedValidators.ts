import BigNumber from 'bignumber.js';

import { Validator } from '@/domain';

import { SortDirection } from '@/types';
import { SortField } from '@/types/validators';

export const useSortedValidators = (
  validators: ComputedRef<Validator[] | undefined>
): {
  sortedValidators: ComputedRef<Validator[]>;
  sortBy: Ref<SortField>;
  sortDirection: Ref<SortDirection>;
} => {
  const sortBy = ref<SortField>(SortField.VOTING_POWER);
  const sortDirection = ref<SortDirection>(SortDirection.DESC);

  const sortedValidators = computed(() => {
    if (!validators.value) return [];

    const sorted = [...validators.value].sort((a: Validator, b: Validator) => {
      let valueA = new BigNumber(0);
      let valueB = new BigNumber(0);

      switch (sortBy.value) {
        case SortField.VOTING_POWER:
          valueA = BigNumber(a[sortBy.value].amount);
          valueB = BigNumber(b[sortBy.value].amount);
          break;
        case SortField.COMMISSION:
          valueA = BigNumber(a[sortBy.value]);
          valueB = BigNumber(b[sortBy.value]);
          break;
      }

      const result = valueA.comparedTo(valueB) || 0;

      return sortDirection.value === SortDirection.ASC ? result : result * -1;
    });

    return sorted || [];
  });

  return {
    sortedValidators,
    sortBy,
    sortDirection,
  };
};
