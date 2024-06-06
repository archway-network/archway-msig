import TokenAmount from './TokenAmount';
import { formatPercent } from '@/utils';

import { type TokenDenom, ValidatorStatus } from '@/types';

type CosmosValidatorStatus =
  | 'BOND_STATUS_UNSPECIFIED'
  | 'BOND_STATUS_UNBONDED'
  | 'BOND_STATUS_UNBONDING'
  | 'BOND_STATUS_BONDED'
  | 'UNRECOGNIZED';

type ValidatorFormattedAttributes = {
  commission: string;
};

export default class Validator {
  public formatted: ValidatorFormattedAttributes;

  constructor(
    public id: string,
    public title: string,
    public avatar: string,
    public votingPower: TokenAmount,
    public commission: number,
    public status: ValidatorStatus,
    public website?: string
  ) {
    this.formatted = this.formatAttributes();
  }

  static make(validatorAttributes: any, tokenDenom: TokenDenom) {
    const { operator_address, description, delegator_shares, commission, status } = validatorAttributes;

    return new Validator(
      operator_address,
      description?.moniker || '',
      Validator.avatar(operator_address),
      TokenAmount.makeFromAmount(delegator_shares, tokenDenom),
      (commission?.commission_rates?.rate || 0) * 100,
      Validator.determineStatus(status),
      Validator.website(description?.website)
    );
  }

  formatAttributes(): ValidatorFormattedAttributes {
    return {
      commission: formatPercent(this.commission),
    };
  }

  static determineStatus(status: CosmosValidatorStatus): ValidatorStatus {
    return {
      BOND_STATUS_BONDED: ValidatorStatus.BONDED,
      BOND_STATUS_UNSPECIFIED: ValidatorStatus.UNSPECIFIED,
      BOND_STATUS_UNBONDED: ValidatorStatus.UNBONDED,
      BOND_STATUS_UNBONDING: ValidatorStatus.UNBONDING,
      UNRECOGNIZED: ValidatorStatus.UNRECOGNIZED,
    }[status];
  }

  static avatar(address: string) {
    return `https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/archway/moniker/${address}.png`;
  }

  static website(url?: string) {
    if (!url) return undefined;
    if (!/^https?:\/\//i.test(url)) return undefined;
    return url.replace(/^https?:\/\//i, '');
  }
}
