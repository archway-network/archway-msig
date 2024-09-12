import { computed, type ComputedRef } from 'vue';
import { TriompheChainInfo, ConstantineChainInfo, TitusChainInfo } from '@archway-kit/wallet';

import { restTransport, rpcTransport } from '@/services/transports';

import type { TokenDenom, ITransport } from '@/types';

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
  transport: ITransport;
};

export enum AppEnvironment {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  TITUS = 'devnet',
}

export const useConfig: () => AppConfig = () => {
  const runtimeConfig = useRuntimeConfig();

  const isMainNet = runtimeConfig.public.runtimeEnvironment === AppEnvironment.MAINNET;
  const isTestNet = runtimeConfig.public.runtimeEnvironment === AppEnvironment.TESTNET;
  const chainInfo = computed(() => (isMainNet ? TriompheChainInfo : isTestNet ? ConstantineChainInfo : TitusChainInfo));
  const tokenDenom = chainInfo.value?.stakeCurrency as TokenDenom;
  const transport = runtimeConfig.public.defaultTransport === 'rpc' ? rpcTransport : restTransport;

  const restEndpoint = computed(() => chainInfo.value?.rest);
  const rpcEndpoint = computed(() => chainInfo.value?.rpc);

  const MINTSCAN_VALIDATORS = isMainNet
    ? `https://www.mintscan.io/archway/validators`
    : `https://testnet.mintscan.io/archway-testnet/validators`;
  const MINTSCAN_TRANSACTIONS = isMainNet
    ? `https://www.mintscan.io/archway/transactions`
    : `https://testnet.mintscan.io/archway-testnet/txs`;

  return {
    appEnvironment: isMainNet ? AppEnvironment.MAINNET : isTestNet ? AppEnvironment.TESTNET : AppEnvironment.TITUS,
    appName: runtimeConfig.public.app.name,
    appAssets: {
      logo: runtimeConfig.public.app.assets.logo,
      brand: runtimeConfig.public.app.assets.brand,
    },
    isMainNet,
    chainInfo,
    tokenDenom,
    transport,
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
