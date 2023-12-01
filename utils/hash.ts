import { toHex } from '@cosmjs/encoding';
import { sha256 } from '@cosmjs/crypto';

export const getSHA256Hash = (input: string) => {
  return toHex(sha256(new TextEncoder().encode(input)));
};
