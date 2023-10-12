<script lang="tsx" setup>
  import { storeToRefs } from 'pinia';
  import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
  import { ChevronDownIcon, PrimaryButton } from '@/components/Ui';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { Proposal } from '@/domain';
  import { useAccountId } from '@/data/useAccountId';
  import { useProposalVoteMutation } from '@/data/useProposalVoteMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';

  import { ProposalVoteOption } from '@/types';

  const props = defineProps({
    proposal: { type: Object as PropType<Proposal>, required: true },
  });

  const emit = defineEmits(['close']);

  const { walletAddress } = storeToRefs(useAuthStore());
  const transactionsStore = useTransactionsStore();

  const { accountId } = useAccountId();
  const { mutate, loading } = await useProposalVoteMutation(accountId.value, walletAddress);

  const submitVote = (vote: ProposalVoteOption) => {
    if (!walletAddress.value) return;

    mutate(
      { proposalId: props.proposal.id, vote },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => (
            <SubmitProposalTransactionSuccessful description="Your vote has been successfully submitted." />
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
  <Menu as="div" class="relative inline-block text-left overflow-visible" v-slot="{ open: menuOpen }">
    <MenuButton
      class="flex items-center space-x-2"
      :as="PrimaryButton"
      :disabled="transactionsStore.isInProgress && !loading"
      :loading="transactionsStore.isInProgress && loading"
    >
      <span>Vote</span>
      <ChevronDownIcon class="w-4 h-4" :class="{ 'rotate-180 transform': menuOpen }" />
    </MenuButton>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        :class="[
          'absolute bottom-0 left-0 w-40 z-20 mb-[58px] -ml-[50px]',
          'origin-top-right rounded-2xl bg-white overflow-hidden',
          'focus:outline-none shadow-[40px_64px_128px_-8px_rgba(0,0,0,0.14)]',
        ]"
      >
        <div class="space-y-2">
          <MenuItem v-slot="{ active }">
            <button :class="[{ 'bg-gray-warm': active }, 'w-full text-left text-black px-5 py-3']" @click="submitVote('abstain')">
              Abstain
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button :class="[{ 'bg-gray-warm': active }, 'w-full text-left text-black px-5 py-3']" @click="submitVote('yes')">Yes</button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button :class="[{ 'bg-gray-warm': active }, 'w-full text-left text-black px-5 py-3']" @click="submitVote('no')">No</button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
