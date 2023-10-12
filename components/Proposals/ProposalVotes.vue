<script lang="ts" setup>
  import { PropType } from 'vue';
  import { storeToRefs } from 'pinia';
  import { CopyAddress } from '@/components/Ui';
  import ProposalVotesSkeleton from '@/components/Proposals/ProposalVotesSkeleton.vue';
  import ProposalVoteLabel from '@/components/Proposals/ProposalVoteLabel.vue';
  import { useAccountId } from '@/data/useAccountId';
  import { useProposalVotes } from '@/data/useProposalVotes';
  import { useAuthStore } from '@/store';
  import { Proposal } from '@/domain';
  import { formatPercent } from '@/utils';

  const props = defineProps({
    proposal: { type: Object as PropType<Proposal>, required: true },
  });

  const { walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();

  const { proposalVotes, loading } = await useProposalVotes(accountId.value, props.proposal.id, walletAddress);
</script>

<template>
  <div>
    <h3 class="font-medium pb-2">Votes cast</h3>
    <div class="bg-gray-100 px-4 py-4 rounded-xl">
      <div class="pt-2">
        <div class="flex items-center space-x-4">
          <div class="flex-1 caption font-medium">Member</div>
          <div class="w-[100px] flex-shrink-0 caption font-medium">Vote</div>
          <div class="w-[110px] flex-shrink-0 text-right caption font-medium">Voting Power</div>
        </div>
        <ProposalVotesSkeleton class="pt-4" v-if="loading" />
        <template v-else>
          <div class="pt-4 space-y-4" v-if="proposalVotes && proposalVotes.length > 0">
            <div class="flex items-center space-x-4" v-for="vote in proposalVotes">
              <div class="flex-1 caption=">
                <CopyAddress :address="vote.voter" />
              </div>
              <div class="w-[100px] flex-shrink-0 caption=">
                <ProposalVoteLabel :vote="vote.vote" />
              </div>
              <div class="w-[110px] flex-shrink-0 text-right caption=">
                {{ formatPercent((vote.power / proposal.totalPower) * 100, 2) }}
              </div>
            </div>
          </div>
          <div class="pt-4 text-center caption text-gray-700" v-else>Nothing to see here!</div>
        </template>
      </div>
      <div class="mt-6 pt-4 border-t border-gray-200 caption text-gray">Proposed by <CopyAddress :address="proposal.proposer" /></div>
    </div>
  </div>
</template>
