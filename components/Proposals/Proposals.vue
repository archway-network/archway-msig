<script setup>
  import { storeToRefs } from 'pinia';
  import { PillFiltersInput, VestingContractFeature } from '@/components/Ui';
  import VestingAccountOverview from '@/components/VestingAccounts/VestingAccountOverview.vue';
  import CreateProposalButton from '@/components/Proposals/CreateProposalButton.vue';
  import ProposalSkeleton from '@/components/Proposals/ProposalSkeleton.vue';
  import NoProposals from '@/components/Proposals/NoProposals.vue';
  import ProposalDetailsButton from '@/components/Proposals/ProposalDetailsButton.vue';
  import ProposalCard from '@/components/Proposals/ProposalCard.vue';
  import { useAccountId } from '@/data/useAccountId';
  import { useProposals } from '@/data/useProposals';
  import { useVestingAccountId } from '@/data/useVestingAccountId';
  import { useAuthStore } from '@/store';

  import { ProposalStatus, ProposalsFilterTypes } from '@/types';

  const { walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();

  const { proposals, filters, loading, selectedFilter } = await useProposals(ProposalsFilterTypes.ALL, accountId.value, walletAddress);
  const { vestingAccountId, loading: loadingVestingAccountId } = await useVestingAccountId(accountId, walletAddress);

  const filteredProposals = computed(() => {
    if (selectedFilter.value === ProposalsFilterTypes.ALL) {
      return proposals.value;
    }

    return proposals.value.filter(proposal => {
      switch (selectedFilter.value) {
        case ProposalsFilterTypes.IN_PROGRESS:
          return proposal.status === ProposalStatus.IN_PROGRESS;
        case ProposalsFilterTypes.TO_EXECUTE:
          return proposal.status === ProposalStatus.PASSED;
        case ProposalsFilterTypes.EXECUTED:
          return proposal.status === ProposalStatus.EXECUTED;
        case ProposalsFilterTypes.FAILED:
          return [ProposalStatus.REJECTED, ProposalStatus.FAILED].includes(proposal.status);
      }
    });
  });
</script>

<template>
  <div>
    <div class="flex flex-col xl:flex-row justify-between items-center pb-8 space-x-2">
      <PillFiltersInput :filters="filters" v-model="selectedFilter" />
      <CreateProposalButton class="mt-4 xl:mt-0" />
    </div>
    <VestingContractFeature>
      <VestingAccountOverview :vesting-account-id="vestingAccountId" v-if="!loadingVestingAccountId && vestingAccountId" />
    </VestingContractFeature>
    <div class="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-8" v-if="loading">
      <ProposalSkeleton v-for="_ in new Array(6)" />
    </div>
    <template v-else>
      <div class="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-8" v-if="filteredProposals?.length">
        <ProposalDetailsButton :proposal="proposal" v-for="proposal in filteredProposals">
          <ProposalCard :proposal="proposal" />
        </ProposalDetailsButton>
      </div>
      <NoProposals v-else />
    </template>
  </div>
</template>
