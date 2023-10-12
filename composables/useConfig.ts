import { computed, ComputedRef } from 'vue';

import triompheChainInfo from '@/config/triomphe.config';
import constantineChainInfo from '@/config/constantine.config';

import { TokenDenom } from '@/types';

type AppConfigExternalLinks = {
  ARCHWAY_DOCS: string;
  ARCHWAY_GOVERNANCE_FORUM: string;
  MINTSCAN_VALIDATORS: string;
  MINTSCAN_TRANSACTIONS: string;
};

type AppConfig = {
  appEnvironment: AppEnvironment;
  appName: string;
  appAssets: {
    logo: string;
    brand: string;
  };
  isMainNet: boolean;
  chainInfo: ComputedRef<ChainInfo>;
  tokenDenom: TokenDenom;
  restEndpoint: string;
  rpcEndpoint: string;
  externalLinks: AppConfigExternalLinks;
};

export enum AppEnvironment {
  MAINNET = 'MAINNET',
  TESTNET = 'TESTNET',
}

export const useConfig: () => AppConfig = () => {
  const runtimeConfig = useRuntimeConfig();

  const isMainNet = runtimeConfig.public.runtimeEnvironment === 'mainnet';
  const chainInfo = computed(() => (isMainNet ? triompheChainInfo : constantineChainInfo));
  const tokenDenom = chainInfo.value?.stakeCurrency as TokenDenom;

  const restEndpoint = computed(() => chainInfo.value?.rest);
  const rpcEndpoint = computed(() => chainInfo.value?.rpc);

  const MINTSCAN_VALIDATORS = isMainNet
    ? `https://www.mintscan.io/archway/validators`
    : `https://testnet.mintscan.io/archway-testnet/validators`;
  const MINTSCAN_TRANSACTIONS = isMainNet
    ? `https://www.mintscan.io/archway/transactions`
    : `https://testnet.mintscan.io/archway-testnet/txs`;

  return {
    appEnvironment: isMainNet ? AppEnvironment.MAINNET : AppEnvironment.TESTNET,
    appName: runtimeConfig.public.app.name,
    appAssets: {
      logo: runtimeConfig.public.app.assets.logo,
      brand: runtimeConfig.public.app.assets.brand,
    },
    isMainNet,
    chainInfo,
    tokenDenom,
    restEndpoint: restEndpoint.value,
    rpcEndpoint: rpcEndpoint.value,
    externalLinks: {
      ARCHWAY_DOCS: 'https://docs.archway.io',
      ARCHWAY_GOVERNANCE_FORUM: 'https://gov.archway.io',
      MINTSCAN_VALIDATORS,
      MINTSCAN_TRANSACTIONS,
    },
  } as AppConfig;
};
