const StellarSdk = require('@stellar/stellar-sdk');
const { Keypair, Contract, rpc, Networks, Address, nativeToScVal } = StellarSdk;

async function run() {
  const adminSecret = 'SBL476C4C7ZTSWUWWNPFNCFWEW2JIPPWJMZMTCI3QZFVSRQWSTQDVIFN';
  const kp = Keypair.fromSecret(adminSecret);
  const pizzaBakingAddress = 'CC6JCDRZE7RQF4NDX6ITDQITCII7VS5MUJRZKXGYLQS2JQX6HRIAOP7M';

  // Use the new deployed token address
  const contractId = 'CDQQS675FAF3GXEV4Y5CQVWVHWOONDWMIM2QDVSQUHADA3XDDXSXZOFR';
  const guitarPizzaContractId = 'CBOKHYCJYPAIF3NQHPQGJTDJGCKBDC2FN5IXPBFI7L4UDIIFCLVED4HF';
  const rpcUrl = 'https://soroban-testnet.stellar.org';
  const server = new rpc.Server(rpcUrl);
  const contract = new Contract(contractId);

  const TransactionBuilder = StellarSdk.TransactionBuilder;

  // Helper to execute a single operation transaction
  const executeTx = async (op, label) => {
    const account = await server.getAccount(kp.publicKey());
    const tx = new TransactionBuilder(account, {
      fee: '1500',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(op)
      .setTimeout(30)
      .build();

    const simulated = await server.simulateTransaction(tx);
    if (!rpc.Api.isSimulationSuccess(simulated)) {
      console.error(`Simulation failed for ${label}:`, simulated);
      throw new Error(`Simulation failed for ${label}`);
    }

    const assembledTxBuilder = rpc.assembleTransaction(tx, simulated);
    const assembledTx = assembledTxBuilder.build();
    assembledTx.sign(kp);

    const response = await server.sendTransaction(assembledTx);
    let status = response.status;
    let finalResp = response;
    if (status === 'PENDING') {
      for (let i = 0; i < 25; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const txStatus = await server.getTransaction(response.hash);
        if (txStatus.status !== 'NOT_FOUND' && txStatus.status !== 'PENDING') {
          status = txStatus.status;
          finalResp = txStatus;
          break;
        }
      }
    }
    if (status !== 'SUCCESS') {
      throw new Error(`Tx ${label} failed: ${status}`);
    }
    return finalResp;
  };

  try {
    // 1. Set minter to admin
    console.log("Setting minter to admin...");
    await executeTx(
      contract.call('set_minter', Address.fromString(kp.publicKey()).toScVal()),
      'set_minter_to_admin'
    );

    // 2. Mint 100,000 SLICE to pizza-baking contract
    console.log("Minting 8,000 SLICE to pizza-baking contract...");
    const amountBigInt = BigInt(8000); // Contract expects whole units, it does the scaling internally
    await executeTx(
      contract.call('mint', Address.fromString(pizzaBakingAddress).toScVal(), nativeToScVal(amountBigInt, { type: 'i128' })),
      'mint_100k_slice'
    );
    console.log("Mint successful!");

  } catch(e) {
    console.error('Error:', e);
  } finally {
    // 3. Reset minter back to guitar-pizza contract
    console.log("Resetting minter back to guitar-pizza...");
    try {
      await executeTx(
        contract.call('set_minter', Address.fromString(guitarPizzaContractId).toScVal()),
        'reset_minter'
      );
      console.log("Minter reset successful!");
    } catch(err) {
      console.error("Failed to reset minter:", err);
    }
  }
}

run();
