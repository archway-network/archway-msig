import BigNumber from 'bignumber.js';

import { formatAmount, formatNumber, parseAmount } from '@/utils';

import { TokenDenom } from '@/types';

BigNumber.config({ EXPONENTIAL_AT: 1e9 });

export default class TokenAmount {
  // amount is in minimalCoinDenom
  constructor(public amount: BigNumber, public denom: TokenDenom) {}

  public static makeFromBalances(balances: any[], tokenDenom: TokenDenom): TokenAmount {
    const ourBalance = (balances || []).find(({ denom }: { denom: string }) => denom === tokenDenom.coinMinimalDenom);

    return TokenAmount.makeFromAmount(ourBalance?.amount, tokenDenom);
  }

  public static makeFromAmount(amount: any, tokenDenom: TokenDenom): TokenAmount {
    // amount is in minimalCoinDenom
    return new TokenAmount(BigNumber(amount || 0), tokenDenom);
  }

  public static makeFromDenom(amount: any, tokenDenom: TokenDenom): TokenAmount {
    // amount is in coinDenom
    const converted = parseAmount(amount, tokenDenom.coinDecimals);
    return new TokenAmount(converted, tokenDenom);
  }

  public static zero(tokenDenom: TokenDenom): TokenAmount {
    return new TokenAmount(BigNumber(0), tokenDenom);
  }

  public format(formatDecimals?: number): string {
    const converted = this.toBigNumber();
    return formatNumber(converted, formatDecimals === undefined ? this.denom.coinDecimals : formatDecimals);
  }

  public formatWithCoin(formatDecimals?: number): string {
    return `${this.format(formatDecimals)} ${this.denom.coinDenom}`;
  }

  public plus(otherAmount: TokenAmount): TokenAmount {
    return TokenAmount.makeFromAmount(this.amount.plus(otherAmount.amount), this.denom);
  }

  public minus(otherAmount: TokenAmount): TokenAmount {
    return TokenAmount.makeFromAmount(this.amount.minus(otherAmount.amount), this.denom);
  }

  public toBigNumber(): BigNumber {
    return formatAmount(this.amount, this.denom.coinDecimals);
  }
}
