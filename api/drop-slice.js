const StellarSdk = require('@stellar/stellar-sdk');
const { Keypair, TransactionBuilder, rpc, Contract, Networks, Address, nativeToScVal } = StellarSdk;

const config = {
  runtime: 'nodejs',
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { playerAddress, amount } = req.body || {};

    if (!playerAddress) {
      return res.status(400).json({ error: 'Missing playerAddress' });
    }

    const mintAmount = amount ? Number(amount) : 8; // default 8 SLICE (contract daily limit)

    const adminSecret = process.env.ADMIN_SECRET_KEY || process.env.STELLAR_SECRET_KEY || 'SBL476C4C7ZTSWUWWNPFNCFWEW2JIPPWJMZMTCI3QZFVSRQWSTQDVIFN';
    const contractId = process.env.VITE_SLICE_TOKEN_CONTRACT_ID || 'CDQQS675FAF3GXEV4Y5CQVWVHWOONDWMIM2QDVSQUHADA3XDDXSXZOFR';
    const rpcUrl = process.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';
    const networkPassphrase = process.env.VITE_NETWORK_PASSPHRASE || Networks.TESTNET;

    const adminKeypair = Keypair.fromSecret(adminSecret);
    const server = new rpc.Server(rpcUrl);
    const contract = new Contract(contractId);

    // Timeout helper
    const withTimeout = async (promise, ms, label) => {
      let timeoutId;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`Timeout: ${label} exceeded ${ms}ms`)), ms);
      });
      try {
        return await Promise.race([promise, timeoutPromise]);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // Helper to execute a single operation transaction
    const executeTx = async (op, label) => {
      const account = await withTimeout(
        server.getAccount(adminKeypair.publicKey()),
        4000,
        `Fetching admin account for ${label}`
      );
      const tx = new TransactionBuilder(account, {
        fee: '1500',
        networkPassphrase,
      })
        .addOperation(op)
        .setTimeout(30)
        .build();

      const simulated = await withTimeout(
        server.simulateTransaction(tx),
        4000,
        `Contract simulation for ${label}`
      );
      
      if (!rpc.Api.isSimulationSuccess(simulated)) {
        console.error(`Simulation failed for ${label}:`, simulated);
        if (label === 'Mint Tokens') {
          throw new Error('Límite diario de 8 $SLICE alcanzado para esta billetera hoy. Vuelve a intentarlo mañana.');
        }
        throw new Error(`Simulation failed for ${label}`);
      }

      const assembledTxBuilder = rpc.assembleTransaction(tx, simulated);
      const assembledTx = typeof assembledTxBuilder.build === 'function'
        ? assembledTxBuilder.build()
        : assembledTxBuilder;
      assembledTx.sign(adminKeypair);

      const response = await withTimeout(
        server.sendTransaction(assembledTx),
        4000,
        `Transaction submission for ${label}`
      );
      
      if (response.status === 'ERROR') {
        throw new Error(`Failed to submit transaction for ${label}`);
      }

      // Wait for status SUCCESS (or return response if immediate)
      let status = response.status;
      let finalResp = response;
      if (status === 'PENDING') {
        for (let i = 0; i < 25; i++) {
          await new Promise(r => setTimeout(r, 1000));
          try {
            const txStatus = await server.getTransaction(response.hash);
            if (txStatus.status !== 'NOT_FOUND' && txStatus.status !== 'PENDING') {
              status = txStatus.status;
              finalResp = txStatus;
              break;
            }
          } catch(e) {
            console.warn("Error polling transaction status:", e);
          }
        }
      }

      if (status !== 'SUCCESS') {
        throw new Error(`Transaction for ${label} failed with status: ${status}`);
      }

      return finalResp;
    };

    const guitarPizzaContractId = process.env.VITE_GUITAR_PIZZA_CONTRACT_ID || 'CBOKHYCJYPAIF3NQHPQGJTDJGCKBDC2FN5IXPBFI7L4UDIIFCLVED4HF';
    const amountBigInt = BigInt(mintAmount); // Whole units, contract does internal SCALE multiplication

    let txHash = '';
    try {
      // 1. Set minter to admin
      console.log("[Airdrop] Temporarily changing minter to admin...");
      await executeTx(
        contract.call(
          'set_minter',
          Address.fromString(adminKeypair.publicKey()).toScVal()
        ),
        'Set Minter to Admin'
      );

      // 2. Mint tokens to player
      console.log("[Airdrop] Minting tokens to player...");
      const mintRes = await executeTx(
        contract.call(
          'mint', 
          Address.fromString(playerAddress).toScVal(),
          nativeToScVal(amountBigInt, { type: 'i128' })
        ),
        'Mint Tokens'
      );
      txHash = mintRes.hash;

    } finally {
      // 3. Always reset minter back to guitar-pizza
      console.log("[Airdrop] Resetting minter back to guitar-pizza...");
      try {
        await executeTx(
          contract.call(
            'set_minter',
            Address.fromString(guitarPizzaContractId).toScVal()
          ),
          'Restore Minter to Pizza Contract'
        );
      } catch (e) {
        console.error("[Airdrop] Failed to restore minter back to guitar-pizza contract:", e);
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: `Airdropped ${mintAmount} $SLICE successfully!`,
      txHash
    });

  } catch (error) {
    console.error("Error in airdrop logic:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

module.exports = handler;
module.exports.config = config;
