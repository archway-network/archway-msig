import { storeToRefs } from 'pinia';
import { useQuery } from '@tanstack/vue-query';

import { useAuthStore, useWalletStore } from '@/store';
import { EstimatedFee, TokenAmount, Validator } from '@/domain';
import { useConfig } from '@/composables';

export const useStakeTokensFee = (validator: Validator): Ref<TokenAmount | undefined> => {
  const { tokenDenom } = useConfig();
  const walletStore = useWalletStore();
  const { walletAddress } = storeToRefs(useAuthStore());

  const { data, isLoading } = useQuery({
    queryKey: [{ scope: 'fees', entity: 'stake' }],
    queryFn: async () => EstimatedFee.archwayFee(walletStore.signingClient!, walletAddress.value!, [
      {
        typeUrl: `/cosmos.staking.v1beta1.MsgDelegate`,
        value: {
          delegatorAddress: walletAddress.value,
          validatorAddress: validator.id,
          amount: {
            denom: tokenDenom.coinMinimalDenom,
            amount: '1',
          },
        },
      },
    ]),
  });

  return data;
};
