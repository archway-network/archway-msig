import { EncodeObject } from '@cosmjs/proto-signing';
import { StdFee } from '@cosmjs/stargate';

interface TransactionInputs {
  signerAddress: string;
  messages: EncodeObject[];
  fee: StdFee | 'auto' | number;
  memo?: string;
}

interface TransactionSuccessStatus {
  successTitle?: string;
  successContent?: string | string[];
  successImage?: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export interface TransactionParams extends TransactionInputs, TransactionSuccessStatus {}

export enum TransactionStatus {
  IDLE,
  IN_PROGRESS,
  FAILED,
  SUCCESSFUL,
}
