import BigNumber from 'bignumber.js';
import { BIG_TEN } from '../config/constants';

export const getFormattedBalance = (val: number) => {
  var formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(val);
};

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals));
};

/**
 * Take a formatted amount, e.g. 15 BNB and convert it to full decimal value, e.g. 15000000000000000
 */
export const getDecimalAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).times(BIG_TEN.pow(decimals));
};

export const formatToUSD = (amount: BigNumber, usdValue: number) => {
  return amount.multipliedBy(new BigNumber(usdValue));
};
