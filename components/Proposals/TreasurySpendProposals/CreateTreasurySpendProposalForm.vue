<script lang="tsx" setup>
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { Link, PrimaryButton, TextInput, TextareaInput } from '@/components/Ui';
  import TreasurySpendBlocks from './TreasurySpendBlocks.vue';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { useAccountId } from '@/data/useAccountId';
  import { useTreasurySpendMutation } from '@/data/useTreasurySpendMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';

  import { TreasurySpendBlock } from '@/types';

  const emit = defineEmits(['close']);

  const title = ref('Treasury spend proposal');
  const description = ref();
  const spendBlocks = ref<TreasurySpendBlock[]>([]);

  const { walletAddress } = storeToRefs(useAuthStore());
  const transactionsStore = useTransactionsStore();
  const { accountId } = useAccountId();

  const { mutate, loading } = await useTreasurySpendMutation(accountId.value, walletAddress);

  const filteredSpendBlocks = computed(() => spendBlocks.value.filter(block => !!block.amount && !!block.address));

  const calculatedDescription = computed(() => {
    const toSpend = filteredSpendBlocks.value.map(block => `${block.amount.formatWithCoin()} @ ${block.address}`).join('\n');

    return [description.value, toSpend ? 'Spend: ' + '\n' + toSpend : ''].filter(Boolean).join('\n\n');
  });

  const manageMembers = () => {
    if (filteredSpendBlocks.value.length === 0) return;

    mutate(
      { title: title.value, description: calculatedDescription.value, spend: filteredSpendBlocks.value },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => <SubmitProposalTransactionSuccessful title="Treasury spend proposal!" />);
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
  <div>
    <div class="space-y-6">
      <TextInput label="Proposal name" v-model="title" />
      <TextareaInput label="Proposal description" v-model="description" />
      <TreasurySpendBlocks v-model="spendBlocks" />
    </div>
    <div class="flex flex-row justify-between pt-8">
      <Link @click="emit('close')">Cancel</Link>
      <div class="flex flex-row space-x-2">
        <PrimaryButton
          :disabled="transactionsStore.isInProgress && !loading"
          :loading="transactionsStore.isInProgress && loading"
          @click="manageMembers"
        >
          Spend
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>
