import { ref, Ref } from 'vue';

export const useLoading = (): { loading: Ref<boolean | undefined>; startsLoading: () => void; finishesLoading: () => void } => {
  const isLoading = ref<boolean | undefined>(undefined);

  return {
    loading: isLoading,
    startsLoading: () => {
      isLoading.value = true;
    },
    finishesLoading: () => {
      isLoading.value = false;
    },
  };
};
