<script lang="ts" setup>
  import { Popover, PopoverPanel, Portal, TransitionRoot } from '@headlessui/vue';

  import TransactionInProgress from '@/components/Wallet/TransactionInProgress.vue';
  import TransactionSuccess from '@/components/Wallet/TransactionSuccess.vue';
  import TransactionFailed from '@/components/Wallet/TransactionFailed.vue';
  import { CloseButton } from '@/components/Ui';
  import { useTransactionsStore, useWalletStore } from '@/store';
  import { Wallets } from '@/domain';

  const walletStore = useWalletStore();
  const transactionsStore = useTransactionsStore();

  const walletInfo = computed(() => Wallets.find(walletStore.wallet?.type));
</script>

<template>
  <Portal>
    <Popover>
      <TransitionRoot
        as="template"
        :show="transactionsStore.isTransactionDialogVisible"
        enter="transform transition duration-300 ease-in-out"
        enter-from="opacity-0 translate-y-full"
        enter-to="opacity-100"
        leave="transform transition duration-300 ease-in-out"
        leave-from="opacity-100"
        leave-to="opacity-0 translate-y-full"
        appear
      >
        <PopoverPanel class="fixed w-[327px] bottom-0 right-0 transform mt-2 mr-4 mb-4 z-40" static>
          <div class="bg-white rounded-2xl shadow-[-8px_0px_124px_rgba(0,0,0,0.16)] px-8 py-8">
            <CloseButton class="absolute top-0 right-0 pt-6 pr-6" @click="transactionsStore.hideTransactionDialog" />

            <TransactionInProgress v-if="transactionsStore.isInProgress && walletInfo" :wallet="walletInfo" />

            <TransactionSuccess
              v-if="transactionsStore.isSuccessful"
              :success-component="transactionsStore.successMessage"
              @close="transactionsStore.hideTransactionDialog"
            />

            <TransactionFailed
              v-if="transactionsStore.isFailed && walletInfo"
              :error-message="transactionsStore.errorMessage"
              :wallet="walletInfo"
              @close="transactionsStore.hideTransactionDialog"
            />
          </div>
        </PopoverPanel>
      </TransitionRoot>
    </Popover>
  </Portal>
</template>
