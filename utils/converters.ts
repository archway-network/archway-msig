import { bech32 } from 'bech32';

export const convertAddress = (address: string, newPrefix: string): string | undefined => {
  try {
    const decoded = bech32.decode(address);

    return bech32.encode(newPrefix, decoded.words);
  } catch {
    return undefined;
  }
};
