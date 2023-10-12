import TokenAmount from './TokenAmount';

import { TokenDenom } from '@/types';

export default class ValidatorDelegation {
  constructor(public delegator: string, public validator: string, public amount: TokenAmount) {}

  static make(attributes: any, balance: any, tokenDenom: TokenDenom) {
    const { delegator_address, validator_address } = attributes;

    return new ValidatorDelegation(delegator_address, validator_address, TokenAmount.makeFromAmount(balance.amount, tokenDenom));
  }
}
