<script lang="tsx" setup>
  import { ref, PropType } from 'vue';
  import { storeToRefs } from 'pinia';
  import { Link, PrimaryButton, TextInput, TextareaInput } from '@/components/Ui';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { Member } from '@/domain/';
  import { useAccountId } from '@/data/useAccountId';
  import { useRemoveMemberMutation } from '@/data/useRemoveMemberMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';
  import { truncateAddress } from '@/utils';

  const props = defineProps({
    member: { type: Object as PropType<Member>, required: true },
  });
  const emit = defineEmits(['close']);

  const title = ref(`Remove ${truncateAddress(props.member.addr)} proposal`);
  const description = ref(`Remove ${props.member.addr} member from the multisig account!`);

  const { walletAddress } = storeToRefs(useAuthStore());
  const transactionsStore = useTransactionsStore();
  const { accountId } = useAccountId();

  const { mutate, loading } = await useRemoveMemberMutation(accountId.value, walletAddress);

  const removeMember = (member: string) => {
    mutate(
      { title: title.value, description: description.value, member },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => <SubmitProposalTransactionSuccessful title="Remove member proposal!" />);
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
    </div>
    <div class="flex flex-row justify-between pt-8">
      <Link @click="emit('close')">Cancel</Link>
      <div class="flex flex-row space-x-2">
        <PrimaryButton
          :disabled="transactionsStore.isInProgress && !loading"
          :loading="transactionsStore.isInProgress && loading"
          @click="removeMember(member.addr)"
        >
          Remove
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>
