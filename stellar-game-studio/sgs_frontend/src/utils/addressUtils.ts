/**
 * Utility functions for format & display of EVM / Avalanche and legacy addresses
 */

/**
 * Truncate an address string for clean UI presentation.
 * Supports EVM (0x...) addresses cleanly: e.g. 0x1234...abcd
 */
export function formatAddress(address: string | null | undefined, prefixLen = 6, suffixLen = 4): string {
  if (!address) return '';
  if (address.length <= prefixLen + suffixLen) return address;
  
  return `${address.slice(0, prefixLen)}...${address.slice(-suffixLen)}`;
}

/**
 * Helper to check if an address string is a valid EVM address format
 */
export function isEvmAddress(address: string | null | undefined): boolean {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
