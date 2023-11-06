import BigNumber from 'bignumber.js';
import { QueryFunctionContext } from '@tanstack/vue-query';
import { useConfig } from '@/composables';
import TokenAmount from './TokenAmount';

export default class WalletBalances {
  static async totalSupply(): Promise<TokenAmount> {
    const { tokenDenom, transport } = useConfig();
    const data = await transport.getSupplyByDenom(tokenDenom.coinMinimalDenom);
    return TokenAmount.makeFromAmount(data.amount?.amount || 0, tokenDenom);
  }

  static async available({ queryKey: [{ address }] }: QueryFunctionContext<{ address?: string }[]>): Promise<TokenAmount> {
    const { tokenDenom, transport } = useConfig();
    const data = await transport.getBalanceByDenom(address!, tokenDenom.coinMinimalDenom);
    return TokenAmount.makeFromAmount(data?.balance?.amount, tokenDenom);
  }

  static async staked({ queryKey: [{ address }] }: QueryFunctionContext<{ address?: string }[]>): Promise<TokenAmount> {
    const { tokenDenom, transport } = useConfig();
    const data = await transport.getDelegationsByDelegator(address!);

    const staked = data?.delegation_responses?.reduce((acc: BigNumber, delegationInfo: any) => {
      return acc.plus(BigNumber(delegationInfo?.balance?.amount || 0));
    }, BigNumber(0));

    return new TokenAmount(staked, tokenDenom);
  }

  static async unbonding({ queryKey: [{ address }] }: QueryFunctionContext<{ address?: string }[]>): Promise<TokenAmount> {
    const { tokenDenom, transport } = useConfig();
    const data = await transport.getUnbondingDelegationsByDelegator(address!);

    const unbonding = (data?.unbonding_responses || [])
      .flatMap(({ entries }: { entries: { balance: any }[] }) => entries.map(({ balance }) => balance))
      .reduce((acc: BigNumber, balance: any) => acc.plus(BigNumber(balance)), BigNumber(0));

    return new TokenAmount(unbonding, tokenDenom);
  }

  static async rewards({ queryKey: [{ address }] }: QueryFunctionContext<{ address?: string }[]>): Promise<TokenAmount> {
    const { tokenDenom, transport } = useConfig();
    const data = await transport.getRewardsByDelegator(address!);

    const rewards = BigNumber(
      (data?.total || []).find(({ denom }: { denom: string }) => denom === tokenDenom.coinMinimalDenom)?.amount || 0
    );

    return TokenAmount.makeFromAmount(rewards, tokenDenom);
  }
}
