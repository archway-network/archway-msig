import { isArray, transform, isObject } from 'lodash';
import { createDefu } from 'defu';
import BigNumber from 'bignumber.js';

export const truncateAddress = (address: string) => {
  const truncateRegex = /^(archway[a-zA-Z0-9]{5})[a-zA-Z0-9]+([a-zA-Z0-9]{5})$/;
  const match = address.match(truncateRegex);

  if (!match) return address;

  return `${match[1]}…${match[2]}`;
};

export const truncateTransaction = (transactionId: string) => {
  const truncateRegex = /^([a-zA-Z0-9]{5})[a-zA-Z0-9]+([a-zA-Z0-9]{5})$/;
  const match = transactionId.match(truncateRegex);

  if (!match) return transactionId;

  return `${match[1]}…${match[2]}`;
};

export function omit<T extends Record<any, any>>(object: T, keysToOmit: string[] = []) {
  const clone = Object.assign({}, object);
  for (let key of keysToOmit) {
    if (key in clone) delete clone[key];
  }

  return clone;
}

export function delayFor(timeout = 500) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export function retryFor(cb: () => void, maxTries = 5): Promise<boolean> {
  let tries = 0;
  const _retry = async (timeout = 500) => {
    try {
      ++tries;
      cb();
      return true;
    } catch (e) {
      if (tries < maxTries) {
        await delayFor(timeout);
        _retry(timeout);
      }
      return false;
    }
  };

  return _retry();
}

export const toArray = (value: any) => (Array.isArray(value) ? value : [value]);

export const isUint8Array = (value: unknown) => value instanceof Object.getPrototypeOf(Uint8Array);

export const transformKeys = (input: Record<string, unknown>, transformer: (v: string) => string) => {
  return transform(input, (result: Record<string, unknown>, value: unknown, key: string, target) => {
    const transformedKey = isArray(target) ? key : transformer(key);
    result[transformedKey] = isObject(value) ? transformKeys(value as Record<string, unknown>, transformer) : value;
  });
};

export const transformValues = (input: unknown, transformer: (v: unknown, key?: string) => any, key?: string) => {
  if (isObject(input)) {
    return transform(input, (result: Record<string, unknown>, value: unknown, key: string) => {
      result[key] = transformValues(value, transformer, key);
    });
  }
  return transformer(input, key);
};

export const mergeObjects = createDefu((obj, key, value) => {
  // don't merge arrays with defaults if value is specified
  if (isArray(obj[key])) {
    if (JSON.stringify(obj[key]) !== JSON.stringify(value)) {
      obj[key] = value;
    }
    return true;
  }
});

export const toBigInt = (amount: string, decimals = '18') => {
  return BigNumber(amount).multipliedBy(`1e${decimals}`).toString();
};
