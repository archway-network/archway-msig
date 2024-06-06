import { type QueryFunctionContext } from '@tanstack/vue-query';

import { useConfig } from '@/composables';
import Validator from './Validator';
import ValidatorDelegation from './ValidatorDelegation';

import { type ValidatorsFilterType, ValidatorsFilterTypes, type ValidatorsWithPagination } from '@/types';

const DEFAULT_PAGE_SIZE = 500;

export default class Validators {
  static async all({
    queryKey: [{ filter, nextPageToken, pageSize = DEFAULT_PAGE_SIZE }],
  }: QueryFunctionContext<
    { filter: ValidatorsFilterType | undefined; nextPageToken?: string; pageSize?: number }[]
  >): Promise<ValidatorsWithPagination> {
    const { tokenDenom, transport } = useConfig();

    const data = await transport.getValidators({
      status: Validators.validatorStatus(filter),
      'pagination.key': nextPageToken,
      'pagination.limit': pageSize,
      'pagination.reverse': true,
      'pagination.count_total': true,
    });

    return {
      nextPageToken: data?.pagination?.next_key,
      validators: data?.validators.map(attributes => Validator.make(attributes, tokenDenom)),
    };
  }

  static async onlyDelegates({
    queryKey: [{ walletAddress, nextPageToken, pageSize = DEFAULT_PAGE_SIZE }],
  }: QueryFunctionContext<{ walletAddress?: string; nextPageToken?: string; pageSize?: number }[]>): Promise<ValidatorsWithPagination> {
    const { tokenDenom, transport } = useConfig();

    const data = await transport.getValidatorsByDelegator(walletAddress!, {
      'pagination.key': nextPageToken,
      'pagination.limit': pageSize,
      'pagination.reverse': true,
      'pagination.count_total': true,
    });

    return {
      nextPageToken: data?.pagination?.next_key,
      validators: data?.validators.map((attributes: any) => Validator.make(attributes, tokenDenom)),
    };
  }

  static async delegationsFor({
    queryKey: [{ walletAddress, pageSize = DEFAULT_PAGE_SIZE }],
  }: QueryFunctionContext<{ walletAddress?: string; pageSize?: number }[]>): Promise<ValidatorDelegation[]> {
    const { tokenDenom, transport } = useConfig();
    const data = await transport.getDelegationsByDelegator(walletAddress!, {
      'pagination.limit': pageSize,
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
