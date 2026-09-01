import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createWalletClient, createPublicClient, http, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { avalancheFuji } from 'viem/chains';

const OVEN_NFT_ADDRESS = process.env.AVAX_OVEN_NFT_ADDRESS || '0xec00D70A86C73Eb6A530b160BA860750eA9c6AeC';
const RPC_URL = process.env.AVALANCHE_FUJI_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc';
const MINTER_KEY = process.env.AVAX_MINTER_PRIVATE_KEY || '178ca27c7716fcc0192c22e5c03254a694c08db51bcea62e974a2fff137c8d1e';
const PRIVY_APP_ID = process.env.PRIVY_APP_ID || 'cmt87cjqe02d60cjwdcnhkyld';
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET || '';

const OVEN_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint8', name: 'style', type: 'uint8' },
    ],
    name: 'mint',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Verify user authentication with Privy
async function verifyPrivyAuth(authHeader?: string): Promise<boolean> {
  if (!PRIVY_APP_SECRET || !authHeader) return true; // allow dev/test fallback if no secret
  try {
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const res = await fetch('https://auth.privy.io/api/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'privy-app-id': PRIVY_APP_ID,
        'Authorization-Basic': Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString('base64'),
      },
    });
    return res.ok;
  } catch (e) {
    console.warn('[Privy Verification Warning]:', e);
    return true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isAuthValid = await verifyPrivyAuth(req.headers.authorization);
  if (!isAuthValid) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Privy session token' });
  }

  const { playerAddress, style = 6 } = req.body || {}; // Style 6 = Brick Oven Starter

  if (!playerAddress || !playerAddress.startsWith('0x')) {
    return res.status(400).json({ error: 'Invalid Avalanche address' });
  }

  if (!MINTER_KEY) {
    console.log(`[Drop-Oven] Mock Starter Oven NFT drop to ${playerAddress}`);
    return res.status(200).json({
      success: true,
      mock: true,
      tokenId: 0,
      message: 'Starter Oven NFT minted successfully.',
      txHash: `0xmock_fuji_oven_${Date.now().toString(16)}`,
    });
  }

  try {
    const formattedKey = (MINTER_KEY.startsWith('0x') ? MINTER_KEY : `0x${MINTER_KEY}`) as `0x${string}`;
    const account = privateKeyToAccount(formattedKey);

    const client = createWalletClient({
      account,
      chain: avalancheFuji,
      transport: http(RPC_URL),
    });

    const publicClient = createPublicClient({
      chain: avalancheFuji,
      transport: http(RPC_URL),
    });

    // Check if player already owns an oven to prevent spam
    const existingBalance = await publicClient.readContract({
      address: OVEN_NFT_ADDRESS as Address,
      abi: OVEN_ABI,
      functionName: 'balanceOf',
      args: [playerAddress as Address],
    });

    if (existingBalance > 0n) {
      return res.status(200).json({
        success: true,
        alreadyClaimed: true,
        message: 'Player already has an Oven NFT on Avalanche Fuji.',
      });
    }

    const hash = await client.writeContract({
      address: OVEN_NFT_ADDRESS as Address,
      abi: OVEN_ABI,
      functionName: 'mint',
      args: [playerAddress as Address, Number(style)],
    });

    await publicClient.waitForTransactionReceipt({ hash });

    return res.status(200).json({
      success: true,
      txHash: hash,
      message: 'Starter Oven NFT minted successfully on Avalanche Fuji.',
    });
  } catch (error: any) {
    console.error('[Drop-Oven Error]:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to mint Starter Oven NFT on Fuji',
    });
  }
}
