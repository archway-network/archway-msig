const currency = {
  coinDenom: 'CONST',
  coinMinimalDenom: 'aconst',
  coinDecimals: 18,
  coinGeckoId: 'archway',
};

const chainInfo: ChainInfo = {
  chainId: 'constantine-3',
  chainName: 'Constantine',
  rpc: 'https://rpc.constantine.archway.tech',
  rest: 'https://api.constantine.archway.tech',
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
