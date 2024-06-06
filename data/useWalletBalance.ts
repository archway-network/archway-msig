import type { ComputedRef, Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { TokenAmount, WalletBalances } from '@/domain';
import { type AccountConfig, BalancesType } from '@/types';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // cache for 5 minutes

export const useWalletBalance = async (
  accountId: AccountConfig.AccountId,
  walletAddress: ComputedRef<string | undefined>,
  includes: BalancesType[] = [BalancesType.AVAILABLE]
): Promise<{
  totalSupply: Ref<TokenAmount | undefined>;
  available: Ref<TokenAmount | undefined>;
  rewards: Ref<TokenAmount | undefined>;
  staked: Ref<TokenAmount | undefined>;
  unbonding: Ref<TokenAmount | undefined>;
  loading: ComputedRef<boolean>;
}> => {
  const isWalletConnected = computed(() => !!walletAddress.value);

  const { data: totalSupply, isLoading: isLoadingTotalSupply } = useQuery({
    queryKey: [{ scope: 'balances', entity: 'totalSupply' }],
    queryFn: WalletBalances.totalSupply,
    enabled: isWalletConnected && includes.includes(BalancesType.TOTAL_SUPPLY),
    staleTime: DEFAULT_STALE_TIME,
  });

  const { data: available, isLoading: isLoadingAvailable } = useQuery({
    queryKey: [{ scope: 'balances', entity: 'available', address: accountId }],
    queryFn: WalletBalances.available,
    enabled: isWalletConnected && includes.includes(BalancesType.AVAILABLE),
    staleTime: DEFAULT_STALE_TIME,
  });

  const { data: rewards, isLoading: isLoadingRewards } = useQuery({
    queryKey: [{ scope: 'balances', entity: 'rewards', address: accountId }],
    queryFn: WalletBalances.rewards,
    enabled: isWalletConnected && includes.includes(BalancesType.REWARDS),
    staleTime: DEFAULT_STALE_TIME,
  });

  const { data: staked, isLoading: isLoadingStaked } = useQuery({
    queryKey: [{ scope: 'balances', entity: 'staked', address: accountId }],
    queryFn: WalletBalances.staked,
    enabled: isWalletConnected && includes.includes(BalancesType.STAKED),
    staleTime: DEFAULT_STALE_TIME,
  });

  const { data: unbonding, isLoading: isLoadingUnbonding } = useQuery({
    queryKey: [{ scope: 'balances', entity: 'unbonding', address: accountId }],
    queryFn: WalletBalances.unbonding,
    enabled: isWalletConnected && includes.includes(BalancesType.UNBONDING),
    staleTime: DEFAULT_STALE_TIME,
  });

  const loading = computed(() => {
    const loadings = [];
    if (includes.includes(BalancesType.TOTAL_SUPPLY)) {
      loadings.push(isLoadingTotalSupply.value);
    }
    if (includes.includes(BalancesType.AVAILABLE)) {
      loadings.push(isLoadingAvailable.value);
    }
    if (includes.includes(BalancesType.REWARDS)) {
      loadings.push(isLoadingRewards.value);
    }
    if (includes.includes(BalancesType.STAKED)) {
      loadings.push(isLoadingStaked.value);
    }
    if (includes.includes(BalancesType.UNBONDING)) {
      loadings.push(isLoadingUnbonding.value);
    }
    return loadings.some(loading => loading);
  });

  return {
    totalSupply,
    available,
    rewards,
    staked,
    unbonding,
    loading,
  };
};
