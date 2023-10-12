<script lang="tsx" setup>
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { Link, PrimaryButton, TextInput, TextareaInput } from '@/components/Ui';
  import CreateMembersBlock from '@/components/Members/CreateMembersBlock.vue';
  import UpdateMembersBlock from '@/components/Members/UpdateMembersBlock.vue';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { useAccountId } from '@/data/useAccountId';
  import { useManageMembersMutation } from '@/data/useManageMembersMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';

  import { Member } from '@/domain';

  const emit = defineEmits(['close']);

  const title = ref('Add or update members proposal');
  const description = ref();
  const membersToUpdate = ref<Member[]>([]);
  const membersToCreate = ref<Member[]>([]);

  const members = computed(() => [...membersToCreate.value, ...membersToUpdate.value].filter(({ addr }: Member) => !!addr));

  const calculatedDescription = computed(() => {
    const toUpdate = [...membersToUpdate.value]
      .filter(({ addr }: Member) => !!addr)
      .map(({ addr, weight }: Member) => `${weight} x ${addr}`)
      .join(', ');
    const toCreate = [...membersToCreate.value]
      .filter(({ addr }: Member) => !!addr)
      .map(({ addr, weight }: Member) => `${weight} x ${addr}`)
      .join(', ');

    return [description.value, toUpdate ? 'Update members: ' + '\n' + toUpdate : '', toCreate ? 'Create members: ' + '\n' + toCreate : '']
      .filter(Boolean)
      .join('\n\n');
  });

  const { walletAddress } = storeToRefs(useAuthStore());
  const transactionsStore = useTransactionsStore();
  const { accountId } = useAccountId();

  const { mutate, loading } = await useManageMembersMutation(accountId.value, walletAddress);

  const manageMembers = () => {
    if (members.value.length === 0) return;

    mutate(
      { title: title.value, description: calculatedDescription.value, members: members.value },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => <SubmitProposalTransactionSuccessful title="Manage members proposal!" />);
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
      <UpdateMembersBlock v-model="membersToUpdate" />
      <CreateMembersBlock v-model="membersToCreate" />
    </div>
    <div class="flex flex-row justify-between pt-8">
      <Link @click="emit('close')">Cancel</Link>
      <div class="flex flex-row space-x-2">
        <PrimaryButton
          :disabled="transactionsStore.isInProgress && !loading"
          :loading="transactionsStore.isInProgress && loading"
          @click="manageMembers"
        >
          Create and/or Update
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>
