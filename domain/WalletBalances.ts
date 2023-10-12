import BigNumber from 'bignumber.js';
import { QueryFunctionContext } from '@tanstack/vue-query';
import { useConfig } from '@/composables';
import TokenAmount from './TokenAmount';

export default class WalletBalances {
  static async totalSupply(): Promise<TokenAmount> {
    const { restEndpoint, tokenDenom } = useConfig();

    return $fetch<any>(`${restEndpoint}/cosmos/bank/v1beta1/supply/${tokenDenom.coinMinimalDenom}`).then(data => {
      return TokenAmount.makeFromAmount(data.amount?.amount || 0, tokenDenom);
    });
  }

  static async available({ queryKey: [{ address }] }: QueryFunctionContext<{ address?: string }[]>): Promise<TokenAmount> {
    const { restEndpoint, tokenDenom } = useConfig();

    return $fetch<any>(`${restEndpoint}/cosmos/bank/v1beta1/balances/${address}`).then(data => {
      return TokenAmount.makeFromBalances(data?.balances || [], tokenDenom);
    });
  }

  static async staked({ queryKey: [{ address }] }: QueryFunctionContext<{ address?: string }[]>): Promise<TokenAmount> {
    const { restEndpoint, tokenDenom } = useConfig();

    return $fetch<any>(`${restEndpoint}/cosmos/staking/v1beta1/delegations/${address}`).then(data => {
      const staked = data?.delegation_responses?.reduce((acc: BigNumber, delegationInfo: any) => {
        return acc.plus(BigNumber(delegationInfo?.balance?.amount || 0));
      }, BigNumber(0));

      return new TokenAmount(staked, tokenDenom);
    });
  }

  static async unbonding({ queryKey: [{ address }] }: QueryFunctionContext<{ address?: string }[]>): Promise<TokenAmount> {
    const { restEndpoint, tokenDenom } = useConfig();

    return $fetch<any>(`${restEndpoint}/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`).then(data => {
      const unbonding = (data?.unbonding_responses || [])
        .flatMap(({ entries }: { entries: { balance: any }[] }) => entries.map(({ balance }) => balance))
        .reduce((acc: BigNumber, balance: any) => acc.plus(BigNumber(balance)), BigNumber(0));

      return new TokenAmount(unbonding, tokenDenom);
    });
  }

  static async rewards({ queryKey: [{ address }] }: QueryFunctionContext<{ address?: string }[]>): Promise<TokenAmount> {
    const { restEndpoint, tokenDenom } = useConfig();

    return $fetch<any>(`${restEndpoint}/cosmos/distribution/v1beta1/delegators/${address}/rewards`).then(data => {
      const rewards = BigNumber(
        (data?.total || []).find(({ denom }: { denom: string }) => denom === tokenDenom.coinMinimalDenom)?.amount || 0
      );

      return TokenAmount.makeFromAmount(rewards, tokenDenom);
    });
  }
}
