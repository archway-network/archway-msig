import { SigningArchwayClient } from '@archwayhq/arch3.js';
import { fromBase64 } from '@cosmjs/encoding';
import { OfflineAminoSigner, StdFee, encodeSecp256k1Pubkey, makeSignDoc } from '@cosmjs/amino';
import { Int53 } from '@cosmjs/math';
import { EncodeObject, TxBodyEncodeObject, encodePubkey, makeAuthInfoBytes } from '@cosmjs/proto-signing';
import { createWasmAminoConverters } from '@cosmjs/cosmwasm-stargate';
import { AminoTypes, SignerData, createDefaultAminoConverters } from '@cosmjs/stargate';
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing.js';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx.js';

const aminoTypes = new AminoTypes({
  ...createDefaultAminoConverters(),
  ...createWasmAminoConverters(),
});

export const patchSignAmino = async (
  client: SigningArchwayClient,
  offlineSigner: OfflineAminoSigner,
  signerAddress: string,
  messages: readonly EncodeObject[],
  fee: StdFee,
  memo: string,
  { accountNumber, sequence, chainId }: SignerData
): Promise<TxRaw> => {
  const accountFromSigner = (await offlineSigner.getAccounts()).find(account => account.address === signerAddress);
  if (!accountFromSigner) {
    throw new Error('Failed to retrieve account from signer');
  }

  const pubkey = encodePubkey(encodeSecp256k1Pubkey(accountFromSigner.pubkey));
  const signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON;
  const msgs = messages.map(msg => aminoTypes.toAmino(msg));
  const signDoc = makeSignDoc(msgs, { amount: fee.amount, gas: fee.gas }, chainId, memo, accountNumber, sequence);
  const { signature, signed } = await offlineSigner.signAmino(signerAddress, signDoc);
  const signedTxBody = {
    messages: signed.msgs.map(msg => aminoTypes.fromAmino(msg)),
    memo: signed.memo,
  };
  const signedTxBodyEncodeObject: TxBodyEncodeObject = {
    typeUrl: '/cosmos.tx.v1beta1.TxBody',
    value: signedTxBody,
  };
  const signedTxBodyBytes = client.registry.encode(signedTxBodyEncodeObject);
  const signedGasLimit = Int53.fromString(signed.fee.gas).toNumber();
  const signedSequence = Int53.fromString(signed.sequence).toNumber();
  const signedAuthInfoBytes = makeAuthInfoBytes(
    [{ pubkey, sequence: signedSequence }],
    signed.fee.amount,
    signedGasLimit,
    fee.granter,
    fee.payer,
    signMode
  );

  return TxRaw.fromPartial({
    bodyBytes: signedTxBodyBytes,
    authInfoBytes: signedAuthInfoBytes,
    signatures: [fromBase64(signature.signature)],
  });
};
