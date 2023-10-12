import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { TransactionStatus } from '@/types';

const useTransactionsStore = defineStore('transactions', () => {
  const isTransactionDialogVisible = ref(false);
  const transactionStatus = ref(TransactionStatus.IDLE);

  const isInProgress = computed(() => transactionStatus.value === TransactionStatus.IN_PROGRESS);
  const isSuccessful = computed(() => transactionStatus.value === TransactionStatus.SUCCESSFUL);
  const isFailed = computed(() => transactionStatus.value === TransactionStatus.FAILED);

  const successMessage = ref();
  const successTransactionId = ref();

  const errorMessage = ref();


  const showTransactionDialog = () => {
    isTransactionDialogVisible.value = true;
  };
  const hideTransactionDialog = () => {
    isTransactionDialogVisible.value = false;
  };

  const onStart = () => {
    successTransactionId.value = undefined;
    showTransactionDialog();
    transactionStatus.value = TransactionStatus.IN_PROGRESS;
  };

  const onSuccess = (transactionId?: string) => {
    successTransactionId.value = transactionId;
    transactionStatus.value = TransactionStatus.SUCCESSFUL;
  };

  const onError = (error: Error) => {
    successTransactionId.value = undefined;
    transactionStatus.value = TransactionStatus.FAILED;
    errorMessage.value = formatCosmjsErrorMessage(error?.message);
  };

  const setSuccessMessage = (component: any) => {
    successMessage.value = component;
  };

  return {
    isTransactionDialogVisible,
    isInProgress,
    isSuccessful,
    isFailed,
    successMessage,
    successTransactionId,
    errorMessage,
    onStart,
    onSuccess,
    onError,
    showTransactionDialog,
    hideTransactionDialog,
    setSuccessMessage,
  };
});

export default useTransactionsStore;
