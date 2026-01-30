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
