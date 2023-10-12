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
