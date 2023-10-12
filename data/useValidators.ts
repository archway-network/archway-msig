import { Ref, ComputedRef } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { Validators, Validator, ValidatorDelegation } from '@/domain';
import { useValidatorsFilters } from '@/data/useValidatorsFilters';
import { useValidatorsDelegations } from '@/data/useValidatorsDelegations';

import { Filter, ValidatorsFilterTypes, ValidatorsFilterType } from '@/types';

export const useValidators = async (
  isAuthenticated: ComputedRef<boolean>,
  walletAddress: ComputedRef<string | undefined>
): Promise<{
  filters: ComputedRef<Filter[]>;
  selectedFilter: Ref<ValidatorsFilterType | undefined>;
  validators: ComputedRef<Validator[] | undefined>;
  nextPageToken: ComputedRef<string | undefined>;
  delegations: Ref<ValidatorDelegation[] | undefined>;
  loading: Ref<boolean>;
  onlyDelegatesData: any;
  filteredValidatorsData: any;
}> => {
  const { filters, selectedFilter } = useValidatorsFilters(isAuthenticated);

  const mustFetchValidatorsWithMyDelegations = computed(
    () => isAuthenticated.value && (selectedFilter.value === ValidatorsFilterTypes.DELEGATED || !selectedFilter.value)
  );
  const { data: onlyDelegatesData, isLoading: isLoadingOnlyDelegatesData } = useQuery({
    queryKey: [{ scope: 'validators', entity: 'index', walletAddress: walletAddress }],
    queryFn: Validators.onlyDelegates,
    enabled: mustFetchValidatorsWithMyDelegations,
  });

  const mustFetchFilteredValidators = computed(() => selectedFilter.value !== ValidatorsFilterTypes.DELEGATED);
  const { data: filteredValidatorsData, isLoading: isLoadingFilteredValidatorsData } = useQuery({
    queryKey: [{ scope: 'validators', entity: 'index', filter: selectedFilter }],
    queryFn: Validators.all,
    enabled: mustFetchFilteredValidators,
  });

  const { delegations, loading: isLoadingDelegations } = await useValidatorsDelegations(walletAddress, isAuthenticated);

  const isLoadingValidators = computed(() => {
    if (mustFetchValidatorsWithMyDelegations.value) return isLoadingOnlyDelegatesData.value;
    return isLoadingFilteredValidatorsData.value;
  });

  const loading = computed(() => isLoadingValidators.value || isLoadingDelegations.value);

  const validators = computed(() => {
    if (mustFetchValidatorsWithMyDelegations.value) return onlyDelegatesData.value?.validators;
    return filteredValidatorsData.value?.validators;
  });

  const nextPageToken = computed(() => {
    if (mustFetchValidatorsWithMyDelegations.value) return onlyDelegatesData.value?.nextPageToken;
    return filteredValidatorsData.value?.nextPageToken;
  });

  return {
    filters,
    selectedFilter,
    validators,
    nextPageToken,
    delegations,
    loading,
    onlyDelegatesData,
    filteredValidatorsData,
  };
};
