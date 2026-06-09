/**
 * Application constants
 * Configuration loaded from environment variables
 */

import { getRuntimeConfig } from './runtimeConfig';

const runtimeConfig = getRuntimeConfig();

// ─── Testnet contract IDs (hardcoded fallback for production/GitHub Pages) ──
const TESTNET_CONTRACT_IDS: Record<string, string> = {
  'nft-collectibles':  'CBC3AGOZTWKEII45VBRWLOGMBNGBJ6ABPP6MOFAZM2HFHP2NKPXXEWXB',
  'guitar-pizza':      'CBOKHYCJYPAIF3NQHPQGJTDJGCKBDC2FN5IXPBFI7L4UDIIFCLVED4HF',
  'slice-token':       'CDQQS675FAF3GXEV4Y5CQVWVHWOONDWMIM2QDVSQUHADA3XDDXSXZOFR',
  'zk-leaderboard':    'CAFKIEE76S5LHA2QJ3PYU7WW2VSCYCW2FDLCC2RTQLBTZRYTL5UL5PYV',
  'daily-recipe':      'CBWPTLNG5BZQUWQYRBTRGUARM7XUEUASASWMGLPIRKSNNVO7R4K3HOVN',
  'achievement-vault': 'CCGVC6WRVP5BNFVBQRZ3KNGTSMR37QHGAZ76NB7FXUT4LSGORTPAERVC',
  'mock-game-hub':     '',
  'twenty-one':        'CBF4YBMZRCGBSRJRANL6T6NKKF7SQDX6KYDBD4UYYEEEYGN56ULRIL5X',
  'number-guess':      'CDEHY5HFXD5L776YOVKKX6KG5IGKNE7ZMR46E4KGM2CBPGO6D27BXEJL',
  'dice-duel':         'CC7WRKO7VCA36V3PLYEKXECIN7Q53VIBURVPSBBVYO34QGTK43YEM5OO',
  'midnight-verifier': 'CDXW6ARYNZV2ZIMQZZHDS54QJGAMBDSQJLBL5TOWANZORVRCQOR2MSTI',
  'staking-vault':      'CCFFCESR67QY2KDAOQGUKG3LWR6BFWXKGWF75TS75VX7IOBKHOSXJCW3',
  'pvp-escrow':         'CAG2HF4P6FWMGQXJEP5RQQSO2WTMSQSQIQCPGME263HOPP337TXQWJM6',
  'tournaments':        'CBD6W6MB2GEA2E7W75EHWXRU6NYI7UWCLNF4MLRRFZL2KUHXVNCADD3M',
  'defindex-vault':     'CCDEFI3C7C6V5N72JQD2QNVVJZ26JQNXJNJNW26JQD2QNVVJZ26JDFX',
  'defindex-lp-token':  'CCDLP3C7C6V5N72JQD2QNVVJZ26JQNXJNJNW26JQTJQNVVJZ26JDLP',
  'cheese-token': 'CBFQYO2ML6ITTZLO46Z6WXUCOV4FLCRYHUBLC7RLERF5OM2G4Q324UGM',
  'pepperoni-token': 'CBE5ZVJPGYORQYZ5ZCLBGKX2HUQVCL2HKGR2T5D4SLFGS73VJYVLPNUW',
  'bacon-token': 'CB4DPSEWXQJHVLIZ3GABBAWNLMKKNZND3KIXPVGAXT6A63DPQMHDK3U5',
  'onion-token': 'CBUE7F2FEVMUH4AX5VJ777EOXN7QCIQEIDZ36622YGLYSOCE6IRXCQEU',
  'refrigerator-vault': 'CDNVDFIU5YHPB4PSPMJU24K7GF6EJWAKYRQGQCRNHYB5FPJR446VJYF2',
  'pizza-baking': 'CC6JCDRZE7RQF4NDX6ITDQITCII7VS5MUJRZKXGYLQS2JQX6HRIAOP7M',
};

export const SOROBAN_RPC_URL =
  runtimeConfig?.rpcUrl || import.meta.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';
export const RPC_URL = SOROBAN_RPC_URL; // Alias for compatibility
export const NETWORK_PASSPHRASE =
  runtimeConfig?.networkPassphrase ||
  import.meta.env.VITE_NETWORK_PASSPHRASE ||
  'Test SDF Network ; September 2015';
export const NETWORK = SOROBAN_RPC_URL.includes('testnet') ? 'testnet' : 'mainnet';

function contractEnvKey(crateName: string): string {
  // Crate name -> env key matches scripts/utils/contracts.ts: hyphens become underscores.
  const envKey = crateName.replace(/-/g, '_').toUpperCase();
  return `VITE_${envKey}_CONTRACT_ID`;
}

export function getContractId(crateName: string): string {
  const runtimeId = runtimeConfig?.contractIds?.[crateName];
  if (runtimeId) return runtimeId;
  const env = import.meta.env as unknown as Record<string, string>;
  return env[contractEnvKey(crateName)] || TESTNET_CONTRACT_IDS[crateName] || '';
}

export function getAllContractIds(): Record<string, string> {
  const env = import.meta.env as unknown as Record<string, string>;
  const out: Record<string, string> = {};

  if (runtimeConfig?.contractIds) {
    for (const [key, value] of Object.entries(runtimeConfig.contractIds)) {
      if (!value) continue;
      out[key] = value;
    }
  }

  for (const [key, value] of Object.entries(env)) {
    if (!key.startsWith('VITE_') || !key.endsWith('_CONTRACT_ID')) continue;
    if (!value) continue;

    const envKey = key.slice('VITE_'.length, key.length - '_CONTRACT_ID'.length);
    const crateName = envKey.toLowerCase().replace(/_/g, '-');
    if (!out[crateName]) {
      out[crateName] = value;
    }
  }

  // Fallback: hardcoded testnet IDs for production (GitHub Pages)
  for (const [crateName, id] of Object.entries(TESTNET_CONTRACT_IDS)) {
    if (!out[crateName] && id) {
      out[crateName] = id;
    }
  }

  return out;
}

// Contract IDs (backwards-compatible named exports for built-in games)
export const MOCK_GAME_HUB_CONTRACT = getContractId('mock-game-hub');
export const TWENTY_ONE_CONTRACT = getContractId('twenty-one');
export const NUMBER_GUESS_CONTRACT = getContractId('number-guess');
export const DICE_DUEL_CONTRACT = getContractId('dice-duel');

// Dev wallet addresses
export const DEV_ADMIN_ADDRESS = import.meta.env.VITE_DEV_ADMIN_ADDRESS || '';
export const DEV_PLAYER1_ADDRESS = import.meta.env.VITE_DEV_PLAYER1_ADDRESS || '';
export const DEV_PLAYER2_ADDRESS = import.meta.env.VITE_DEV_PLAYER2_ADDRESS || '';

// Runtime-configurable simulation source (for standalone builds)
export const RUNTIME_SIMULATION_SOURCE =
  runtimeConfig?.simulationSourceAddress || import.meta.env.VITE_SIMULATION_SOURCE_ADDRESS || '';

// Transaction options
export const DEFAULT_METHOD_OPTIONS = {
  timeoutInSeconds: 30,
};

// Auth TTL constants (in minutes)
export const DEFAULT_AUTH_TTL_MINUTES = 5;
export const MULTI_SIG_AUTH_TTL_MINUTES = 60;
