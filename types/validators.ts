import Validator from '@/domain/Validator';
import TokenAmount from '@/domain/TokenAmount';

export const ValidatorsFilterTypes = {
  ACTIVE: 'ACTIVE',
  DELEGATED: 'DELEGATED',
  ALL: 'ALL',
} as const;

export type ValidatorsFilterType = (typeof ValidatorsFilterTypes)[keyof typeof ValidatorsFilterTypes];

export type ValidatorsWithPagination = {
  validators: Validator[];
  nextPageToken?: string;
};

export enum ValidatorStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  UNBONDED = 'UNBONDED',
  UNBONDING = 'UNBONDING',
  BONDED = 'BONDED',
  UNRECOGNIZED = 'UNRECOGNIZED',
}

export type BulkDelegationBlock = {
  amount: TokenAmount;
  validator: Validator;
};

export enum SortField {
  VOTING_POWER = 'votingPower',
  COMMISSION = 'commission',
}
