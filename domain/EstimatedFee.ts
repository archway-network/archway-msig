import { EncodeObject } from '@cosmjs/proto-signing';
import { SigningArchwayClient } from '@archwayhq/arch3.js';

import { useConfig } from '@/composables';
import TokenAmount from './TokenAmount';

const defaultGasAdjustment = 1.4;

export default class EstimatedFee {
  static async archwayFee(
    signingClient: SigningArchwayClient,
    signerAddress: string,
    messages: EncodeObject[],
    gasAdjustment = defaultGasAdjustment
  ) {
    const { tokenDenom } = useConfig();

    try {
      const result = await signingClient.calculateFee(signerAddress, messages, undefined, gasAdjustment);

      return TokenAmount.makeFromAmount(result.amount[0].amount, tokenDenom);
    } catch (error: Error | any) {
      console.error(error);
      return TokenAmount.zero(tokenDenom);
    }
  }
}
