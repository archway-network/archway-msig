<script lang="tsx" setup>
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { Link, PrimaryButton, TextInput, TextareaInput } from '@/components/Ui';
  import ExecuteContractProposalAlert from './ExecuteContractProposalAlert.vue';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { useAccountId } from '@/data/useAccountId';
  import { useCreateExecuteContractProposalMutation } from '@/data/useCreateExecuteContractProposalMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';

  const emit = defineEmits(['close']);

  const title = ref('');
  const description = ref('');
  const contractAddress = ref('');
  const content = ref('');

  const { walletAddress } = storeToRefs(useAuthStore());
  const transactionsStore = useTransactionsStore();
  const { accountId } = useAccountId();

  const msgs = computed(() => {
    if (!content.value) return [];

    try {
      return JSON.parse(content.value);
    } catch (e) {
      console.log(e);

      return [];
    }
  });

  const { mutate, loading } = await useCreateExecuteContractProposalMutation(accountId.value, walletAddress);

  const createProposal = () => {
    if (msgs.value.length === 0 || !contractAddress.value) return;

    mutate(
      { contractAddress: contractAddress.value, title: title.value, description: description.value, msgs: msgs.value },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => <SubmitProposalTransactionSuccessful title="Execute contract proposal!" />);
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
    <ExecuteContractProposalAlert class="mb-8" />
    <div class="space-y-6">
      <TextInput label="Proposal name" v-model="title" />
      <TextareaInput label="Proposal description" v-model="description" />
      <TextInput label="Smart contract address" v-model="contractAddress" />
      <TextareaInput label="Proposal Content" v-model="content" rows="8" />
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
  </div>
</template>
