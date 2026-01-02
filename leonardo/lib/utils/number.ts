/**
 * Number Utilities
 *
 * Helper functions for number formatting.
 * Matches production bundle module 550147.
 */

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Format a number with comma separators (e.g., 1000000 -> "1,000,000")
 */
export function formatNumberWithCommas(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return String(value);
  
  // Handle decimals
  const [intPart, decPart] = num.toString().split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return decPart ? `${formattedInt}.${decPart}` : formattedInt;
}

/**
 * Parse a formatted number string back to number (e.g., "1,000,000" -> 1000000)
 */
export function parseFormattedNumber(value: string): number {
  return parseFloat(value.replace(/,/g, ''));
}

/**
 * Clamp a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round a number to specified decimal places
 */
export function roundToDecimal(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Check if a value is a valid number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Safe division that returns 0 if divisor is 0
 */
export function safeDivide(dividend: number, divisor: number): number {
  if (divisor === 0) return 0;
  return dividend / divisor;
}

/**
 * Calculate percentage
 */
export function percentage(value: number, total: number): number {
  return safeDivide(value * 100, total);
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
