<script lang="tsx" setup>
  import { type PropType } from 'vue';
  import { storeToRefs } from 'pinia';
  import { PrimaryButton } from '@/components/Ui';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { Proposal } from '@/domain';
  import { useAccountId } from '@/data/useAccountId';
  import { useProposalCloseMutation } from '@/data/useProposalCloseMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';

  const props = defineProps({
    proposal: { type: Object as PropType<Proposal>, required: true },
  });

  const emit = defineEmits(['close']);

  const { walletAddress } = storeToRefs(useAuthStore());
  const transactionsStore = useTransactionsStore();

  const { accountId } = useAccountId();
  const { mutate, loading } = await useProposalCloseMutation(accountId.value, walletAddress);

  const closeProposal = () => {
    if (!walletAddress.value) return;

    mutate(
      { proposalId: props.proposal.id },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => (
            <SubmitProposalTransactionSuccessful description="Your proposal has been successfully closed." />
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
    @click="closeProposal()"
  >
    Close Proposal
  </PrimaryButton>
</template>
