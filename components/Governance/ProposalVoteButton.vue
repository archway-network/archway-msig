<script lang="tsx" setup>
  import { type PropType } from 'vue';
  import { storeToRefs } from 'pinia';
  import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
  import { ChevronDownIcon, PrimaryButton } from '@/components/Ui';
  import SubmitProposalTransactionSuccessful from '@/components/Proposals/SubmitProposalTransactionSuccessful.vue';
  import { useAccountId } from '@/data/useAccountId';
  import { useGovernanceProposalVoteMutation } from '@/data/useGovernanceProposalVoteMutation';
  import { useAuthStore, useTransactionsStore } from '@/store';
  import { useWalletBalance } from '@/data/useWalletBalance';

  import { BalancesType, type GovernanceProposalId, type GovernanceProposalVoteOption } from '@/types';

  const props = defineProps({
    proposalId: { type: [String, Number] as PropType<GovernanceProposalId>, required: true },
  });

  const emit = defineEmits(['close']);

  const { walletAddress } = storeToRefs(useAuthStore());
  const { accountId } = useAccountId();
  const transactionsStore = useTransactionsStore();

  const { staked, loading: loadingStakedBalance } = await useWalletBalance(accountId.value, walletAddress, [BalancesType.STAKED]);

  const { mutate, loading } = await useGovernanceProposalVoteMutation(accountId.value, walletAddress);

  const submitVote = (vote: GovernanceProposalVoteOption) => {
    if (!walletAddress.value) return;

    mutate(
      {
        title: `${props.proposalId} vote proposal`,
        description: `Vote "${vote}" for #${props.proposalId} proposal.`,
        proposalId: props.proposalId,
        vote,
      },
      {
        onSuccess: () => {
          transactionsStore.setSuccessMessage(() => <SubmitProposalTransactionSuccessful title="Vote successful!" />);
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
    <div>
      <MenuButton
        class="flex items-center space-x-2"
        :as="PrimaryButton"
        :disabled="(transactionsStore.isInProgress && !loading) || staked?.amount.isZero() || loadingStakedBalance"
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
            <MenuItem v-slot="{ active }">
              <button :class="[{ 'bg-gray-warm': active }, 'w-full text-left text-black px-5 py-3']" @click="submitVote('no_with_veto')">
                No with Veto
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </div>
  </Menu>
</template>
