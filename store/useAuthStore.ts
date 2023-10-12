import { computed } from 'vue';
import { defineStore } from 'pinia';
import useWalletStore from '@/store/useWalletStore';

const useAuthStore = defineStore('auth', () => {
  const walletStore = useWalletStore();

  const loading = computed(() => walletStore.loading);
  const isAuthenticated = computed(() => !!walletStore.wallet);
  const walletAddress = computed(() => walletStore.address);

  async function init() {
    await walletStore.init();
  }

  async function signOut() {
    await walletStore.disconnect();
  }

  return { isAuthenticated, walletAddress, loading, init, signOut };
});

export default useAuthStore;
