/**
 * Utility functions for format & display of Solana, EVM and legacy addresses
 */

/**
 * Truncate an address string for clean UI presentation.
 * Supports Solana (Base58 e.g. 7UXw...9Kz1) and EVM (0x1234...abcd)
 */
export function formatAddress(address: string | null | undefined, prefixLen = 4, suffixLen = 4): string {
  if (!address) return '';
  if (address.length <= prefixLen + suffixLen) return address;
  
  return `${address.slice(0, prefixLen)}...${address.slice(-suffixLen)}`;
}

/**
 * Helper to check if an address string is a valid Solana Base58 public key format
 */
export function isSolanaAddress(address: string | null | undefined): boolean {
  if (!address) return false;
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Helper to check if an address string is a valid EVM address format
 */
export function isEvmAddress(address: string | null | undefined): boolean {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
