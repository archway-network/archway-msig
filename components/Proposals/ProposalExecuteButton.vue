<script lang="tsx" setup>
  import { storeToRefs } from 'pinia';
  import { useQueryClient } from '@tanstack/vue-query';
  import { PrimaryButton } from '@/components/Ui';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { InvalidateQueries, Proposal } from '@/domain';
  import { useAccountId } from '@/data/useAccountId';
  import { useProposalExecuteMutation } from '@/data/useProposalExecuteMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';

  const props = defineProps({
    proposal: { type: Object as PropType<Proposal>, required: true },
  });

  const emit = defineEmits(['close']);

  const queryClient = useQueryClient();

  const { walletAddress } = storeToRefs(useAuthStore());
  const transactionsStore = useTransactionsStore();

  const { accountId } = useAccountId();
  const { mutate, loading } = await useProposalExecuteMutation(accountId.value, walletAddress);

  const executeProposal = () => {
    if (!walletAddress.value) return;

    mutate(
      { proposalId: props.proposal.id },
      {
        onSuccess: () => {
          if (walletAddress.value) {
            const invalidateQueries = new InvalidateQueries(queryClient, accountId.value, walletAddress.value);
            if (props.proposal.isForMembers()) {
              invalidateQueries.forMembers();
            }
            if (props.proposal.isForRewards()) {
              invalidateQueries.forRewards();
            }
            if (props.proposal.isForStaking()) {
              invalidateQueries.forStaking();
            }
            if (props.proposal.isForVestingClawbacks()) {
              invalidateQueries.forVestingClawbacks();
            }
            if (props.proposal.isForVestingClaimRewards()) {
              invalidateQueries.forVestingClaimRewards();
            }
            if (props.proposal.isForVestingWithdrawRewards()) {
              invalidateQueries.forVestingWithdrawRewards();
            }
            if (props.proposal.isForVestingWithdrawTokens()) {
              invalidateQueries.forVestingWithdrawTokens();
            }
            if (props.proposal.isForVotingConfiguration()) {
              invalidateQueries.forVotingConfiguration();
            }
          }
          transactionsStore.setSuccessMessage(() => (
            <SubmitProposalTransactionSuccessful description="Your proposal has been successfully executed." />
          ));
          emit('close');
        },
        onError: () => {
          emit('close');
        },
      }
    );
  };
</script>

<template>
  <PrimaryButton
    :disabled="transactionsStore.isInProgress && !loading"
    :loading="transactionsStore.isInProgress && loading"
    @click="executeProposal()"
  >
    Execute Proposal
  </PrimaryButton>
</template>
