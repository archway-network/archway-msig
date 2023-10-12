const currency = {
  coinDenom: 'ARCH',
  coinMinimalDenom: 'aarch',
  coinDecimals: 18,
  coinGeckoId: 'archway',
};

const chainInfo: ChainInfo = {
  chainId: 'archway-1',
  chainName: 'Archway',
  rpc: 'https://rpc.mainnet.archway.io',
  rest: 'https://api.mainnet.archway.io',
  stakeCurrency: currency,
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'archway',
    bech32PrefixAccPub: 'archwaypub',
    bech32PrefixValAddr: 'archwayvaloper',
    bech32PrefixValPub: 'archwayvaloperpub',
    bech32PrefixConsAddr: 'archwayvalcons',
    bech32PrefixConsPub: 'archwayvalconspub',
  },
  currencies: [currency],
  feeCurrencies: [currency],
  coinType: 118,
  features: ['cosmwasm'],
};

export default chainInfo;
