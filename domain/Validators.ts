import { QueryFunctionContext } from '@tanstack/vue-query';

import { useConfig } from '@/composables';
import Validator from './Validator';
import ValidatorDelegation from './ValidatorDelegation';

import { ValidatorsFilterType, ValidatorsFilterTypes, ValidatorsWithPagination } from '@/types';

export default class Validators {
  static async all({
    queryKey: [{ filter, nextPageToken }],
  }: QueryFunctionContext<{ filter: ValidatorsFilterType | undefined; nextPageToken?: string }[]>): Promise<ValidatorsWithPagination> {
    const { restEndpoint, tokenDenom } = useConfig();

    return $fetch<any>(`${restEndpoint}/cosmos/staking/v1beta1/validators`, {
      query: {
        status: Validators.validatorStatus(filter),
        'pagination.key': nextPageToken,
        'pagination.limit': 100,
        'pagination.reverse': true,
        'pagination.count_total': true,
      },
    }).then(data => ({
      nextPageToken: data?.pagination?.next_key,
      validators: data?.validators.map((attributes: any) => Validator.make(attributes, tokenDenom)),
    }));
  }

  static async onlyDelegates({
    queryKey: [{ walletAddress, nextPageToken }],
  }: QueryFunctionContext<{ walletAddress?: string; nextPageToken?: string }[]>): Promise<ValidatorsWithPagination> {
    const { restEndpoint, tokenDenom } = useConfig();

    return $fetch<any>(`${restEndpoint}/cosmos/staking/v1beta1/delegators/${walletAddress}/validators`, {
      query: {
        'pagination.key': nextPageToken,
        'pagination.limit': 100,
        'pagination.reverse': true,
        'pagination.count_total': true,
      },
    }).then(data => {
      return {
        nextPageToken: data?.pagination?.next_key,
        validators: data?.validators.map((attributes: any) => Validator.make(attributes, tokenDenom)),
      };
    });
  }

  static async delegationsFor({
    queryKey: [{ walletAddress }],
  }: QueryFunctionContext<{ walletAddress?: string }[]>): Promise<ValidatorDelegation[]> {
    const { restEndpoint, tokenDenom } = useConfig();

    return $fetch<any>(`${restEndpoint}/cosmos/staking/v1beta1/delegations/${walletAddress}`, {
      query: {
        'pagination.limit': 100,
        'pagination.reverse': true,
        'pagination.count_total': false,
      },
    }).then(data => {
      return data?.delegation_responses.map(({ delegation, balance }: any) => ValidatorDelegation.make(delegation, balance, tokenDenom));
    });
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
