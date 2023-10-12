import { bech32 } from 'bech32';

export const isEmail = (str: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(str));
};

export const isValidAddress = (address: string, prefix = 'archway'): boolean => {
  const ALLOWED_CHARS = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  var regexp = new RegExp(`^(${prefix})1([${ALLOWED_CHARS}]+)$`); // Prefix + bech32 separated by '1'

  let match = regexp.exec(address);

  try {
    if (match) {
      const decoded = bech32.decode(address);
      return decoded?.words?.length === 32;
    }
  } catch (err) {
    return false;
  }

  return false;
};
