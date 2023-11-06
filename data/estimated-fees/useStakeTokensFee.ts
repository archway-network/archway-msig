import { storeToRefs } from 'pinia';
import { useQuery } from '@tanstack/vue-query';

import { useAuthStore } from '@/store';
import { EstimatedFee, TokenAmount, Validator } from '@/domain';
import { useConfig, useSigningClient } from '@/composables';

export const useStakeTokensFee = (validator: Validator): Ref<TokenAmount | undefined> => {
  const { tokenDenom } = useConfig();
  const { walletAddress } = storeToRefs(useAuthStore());

  const signingClient = useSigningClient();

  const { data, isLoading } = useQuery({
    queryKey: [{ scope: 'fees', entity: 'stake' }],
    queryFn: async () => EstimatedFee.archwayFee(signingClient, walletAddress.value!, [
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
