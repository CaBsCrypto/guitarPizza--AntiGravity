const StellarSdk = require('@stellar/stellar-sdk');
const { Keypair, TransactionBuilder, rpc, Contract, Networks, Address } = StellarSdk;

const config = {
  runtime: 'nodejs',
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { playerAddress, accuracy, score, isDevMint } = req.body || {};

    if (!playerAddress) {
      return res.status(400).json({ error: 'Missing playerAddress' });
    }

    if (!isDevMint) {
      if (typeof accuracy !== 'number') {
        return res.status(400).json({ error: 'Missing accuracy' });
      }
      if (accuracy < 80) {
        return res.status(200).json({ success: false, message: 'Accuracy too low for a drop chance.' });
      }

      // Drop Rate Logic
      let dropChance = 0;
      if (accuracy >= 100) {
        dropChance = 100;
      } else {
        dropChance = 10;
      }

      const roll = Math.random() * 100;
      const wonDrop = roll <= dropChance;

      if (!wonDrop) {
        return res.status(200).json({ success: false, message: 'Bad luck this time. Keep playing!' });
      }
    }

    const adminSecret = process.env.ADMIN_SECRET_KEY || process.env.STELLAR_SECRET_KEY || 'SBL476C4C7ZTSWUWWNPFNCFWEW2JIPPWJMZMTCI3QZFVSRQWSTQDVIFN';
    const contractId = process.env.VITE_NFT_COLLECTIBLES_CONTRACT_ID || 'CBC3AGOZTWKEII45VBRWLOGMBNGBJ6ABPP6MOFAZM2HFHP2NKPXXEWXB';
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

    const account = await withTimeout(
      server.getAccount(adminKeypair.publicKey()),
      3500,
      'Fetching admin account'
    );

    const tx = new TransactionBuilder(account, {
      fee: '1000',
      networkPassphrase,
    })
      .addOperation(contract.call('mint', Address.fromString(playerAddress).toScVal()))
      .setTimeout(30)
      .build();

    const simulated = await withTimeout(
      server.simulateTransaction(tx),
      3500,
      'Contract simulation'
    );
    
    if (!rpc.Api.isSimulationSuccess(simulated)) {
      console.error("Simulation failed:", simulated);
      return res.status(400).json({ error: 'Contract simulation failed.' });
    }

    const assembledTxBuilder = rpc.assembleTransaction(tx, simulated);
    const assembledTx = typeof assembledTxBuilder.build === 'function'
      ? assembledTxBuilder.build()
      : assembledTxBuilder;
    assembledTx.sign(adminKeypair);

    const response = await withTimeout(
      server.sendTransaction(assembledTx),
      3500,
      'Transaction submission'
    );
    
    if (response.status === 'ERROR') {
      console.error("Submission error:", response);
      return res.status(500).json({ error: 'Failed to submit mint transaction.' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Congratulations! You won an OG Oven NFT!',
      drop: 'OG_OVEN',
      txHash: response.hash
    });

  } catch (error) {
    console.error("Error in drop logic:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

module.exports = handler;
module.exports.config = config;
