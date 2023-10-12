<script lang="tsx" setup>
  import { storeToRefs } from 'pinia';

  import { SecondaryButton } from '@/components/Ui';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';

  import { useAccountId } from '@/data/useAccountId';
  import { useVestingAccountMutations } from '@/data/useVestingAccountMutations';
  import { TransactionMessages } from '@/domain';
  import { useAuthStore, useTransactionsStore } from '@/store';

  const props = defineProps<{
    vestingAccountId: string;
  }>();
  const emit = defineEmits(['close']);

  const { walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();
  const transactionsStore = useTransactionsStore();

  const { mutate, loading } = await useVestingAccountMutations(accountId.value, walletAddress);

  const claimRewards = () => {
    if (!walletAddress.value) return;

    const msg = TransactionMessages.vestingClaimRewardsProposal(props.vestingAccountId);

    mutate(msg, {
      onSuccess: () => {
        transactionsStore.setSuccessMessage(() => <SubmitProposalTransactionSuccessful title="Claim rewards proposal!" />);
        emit('close');
      },
      onError: () => {
        emit('close');
      },
    });
  };
</script>

<template>
  <SecondaryButton
    :disabled="transactionsStore.isInProgress && !loading"
    :loading="transactionsStore.isInProgress && loading"
    @click="claimRewards"
  >
    Claim Rewards
  </SecondaryButton>
</template>
