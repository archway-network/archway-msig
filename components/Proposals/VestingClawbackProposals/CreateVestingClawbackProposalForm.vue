<script lang="tsx" setup>
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { Link, PrimaryButton, TextInput, TextareaInput, ToggleInput } from '@/components/Ui';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { VestingAccount } from '@/domain';
  import { useAccountId } from '@/data/useAccountId';
  import { useVestingAccountClawbackMutation } from '@/data/useVestingAccountClawbackMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';
  import { truncateAddress } from '@/utils';

  const props = defineProps<{
    vestingAccount: VestingAccount;
  }>();
  const emit = defineEmits(['close']);

  const finalizeClawback = ref(false);
  const title = ref('Vesting contract clawback proposal');
  const description = ref(
    `Vesting contract: ${truncateAddress(props.vestingAccount.id)}\n\nBeneficiary: ${truncateAddress(props.vestingAccount.beneficiary)}`
  );

  const { walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();
  const transactionsStore = useTransactionsStore();

  const { mutate, loading } = await useVestingAccountClawbackMutation(accountId.value, walletAddress);

  const createProposal = () => {
    mutate(
      {
        vestingAccount: props.vestingAccount,
        finalizeClawback: finalizeClawback.value,
        title: title.value,
        description: description.value,
      },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => <SubmitProposalTransactionSuccessful title="Clawback proposal!" />);
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
  <div class="space-y-6">
    <div>
      <label class="block pb-2 caption text-gray-800">Clawback Type</label>
      <div class="flex items-center space-x-4">
        <label class="caption">Initialize Clawback</label>
        <div>
          <ToggleInput v-model="finalizeClawback" />
        </div>
        <label class="caption">Finalize Clawback</label>
      </div>
    </div>
    <TextInput label="Proposal title" v-model="title" />
    <TextareaInput label="Proposal description" v-model="description" />
  </div>
  <div class="flex flex-row justify-between pt-8">
    <Link @click="emit('close')">Cancel</Link>
    <div class="flex flex-row space-x-2">
      <PrimaryButton
        :disabled="transactionsStore.isInProgress && !loading"
        :loading="transactionsStore.isInProgress && loading"
        @click="createProposal"
      >
        Create Proposal
      </PrimaryButton>
    </div>
  </div>
</template>
