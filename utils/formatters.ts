import BigNumber from 'bignumber.js';
import { format } from 'date-fns';

export const formatShortDate = (date: Date | number) => {
  return format(date, 'P');
};

export const formatDate = (date: Date | number) => {
  return format(date, 'LLLL d yyyy');
};

export const formatFullDateTime = (date: Date) => {
  return format(date, 'P, pp');
};

export const formatNumber = (val: number | string | BigNumber, decimals?: number, removeTrailingZeroes = true) => {
  // Get formatted Number
  const formatted = BigNumber(val).toFormat(decimals);
  return removeTrailingZeroes
    ? formatted
        // Remove trailing zeroes
        .replace(/(\.\d*?)0*$/, '$1')
        // If only dot is left at the end, remove it
        .replace(/\.$/, '')
    : formatted;
};

export const formatPercent = (val: number | string | BigNumber, decimals = 2, removeTrailingZeroes = true) => {
  return `${formatNumber(val, decimals, removeTrailingZeroes)}%`;
};

export const formatCosmjsErrorMessage = (errorMessage?: string): Error => {
  const regex = /(?:.*failed to execute message; message index: 0: )(.*)/;

  const newMessage = errorMessage?.match(regex)?.[1] || errorMessage || 'Unexpected error';

  return new Error(newMessage.charAt(0).toUpperCase() + newMessage.slice(1));
};
