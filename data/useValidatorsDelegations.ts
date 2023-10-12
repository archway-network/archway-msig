import { Ref, ComputedRef } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { Validators, ValidatorDelegation } from '@/domain';

export const useValidatorsDelegations = async (
  walletAddress: ComputedRef<string | undefined>,
  enabled: ComputedRef<boolean> = computed(() => false)
): Promise<{
  delegations: Ref<ValidatorDelegation[] | undefined>;
  loading: Ref<boolean>;
}> => {
  const { data: delegations, isLoading } = useQuery({
    queryKey: [{ scope: 'validators', entity: 'delegations', walletAddress }],
    queryFn: Validators.delegationsFor,
    enabled,
  });

  return {
    delegations,
    loading: computed(() => enabled.value && isLoading.value),
  };
};
