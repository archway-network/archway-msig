import { QueryFunctionContext } from '@tanstack/vue-query';

import { useConfig } from '@/composables';
import Validator from './Validator';
import ValidatorDelegation from './ValidatorDelegation';

import { ValidatorsFilterType, ValidatorsFilterTypes, ValidatorsWithPagination } from '@/types';

export default class Validators {
  static async all({
    queryKey: [{ filter, nextPageToken }],
  }: QueryFunctionContext<{ filter: ValidatorsFilterType | undefined; nextPageToken?: string }[]>): Promise<ValidatorsWithPagination> {
    const { tokenDenom, transport } = useConfig();

    const data = await transport.getValidators({
      status: Validators.validatorStatus(filter),
      'pagination.key': nextPageToken,
      'pagination.limit': 100,
      'pagination.reverse': true,
      'pagination.count_total': true,
    });

    return {
      nextPageToken: data?.pagination?.next_key,
      validators: data?.validators.map((attributes) => Validator.make(attributes, tokenDenom)),
    };
  }

  static async onlyDelegates({
    queryKey: [{ walletAddress, nextPageToken }],
  }: QueryFunctionContext<{ walletAddress?: string; nextPageToken?: string }[]>): Promise<ValidatorsWithPagination> {
    const { tokenDenom, transport } = useConfig();

    const data = await transport.getValidatorsByDelegator(walletAddress!, {
      'pagination.key': nextPageToken,
      'pagination.limit': 100,
      'pagination.reverse': true,
      'pagination.count_total': true,
    });

    return {
      nextPageToken: data?.pagination?.next_key,
      validators: data?.validators.map((attributes: any) => Validator.make(attributes, tokenDenom)),
    };
  }

  static async delegationsFor({
    queryKey: [{ walletAddress }],
  }: QueryFunctionContext<{ walletAddress?: string }[]>): Promise<ValidatorDelegation[]> {
    const { tokenDenom, transport } = useConfig();
    const data = await transport.getDelegationsByDelegator(walletAddress!, {
      'pagination.limit': 100,
      'pagination.reverse': true,
      'pagination.count_total': false,
    });
    return data?.delegation_responses.map(({ delegation, balance }: any) => ValidatorDelegation.make(delegation, balance, tokenDenom));
  }

  static validatorStatus(filter?: ValidatorsFilterType) {
    if (!filter) return undefined;

    return {
      [ValidatorsFilterTypes.ACTIVE]: 'BOND_STATUS_BONDED',
      [ValidatorsFilterTypes.ALL]: undefined,
      [ValidatorsFilterTypes.DELEGATED]: undefined,
    }[filter];
  }
}
