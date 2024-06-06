import { formatDistanceToNow, format, differenceInSeconds, isPast, isFuture } from 'date-fns';
import TokenAmount from './TokenAmount';

import { type TokenDenom } from '@/types';
import BigNumber from 'bignumber.js';

type VestingAccountFormattedAttributes = {
  startDate: string;
  cliffDateDistanceToNow: string;
  cliffDate: string;
  endDate: string;
};

export default class VestingAccount {
  public formatted: VestingAccountFormattedAttributes;
  public progressToCliff: number;
  public progressToFullVesting: number;
  public canWithdrawTokens: boolean = false;

  constructor(
    public id: string,
    public beneficiary: string,
    public canClawback: boolean,
    public initialAmount: TokenAmount,
    public cliffUnlockAmount: TokenAmount,
    public unlockedAmount: TokenAmount,
    public withdrawnAmount: TokenAmount,
    public withdrableAmount: TokenAmount,
    public withdrableStakingRewardsAmount: TokenAmount,
    public stakedAmount: TokenAmount,
    public unbondingAmount: TokenAmount,
    public clawbackTotalAmount: TokenAmount,
    public clawbackWithdrawnAmount: TokenAmount,
    public clawbackWithdrableAmount: TokenAmount,
    public startDate: Date,
    public cliffDate: Date,
    public endDate: Date,
    public canWithdrawStakingRewards: boolean,
    public liquidStakingRewards: boolean
  ) {
    this.canWithdrawTokens = this.unlockedAmount.amount.isGreaterThan(0);
    this.formatted = this.formatAttributes();
    this.progressToCliff = this.determineProgressToCliff();
    this.progressToFullVesting = this.determineProgressToFullVesting();
  }

  static make(accountId: string, vestingAccountId: string, attributes: any, tokenDenom: TokenDenom): VestingAccount {
    const {
      beneficiary,
      funder,
      start_time,
      cliff_time,
      end_time,
      initial_amount,
      cliff_unlock_amount,
      balance_unlocks,
      unlocked,
      withdrawn,
      withdrawable,
      withdrawable_staking_rewards,
      spent,
      clawback,
      can_stake,
      can_withdraw_staking_rewards,
      liquid_staking_rewards,
    } = attributes;

    const totalUnbonding = (balance_unlocks || []).reduce((acc: BigNumber, { amount }: { amount: any }) => acc.plus(amount), BigNumber(0));

    const clawbackTotalAmount = BigNumber(clawback?.total || 0).isGreaterThan(0)
      ? TokenAmount.makeFromAmount(clawback?.total || 0, tokenDenom)
      : new TokenAmount(BigNumber(initial_amount).minus(BigNumber(unlocked)), tokenDenom);

    return new VestingAccount(
      vestingAccountId,
      beneficiary,
      funder === accountId,
      TokenAmount.makeFromAmount(initial_amount, tokenDenom),
      TokenAmount.makeFromAmount(cliff_unlock_amount, tokenDenom),
      TokenAmount.makeFromAmount(unlocked, tokenDenom),
      TokenAmount.makeFromAmount(withdrawn, tokenDenom),
      TokenAmount.makeFromAmount(withdrawable, tokenDenom),
      TokenAmount.makeFromAmount(withdrawable_staking_rewards, tokenDenom),
      TokenAmount.makeFromAmount(spent, tokenDenom),
      TokenAmount.makeFromAmount(totalUnbonding, tokenDenom),
      clawbackTotalAmount,
      TokenAmount.makeFromAmount(clawback?.withdrawn || 0, tokenDenom),
      TokenAmount.makeFromAmount(clawback?.withdrable || 0, tokenDenom),
      new Date(Number(start_time) * 1e3),
      new Date(Number(cliff_time) * 1e3),
      new Date(Number(end_time) * 1e3),
      !!can_withdraw_staking_rewards,
      !!liquid_staking_rewards
    );
  }

  formatAttributes(): VestingAccountFormattedAttributes {
    return {
      startDate: format(this.startDate, 'LLLL d yyyy'),
      cliffDateDistanceToNow: formatDistanceToNow(this.cliffDate, { addSuffix: true }),
      cliffDate: format(this.cliffDate, 'LLLL d yyyy'),
      endDate: format(this.endDate, 'LLLL d yyyy'),
    };
  }

  shouldWithdrawClawback(): boolean {
    return this.clawbackWithdrableAmount.amount.isGreaterThan(0);
  }

  protected determineProgressToCliff() {
    if (isPast(this.cliffDate)) return 100;

    const secondsToCliff = differenceInSeconds(new Date(), this.startDate);

    return (secondsToCliff / differenceInSeconds(this.cliffDate, this.startDate)) * 100;
  }

  protected determineProgressToFullVesting() {
    if (isFuture(this.cliffDate)) return 0;

    if (isPast(this.endDate)) return 100;

    const secondsToFullVesting = differenceInSeconds(this.cliffDate, new Date());

    return (secondsToFullVesting / differenceInSeconds(this.cliffDate, this.endDate)) * 100;
  }
}
