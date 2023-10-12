<script lang="ts" setup>
  import { storeToRefs } from 'pinia';

  import { FiltersInput } from '@/components/Ui';
  import APR from '@/components/Staking/APR.vue';
  import StakingOverview from '@/components/Staking/StakingOverview.vue';
  import ManageStakingButton from '@/components/Staking/ManageStakingButton.vue';
  import ValidatorsSkeleton from '@/components/Staking/ValidatorsSkeleton.vue';
  import ValidatorsList from '@/components/Staking/ValidatorsList.vue';
  import NoValidators from '@/components/Staking/NoValidators.vue';
  import Pagination from '@/components/Staking/Pagination.vue';
  import { useAccountId } from '@/data/useAccountId';
  import { useValidators } from '@/data/useValidators';
  import { useValidatorsActive } from '@/data/useValidatorsActive';
  import { useSortedValidators } from '@/data/useSortedValidators';
  import { useAuthStore } from '@/store';

  import { SortDirection, ValidatorsFilterTypes } from '@/types';
  import { SortField } from '@/types/validators';

  const { isAuthenticated } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();

  const {
    filters,
    selectedFilter,
    validators: filteredValidators,
    nextPageToken: nextPageTokenForFilteredValidators,
    delegations,
    loading: loadingFilteredValidators,
  } = await useValidators(isAuthenticated, accountId);

  const noValidatorsWithMyDelegations = computed(() => (filteredValidators.value || []).length === 0);

  const shouldForceActive = computed(() => {
    return selectedFilter.value === undefined && (!isAuthenticated.value || noValidatorsWithMyDelegations.value);
  });

  const {
    validators: activeValidators,
    nextPageToken: nextPageTokenForActiveValidators,
    loading: loadingActiveValidators,
  } = await useValidatorsActive(shouldForceActive);

  const validators = computed(() => {
    return shouldForceActive.value ? activeValidators.value : filteredValidators.value;
  });

  const nextPageToken = computed(() => {
    return shouldForceActive.value ? nextPageTokenForActiveValidators.value : nextPageTokenForFilteredValidators.value;
  });

  const loading = computed(() => {
    return loadingFilteredValidators.value || loadingActiveValidators.value;
  });

  const defaultFilter = computed(() => {
    return shouldForceActive.value ? ValidatorsFilterTypes.ACTIVE : ValidatorsFilterTypes.DELEGATED;
  });

  const { sortedValidators, sortBy, sortDirection } = useSortedValidators(validators);

  const updateSortBy = (value: SortField) => {
    sortBy.value = value;
  };

  const updateSortDirection = (value: SortDirection) => {
    sortDirection.value = value;
  };
</script>

<template>
  <div class="pb-8" v-if="isAuthenticated">
    <StakingOverview />
  </div>
  <div class="bg-white rounded-2xl px-8 py-8 space-y-6">
    <div class="border-b border-gray-warm pb-6">
      <div class="flex items-center justify-between space-x-4 space-y-0">
        <FiltersInput :filters="filters" :default-value="defaultFilter" v-model="selectedFilter" />
        <div class="flex flex-row items-center space-x-4">
          <APR />
          <ManageStakingButton />
        </div>
      </div>
    </div>
    <ValidatorsSkeleton v-if="loading" />
    <template v-else>
      <div v-if="validators && validators.length > 0">
        <ValidatorsList
          :validators="validators"
          :delegations="delegations"
          :sort-by="sortBy"
          :sort-direction="sortDirection"
          @update:sort-by="updateSortBy"
          @update:sort-direction="updateSortDirection"
        />
        <Pagination class="pt-4" :current-page-token="nextPageToken" v-if="false" />
      </div>
      <NoValidators v-else />
    </template>
  </div>
</template>
