import { type AppCurrency } from '@keplr-wallet/types';
import { type Account as Bech32Account } from '@cosmjs/stargate';

export * from './proposals';
export * from './transactions';
export * from './validators';
export * from './governance';
export * from './transport';
export * from './pagination';
export * from './params';

export type TokenDenom = AppCurrency;

export type Account = Bech32Account & Record<string, any>;

export type ModuleAccount<T extends string = string> = {
  '@type': '/cosmos.auth.v1beta1.ModuleAccount';
  base_account: Bech32Account;
  name: T;
  permissions: string[];
};

export namespace AccountConfig {
  export type AccountId = string;

  export type Account = {
    mainAddress: string;
    preProposeAddress: string;
    proposalsAddress: string;
    membersAddress: string;
  };
}

export enum BalancesType {
  AVAILABLE,
  STAKED,
  UNBONDING,
  REWARDS,
  TOTAL_SUPPLY,
}

export type MenuItem = {
  label: string;
  url: string;
  icon?: any;
  comingSoon?: boolean;
  selected?: boolean;
};

export type SelectOption = {
  label: string;
  value: string;
  data?: any;
};

export type Filter = {
  id: unknown;
  label: string;
};

export type Percent = {
  value: number;
  formatted: string;
};

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type Pagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
};

export enum TooltipPosition {
  TOP = 'TOP',
  TOP_LEFT = 'TOP_LEFT',
  TOP_RIGHT = 'TOP_RIGHT',
  RIGHT = 'RIGHT',
  BOTTOM = 'BOTTOM',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  LEFT = 'LEFT',
}
