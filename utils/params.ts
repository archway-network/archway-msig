import { transformValues } from './helpers';

export const normalizeParams = (input: unknown) => {
  return transformValues(input, (v, key) => {
    if (typeof v === 'string' && v.match(/^[0-9]+s$/)) {
      const seconds = parseInt(v);
      return key === 'seconds' ? seconds : { seconds };
    }
    return v;
  });
};
