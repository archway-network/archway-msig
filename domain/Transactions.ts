import { SigningArchwayClient } from '@archwayhq/arch3.js';
import { type DeliverTxResponse } from '@cosmjs/stargate';
import type { ExecuteResult, MsgExecuteContractEncodeObject } from '@cosmjs/cosmwasm-stargate';
import type { OfflineAminoSigner, StdFee } from '@cosmjs/amino';
import { isOfflineDirectSigner, type OfflineSigner } from '@cosmjs/proto-signing';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx.js';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx.js';
import { toUtf8 } from '@cosmjs/encoding';

import UserWalletFactory from './Wallets/UserWalletFactory';
import { patchSignAmino } from '@/utils/signing';

import type { TransactionParams } from '@/types';

class Transactions {
  protected constructor(protected signingClient: SigningArchwayClient) {}

  public get client(): SigningArchwayClient {
    return this.signingClient;
  }

  static async suggestChain(chainInfo: ChainInfo): Promise<void> {
    return UserWalletFactory.suggestChain(chainInfo);
  }

  static make(signingClient?: SigningArchwayClient) {
    if (!signingClient) throw new Error("Couldn't connect to network");

    return new Transactions(signingClient);
  }

  async signAndBroadcast(tx: TransactionParams): Promise<DeliverTxResponse> {
    return this.signingClient.signAndBroadcast(tx.signerAddress, tx.messages, tx.fee, tx.memo);
  }

  async execute(smartContractAddress: string, signerAddress: string, msg: any): Promise<ExecuteResult> {
    return this.signingClient.execute(signerAddress, smartContractAddress, msg, 'auto');
  }

  async executeWithFeeGranter(
    offlineSigner: OfflineSigner,
    smartContractAddress: string,
    signerAddress: string,
    feeGranterAddress: string,
    msg: any
  ): Promise<DeliverTxResponse> {
    const executeMsg: MsgExecuteContractEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: signerAddress,
        contract: smartContractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: [],
      }),
    };
    const messages = [executeMsg];

    const gasAdjustment = 1.5;
    const fee = await this.signingClient.calculateFee(signerAddress, messages, undefined, gasAdjustment, feeGranterAddress);

    if (offlineSigner && !isOfflineDirectSigner(offlineSigner)) {
      return this.broadcastRawTransaction(offlineSigner as OfflineAminoSigner, signerAddress, messages, fee);
    }

    return this.signingClient.signAndBroadcast(signerAddress, messages, fee);
  }

  protected async broadcastRawTransaction(
    offlineSigner: OfflineAminoSigner,
    signerAddress: string,
    messages: any[],
    fee: StdFee
  ): Promise<DeliverTxResponse> {
    const { accountNumber, sequence } = await this.signingClient.getSequence(signerAddress);
    const chainId = await this.signingClient.getChainId();

    const txRaw = await patchSignAmino(this.signingClient, offlineSigner, signerAddress, messages, fee, '', {
      accountNumber,
      sequence,
      chainId,
    });

    const txBytes = TxRaw.encode(txRaw).finish();

    return this.signingClient.broadcastTx(txBytes, this.signingClient.broadcastTimeoutMs, this.signingClient.broadcastPollIntervalMs);
  }

  disconnectSignerClient() {
    this.signingClient.disconnect();
  }
}

export default Transactions;
