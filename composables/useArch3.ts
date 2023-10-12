import { ArchwayClient } from '@archwayhq/arch3.js';
import { HttpBatchClient, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { useConfig } from '@/composables/useConfig';

export const useArch3 = async () => {
  const { rpcEndpoint } = useConfig();

  const client = await ArchwayClient.connectWithBatchClient(rpcEndpoint);

  return { client };
};
