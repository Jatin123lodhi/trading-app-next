import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats Zod validation errors into a user-friendly error message
 * @param error - The ZodError object from safeParse
 * @returns A formatted error message string
 * @example
 * // Returns: "amount: Amount must be positive, walletId: Required"
 * formatValidationError(result.error)
 */
export function formatValidationError(error: ZodError): string {
  return error.issues
    .map(issue => `${issue.path.join('.')}: ${issue.message}`)
    .join(', ');
}

/**
 * Currency conversion rates (USD to INR)
 * In a real application, this should be fetched from a live API
 */
const EXCHANGE_RATES = {
  USD_TO_INR: 83.50, // Approximate rate, should be dynamic in production
  INR_TO_USD: 1 / 83.50
};

/**
 * Converts an amount from one currency to another
 * @param amount - The amount to convert
 * @param fromCurrency - Source currency ('USD' or 'INR')
 * @param toCurrency - Target currency ('USD' or 'INR')
 * @returns The converted amount
 */
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  if (fromCurrency === 'USD' && toCurrency === 'INR') {
    return amount * EXCHANGE_RATES.USD_TO_INR;
  }

  if (fromCurrency === 'INR' && toCurrency === 'USD') {
    return amount * EXCHANGE_RATES.INR_TO_USD;
  }

  // Default: return original amount if currencies not supported
  return amount;
}

/**
 * Converts all wallet amounts to a base currency (INR) for portfolio calculations
 * @param wallets - Array of wallet objects with balance, lockedBalance, and currency
 * @param baseCurrency - The target currency to convert to (default: 'INR')
 * @returns Object with converted totals
 */
export function calculatePortfolioTotals(
  wallets: Array<{ balance: number; lockedBalance: number; currency: string }>,
  baseCurrency: string = 'INR'
) {
  let totalBalance = 0;
  let totalLockedBalance = 0;

  wallets.forEach(wallet => {
    const convertedBalance = convertCurrency(wallet.balance, wallet.currency, baseCurrency);
    const convertedLockedBalance = convertCurrency(wallet.lockedBalance, wallet.currency, baseCurrency);
    
    totalBalance += convertedBalance;
    totalLockedBalance += convertedLockedBalance;
  });

  return {
    totalBalance,
    totalLockedBalance,
    totalPortfolioValue: totalBalance + totalLockedBalance
  };
}
