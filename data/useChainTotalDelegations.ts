import { ComputedRef, Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import BigNumber from 'bignumber.js';

import { Validators, TokenAmount, Validator } from '@/domain';
import { useConfig } from '@/composables';

import { ValidatorsFilterTypes } from '@/types';

export const useChainTotalDelegations = async (): Promise<{
  totalDelegated: ComputedRef<TokenAmount>;
  loading: Ref<boolean>;
}> => {
  const { tokenDenom } = useConfig();

  const { data, isLoading } = useQuery({
    queryKey: [{ scope: 'validators', entity: 'index', filter: ValidatorsFilterTypes.ALL }],
    queryFn: Validators.all,
  });

  const totalDelegated = computed(() => {
    if (!data.value) return TokenAmount.makeFromAmount(BigNumber(0), tokenDenom);

    const total = data.value.validators.reduce((result: BigNumber, current: Validator) => {
      return result.plus(current.votingPower.amount);
    }, BigNumber(0));

    return TokenAmount.makeFromAmount(total, tokenDenom);
  });

  return {
    totalDelegated,
    loading: isLoading,
  };
};
