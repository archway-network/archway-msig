<script lang="tsx" setup>
  import { storeToRefs } from 'pinia';
  import { useQuery } from '@tanstack/vue-query';
  import { SecondaryButton } from '@/components/Ui';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { Validators, Validator } from '@/domain';
  import { useAccountId } from '@/data/useAccountId';
  import { useClaimRewardsMutation } from '@/data/useClaimRewardsMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';

  const emit = defineEmits(['close']);

  const { walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();
  const transactionsStore = useTransactionsStore();

  const { data: onlyDelegatesData, isLoading: isLoadingDelegatesData } = useQuery({
    queryKey: [{ scope: 'validators', entity: 'index', walletAddress: accountId }],
    queryFn: Validators.onlyDelegates,
  });

  const { mutate, loading } = await useClaimRewardsMutation(accountId.value, walletAddress);

  const claimRewards = () => {
    if (!walletAddress.value || !onlyDelegatesData.value?.validators) return;

    const description =
      'Claim rewards from: ' + onlyDelegatesData.value.validators.map((validator: Validator) => validator.title).join(', ');

    mutate(
      { title: 'Claim rewards proposal', description, delegations: onlyDelegatesData.value.validators },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => <SubmitProposalTransactionSuccessful title="Claim rewards proposal!" />);
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
  <SecondaryButton
    :disabled="(transactionsStore.isInProgress && !loading) || isLoadingDelegatesData"
    :loading="(transactionsStore.isInProgress && loading) || isLoadingDelegatesData"
    @click="claimRewards"
  >
    Claim Rewards
  </SecondaryButton>
</template>
