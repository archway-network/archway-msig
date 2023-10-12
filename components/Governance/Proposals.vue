<script setup>
  import { PillFiltersInput, Link, PrimaryButton, Tooltip, HelpIcon } from '@/components/Ui';
  import ProposalSkeleton from '@/components/Governance/ProposalSkeleton.vue';
  import NoProposals from '@/components/Governance/NoProposals.vue';
  import ProposalDetailsButton from '@/components/Governance/ProposalDetailsButton.vue';
  import ProposalCard from '@/components/Governance/ProposalCard.vue';
  import { useGovernanceProposals } from '@/data/useGovernanceProposals';
  import { useConfig } from '@/composables';

  import { GovernanceProposalsFilterTypes, TooltipPosition } from '@/types';

  const { proposals, filters, loading, selectedFilter } = await useGovernanceProposals(GovernanceProposalsFilterTypes.ALL);

  const config = useConfig();
</script>

<template>
  <div>
    <div class="flex flex-col xl:flex-row justify-between items-center pb-8 space-x-2">
      <PillFiltersInput :filters="filters" v-model="selectedFilter" />
      <div class="flex items-center space-x-5 mt-4 xl:mt-0">
        <div class="flex items-center space-x-2">
          <Link :href="`${config.externalLinks.ARCHWAY_DOCS}/community/governance/governance`" :hide-external-icon="true">
            How does it work
          </Link>
          <Tooltip
            text="Governance proposals follow an agreed community process. Click to learn more."
            :position="TooltipPosition.BOTTOM"
            width="225px"
          >
            <HelpIcon class="w-4 h-4 text-orange" />
          </Tooltip>
        </div>
        <PrimaryButton href="https://gov.archway.io">Gov. Forum</PrimaryButton>
      </div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-8" v-if="loading">
      <ProposalSkeleton v-for="_ in new Array(6)" />
    </div>
    <template v-else>
      <div class="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-8" v-if="proposals?.length">
        <ProposalDetailsButton :proposal="proposal" v-for="proposal in proposals">
          <ProposalCard :proposal="proposal" />
        </ProposalDetailsButton>
      </div>
      <NoProposals v-else />
    </template>
  </div>
</template>
