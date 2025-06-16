
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to format currency in MWK
export const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `MWK ${numAmount.toLocaleString('en-MW', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
}
