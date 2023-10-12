import { QueryClient } from '@tanstack/vue-query';

export default class InvalidateQueries {
  constructor(protected queryClient: QueryClient, protected accountId: string, protected walletAddress: string) {}

  forMembers() {
    this.queryClient.invalidateQueries({
      queryKey: [{ scope: 'accounts', entity: `account.${this.accountId}.members`, address: this.walletAddress }],
    });
  }

  forStaking() {
    this.queryClient.invalidateQueries({
      queryKey: [{ scope: 'balances', entity: 'available' }],
    });
    this.queryClient.invalidateQueries({
      queryKey: [{ scope: 'balances', entity: 'staked' }],
    });
    this.queryClient.invalidateQueries({
      queryKey: [{ scope: 'balances', entity: 'unbonding' }],
    });
    this.queryClient.invalidateQueries({
      queryKey: [{ scope: 'validators', entity: 'delegations' }],
    });
  }

  forGovernance() {}

  forRewards() {
    this.queryClient.invalidateQueries({
      queryKey: [{ scope: 'balances', entity: 'available' }],
    });
    this.queryClient.invalidateQueries({
      queryKey: [{ scope: 'balances', entity: 'rewards' }],
    });
  }

  forVestingClawbacks() {
    this.queryClient.invalidateQueries({
      queryKey: [{ scope: 'balances', entity: 'available' }],
    });
  }

  forVestingClaimRewards() {
    this.queryClient.invalidateQueries({
      queryKey: [{ scope: 'balances', entity: 'rewards' }],
    });
    this.queryClient.invalidateQueries({
      queryKey: [{ scope: 'vesting-accounts', entity: `account.${this.accountId}.status` }],
    });
  }

  forVestingWithdrawRewards() {
    this.queryClient.invalidateQueries({
      queryKey: [{ scope: 'vesting-accounts', entity: `account.${this.accountId}.status` }],
    });
    this.queryClient.invalidateQueries({
      queryKey: [{ scope: 'balances', entity: 'available' }],
    });
  }

  forVestingWithdrawTokens() {
    this.queryClient.invalidateQueries({
      queryKey: [{ scope: 'vesting-accounts', entity: `account.${this.accountId}.status` }],
    });
    this.queryClient.invalidateQueries({
      queryKey: [{ scope: 'balances', entity: 'available' }],
    });
  }

  forVotingConfiguration() {
    this.queryClient.invalidateQueries({
      queryKey: [{ scope: 'accounts', entity: `account.${this.accountId}.votingConfig` }],
    });
  }
}
