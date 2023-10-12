import { Ref, ComputedRef } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { Validators, Validator } from '@/domain';

export const useValidatorsWithMyDelegations = async (
  walletAddress: ComputedRef<string | undefined>,
  enabled: ComputedRef<boolean> = computed(() => true)
): Promise<{
  validators: Ref<Validator[] | undefined>;
  nextPageToken: ComputedRef<string | undefined>;
  loading: Ref<boolean>;
}> => {
  const { data: onlyDelegatesdata, isLoading } = useQuery({
    queryKey: [{ scope: 'validators', entity: 'index', walletAddress }],
    queryFn: Validators.onlyDelegates,
    enabled: enabled,
  });

  return {
    validators: computed(() => onlyDelegatesdata.value?.validators),
    nextPageToken: computed(() => onlyDelegatesdata.value?.nextPageToken),
    loading: computed(() => enabled.value && isLoading.value),
  };
};
