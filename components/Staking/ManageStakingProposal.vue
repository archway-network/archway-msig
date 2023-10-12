<script lang="tsx" setup>
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { Link, PrimaryButton, TextInput, TextareaInput } from '@/components/Ui';
  import ManageStakingDelegations from '@/components/Staking/ManageStakingDelegations.vue';
  import ManageStakingUndelegations from '@/components/Staking/ManageStakingUndelegations.vue';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { Validator } from '@/domain';
  import { useAccountId } from '@/data/useAccountId';
  import { useBulkStakingMutation } from '@/data/useBulkStakingMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';

  import { BulkDelegationBlock } from '@/types';

  defineProps<{
    validators: Validator[];
  }>();
  const emit = defineEmits(['close']);

  const title = ref('Delegate/undelegate proposal');
  const description = ref('');
  const delegations = ref<BulkDelegationBlock[]>([]);
  const undelegations = ref<BulkDelegationBlock[]>([]);

  const { walletAddress } = storeToRefs(useAuthStore());
  const transactionsStore = useTransactionsStore();
  const { accountId } = useAccountId();

  const { mutate, loading } = await useBulkStakingMutation(accountId.value, walletAddress);

  const filteredDelegations = computed(() => delegations.value.filter(block => !!block.amount && !!block.validator));
  const filteredUndelegations = computed(() => undelegations.value.filter(block => !!block.amount && !!block.validator));

  const calculatedDescription = computed(() => {
    const toDelegate = filteredDelegations.value
      .map(block => `${block.amount.formatWithCoin()} x ${block.validator.title} (${block.validator.id})`)
      .join('\n');
    const toUndelegate = filteredUndelegations.value
      .map(block => `${block.amount.formatWithCoin()} x ${block.validator.title} (${block.validator.id})`)
      .join('\n');

    return [description.value, toDelegate ? 'To Delegate:\n' + toDelegate : '', toUndelegate ? 'To Undelegate:\n' + toUndelegate : '']
      .filter(Boolean)
      .join('\n\n');
  });

  const manageMembers = () => {
    if (filteredDelegations.value.length === 0 && filteredUndelegations.value.length === 0) return;

    mutate(
      {
        title: title.value,
        description: calculatedDescription.value,
        delegations: filteredDelegations.value,
        undelegations: filteredUndelegations.value,
      },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => <SubmitProposalTransactionSuccessful title="Bulk staking proposal!" />);
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
      <ManageStakingDelegations :validators="validators" v-model="delegations" />
      <ManageStakingUndelegations :validators="validators" v-model="undelegations" />
    </div>
    <div class="flex flex-row justify-between items-center pt-8">
      <Link @click="emit('close')">Cancel</Link>
      <div class="flex flex-row space-x-2">
        <PrimaryButton
          :disabled="transactionsStore.isInProgress && !loading"
          :loading="transactionsStore.isInProgress && loading"
          @click="manageMembers"
        >
          Delegate/Undelegate
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>
